const GEOCODE_URL = "https://nominatim.openstreetmap.org/search";
const CACHE = new Map();
let nominatimBlockedUntil = 0;

const REGION_CENTROIDS = {
  global: { latitude: 20, longitude: 0 },
  africa: { latitude: 4.5, longitude: 20 },
  asia: { latitude: 34, longitude: 100 },
  europe: { latitude: 54, longitude: 15 },
  "north america": { latitude: 45, longitude: -100 },
  "south america": { latitude: -10, longitude: -55 },
  antarctica: { latitude: -75, longitude: 0 },
  afghanistan: { latitude: 33.9391, longitude: 67.71 },
  australia: { latitude: -25.2744, longitude: 133.7751 },
  bangladesh: { latitude: 23.685, longitude: 90.3563 },
  brazil: { latitude: -14.235, longitude: -51.9253 },
  canada: { latitude: 56.1304, longitude: -106.3468 },
  china: { latitude: 35.8617, longitude: 104.1954 },
  colombia: { latitude: 4.5709, longitude: -74.2973 },
  egypt: { latitude: 26.8206, longitude: 30.8025 },
  ethiopia: { latitude: 9.145, longitude: 40.4897 },
  france: { latitude: 46.2276, longitude: 2.2137 },
  germany: { latitude: 51.1657, longitude: 10.4515 },
  greece: { latitude: 39.0742, longitude: 21.8243 },
  guam: { latitude: 13.4443, longitude: 144.7937 },
  india: { latitude: 20.5937, longitude: 78.9629 },
  indonesia: { latitude: -0.7893, longitude: 113.9213 },
  iran: { latitude: 32.4279, longitude: 53.688 },
  iraq: { latitude: 33.2232, longitude: 43.6793 },
  italy: { latitude: 41.8719, longitude: 12.5674 },
  japan: { latitude: 36.2048, longitude: 138.2529 },
  kenya: { latitude: -0.0236, longitude: 37.9062 },
  mexico: { latitude: 23.6345, longitude: -102.5528 },
  morocco: { latitude: 31.7917, longitude: -7.0926 },
  nepal: { latitude: 28.3949, longitude: 84.124 },
  nigeria: { latitude: 9.082, longitude: 8.6753 },
  "papua new guinea": { latitude: -6.315, longitude: 143.9555 },
  pakistan: { latitude: 30.3753, longitude: 69.3451 },
  philippines: { latitude: 12.8797, longitude: 121.774 },
  "solomon islands": { latitude: -9.6457, longitude: 160.1562 },
  spain: { latitude: 40.4637, longitude: -3.7492 },
  "sri lanka": { latitude: 7.8731, longitude: 80.7718 },
  sudan: { latitude: 12.8628, longitude: 30.2176 },
  syria: { latitude: 34.8021, longitude: 38.9968 },
  tanzania: { latitude: -6.369, longitude: 34.8888 },
  congo: { latitude: -4.0383, longitude: 21.7587 },
  drc: { latitude: -4.0383, longitude: 21.7587 },
  "democratic republic of the congo": { latitude: -4.0383, longitude: 21.7587 },
  turkey: { latitude: 38.9637, longitude: 35.2433 },
  ukraine: { latitude: 48.3794, longitude: 31.1656 },
  "united kingdom": { latitude: 55.3781, longitude: -3.436 },
  uk: { latitude: 55.3781, longitude: -3.436 },
  "united states": { latitude: 39.8283, longitude: -98.5795 },
  usa: { latitude: 39.8283, longitude: -98.5795 },
  us: { latitude: 39.8283, longitude: -98.5795 },
  california: { latitude: 36.7783, longitude: -119.4179 },
  florida: { latitude: 27.6648, longitude: -81.5158 },
  texas: { latitude: 31.9686, longitude: -99.9018 },
  hawaii: { latitude: 19.8968, longitude: -155.5828 },
  louisiana: { latitude: 30.9843, longitude: -91.9623 },
  "new york": { latitude: 40.7128, longitude: -74.006 },
  vietnam: { latitude: 14.0583, longitude: 108.2772 },
  micronesia: { latitude: 7.4256, longitude: 150.5508 },
};

const REGION_KEYS = Object.keys(REGION_CENTROIDS)
  .filter((key) => key !== "global")
  .sort((left, right) => right.length - left.length);

const STOP_WORDS = new Set([
  "the", "and", "while", "after", "before", "during", "these", "those", "this", "that",
  "new", "severe", "caused", "flash", "tropical", "breaking", "sites", "hits", "resultant",
  "april", "march", "found", "moving", "safety", "started", "has", "have", "with", "from",
]);

function normalizeKey(value) {
  return String(value || "").toLowerCase().trim();
}

function isValidPlaceCandidate(value) {
  const normalized = normalizeKey(value);
  if (!normalized || normalized === "global" || normalized.length < 3) {
    return false;
  }

  const words = normalized.split(/[\s,]+/).filter(Boolean);
  if (words.every((word) => STOP_WORDS.has(word))) {
    return false;
  }

  if (words.length === 1 && STOP_WORDS.has(words[0])) {
    return false;
  }

  return true;
}

function findRegionInText(text) {
  const normalized = normalizeKey(text);
  for (const key of REGION_KEYS) {
    if (normalized.includes(key)) {
      return key;
    }
  }
  return null;
}

function findCentroid(location) {
  const normalized = normalizeKey(location);
  if (!normalized || normalized === "global") {
    return REGION_CENTROIDS.global;
  }

  if (REGION_CENTROIDS[normalized]) {
    return REGION_CENTROIDS[normalized];
  }

  for (const key of REGION_KEYS) {
    if (normalized.includes(key)) {
      return REGION_CENTROIDS[key];
    }
  }

  return null;
}

function extractPlaceCandidates(text) {
  const candidates = [];
  const source = String(text || "");

  const regionMatch = findRegionInText(source);
  if (regionMatch) {
    candidates.push(regionMatch);
  }

  const patterns = [
    /\b(?:in|near|across|at|around)\s+([A-Z][A-Za-z]+(?:[\s,-][A-Za-z]+){0,3})/g,
    /\b([A-Z][A-Za-z]+,\s*[A-Z][A-Za-z]+(?:[\s,-][A-Za-z]+)?)/g,
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(source);
    while (match) {
      const place = match[1]?.trim();
      if (place && isValidPlaceCandidate(place)) {
        candidates.push(place);
      }
      match = pattern.exec(source);
    }
  }

  return [...new Set(candidates)];
}

async function nominatimSearch(query) {
  if (Date.now() < nominatimBlockedUntil) {
    return null;
  }

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "1",
  });

  const response = await fetch(`${GEOCODE_URL}?${params}`, {
    headers: {
      "User-Agent": "GetRespondr-ClimateAgent/1.0",
    },
  });

  if (response.status === 429) {
    nominatimBlockedUntil = Date.now() + 60_000;
    console.warn("[geocode] Nominatim rate limit hit — using centroid fallbacks for 60s");
    return null;
  }

  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status})`);
  }

  const results = await response.json();
  if (!results.length) {
    return null;
  }

  return {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
    locationDetail: results[0].display_name || query,
  };
}

export async function geocodeLocation(location, contextText = "") {
  const query = String(location || "").trim();
  const cacheKey = `${query}::${contextText.slice(0, 120)}`;

  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey);
  }

  const combinedText = `${query} ${contextText}`;
  const regionFromText = findRegionInText(combinedText);
  if (regionFromText) {
    const result = {
      ...REGION_CENTROIDS[regionFromText],
      locationDetail: regionFromText.replace(/\b\w/g, (char) => char.toUpperCase()),
      geocodeSource: "centroid",
    };
    CACHE.set(cacheKey, result);
    return result;
  }

  const centroid = findCentroid(query);
  if (centroid) {
    const result = {
      ...centroid,
      locationDetail: query || "Global",
      geocodeSource: "centroid",
    };
    CACHE.set(cacheKey, result);
    return result;
  }

  const candidates = extractPlaceCandidates(combinedText).filter(isValidPlaceCandidate);
  const nominatimCandidate = candidates.find((candidate) => candidate.includes(",") || findCentroid(candidate));

  if (nominatimCandidate && Date.now() >= nominatimBlockedUntil) {
    try {
      const result = await nominatimSearch(nominatimCandidate);
      if (result) {
        const enriched = { ...result, geocodeSource: "nominatim" };
        CACHE.set(cacheKey, enriched);
        return enriched;
      }
    } catch (error) {
      console.warn(`[geocode] Nominatim failed for "${nominatimCandidate}":`, error.message);
    }
  }

  const fallbackCentroid = findCentroid(candidates[0]) || REGION_CENTROIDS.global;
  const fallback = {
    latitude: fallbackCentroid.latitude,
    longitude: fallbackCentroid.longitude,
    locationDetail: query || candidates[0] || "Global",
    geocodeSource: "fallback",
  };
  CACHE.set(cacheKey, fallback);
  return fallback;
}

export function extractLocationFromArticle(article) {
  const text = `${article.title || ""} ${article.description || ""}`;
  const region = findRegionInText(text);
  if (region) {
    return region.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const candidates = extractPlaceCandidates(text);
  if (candidates.length) {
    return candidates[0];
  }

  return "Global";
}
