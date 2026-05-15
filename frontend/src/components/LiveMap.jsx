import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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

function getCategoryIcon(category) {
  switch (category) {
    case "Flood":
      return AlertTriangle;
    case "Fire":
      return Flame;
    case "Earthquake":
      return ShieldAlert;
    case "Medical":
      return Users;
    case "Accident":
      return Truck;
    default:
      return AlertTriangle;
  }
}

function getCategoryTone(severity) {
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

function MapMarkerLayer() {
  const [zoom, setZoom] = useState(12);
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

  // Transform Firestore incidents into marker data
  const displayIncidents = useMemo(() => {
    const data = firestoreIncidents.length > 0 ? firestoreIncidents : incidentsSeed;
    return data
      .filter((inc) => inc.latitude && inc.longitude)
      .map((inc) => ({
        id: inc.id,
        title: inc.title || "Incident",
        severity: inc.severity || "Medium",
        position: [inc.latitude, inc.longitude],
        icon: getCategoryIcon(inc.category),
        tone: getCategoryTone(inc.severity),
        category: inc.category,
      }));
  }, [firestoreIncidents]);

  return (
    <>
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
              <p className="text-xs text-slate-600">{incident.category}</p>
              <p className="text-red-500 text-xs font-medium">{incident.severity}</p>
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

export default function LiveMap() {
  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapMarkerLayer />
    </MapContainer>
  );
}
