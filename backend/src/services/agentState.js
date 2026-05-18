import { admin, getDb } from "../firebase.js";
import { config } from "../config.js";

const CONFIG_DOC = "climate_agent";

const defaultConfig = {
  autoDetectionEnabled: true,
  scanIntervalMinutes: config.scanIntervalMinutes,
  lastScanAt: null,
  lastScanStatus: "idle",
  lastScanMessage: "Agent not yet started",
  incidentsCreated: 0,
  articlesScanned: 0,
  sourcesMonitored: 5,
  isScanning: false,
  recentScans: [],
};

export async function getAgentConfig() {
  const db = getDb();
  const doc = await db.collection("system_config").doc(CONFIG_DOC).get();

  if (!doc.exists) {
    await db.collection("system_config").doc(CONFIG_DOC).set(defaultConfig);
    return { ...defaultConfig };
  }

  return { ...defaultConfig, ...doc.data() };
}

export async function updateAgentConfig(updates) {
  const db = getDb();
  await db.collection("system_config").doc(CONFIG_DOC).set(updates, { merge: true });
  return getAgentConfig();
}

export async function recordScanStart() {
  const db = getDb();
  await db.collection("system_config").doc(CONFIG_DOC).set(
    {
      isScanning: true,
      lastScanStatus: "running",
      lastScanMessage: "Scanning trusted sources...",
    },
    { merge: true }
  );
}

export async function recordScanComplete({
  status,
  message,
  articlesScanned,
  incidentsCreated,
  incidentsUpdated = 0,
  coordinatesBackfilled = 0,
  sources,
}) {
  const db = getDb();
  const current = await getAgentConfig();
  const scanEntry = {
    at: new Date().toISOString(),
    status,
    message,
    articlesScanned,
    incidentsCreated,
    incidentsUpdated,
    coordinatesBackfilled,
  };

  const recentScans = [scanEntry, ...(current.recentScans || [])].slice(0, 10);

  await db.collection("system_config").doc(CONFIG_DOC).set(
    {
      isScanning: false,
      lastScanAt: admin.firestore.FieldValue.serverTimestamp(),
      lastScanStatus: status,
      lastScanMessage: message,
      articlesScanned: (current.articlesScanned || 0) + articlesScanned,
      incidentsCreated: (current.incidentsCreated || 0) + incidentsCreated,
      sourcesMonitored: sources,
      recentScans,
    },
    { merge: true }
  );
}

export async function findIncidentByExternalId(externalId) {
  const db = getDb();
  const snapshot = await db
    .collection("incidents")
    .where("externalId", "==", externalId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ref: doc.ref, data: doc.data() };
}

export async function externalIncidentExists(externalId) {
  const match = await findIncidentByExternalId(externalId);
  return Boolean(match);
}
