import { admin, getDb } from "../firebase.js";
import { config } from "../config.js";
import { scanAllSources, TRUSTED_SOURCES } from "./feedScanner.js";
import { extractIncidentsFromArticles } from "./geminiAnalyzer.js";
import { geocodeLocation } from "./geocoder.js";
import {
  findIncidentByExternalId,
  getAgentConfig,
  recordScanComplete,
  recordScanStart,
} from "./agentState.js";

let scanInProgress = false;

const GEOCODE_DELAY_MS = 300;
const BACKFILL_LIMIT = 5;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasCoordinates(incident) {
  const lat = incident.latitude ?? incident.coordinates?.latitude;
  const lng = incident.longitude ?? incident.coordinates?.longitude;
  return lat != null && lng != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng));
}

function buildIncidentPayload(item, geo, article) {
  return {
    title: item.title,
    description: item.description,
    category: item.category,
    severity: item.severity,
    status: "Investigating",
    source: "AI External Report",
    reportedBy: "AI Detection Agent",
    autoDetected: true,
    externalId: article.externalId,
    sourceUrl: article.sourceUrl,
    sourceName: article.sourceName,
    sourceType: article.sourceType,
    sourcePublishedAt: article.publishedAt,
    location: geo.locationDetail,
    locationDetail: geo.locationDetail,
    latitude: geo.latitude,
    longitude: geo.longitude,
    coordinates: {
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    aiSummary: item.summary,
    recommendedAction: item.recommendedAction,
    aiSuggestedSeverity: item.severity,
    aiConfidence: item.confidence,
    aiAnalysisSource: config.geminiApiKey ? "gemini" : "heuristic",
    aiDuplicateMatches: [],
    geocodeSource: geo.geocodeSource || "unknown",
    lastScannedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function createNotification(incidentRef, incident) {
  const db = getDb();
  await db.collection("notifications").add({
    type: "ai",
    title: `AI detected: ${incident.title}`,
    description: incident.aiSummary || incident.description,
    severity: incident.severity,
    audience: ["Coordinator", "Responder", "Super Admin"],
    incidentId: incidentRef.id,
    incidentTitle: incident.title,
    createdBy: "Climate Detection Agent",
    source: "climate-agent",
    deliveryChannels: ["in-app", "push"],
    metadata: {
      autoDetected: true,
      sourceUrl: incident.sourceUrl,
      confidence: incident.aiConfidence,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function createActivityLog(message, metadata = {}) {
  const db = getDb();
  await db.collection("activity_logs").add({
    action: "climate_scan",
    message,
    metadata,
    createdBy: "Climate Detection Agent",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export async function backfillMissingCoordinates(db, limit = BACKFILL_LIMIT) {
  const snapshot = await db.collection("incidents").where("autoDetected", "==", true).get();
  let coordinatesBackfilled = 0;

  for (const doc of snapshot.docs) {
    if (coordinatesBackfilled >= limit) {
      break;
    }

    const data = doc.data();
    if (hasCoordinates(data)) {
      continue;
    }

    const context = `${data.title || ""} ${data.description || ""}`;
    const geo = await geocodeLocation(data.locationDetail || data.location || data.title, context);
    await sleep(GEOCODE_DELAY_MS);

    if (geo.latitude == null || geo.longitude == null) {
      continue;
    }

    await doc.ref.update({
      latitude: geo.latitude,
      longitude: geo.longitude,
      coordinates: { latitude: geo.latitude, longitude: geo.longitude },
      location: geo.locationDetail,
      locationDetail: geo.locationDetail,
      geocodeSource: geo.geocodeSource || "backfill",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastScannedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    coordinatesBackfilled += 1;
  }

  return coordinatesBackfilled;
}

export async function runClimateScan() {
  const agentConfig = await getAgentConfig();

  if (!agentConfig.autoDetectionEnabled) {
    return {
      status: "skipped",
      message: "Auto-detection is disabled",
      articlesScanned: 0,
      incidentsCreated: 0,
      incidentsUpdated: 0,
    };
  }

  if (scanInProgress || agentConfig.isScanning) {
    return {
      status: "skipped",
      message: "Scan already in progress",
      articlesScanned: 0,
      incidentsCreated: 0,
      incidentsUpdated: 0,
    };
  }

  scanInProgress = true;
  await recordScanStart();

  try {
    const articles = await scanAllSources();
    const extracted = await extractIncidentsFromArticles(articles);
    const db = getDb();
    let incidentsCreated = 0;
    let incidentsUpdated = 0;

    for (const item of extracted) {
      if (item.confidence < config.minConfidence) {
        continue;
      }

      const article = item.article;
      const context = `${article.title} ${article.description}`;
      const geo = await geocodeLocation(item.location, context);
      await sleep(GEOCODE_DELAY_MS);

      const incidentData = buildIncidentPayload(item, geo, article);
      const existing = await findIncidentByExternalId(article.externalId);

      if (existing) {
        await existing.ref.update({
          ...incidentData,
          timestamp: existing.data.timestamp || admin.firestore.FieldValue.serverTimestamp(),
          detectedAt: existing.data.detectedAt || admin.firestore.FieldValue.serverTimestamp(),
          imageUrl: existing.data.imageUrl || "",
          images: existing.data.images || [],
        });
        incidentsUpdated += 1;
        continue;
      }

      const incidentRef = await db.collection("incidents").add({
        ...incidentData,
        imageUrl: "",
        images: [],
        detectedAt: admin.firestore.FieldValue.serverTimestamp(),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      await createNotification(incidentRef, incidentData);
      incidentsCreated += 1;
    }

    const coordinatesBackfilled = await backfillMissingCoordinates(db);

    const message = `Scanned ${articles.length} articles — ${incidentsCreated} new, ${incidentsUpdated} updated, ${coordinatesBackfilled} geocoded`;
    await recordScanComplete({
      status: "success",
      message,
      articlesScanned: articles.length,
      incidentsCreated,
      incidentsUpdated,
      coordinatesBackfilled,
      sources: TRUSTED_SOURCES.length,
    });
    await createActivityLog(message, {
      articlesScanned: articles.length,
      incidentsCreated,
      incidentsUpdated,
      coordinatesBackfilled,
      sources: TRUSTED_SOURCES.map((s) => s.name),
    });

    return {
      status: "success",
      message,
      articlesScanned: articles.length,
      incidentsCreated,
      incidentsUpdated,
      coordinatesBackfilled,
    };
  } catch (error) {
    const message = `Scan failed: ${error.message}`;
    await recordScanComplete({
      status: "error",
      message,
      articlesScanned: 0,
      incidentsCreated: 0,
      incidentsUpdated: 0,
      coordinatesBackfilled: 0,
      sources: TRUSTED_SOURCES.length,
    });
    console.error("[scan]", error);
    return {
      status: "error",
      message,
      articlesScanned: 0,
      incidentsCreated: 0,
      incidentsUpdated: 0,
    };
  } finally {
    scanInProgress = false;
  }
}
