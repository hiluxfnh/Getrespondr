import { applyRecencyToMatchScore, getIncidentAgeDays, sortByRelevance } from "../utils/incidentRelevance";

const DEFAULT_MODEL = "gemini-1.5-flash";
const DUPLICATE_MATCH_THRESHOLD = 0.45;
const MAX_REFERENCE_AGE_DAYS = 60;

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2);
}

function scoreSimilarity(source, target) {
  const sourceTokens = new Set(tokenize(source));
  const targetTokens = new Set(tokenize(target));

  if (!sourceTokens.size || !targetTokens.size) {
    return 0;
  }

  let overlap = 0;
  sourceTokens.forEach((token) => {
    if (targetTokens.has(token)) {
      overlap += 1;
    }
  });

  return overlap / Math.max(sourceTokens.size, targetTokens.size);
}

function severityFromText(text, fallback = "Medium") {
  const value = normalizeText(text);

  if (/fatal|collapse|explosion|massive|critical|immediate evacuation|severe injury/.test(value)) {
    return "Critical";
  }

  if (/fire|flood|medical|injury|blocked|hazard|major|high risk/.test(value)) {
    return "High";
  }

  if (/monitor|minor|localized|small|contained|low risk/.test(value)) {
    return "Low";
  }

  return fallback;
}

function recommendedActionFromIncident(incident) {
  const category = normalizeText(incident.category);
  const severity = incident.severity || "Medium";

  if (severity === "Critical") {
    return "Dispatch the nearest response teams immediately, escalate to command, and verify evacuation or life-safety support.";
  }

  if (/flood/.test(category)) {
    return "Deploy rescue boats or high-clearance support, mark blocked access points, and monitor water levels continuously.";
  }

  if (/fire/.test(category)) {
    return "Send fire suppression teams, isolate the area, and confirm nearby structures have been cleared.";
  }

  if (/medical/.test(category)) {
    return "Assign medical responders, secure patient transport, and coordinate with the nearest care facility.";
  }

  if (/earthquake|collapse|infrastructure/.test(category)) {
    return "Inspect structural safety, establish a perimeter, and prioritize search and rescue assessment.";
  }

  return severity === "High"
    ? "Assign responders for rapid field assessment and keep the incident under active monitoring."
    : "Keep the incident under observation, verify details, and update the response plan as new information arrives.";
}

function buildDuplicateMatches(incident, referenceIncidents = []) {
  const targetText = `${incident.title || ""} ${incident.description || ""} ${incident.location || incident.locationDetail || ""}`;

  return referenceIncidents
    .filter((item) => String(item?.id) !== String(incident?.id))
    .filter((item) => getIncidentAgeDays(item) <= MAX_REFERENCE_AGE_DAYS)
    .map((item) => {
      const sourceText = `${item.title || ""} ${item.description || ""} ${item.location || item.locationDetail || ""}`;
      const baseScore = scoreSimilarity(targetText, sourceText);
      const score = applyRecencyToMatchScore(baseScore, item);

      return {
        id: item.id,
        title: item.title || "Untitled incident",
        location: item.location || item.locationDetail || "Unknown location",
        score,
        ageDays: Math.round(getIncidentAgeDays(item)),
      };
    })
    .filter((item) => item.score >= DUPLICATE_MATCH_THRESHOLD)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function buildFallbackAnalysis(incident, referenceIncidents) {
  const category = incident.category || "general";
  const location = incident.location || incident.locationDetail || "the reported area";
  const description = incident.description || "No description provided.";
  const duplicateMatches = buildDuplicateMatches(incident, referenceIncidents);
  const suggestedSeverity = severityFromText(`${incident.title || ""} ${description} ${category}`, incident.severity || "Medium");

  return {
    summary: `${category} incident reported near ${location}. ${description}`,
    recommendedAction: recommendedActionFromIncident({ ...incident, severity: suggestedSeverity }),
    suggestedSeverity,
    duplicateMatches,
    confidence: duplicateMatches.length > 0 ? 0.74 : 0.6,
    source: "heuristic",
  };
}

function parseGeminiJson(rawText) {
  const text = String(rawText || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");

  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    }

    throw new Error("Unable to parse Gemini response");
  }
}

async function analyzeWithGemini(incident, referenceIncidents) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL;
  const referenceSummary = sortByRelevance(referenceIncidents)
    .filter((item) => getIncidentAgeDays(item) <= MAX_REFERENCE_AGE_DAYS)
    .slice(0, 5)
    .map((item) => `- ${item.title || "Untitled"} | ${item.location || item.locationDetail || "Unknown location"} | ${item.description || "No description"}`)
    .join("\n");

  const prompt = `You are an incident-analysis assistant for a crisis coordination platform.
Return only valid JSON with the following keys:
summary, recommendedAction, suggestedSeverity, duplicateMatches, confidence.

Rules:
- summary should be 1-2 concise operational sentences.
- recommendedAction should be a practical response recommendation.
- suggestedSeverity must be one of Low, Medium, High, Critical.
- duplicateMatches should be an array of objects with id, title, location, reason, score.
- confidence should be a number between 0 and 1.

Incident:
title: ${incident.title || "Untitled"}
category: ${incident.category || "Unknown"}
severity: ${incident.severity || "Medium"}
location: ${incident.location || incident.locationDetail || "Unknown"}
description: ${incident.description || "No description provided"}

Recent incidents for duplicate checking:
${referenceSummary || "No references available."}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed (${response.status})`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "{}";
  const parsed = parseGeminiJson(text);

  return {
    summary: parsed.summary || parsed.aiSummary || "AI analysis completed.",
    recommendedAction: parsed.recommendedAction || "Review the incident and coordinate the next steps.",
    suggestedSeverity: parsed.suggestedSeverity || parsed.severity || incident.severity || "Medium",
    duplicateMatches: Array.isArray(parsed.duplicateMatches) ? parsed.duplicateMatches : [],
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
    source: "gemini",
  };
}

export async function analyzeIncident(incident, referenceIncidents = []) {
  try {
    const geminiAnalysis = await analyzeWithGemini(incident, referenceIncidents);

    if (geminiAnalysis) {
      return {
        ...geminiAnalysis,
        duplicateMatches: geminiAnalysis.duplicateMatches.length > 0
          ? geminiAnalysis.duplicateMatches
          : buildDuplicateMatches(incident, referenceIncidents),
      };
    }
  } catch (error) {
    console.warn("Gemini analysis failed, using fallback analysis", error);
  }

  return buildFallbackAnalysis(incident, referenceIncidents);
}

export function formatDuplicateSummary(matches = []) {
  if (!matches.length) {
    return "No obvious duplicates detected.";
  }

  const topMatch = matches[0];
  return `Possible duplicate match: ${topMatch.title} in ${topMatch.location}.`;
}