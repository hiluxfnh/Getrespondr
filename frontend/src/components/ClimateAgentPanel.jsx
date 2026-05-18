import { useCallback, useEffect, useState } from "react";
import {
  Bot,
  Globe,
  Loader,
  Play,
  Radio,
  RefreshCw,
} from "lucide-react";

import {
  fetchAgentStatus,
  triggerManualScan,
  backfillIncidentCoordinates,
  updateAgentConfig,
} from "../services/agentApi";

function formatScanTime(value) {
  if (!value) {
    return "Never";
  }

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Unknown";
  }
}

export default function ClimateAgentPanel({ compact = false }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [backendOnline, setBackendOnline] = useState(true);

  const loadStatus = useCallback(async () => {
    try {
      const data = await fetchAgentStatus();
      setStatus(data);
      setBackendOnline(true);
      setError("");
    } catch (err) {
      setBackendOnline(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
    const interval = window.setInterval(loadStatus, 30000);
    return () => window.clearInterval(interval);
  }, [loadStatus]);

  const handleToggle = async () => {
    if (!status) {
      return;
    }

    try {
      await updateAgentConfig({ autoDetectionEnabled: !status.autoDetectionEnabled });
      await loadStatus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleManualScan = async () => {
    try {
      setScanning(true);
      await triggerManualScan();
      await loadStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  const handleBackfill = async () => {
    try {
      setScanning(true);
      await backfillIncidentCoordinates();
      await loadStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader className="h-4 w-4 animate-spin" />
          Loading climate agent...
        </div>
      </div>
    );
  }

  const isActive = backendOnline && status?.autoDetectionEnabled;
  const isRunning = status?.isScanning || scanning;

  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
          <span className="text-sm font-medium text-slate-700">
            Climate Agent {isActive ? "Active" : "Paused"}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {status?.sourcesMonitored || 0} sources · every {status?.scanIntervalMinutes || 5}m
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-slate-900">Climate Detection Agent</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isActive ? "ACTIVE" : "PAUSED"}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Scans trusted news and disaster feeds every {status?.scanIntervalMinutes || 5} minutes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleBackfill}
            disabled={isRunning || !backendOnline}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Update Map
          </button>
          <button
            type="button"
            onClick={handleManualScan}
            disabled={isRunning || !backendOnline}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Scan Now
          </button>
          <button
            type="button"
            onClick={loadStatus}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {!backendOnline ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Backend offline. Start the server with <code className="font-mono">npm run dev</code> in the backend folder.
        </div>
      ) : null}

      {error && backendOnline ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Scan</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{formatScanTime(status?.lastScanAt)}</p>
          <p className="mt-1 text-xs text-slate-500">{status?.lastScanMessage || "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Incidents Created</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{status?.incidentsCreated || 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Articles Scanned</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{status?.articlesScanned || 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sources</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{status?.sourcesMonitored || 0}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 p-4">
        <div>
          <p className="font-medium text-slate-900">Auto-detection</p>
          <p className="text-sm text-slate-500">Automatically create incidents from trusted sources</p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={!backendOnline}
          className={`relative h-7 w-12 rounded-full transition ${status?.autoDetectionEnabled ? "bg-violet-600" : "bg-slate-300"}`}
          aria-pressed={status?.autoDetectionEnabled}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${status?.autoDetectionEnabled ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>

      {status?.sources?.length ? (
        <div className="mt-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Globe className="h-4 w-4 text-slate-500" />
            Trusted Sources
          </div>
          <div className="flex flex-wrap gap-2">
            {status.sources.map((source) => (
              <span
                key={source.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
              >
                <Radio className="h-3 w-3 text-violet-500" />
                {source.name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
