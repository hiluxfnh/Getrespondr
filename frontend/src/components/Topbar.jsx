import {
  Bell,
  MessageCircle,
  Search,
  Menu,
  CloudRain,
  MapPin,
} from "lucide-react";

import {
  useLocation,
} from "react-router-dom";

export default function Topbar() {
  const { pathname } = useLocation();

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

  const activePage = pageMeta[pathname] ?? pageMeta["/"];
  const showSearch = pathname !== "/live-map";

  return (
    <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <button className="p-2 hover:bg-slate-100 rounded-lg">
          <Menu size={20} className="text-slate-700" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">{activePage.title}</h1>

          <p className="text-slate-500 text-sm">{activePage.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="bg-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-2 w-80">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search incidents, tasks, resources..."
              className="bg-transparent outline-none flex-1 text-slate-700 placeholder:text-slate-400"
            />
            <span className="text-xs text-slate-400 font-medium">⌘ K</span>
          </div>
        )}

        <button className="relative p-2 hover:bg-slate-100 rounded-lg">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            5
          </span>
        </button>

        <button className="relative p-2 hover:bg-slate-100 rounded-lg">
          <MessageCircle size={20} className="text-slate-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
        </button>

        <div className="border-l border-slate-200 px-4 flex items-center gap-3">
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

        <div className="border-l border-slate-200 pl-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <div>
              <p className="text-xs text-emerald-600 font-medium">System Status</p>
              <p className="text-sm font-semibold text-slate-900">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}