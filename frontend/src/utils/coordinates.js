export function parseCoordinate(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCoordinate(value, digits = 4) {
  const parsed = parseCoordinate(value);
  return parsed === null ? "" : parsed.toFixed(digits);
}

export function validateCoordinates(latitude, longitude, { requireBoth = false } = {}) {
  const lat = parseCoordinate(latitude);
  const lng = parseCoordinate(longitude);

  if (lat === null && lng === null) {
    return requireBoth ? { valid: false, error: "Latitude and longitude are required." } : { valid: true, latitude: null, longitude: null };
  }

  if (lat === null || lng === null) {
    return { valid: false, error: "Enter both latitude and longitude, or leave both empty." };
  }

  if (lat < -90 || lat > 90) {
    return { valid: false, error: "Latitude must be between -90 and 90." };
  }

  if (lng < -180 || lng > 180) {
    return { valid: false, error: "Longitude must be between -180 and 180." };
  }

  return { valid: true, latitude: lat, longitude: lng };
}

export function hasValidCoordinates(latitude, longitude) {
  return validateCoordinates(latitude, longitude).valid && parseCoordinate(latitude) !== null;
}
