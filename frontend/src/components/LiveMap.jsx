import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { useMemo, useState } from "react";
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

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const incidents = [
  {
    id: 1,
    title: "Flood in Downtown",
    severity: "Critical",
    position: [40.7128, -74.006],
    kind: "incident",
    icon: AlertTriangle,
    tone: "critical",
  },
  {
    id: 2,
    title: "Wildfire Alert",
    severity: "High",
    position: [40.7228, -74.016],
    kind: "incident",
    icon: Flame,
    tone: "high",
  },
  {
    id: 3,
    title: "Medical Emergency",
    severity: "Medium",
    position: [40.7328, -74.026],
    kind: "incident",
    icon: ShieldAlert,
    tone: "medium",
  },
  {
    id: 4,
    title: "Response Team Alpha",
    severity: "Low",
    position: [40.7292, -74.011],
    kind: "team",
    icon: Users,
    tone: "team",
  },
  {
    id: 5,
    title: "Supplies Depot",
    severity: "Low",
    position: [40.7191, -74.021],
    kind: "resource",
    icon: Truck,
    tone: "resource",
  },
  {
    id: 6,
    title: "Safe Shelter",
    severity: "Low",
    position: [40.7422, -74.019],
    kind: "shelter",
    icon: TentTree,
    tone: "shelter",
  },
];

const clusterMarkers = [
  {
    id: "c-1",
    position: [40.7262, -74.0212],
    count: 2,
    tone: "blue",
  },
  {
    id: "c-2",
    position: [40.7362, -74.0012],
    count: 3,
    tone: "blue",
  },
  {
    id: "c-3",
    position: [40.7062, -74.0122],
    count: 4,
    tone: "green",
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getZoomScale(zoom) {
  return clamp(0.9 + (zoom - 12) * 0.07, 0.9, 1.2);
}

function createMarkerIcon({ icon: Icon, tone, pulse = true, label, scale = 1, size }) {
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
        ${label ? `<div class="map-pin__label">${label}</div>` : ""}
      </div>
    `,
    iconSize: [size?.width ?? 64, size?.height ?? 80],
    iconAnchor: [Math.round((size?.width ?? 64) / 2), Math.round((size?.height ?? 80) * 0.9)],
    popupAnchor: [0, -60],
  });
}

function createClusterIcon(count, tone = "blue", scale = 1, size) {
  return L.divIcon({
    className: "",
    html: `
      <div class="map-cluster map-cluster--${tone} map-cluster--pulse" style="--map-pin-scale: ${scale}; --map-cluster-size: ${size?.width ?? 40}px;">
        <span>${count}</span>
      </div>
    `,
    iconSize: [size?.width ?? 40, size?.height ?? 40],
    iconAnchor: [Math.round((size?.width ?? 40) / 2), Math.round((size?.height ?? 40) / 2)],
  });
}

function MapMarkerLayer() {
  const [zoom, setZoom] = useState(12);

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

  const clusterSize = {
    width: Math.round(40 * zoomScale),
    height: Math.round(40 * zoomScale),
  };

  return (
    <>
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={incident.position}
          icon={createMarkerIcon({
            icon: incident.icon,
            tone: incident.tone,
            label: incident.kind === "team" ? "Team" : "",
            scale: zoomScale,
            size: markerSize,
          })}
        >
          <Popup>
            <div className="space-y-1">
              <h2 className="font-bold">
                {incident.title}
              </h2>

              <p className="text-red-500 text-sm">
                {incident.severity}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {clusterMarkers.map((cluster) => (
        <Marker
          key={cluster.id}
          position={cluster.position}
          icon={createClusterIcon(cluster.count, cluster.tone, zoomScale, clusterSize)}
        />
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
