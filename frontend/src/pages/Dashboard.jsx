import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import LiveMap from "../components/LiveMap";
import IncidentFeed from "../components/IncidentFeed";
import AIInsights from "../components/AIInsights";
import ActivityStream from "../components/ActivityStream";
import {
  AlertTriangle,
  Users,
  Package,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { listenToDashboardStats } from "../firebase/dashboardStats";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    criticalIncidents: 0,
    resolvedIncidents: 0,
    allIncidents: [],
  });

  useEffect(() => {
    const unsubscribe = listenToDashboardStats((newStats) => {
      setStats(newStats);
    });

    return unsubscribe;
  }, []);

  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Active Incidents"
          value={stats.activeIncidents.toString()}
          color="text-red-500"
          icon={AlertTriangle}
          trend={`${stats.criticalIncidents} critical`}
          trendLabel="ongoing"
        />

        <StatCard
          title="Total Incidents"
          value={stats.totalIncidents.toString()}
          color="text-blue-500"
          icon={AlertTriangle}
          trend={`${stats.resolvedIncidents} resolved`}
          trendLabel="overall"
        />

        <StatCard
          title="Critical Alerts"
          value={stats.criticalIncidents.toString()}
          color="text-orange-500"
          icon={CheckCircle}
          trend="highest priority"
          trendLabel="immediate action"
        />

        <StatCard
          title="Response Status"
          value={stats.activeIncidents > 0 ? "Active" : "Clear"}
          color={stats.activeIncidents > 0 ? "text-red-500" : "text-green-500"}
          icon={TrendingUp}
          trend={stats.activeIncidents > 0 ? "responding" : "all clear"}
          trendLabel="current status"
        />

        <StatCard
          title="System Status"
          value="Operational"
          color="text-purple-500"
          icon={TrendingUp}
          trend="24/7"
          trendLabel="monitoring active"
        />
      </div>

      {/* Map + Incident Feed */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 h-[450px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Live Incident Map</h2>
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Filters
            </button>
          </div>
          <div className="h-[calc(100%-60px)]">
            <LiveMap />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <IncidentFeed />
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900">AI Intelligence</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
            <AIInsights incidents={stats.allIncidents} />
          </div>
        </div>
      </div>

      {/* Trends + Tasks + Activity */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Incident Trends</h2>
            <select className="text-sm text-slate-600 border border-slate-200 rounded-lg px-2 py-1">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[200px] bg-gradient-to-b from-blue-50 to-white rounded-lg p-4 flex items-end justify-around">
            {[40, 65, 52, 78, 85, 92, 110].map((height, i) => (
              <div key={i} className="w-8 bg-blue-500 rounded-t" style={{ height: `${height}px` }} />
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{stats.totalIncidents} Total Incidents</p>
            <p>↑ 18% vs last 7 days</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Incident Status</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Active</span>
              <span className="font-bold text-slate-900">{stats.activeIncidents}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{
                  width:
                    stats.totalIncidents > 0
                      ? `${(stats.activeIncidents / stats.totalIncidents) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-slate-700">Critical</span>
              <span className="font-bold text-slate-900">{stats.criticalIncidents}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{
                  width:
                    stats.totalIncidents > 0
                      ? `${(stats.criticalIncidents / stats.totalIncidents) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-slate-700">Resolved</span>
              <span className="font-bold text-slate-900">{stats.resolvedIncidents}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width:
                    stats.totalIncidents > 0
                      ? `${(stats.resolvedIncidents / stats.totalIncidents) * 100}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {stats.allIncidents.slice(0, 4).map((incident) => (
              <div key={incident.id} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{incident.title}</p>
                  <p className="text-xs text-slate-500">{incident.severity || "Medium"} severity</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {incident.status || "Investigating"}
                </span>
              </div>
            ))}
            {stats.allIncidents.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No incidents yet</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}