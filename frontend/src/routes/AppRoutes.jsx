import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Incidents from "../pages/Incidents";
import LiveMapPage from "../pages/LiveMapPage";
import Tasks from "../pages/Tasks";
import Resources from "../pages/Resources";
import Analytics from "../pages/Analytics";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import IncidentDetails from "../pages/IncidentDetails";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
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
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
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