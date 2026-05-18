const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }

  return response.json();
}

export async function fetchAgentStatus() {
  return request("/api/agent/status");
}

export async function updateAgentConfig(config) {
  return request("/api/agent/config", {
    method: "PUT",
    body: JSON.stringify(config),
  });
}

export async function triggerManualScan() {
  return request("/api/agent/scan", { method: "POST" });
}

export async function backfillIncidentCoordinates() {
  return request("/api/agent/backfill", { method: "POST" });
}

export async function checkBackendHealth() {
  return request("/api/health");
}
