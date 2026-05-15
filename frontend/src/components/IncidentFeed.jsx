const incidents = [
  {
    title: "Flooding in Downtown",
    location: "Mid-Road, Downtown",
    severity: "Critical",
    time: "2 min ago",
  },
  {
    title: "Building Collapse",
    location: "River Area",
    severity: "High",
    time: "5 min ago",
  },
  {
    title: "Road Accident - NH 12",
    location: "Highway 12, Mile 45",
    severity: "High",
    time: "10 min ago",
  },
  {
    title: "Fire in Industrial Area",
    location: "Industrial Zone, Sector 5",
    severity: "Critical",
    time: "15 min ago",
  },
  {
    title: "Medical Emergency",
    location: "City Hospital Area",
    severity: "Medium",
    time: "20 min ago",
  },
];

export default function IncidentFeed() {
  const severityColors = {
    Critical: "text-red-600 bg-red-50",
    High: "text-orange-600 bg-orange-50",
    Medium: "text-amber-600 bg-amber-50",
    Low: "text-emerald-600 bg-emerald-50",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Incidents</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {incidents.map((incident, index) => (
          <div key={index} className="border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 text-sm">{incident.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${severityColors[incident.severity]}`}>
                {incident.severity}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{incident.location}</p>
            <p className="text-xs text-slate-400">{incident.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}