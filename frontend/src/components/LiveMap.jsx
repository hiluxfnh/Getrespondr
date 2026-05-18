import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  TentTree,
  Truck,
  Users,
} from "lucide-react";

import "leaflet/dist/leaflet.css";
import { listenToIncidentsForMap } from "../firebase/dashboardStats";
import incidentsSeed from "../assets/incidents";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function getIncidentCoords(incident) {
  const lat = incident.latitude ?? incident.coordinates?.latitude;
  const lng = incident.longitude ?? incident.coordinates?.longitude;
  if (lat == null || lng == null) {
    return null;
  }
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }
  return { latitude, longitude };
}

function getCategoryIcon(category) {
  switch (category) {
    case "Flood":
      return AlertTriangle;
    case "Fire":
    case "Wildfire":
      return Flame;
    case "Earthquake":
      return ShieldAlert;
    case "Medical":
      return Users;
    case "Accident":
      return Truck;
    case "Heatwave":
    case "Hurricane":
    case "Drought":
      return TentTree;
    default:
      return AlertTriangle;
  }
}

function getCategoryTone(severity, autoDetected) {
  if (autoDetected) {
    return "auto";
  }

  switch (severity) {
    case "Critical":
      return "critical";
    case "High":
      return "high";
    case "Medium":
      return "medium";
    default:
      return "low";
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getZoomScale(zoom) {
  return clamp(0.9 + (zoom - 12) * 0.07, 0.9, 1.2);
}

function createMarkerIcon({ icon: Icon, tone, pulse = true, scale = 1, size }) {
  return L.divIcon({
    className: "",
    html: `
      <div class="map-pin map-pin--${tone} ${pulse ? "map-pin--pulse" : ""}" style="--map-pin-scale: ${scale}; --map-pin-width: ${size?.width ?? 64}px; --map-pin-height: ${size?.height ?? 80}px;">
        <div class="map-pin__glow map-pin__glow--outer"></div>
        <div class="map-pin__glow map-pin__glow--mid"></div>
        <div class="map-pin__glow map-pin__glow--inner"></div>
        <div class="map-pin__shape">
          <div class="map-pin__core">
            ${renderToStaticMarkup(<Icon size={18} strokeWidth={2.35} />)}
          </div>
        </div>
      </div>
    `,
    iconSize: [size?.width ?? 64, size?.height ?? 80],
    iconAnchor: [Math.round((size?.width ?? 64) / 2), Math.round((size?.height ?? 80) * 0.9)],
    popupAnchor: [0, -60],
  });
}

function MapBoundsFit({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions.length) {
      return;
    }

    if (positions.length === 1) {
      map.setView(positions[0], 8, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 10, animate: true });
  }, [map, positions]);

  return null;
}

function MapMarkerLayer({ filters, onIncidentsChange }) {
  const [zoom, setZoom] = useState(3);
  const [firestoreIncidents, setFirestoreIncidents] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToIncidentsForMap((incidents) => {
      setFirestoreIncidents(incidents);
    });

    return unsubscribe;
  }, []);

  useMapEvents({
    zoomend(event) {
      setZoom(event.target.getZoom());
    },
    zoomlevelschange(event) {
      setZoom(event.target.getZoom());
    },
    load(event) {
      setZoom(event.target.getZoom());
    },
  });

  const zoomScale = useMemo(() => getZoomScale(zoom), [zoom]);

  const markerSize = {
    width: Math.round(64 * zoomScale),
    height: Math.round(80 * zoomScale),
  };

  const allIncidents = firestoreIncidents.length > 0 ? firestoreIncidents : incidentsSeed;

  const displayIncidents = useMemo(() => {
    return allIncidents
      .map((inc) => {
        const coords = getIncidentCoords(inc);
        if (!coords) {
          return null;
        }

        if (filters.autoOnly && !inc.autoDetected) {
          return null;
        }
        if (filters.categories?.length && !filters.categories.includes(inc.category)) {
          return null;
        }
        if (filters.severities?.length && !filters.severities.includes(inc.severity)) {
          return null;
        }

        return {
          id: inc.id,
          title: inc.title || "Incident",
          severity: inc.severity || "Medium",
          position: [coords.latitude, coords.longitude],
          icon: getCategoryIcon(inc.category),
          tone: getCategoryTone(inc.severity, inc.autoDetected),
          category: inc.category,
          autoDetected: inc.autoDetected,
          sourceName: inc.sourceName,
          sourceUrl: inc.sourceUrl,
          updatedAt: inc.updatedAt || inc.timestamp,
        };
      })
      .filter(Boolean);
  }, [allIncidents, filters]);

  useEffect(() => {
    if (onIncidentsChange) {
      const mapped = allIncidents.length;
      const onMap = displayIncidents.length;
      const autoDetected = displayIncidents.filter((inc) => inc.autoDetected).length;
      onIncidentsChange({ mapped, onMap, autoDetected, total: allIncidents.length });
    }
  }, [allIncidents, displayIncidents, onIncidentsChange]);

  const positions = useMemo(
    () => displayIncidents.map((incident) => incident.position),
    [displayIncidents]
  );

  return (
    <>
      <MapBoundsFit positions={positions} />
      {displayIncidents.map((incident) => (
        <Marker
          key={incident.id}
          position={incident.position}
          icon={createMarkerIcon({
            icon: incident.icon,
            tone: incident.tone,
            scale: zoomScale,
            size: markerSize,
          })}
        >
          <Popup>
            <div className="space-y-1">
              <h2 className="font-bold text-sm">{incident.title}</h2>
              {incident.autoDetected ? (
                <p className="text-xs font-semibold text-violet-600">AI auto-detected</p>
              ) : null}
              <p className="text-xs text-slate-600">{incident.category}</p>
              <p className="text-red-500 text-xs font-medium">{incident.severity}</p>
              {incident.sourceName ? (
                <p className="text-xs text-slate-500">Source: {incident.sourceName}</p>
              ) : null}
              <p className="text-xs text-slate-500">
                {incident.position[0].toFixed(4)}, {incident.position[1].toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function LiveMap({ filters = {}, onIncidentsChange }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
      worldCopyJump
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapMarkerLayer filters={filters} onIncidentsChange={onIncidentsChange} />
    </MapContainer>
  );
}

export { getIncidentCoords };
