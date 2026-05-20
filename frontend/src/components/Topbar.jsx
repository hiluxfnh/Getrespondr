import {
  Bell,
  House,
  LogIn,
  MessageCircle,
  Search,
  Menu,
  CloudRain,
  MapPin,
  ShieldCheck,
  Users,
  UserCog,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";
import { useAuth } from "../firebase/auth";
import { listenToNotifications } from "../firebase/notifications";
import { useLayout } from "../layouts/DashboardLayout";

export default function Topbar() {
  const { pathname } = useLocation();
  const { user, requestRole } = useAuth();
  const { toggleSidebar } = useLayout();
  const [selectedRole, setSelectedRole] = useState("Volunteer");
  const [requestMessage, setRequestMessage] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const pageMeta = {
    "/": {
      title: "Home",
      subtitle: "Real-time crisis coordination for responders and communities",
    },
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Overview of crisis operations",
    },
    "/live-map": {
      title: "Live Map",
      subtitle: "Real-time incident and resource tracking",
    },
    "/incidents": {
      title: "Incidents",
      subtitle: "Manage and review active events",
    },
    "/incidents/:id": {
      title: "Incident Details",
      subtitle: "Review the full incident record and response status",
    },
    "/tasks": {
      title: "Tasks",
      subtitle: "Coordinate field actions and follow-ups",
    },
    "/resources": {
      title: "Resources",
      subtitle: "Track assets, shelters, and supplies",
    },
    "/volunteers": {
      title: "Volunteers",
      subtitle: "Volunteer availability and deployment",
    },
    "/profile": {
      title: "Profile",
      subtitle: "Your account information and access details",
    },
    "/notifications": {
      title: "Notifications",
      subtitle: "Alerts and operational updates",
    },
    "/messages": {
      title: "Messages",
      subtitle: "Team communication and coordination",
    },
    "/settings": {
      title: "Settings",
      subtitle: "Configure the coordination workspace",
    }
  };

  const activePage = pathname.startsWith("/incidents/")
    ? pageMeta["/incidents/:id"]
    : pageMeta[pathname] ?? pageMeta["/"];
  const showSearch = pathname !== "/live-map";
  const showRoleRequest = Boolean(user) && pathname !== "/login" && pathname !== "/register";
  const isPublicRoute = ["/", "/dashboard", "/incidents", "/live-map", "/tasks", "/resources", "/volunteers", "/notifications", "/messages"].some((route) =>
    route === pathname || (route === "/incidents" && pathname.startsWith("/incidents/"))
  );

  const roleOptions = [
    { value: "Volunteer", label: "Volunteer", icon: Users },
    { value: "Responder", label: "Responder", icon: UserCog },
    { value: "Coordinator", label: "Coordinator", icon: ShieldCheck },
  ];

  const handleRequestRole = async () => {
    try {
      setRequestMessage("");
      const result = await requestRole(selectedRole);
      if (result.status === "approved") {
        setRequestMessage(`${selectedRole} access granted.`);
      } else if (result.status === "pending") {
        setRequestMessage("Coordinator request sent for super admin approval.");
      } else {
        setRequestMessage("You already have this access.");
      }
    } catch (error) {
      setRequestMessage(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      return undefined;
    }

    const unsubscribe = listenToNotifications(user.role, (items) => {
      setNotificationCount(items.length);
    }, undefined, user.notificationPreferences || {});

    return unsubscribe;
  }, [user]);

  return (
    <header className="sticky top-0 z-40 flex h-auto min-h-20 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8" role="banner">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/70 lg:hidden"
        >
          <Menu size={20} className="text-slate-700" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-[1.45rem] font-bold leading-tight text-slate-900">{activePage.title}</h1>

          <p className="truncate text-sm text-slate-500">{activePage.subtitle}</p>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
        >
          <House size={16} className="text-slate-500" />
          Landing Page
        </Link>

        {!user && isPublicRoute && (
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
          >
            <LogIn size={16} />
            Sign in
          </Link>
        )}

        {showSearch && (
          <label className="bg-slate-100 px-3.5 py-2 rounded-xl flex items-center gap-2 w-72 max-w-[32vw] focus-within:ring-2 focus-within:ring-sky-500/70">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search incidents, tasks, resources..."
              aria-label="Search incidents, tasks, and resources"
              className="min-w-0 bg-transparent outline-none flex-1 text-sm text-slate-700 placeholder:text-slate-400"
            />
            <span className="text-xs text-slate-400 font-medium">⌘ K</span>
          </label>
        )}

        {showRoleRequest && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 max-w-[360px]">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/70"
              aria-label="Request access role"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRequestRole}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
            >
              Request Access
            </button>
            {requestMessage ? (
              <span className="w-full text-xs text-slate-500">{requestMessage}</span>
            ) : null}
          </div>
        )}

        <Link to="/notifications" className="relative rounded-lg p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/70" aria-label="Notifications">
          <Bell size={20} className="text-slate-600" />
          {notificationCount > 0 ? (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          ) : null}
        </Link>

        <Link to="/messages" className="relative rounded-lg p-2 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/70" aria-label="Messages">
          <MessageCircle size={20} className="text-slate-600" />
        </Link>

        <div className="hidden items-center gap-3 border-l border-slate-200 px-4 md:flex">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <CloudRain size={16} className="text-blue-500" />
              28°C Light Rain
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin size={12} /> New York, USA
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <div>
              <p className="text-xs text-emerald-600 font-medium">System Status</p>
              <p className="text-sm font-semibold text-slate-900">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
