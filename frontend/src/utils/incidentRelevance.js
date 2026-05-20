const DAY_MS = 24 * 60 * 60 * 1000;

export function getIncidentDate(incident) {
  if (typeof incident?.timestamp?.toDate === "function") {
    return incident.timestamp.toDate();
  }

  if (incident?.timestamp instanceof Date) {
    return incident.timestamp;
  }

  if (incident?.updatedAt?.toDate) {
    return incident.updatedAt.toDate();
  }

  if (incident?.updatedAt instanceof Date) {
    return incident.updatedAt;
  }

  return null;
}

export function getIncidentAgeDays(incident, now = new Date()) {
  const date = getIncidentDate(incident);
  if (!date) {
    return 0;
  }

  return Math.max(0, (now.getTime() - date.getTime()) / DAY_MS);
}

/** Recency weight 0–1; resolved incidents decay faster. */
export function getRecencyScore(incident, { maxRelevantDays = 30, now = new Date() } = {}) {
  const ageDays = getIncidentAgeDays(incident, now);
  const status = String(incident?.status || "").toLowerCase();
  const decayDays = status === "resolved" ? Math.min(maxRelevantDays, 14) : maxRelevantDays;

  if (ageDays >= decayDays) {
    return 0.15;
  }

  return Math.max(0.15, 1 - ageDays / decayDays);
}

export function getRelevanceScore(incident, options = {}) {
  const recency = getRecencyScore(incident, options);
  const severityWeight = {
    Critical: 1,
    High: 0.85,
    Medium: 0.65,
    Low: 0.45,
  };
  const severity = severityWeight[incident?.severity] ?? 0.6;
  const status = String(incident?.status || "").toLowerCase();
  const statusWeight = status === "resolved" ? 0.35 : status === "active" || status === "investigating" ? 1 : 0.75;
  const autoBoost = incident?.autoDetected ? 0.05 : 0;

  return recency * severity * statusWeight + autoBoost;
}

export function sortByRelevance(incidents, options = {}) {
  return [...incidents].sort((left, right) => getRelevanceScore(right, options) - getRelevanceScore(left, options));
}

export function applyRecencyToMatchScore(baseScore, incident, options = {}) {
  const recency = getRecencyScore(incident, options);
  return baseScore * (0.35 + recency * 0.65);
}
