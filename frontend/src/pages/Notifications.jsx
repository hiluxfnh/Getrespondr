import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Filter,
  MessageCircle,
  MoreVertical,
  Package,
  Search,
  Settings2,
  Sparkles,
  TriangleAlert,
  ShieldAlert,
} from "lucide-react";

import { useAuth } from "../firebase/auth";
import { listenToNotifications } from "../firebase/notifications";

const filterOptions = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "incident", label: "Incidents" },
  { id: "ai", label: "AI" },
  { id: "system", label: "System" },
];

function formatTime(value) {
  if (!value) return "Just now";
  if (typeof value?.toDate === "function") return value.toDate().toLocaleString();
  if (value instanceof Date) return value.toLocaleString();
  return String(value);
}

function iconForNotification(notification) {
  switch (notification.type) {
    case "ai":
      return Sparkles;
    case "incident":
      return TriangleAlert;
    case "update":
      return CheckCircle2;
    case "system":
      return Settings2;
    case "message":
      return MessageCircle;
    case "resource":
      return Package;
    default:
      return Bell;
  }
}

function toneForNotification(notification) {
  switch (notification.type) {
    case "ai":
      return { wrapper: "bg-violet-50 border-violet-200 text-violet-700", dot: "bg-violet-500" };
    case "incident":
      return { wrapper: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500" };
    case "update":
      return { wrapper: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" };
    case "system":
      return { wrapper: "bg-slate-50 border-slate-200 text-slate-700", dot: "bg-slate-500" };
    default:
      return { wrapper: "bg-blue-50 border-blue-200 text-blue-700", dot: "bg-blue-500" };
  }
}

function StatPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left backdrop-blur">
      <p className="text-xs uppercase tracking-[0.18em] text-white/60">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dismissedIds, setDismissedIds] = useState([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setNotifications([]);
      return undefined;
    }

    setLoading(true);
    const unsubscribe = listenToNotifications(user.role, (items) => {
      setNotifications(items);
      setLoading(false);
      setError("");
    }, (err) => {
      setError(err.message);
      setLoading(false);
    }, user.notificationPreferences || {});

    return unsubscribe;
  }, [user]);

  const unreadCount = notifications.filter((item) => !dismissedIds.includes(item.id)).length;
  const stats = useMemo(() => ({
    total: notifications.length,
    incident: notifications.filter((item) => item.type === "incident").length,
    ai: notifications.filter((item) => item.type === "ai").length,
    system: notifications.filter((item) => item.type === "system").length,
    unread: unreadCount,
  }), [notifications, unreadCount]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const searchable = `${notification.title} ${notification.description} ${notification.incidentTitle}`.toLowerCase();
      const matchesSearch = searchable.includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "unread" && !dismissedIds.includes(notification.id)) ||
        notification.type === activeFilter;

      return matchesSearch && matchesFilter && !dismissedIds.includes(notification.id);
    });
  }, [notifications, searchQuery, activeFilter, dismissedIds]);

  const markAllRead = () => setDismissedIds(notifications.map((item) => item.id));
  const markAsRead = (id) => setDismissedIds((current) => (current.includes(id) ? current : [...current, id]));

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[linear-gradient(135deg,#071d40_0%,#12305d_45%,#0ea5e9_100%)] px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur">
                <Bell className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Realtime Alerts</p>
                <h1 className="mt-1 text-3xl font-bold">Notifications</h1>
                <p className="mt-2 text-sm text-white/75">Incident alerts, AI findings, and system updates stream here in realtime.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatPill label="Total" value={stats.total} />
              <StatPill label="Unread" value={stats.unread} />
              <StatPill label="Incidents" value={stats.incident} />
              <StatPill label="AI" value={stats.ai} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.6fr)_360px] sm:px-8">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search alerts, incidents, and AI notes"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark all read
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <button type="button" className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.id
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                  Loading notifications...
                </div>
              ) : filteredNotifications.length ? (
                filteredNotifications.map((notification) => {
                  const Icon = iconForNotification(notification);
                  const tone = toneForNotification(notification);

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div className={`grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl border ${tone.wrapper}`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                              <p className="mt-1 text-sm leading-6 text-slate-600">{notification.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{formatTime(notification.createdAt)}</span>
                              <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{notification.type}</span>
                            {notification.incidentTitle ? (
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">{notification.incidentTitle}</span>
                            ) : null}
                            {notification.severity ? (
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{notification.severity}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <Bell className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-4 text-lg font-semibold text-slate-900">No notifications right now</p>
                  <p className="mt-2 text-sm text-slate-500">New incident alerts and AI results will appear here automatically.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Delivery Scope</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" /> Incident alerts go to responders and coordinators.</p>
                <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-500" /> AI duplicate matches and severity suggestions are included automatically.</p>
                <p className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-slate-500" /> System notices can be added alongside incident updates.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Realtime Feed</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This feed listens directly to the Firestore notifications collection, so alerts update without refreshing the page.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
