import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import LiveMap from "../components/LiveMap";
import IncidentFeed from "../components/IncidentFeed";
import AIInsights from "../components/AIInsights";
import ActivityStream from "../components/ActivityStream";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Active Incidents"
          value="1,248"
          color="text-red-500"
        />

        <StatCard
          title="Volunteers Online"
          value="5,432"
          color="text-blue-500"
        />

        <StatCard
          title="Pending Tasks"
          value="684"
          color="text-orange-500"
        />

        <StatCard
          title="Resources Available"
          value="812"
          color="text-green-500"
        />
      </div>

      {/* Map + Incident Feed */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 h-[500px] overflow-hidden">
          <LiveMap />
        </div>

        <IncidentFeed />
      </div>

      {/* AI + Activity */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <AIInsights />

        <ActivityStream />
      </div>
    </DashboardLayout>
  );
}