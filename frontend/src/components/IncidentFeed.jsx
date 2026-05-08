const incidents = [
  {
    title: "Flood in Downtown",
    severity: "Critical",
  },
  {
    title: "Road Accident",
    severity: "High",
  },
  {
    title: "Medical Emergency",
    severity: "Medium",
  },
];

export default function IncidentFeed() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full">
      <h2 className="text-xl font-bold mb-4">
        Recent Incidents
      </h2>

      <div className="space-y-4">
        {incidents.map((incident, index) => (
          <div
            key={index}
            className="border border-slate-100 rounded-xl p-4"
          >
            <h3 className="font-semibold">
              {incident.title}
            </h3>

            <p className="text-sm text-red-500 mt-1">
              {incident.severity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}