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

import { useAuth } from "../firebase/auth";

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
  const { user, logout } = useAuth();

  return (
    <aside aria-label="Primary navigation" className="fixed left-0 top-0 z-50 w-64 h-screen bg-[#071936] text-white flex flex-col shadow-[18px_0_40px_rgba(2,6,23,0.35)]">
      <NavLink to="/" className="px-5 py-5 text-2xl font-bold border-b border-white/10 flex items-center gap-3 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-sky-400/70">
        <div className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <span className="text-sm font-black">+</span>
        </div>

        <span className="text-[1.45rem] tracking-tight whitespace-nowrap">
          Get<span className="text-blue-400">Respondr</span>
        </span>
      </NavLink>

      <div className="scrollbar-none flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-sky-400/70 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-950/30"
                  : "hover:bg-white/10 text-white/90"
              }`
            }
          >
            <div className="flex min-w-0 items-center gap-3">
              <item.icon size={18} />

              <span className="truncate text-[14px] font-medium leading-none">{item.label}</span>
            </div>

            {item.badge ? (
              <span className="grid min-w-6 h-6 shrink-0 place-items-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white shadow-sm">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-3 border-t border-white/10">
        {user ? (
          <div className="space-y-2.5">
            <NavLink
              to="/profile"
              className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-amber-400 p-[2px]">
                    <div className="h-full w-full rounded-full bg-white/90 overflow-hidden">
                      <div className="h-full w-full bg-[radial-gradient(circle_at_35%_30%,#f8d7b6_0%,#f0b37a_38%,#8b5e3c_100%)]" />
                    </div>
                  </div>
                  <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#071936]" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">
                    {user.displayName || user.email || "User"}
                  </p>

                  <p className="truncate text-xs text-white/65 leading-tight">
                    {user.role || "Viewer"}
                  </p>
                </div>
              </div>

              <Settings size={18} className="text-white/70" />
            </NavLink>

            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <p className="text-sm leading-5 text-white/75">
              Public mode is enabled. Sign in to create, edit, and coordinate.
            </p>
            <div className="flex gap-2">
              <NavLink
                to="/login"
                className="flex-1 rounded-xl bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400/70"
              >
                Register
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}