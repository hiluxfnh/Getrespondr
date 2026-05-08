import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

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
  },

  {
    id: 2,
    title: "Wildfire Alert",
    severity: "High",
    position: [40.7228, -74.016],
  },

  {
    id: 3,
    title: "Medical Emergency",
    severity: "Medium",
    position: [40.7328, -74.026],
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
    </MapContainer>
  );
}