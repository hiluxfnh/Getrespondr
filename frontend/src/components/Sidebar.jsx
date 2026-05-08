import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  ClipboardList,
  Package,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
  },

  {
    icon: AlertTriangle,
    label: "Incidents",
    path: "/incidents",
  },

  {
    icon: Map,
    label: "Live Map",
    path: "/live-map",
  },

  {
    icon: ClipboardList,
    label: "Tasks",
    path: "/tasks",
  },

  {
    icon: Package,
    label: "Resources",
    path: "/resources",
  },

  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
  },

  {
    icon: Bell,
    label: "Notifications",
    path: "/notifications",
  },

  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#0B1739] text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-white/10">
        GetRespondr
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-white/10"
              }`
            }
          >
            <item.icon size={20} />

            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="font-semibold">
            John Doe
          </p>

          <p className="text-sm text-gray-300">
            Coordinator
          </p>
        </div>
      </div>
    </div>
  );
}