import { Router } from "express";

import { getAgentConfig, updateAgentConfig } from "../services/agentState.js";
import { runClimateScan, backfillMissingCoordinates } from "../services/incidentProcessor.js";
import { getDb } from "../firebase.js";
import { TRUSTED_SOURCES } from "../services/feedScanner.js";
import { config } from "../config.js";

const router = Router();

router.get("/status", async (_req, res) => {
  try {
    const agentConfig = await getAgentConfig();
    res.json({
      autoDetectionEnabled: agentConfig.autoDetectionEnabled,
      scanIntervalMinutes: agentConfig.scanIntervalMinutes || config.scanIntervalMinutes,
      lastScanAt: agentConfig.lastScanAt?.toDate?.()
        ? agentConfig.lastScanAt.toDate().toISOString()
        : agentConfig.lastScanAt || null,
      lastScanStatus: agentConfig.lastScanStatus,
      lastScanMessage: agentConfig.lastScanMessage,
      isScanning: agentConfig.isScanning,
      incidentsCreated: agentConfig.incidentsCreated || 0,
      articlesScanned: agentConfig.articlesScanned || 0,
      sourcesMonitored: agentConfig.sourcesMonitored || TRUSTED_SOURCES.length,
      sources: TRUSTED_SOURCES.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
      })),
      recentScans: agentConfig.recentScans || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/config", async (req, res) => {
  try {
    const { autoDetectionEnabled, scanIntervalMinutes } = req.body;
    const updates = {};

    if (typeof autoDetectionEnabled === "boolean") {
      updates.autoDetectionEnabled = autoDetectionEnabled;
    }
    if (typeof scanIntervalMinutes === "number" && scanIntervalMinutes >= 1) {
      updates.scanIntervalMinutes = scanIntervalMinutes;
    }

    const agentConfig = await updateAgentConfig(updates);
    res.json({
      autoDetectionEnabled: agentConfig.autoDetectionEnabled,
      scanIntervalMinutes: agentConfig.scanIntervalMinutes,
      message: "Agent configuration updated",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/backfill", async (_req, res) => {
  try {
    const db = getDb();
    const coordinatesBackfilled = await backfillMissingCoordinates(db);
    res.json({
      status: "success",
      message: `Backfilled coordinates for ${coordinatesBackfilled} incident(s)`,
      coordinatesBackfilled,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/scan", async (_req, res) => {
  try {
    const result = await runClimateScan();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
