import { useEffect, useRef, useState } from "react";
import { MapPin, X, Search } from "lucide-react";
import geocodeService from "../services/geocodeService";
import { formatCoordinate } from "../utils/coordinates";

export default function LocationSearch({
  value = "",
  latitude = "",
  longitude = "",
  onLocationSelect,
}) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await geocodeService.searchPlace(searchTerm);
      setSuggestions(results);
      setIsOpen(true);
      setIsSearching(false);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectLocation = (location) => {
    onLocationSelect({
      location: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setSearchTerm(location.name);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    onLocationSelect({
      location: "",
      latitude: "",
      longitude: "",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search for a location..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-400" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectLocation(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition flex items-start gap-3"
              >
                <MapPin size={16} className="mt-1 text-slate-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {suggestion.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {formatCoordinate(latitude) && formatCoordinate(longitude) ? (
        <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <p className="font-medium">Selected location</p>
          <p className="text-xs mt-1">
            {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
