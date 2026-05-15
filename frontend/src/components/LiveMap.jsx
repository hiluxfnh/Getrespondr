import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import {
  renderToStaticMarkup,
} from "react-dom/server";

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

function createMarkerIcon({ icon: Icon, tone, pulse = true, label }) {
  return L.divIcon({
    className: "",
    html: `
      <div class="map-pin map-pin--${tone} ${pulse ? "map-pin--pulse" : ""}">
        <div class="map-pin__core">
          ${renderToStaticMarkup(<Icon size={18} strokeWidth={2.6} />)}
        </div>
        ${label ? `<div class="map-pin__label">${label}</div>` : ""}
      </div>
    `,
    iconSize: [48, 62],
    iconAnchor: [24, 54],
    popupAnchor: [0, -46],
  });
}

function createClusterIcon(count) {
  return L.divIcon({
    className: "",
    html: `
      <div class="map-cluster map-cluster--pulse">
        <span>${count}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

const clusterMarkers = [
  {
    id: "c-1",
    position: [40.7262, -74.0212],
    count: 2,
  },
  {
    id: "c-2",
    position: [40.7362, -74.0012],
    count: 3,
  },
  {
    id: "c-3",
    position: [40.7062, -74.0122],
    count: 4,
  },
];

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

      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={incident.position}
          icon={createMarkerIcon({
            icon: incident.icon,
            tone: incident.tone,
            label: incident.kind === "team" ? "Team" : "",
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
          icon={createClusterIcon(cluster.count)}
        />
      ))}
    </MapContainer>
  );
}