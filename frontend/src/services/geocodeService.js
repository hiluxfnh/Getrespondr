/**
 * Nominatim Geocoding Service for location search and reverse geocoding.
 * Uses OpenStreetMap's free Nominatim API (no API key required).
 */

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

class GeocodeService {
  /**
   * Search for places by name.
   * @param {string} query - Place name to search for
   * @returns {Promise<Array>} - Array of matching places with name, latitude, longitude
   */
  async searchPlace(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=10`,
        {
          headers: {
            "User-Agent": "GetRespondr-Crisis-Platform",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding search failed");
      }

      const results = await response.json();
      return results.map((result) => ({
        name: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        boundingBox: result.boundingbox,
      }));
    } catch (error) {
      console.error("Geocoding search error:", error);
      return [];
    }
  }

  /**
   * Reverse geocode coordinates to get place name.
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<string>} - Place name
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            "User-Agent": "GetRespondr-Crisis-Platform",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const result = await response.json();
      return result.display_name || `${latitude}, ${longitude}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${latitude}, ${longitude}`;
    }
  }
}

export default new GeocodeService();
