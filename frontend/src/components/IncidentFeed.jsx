import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import incidentsSeed from "../assets/incidents";
import AutoDetectBadge from "./AutoDetectBadge";
import { listenToIncidents } from "../firebase/incidents";

function formatTime(incident) {
  if (typeof incident.timestamp?.toDate === "function") {
    return incident.timestamp.toDate().toLocaleString();
  }
  return incident.time || "Recently";
}

export default function IncidentFeed() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToIncidents((next) => {
      setIncidents(next.length ? next : incidentsSeed);
    });
    return unsubscribe;
  }, []);

  const severityColors = {
    Critical: "text-red-600 bg-red-50",
    High: "text-orange-600 bg-orange-50",
    Medium: "text-amber-600 bg-amber-50",
    Low: "text-emerald-600 bg-emerald-50",
  };

  const recent = incidents.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Recent Incidents</h2>
        <Link to="/incidents" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {recent.length ? recent.map((incident) => (
          <Link
            key={incident.id}
            to={`/incidents/${incident.id}`}
            className="block border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm">{incident.title}</h3>
                {incident.autoDetected ? <AutoDetectBadge compact /> : null}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${severityColors[incident.severity] || severityColors.Medium}`}>
                {incident.severity}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{incident.locationDetail || incident.location}</p>
            <p className="text-xs text-slate-400">{formatTime(incident)}</p>
          </Link>
        )) : (
          <p className="text-sm text-slate-500">No incidents yet.</p>
        )}
      </div>
    </div>
  );
}
