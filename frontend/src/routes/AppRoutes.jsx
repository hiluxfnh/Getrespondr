import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/Dashboard";
import Incidents from "../pages/Incidents";
import LiveMapPage from "../pages/LiveMapPage";
import Tasks from "../pages/Tasks";
import Resources from "../pages/Resources";
import DashboardLayout from "../layouts/DashboardLayout";
import Analytics from "../pages/Analytics";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import IncidentDetails from "../pages/IncidentDetails";

function PlaceholderPage({ title, description }) {
  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
      </div>
    </DashboardLayout>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/incidents"
          element={<Incidents />}
        />

        <Route
          path="/live-map"
          element={<LiveMapPage />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

        <Route
          path="/resources"
          element={<Resources />}
        />

        <Route
          path="/volunteers"
          element={
            <PlaceholderPage
              title="Volunteers"
              description="Volunteer coordination and availability tracking will live here."
            />
          }
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/reports"
          element={
            <PlaceholderPage
              title="Reports"
              description="Incident reports, summaries, and exports will live here."
            />
          }
        />

        <Route
          path="/messages"
          element={
            <PlaceholderPage
              title="Messages"
              description="Team messages and coordination chat will live here."
            />
          }
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/incidents/:id"
          element={<IncidentDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}