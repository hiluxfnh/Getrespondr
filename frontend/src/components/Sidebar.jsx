import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  ClipboardList,
  Package,
  Bell,
  Settings,
  Users,
  MessagesSquare,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
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
    icon: Users,
    label: "Volunteers",
    path: "/volunteers",
  },

  {
    icon: Bell,
    label: "Notifications",
    path: "/notifications",
    badge: 12,
  },

  {
    icon: MessagesSquare,
    label: "Messages",
    path: "/messages",
  },

  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 z-50 w-64 h-screen bg-[#071936] text-white flex flex-col shadow-[18px_0_40px_rgba(2,6,23,0.35)]">
      <NavLink to="/" className="p-6 text-2xl font-bold border-b border-white/10 flex items-center gap-3 hover:opacity-95">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <span className="text-sm font-black">+</span>
        </div>

        <span className="text-[1.7rem] tracking-tight">
          Get<span className="text-blue-400">Respondr</span>
        </span>
      </NavLink>

      <div className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-950/30"
                  : "hover:bg-white/10 text-white/90"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={19} />

              <span className="text-[15px] font-medium">{item.label}</span>
            </div>

            {item.badge ? (
              <span className="grid min-w-6 h-6 place-items-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white shadow-sm">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/profile"
          className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-3 transition hover:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-amber-400 p-[2px]">
                <div className="h-full w-full rounded-full bg-white/90 overflow-hidden">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_35%_30%,#f8d7b6_0%,#f0b37a_38%,#8b5e3c_100%)]" />
                </div>
              </div>
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#071936]" />
            </div>

            <div>
              <p className="font-semibold leading-tight">
                John Doe
              </p>

              <p className="text-sm text-white/65 leading-tight">
                Coordinator
              </p>
            </div>
          </div>

          <Settings size={18} className="text-white/70" />
        </NavLink>
      </div>
    </div>
  );
}