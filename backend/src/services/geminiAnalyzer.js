import { config } from "../config.js";
import { extractLocationFromArticle } from "./geocoder.js";

function parseGeminiJson(rawText) {
  const text = String(rawText || "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

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

const VALID_CATEGORIES = [
  "Flood",
  "Fire",
  "Earthquake",
  "Medical",
  "Accident",
  "Infrastructure Failure",
  "Heatwave",
  "Wildfire",
  "Hurricane",
  "Drought",
];

const VALID_SEVERITIES = ["Low", "Medium", "High", "Critical"];

function heuristicExtract(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  let category = "Infrastructure Failure";
  let severity = "Medium";

  if (/flood|inundat|deluge|monsoon/.test(text)) category = "Flood";
  else if (/wildfire|bushfire|forest fire/.test(text)) category = "Wildfire";
  else if (/heatwave|heat wave|extreme heat/.test(text)) category = "Heatwave";
  else if (/hurricane|cyclone|typhoon/.test(text)) category = "Hurricane";
  else if (/drought|water shortage/.test(text)) category = "Drought";
  else if (/earthquake|seismic|tremor/.test(text)) category = "Earthquake";
  else if (/fire|blaze|inferno/.test(text)) category = "Fire";

  if (/fatal|massive|critical|evacuat|emergency|severe|catastroph/.test(text)) {
    severity = "Critical";
  } else if (/major|significant|widespread|destruct/.test(text)) {
    severity = "High";
  } else if (/minor|localized|small/.test(text)) {
    severity = "Low";
  }

  const location = extractLocationFromArticle(article);

  return {
    isIncident: true,
    title: article.title.slice(0, 200),
    description: article.description.slice(0, 800),
    category,
    severity,
    location,
    confidence: 0.62,
    summary: `${category} event reported: ${article.title}`,
    recommendedAction: "Verify the report, assess local impact, and coordinate field response if confirmed.",
  };
}

export async function extractIncidentsFromArticles(articles) {
  if (!articles.length) {
    return [];
  }

  if (!config.geminiApiKey) {
    return articles.map((article) => ({
      ...heuristicExtract(article),
      article,
    }));
  }

  const articleList = articles
    .slice(0, 15)
    .map(
      (a, i) =>
        `[${i}] title: ${a.title}\ndescription: ${a.description.slice(0, 400)}\nsource: ${a.sourceName}\nurl: ${a.sourceUrl}`
    )
    .join("\n\n");

  const prompt = `You are a climate and disaster incident detection agent for a crisis coordination platform.
Analyze the following news articles and extract ONLY genuine climate-related or natural disaster incidents (floods, fires, heatwaves, hurricanes, droughts, earthquakes, wildfires, storms, etc.).

Return ONLY valid JSON with this structure:
{
  "incidents": [
    {
      "articleIndex": 0,
      "isIncident": true,
      "title": "concise incident title",
      "description": "2-3 sentence operational description",
      "category": "one of: ${VALID_CATEGORIES.join(", ")}",
      "severity": "one of: ${VALID_SEVERITIES.join(", ")}",
      "location": "city, region, or country mentioned",
      "confidence": 0.0-1.0,
      "summary": "1-2 sentence AI summary for responders",
      "recommendedAction": "practical response recommendation"
    }
  ]
}

Rules:
- Skip opinion pieces, policy debates, and general climate science without a specific ongoing event.
- location must be a real place name when possible, otherwise "Global".
- confidence reflects how certain this is an active incident vs general news.

Articles:
${articleList}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed (${response.status})`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "{}";
    const parsed = parseGeminiJson(text);
    const incidents = Array.isArray(parsed.incidents) ? parsed.incidents : [];

    return incidents
      .filter((item) => item.isIncident !== false)
      .map((item) => {
        const article = articles[item.articleIndex] || articles[0];
        return {
          isIncident: true,
          title: item.title || article.title,
          description: item.description || article.description,
          category: VALID_CATEGORIES.includes(item.category) ? item.category : "Infrastructure Failure",
          severity: VALID_SEVERITIES.includes(item.severity) ? item.severity : "Medium",
          location: item.location || "Global",
          confidence: typeof item.confidence === "number" ? item.confidence : 0.7,
          summary: item.summary || item.description,
          recommendedAction: item.recommendedAction || "Review and validate this auto-detected incident.",
          article,
        };
      });
  } catch (error) {
    console.warn("[gemini] Extraction failed, using heuristic fallback:", error.message);
    return articles.map((article) => ({
      ...heuristicExtract(article),
      article,
    }));
  }
}
