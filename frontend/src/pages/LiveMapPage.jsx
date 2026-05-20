import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import LiveMap, { getIncidentCoords } from "../components/LiveMap";
import SeverityBadge from "../components/SeverityBadge";
import AutoDetectBadge from "../components/AutoDetectBadge";
import ClimateAgentPanel from "../components/ClimateAgentPanel";
import incidentsSeed from "../assets/incidents";
import { listenToIncidents } from "../firebase/incidents";
import { sortByRelevance } from "../utils/incidentRelevance";
import {
  AlertTriangle,
  Filter,
  Flame,
  Layers3,
  MapPin,
  Search,
  ShieldCheck,
  TentTree,
  Truck,
  Users,
} from "lucide-react";

const ALL_CATEGORIES = [
  "Flood", "Fire", "Wildfire", "Heatwave", "Hurricane", "Drought",
  "Earthquake", "Medical", "Accident", "Infrastructure Failure",
];

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

function formatTime(incident) {
  if (typeof incident.timestamp?.toDate === "function") {
    return incident.timestamp.toDate().toLocaleString();
  }
  return incident.time || "Recently";
}

function getCategoryIcon(category) {
  switch (category) {
    case "Fire":
    case "Wildfire":
      return Flame;
    case "Earthquake":
      return ShieldCheck;
    default:
      return AlertTriangle;
  }
}

export default function LiveMapPage() {
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(ALL_CATEGORIES);
  const [selectedSeverities, setSelectedSeverities] = useState(SEVERITY_OPTIONS);
  const [autoOnly, setAutoOnly] = useState(false);
  const [mapStats, setMapStats] = useState({ onMap: 0, total: 0, autoDetected: 0 });

  useEffect(() => {
    const unsubscribe = listenToIncidents((next) => {
      setIncidents(next.length ? next : incidentsSeed);
    });
    return unsubscribe;
  }, []);

  const filteredIncidents = useMemo(() => {
    return sortByRelevance(
      incidents.filter((inc) => {
        const location = inc.locationDetail || inc.location || "";
        const matchesSearch =
          !search ||
          inc.title?.toLowerCase().includes(search.toLowerCase()) ||
          location.toLowerCase().includes(search.toLowerCase()) ||
          inc.category?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategories.includes(inc.category);
        const matchesSeverity = selectedSeverities.includes(inc.severity);
        const matchesAuto = !autoOnly || inc.autoDetected;
        const hasCoords = Boolean(getIncidentCoords(inc));
        return matchesSearch && matchesCategory && matchesSeverity && matchesAuto && hasCoords;
      })
    );
  }, [incidents, search, selectedCategories, selectedSeverities, autoOnly]);

  const mapFilters = useMemo(
    () => ({
      categories: selectedCategories,
      severities: selectedSeverities,
      autoOnly,
    }),
    [selectedCategories, selectedSeverities, autoOnly]
  );

  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  const toggleSeverity = (severity) => {
    setSelectedSeverities((current) =>
      current.includes(severity)
        ? current.filter((item) => item !== severity)
        : [...current, severity]
    );
  };

  const resetFilters = () => {
    setSelectedCategories(ALL_CATEGORIES);
    setSelectedSeverities(SEVERITY_OPTIONS);
    setAutoOnly(false);
    setSearch("");
  };

  const autoDetectedCount = incidents.filter((inc) => inc.autoDetected).length;
  const criticalCount = filteredIncidents.filter((inc) => inc.severity === "Critical").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ClimateAgentPanel compact />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search location, incident, resource..."
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Filter className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="h-[560px]">
                <LiveMap filters={mapFilters} onIncidentsChange={setMapStats} />
              </div>

              <div className="absolute left-4 top-4 z-[1000] rounded-2xl border border-slate-200 bg-white/95 px-4 py-2 text-sm shadow-lg backdrop-blur">
                <span className="font-medium text-slate-900">{mapStats.onMap}</span>
                <span className="text-slate-500"> on map</span>
                {mapStats.autoDetected ? (
                  <span className="ml-2 text-violet-600">· {mapStats.autoDetected} AI</span>
                ) : null}
              </div>

              <div className="absolute bottom-4 left-4 z-[1000] flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
                {SEVERITY_OPTIONS.map((severity) => {
                  const colors = {
                    Low: "bg-emerald-500",
                    Medium: "bg-amber-500",
                    High: "bg-orange-500",
                    Critical: "bg-red-500",
                  };
                  return (
                    <span key={severity} className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-slate-700">
                      <span className={`h-2.5 w-2.5 rounded-full ${colors[severity]}`} />
                      {severity}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Live Incidents ({filteredIncidents.length})
                </h2>
                <Link to="/incidents" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  View All Incidents
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {filteredIncidents.slice(0, 5).map((incident) => {
                  const Icon = getCategoryIcon(incident.category);
                  return (
                    <Link
                      key={incident.id}
                      to={`/incidents/${incident.id}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm text-red-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <SeverityBadge severity={incident.severity} />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{incident.title}</h3>
                        {incident.autoDetected ? <AutoDetectBadge compact /> : null}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{formatTime(incident)}</p>
                      <p className="text-xs text-slate-600">{incident.locationDetail || incident.location}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Map Filters</h2>
                <button type="button" onClick={resetFilters} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Reset
                </button>
              </div>

              <div className="space-y-5">
                <label className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-800">
                  <input
                    type="checkbox"
                    checked={autoOnly}
                    onChange={(event) => setAutoOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span>AI auto-detected only ({autoDetectedCount})</span>
                </label>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">Incident Type</h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    {ALL_CATEGORIES.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(item)}
                          onChange={() => toggleCategory(item)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">Severity</h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    {SEVERITY_OPTIONS.map((item) => (
                      <label key={item} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSeverities.includes(item)}
                          onChange={() => toggleSeverity(item)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span>Critical incidents</span>
                  <span className="inline-flex items-center gap-2 text-red-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    {criticalCount}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span>On map</span>
                  <span className="inline-flex items-center gap-2 text-blue-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    {mapStats.onMap}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span>AI auto-detected</span>
                  <span className="inline-flex items-center gap-2 text-violet-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                    {autoDetectedCount}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
