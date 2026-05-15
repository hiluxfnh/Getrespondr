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
import Volunteers from "../pages/Volunteers";
import DashboardLayout from "../layouts/DashboardLayout";
import Notifications from "../pages/Notifications";
import Messages from "../pages/Messages";
import Settings from "../pages/Settings";
import SettingsPage from "../pages/SettingsPage";
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
          element={<Volunteers />}
        />

        <Route
          path="/notifications"
          element={
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          }
        />

        <Route
          path="/messages"
          element={
            <DashboardLayout>
              <Messages />
            </DashboardLayout>
          }
        />

        <Route
          path="/profile"
          element={<Settings />}
        />

        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/incidents/:id"
          element={<IncidentDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}