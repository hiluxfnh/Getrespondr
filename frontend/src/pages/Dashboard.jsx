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

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Active Incidents"
          value="1,248"
          color="text-red-500"
          icon={AlertTriangle}
          trend="+ 12"
          trendLabel="today"
        />

        <StatCard
          title="Volunteers Online"
          value="5,432"
          color="text-blue-500"
          icon={Users}
          trend="↑ 8%"
          trendLabel="from yesterday"
        />

        <StatCard
          title="Pending Tasks"
          value="684"
          color="text-orange-500"
          icon={CheckCircle}
          trend="↑ 24"
          trendLabel="today"
        />

        <StatCard
          title="Resources Available"
          value="812"
          color="text-green-500"
          icon={Package}
          trend="↑ 16"
          trendLabel="today"
        />

        <StatCard
          title="System Monitoring"
          value="24/7"
          color="text-purple-500"
          icon={TrendingUp}
          trend=""
          trendLabel="All Systems Normal"
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
            <div className="space-y-2 text-sm text-slate-700">
              <p>🌧️ Heavy rainfall predicted in North Region in the next 6 hours.</p>
              <p>🚗 Spike in road accidents reported on Highway 12. 12 incidents in last 2 hours.</p>
              <p>🏢 Possible building collapse risk detected in 3 structures. Priority inspection recommended.</p>
              <p>📱 Social media alert: People trapped in subway near Central.</p>
            </div>
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
            <p className="font-semibold text-slate-900">1,248 Total Incidents</p>
            <p>↑ 18% vs last 7 days</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Task Overview</h2>
          <div className="h-[200px] flex items-center justify-center relative">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e2e8f0" strokeWidth="30" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#10b981"
                strokeWidth="30"
                strokeDasharray="226 450"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="30"
                strokeDasharray="135 450"
                strokeDashoffset="-226"
              />
              <text x="100" y="105" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#1f2937">
                684
              </text>
            </svg>
            <div className="absolute text-center">
              <p className="text-3xl font-bold text-slate-900">684</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="w-3 h-3 bg-emerald-500 rounded-full inline-block mr-2" />Completed: 212 (31%)</p>
            <p><span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2" />In Progress: 198 (29%)</p>
            <p><span className="w-3 h-3 bg-orange-500 rounded-full inline-block mr-2" />Pending: 274 (40%)</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Volunteer Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: "Sarah Johnson", role: "Flood Relief", location: "Downtown Area" },
              { name: "Michael Chen", role: "Available for task", location: "Mobile Unit" },
              { name: "David Wilson", role: "On a task", location: "Medical Support" },
              { name: "Emily Davis", role: "Available for task", location: "Rescue Team B" },
            ].map((volunteer) => (
              <div key={volunteer.name} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-orange-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{volunteer.name}</p>
                  <p className="text-xs text-slate-500">{volunteer.role}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{volunteer.location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}