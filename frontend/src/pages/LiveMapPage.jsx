import DashboardLayout from "../layouts/DashboardLayout";
import LiveMap from "../components/LiveMap";
import SeverityBadge from "../components/SeverityBadge";
import {
  AlertTriangle,
  Filter,
  Flame,
  Layers3,
  MapPin,
  Search,
  ShieldCheck,
  TentTree,
  Truck,
  Users,
} from "lucide-react";

const incidentCards = [
  {
    title: "Flooding in Downtown",
    severity: "Critical",
    time: "2 min ago",
    location: "Downtown",
    icon: AlertTriangle,
  },
  {
    title: "Building Collapse",
    severity: "High",
    time: "8 min ago",
    location: "North District",
    icon: ShieldCheck,
  },
  {
    title: "Road Accident - NH 12",
    severity: "Medium",
    time: "15 min ago",
    location: "Highway NH-12",
    icon: AlertTriangle,
  },
  {
    title: "Fire in Industrial Area",
    severity: "High",
    time: "25 min ago",
    location: "Industrial Area",
    icon: Flame,
  },
  {
    title: "Medical Emergency",
    severity: "Low",
    time: "35 min ago",
    location: "West Zone",
    icon: ShieldCheck,
  },
];

const resourceStats = [
  {
    icon: Users,
    label: "Volunteers",
    value: "124",
    sublabel: "Deployed",
  },
  {
    icon: TentTree,
    label: "Shelters",
    value: "8",
    sublabel: "Open",
  },
  {
    icon: Truck,
    label: "Supplies",
    value: "812",
    sublabel: "Units",
  },
];

const incidentTypes = [
  "All Types",
  "Flood",
  "Fire",
  "Accident",
  "Collapse",
  "Medical",
  "Power Outage",
  "Other",
];

const severityTypes = [
  { label: "Low", color: "text-green-600" },
  { label: "Medium", color: "text-amber-600" },
  { label: "High", color: "text-orange-600" },
  { label: "Critical", color: "text-red-600" },
];

export default function LiveMapPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <section className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search location, incident, resource..."
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur">
                <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100">
                  <span className="text-2xl leading-none">+</span>
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100">
                  <span className="text-2xl leading-none">−</span>
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100">
                  <MapPin className="h-4 w-4" />
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100">
                  <Layers3 className="h-4 w-4" />
                </button>
              </div>

              <div className="h-[560px]">
                <LiveMap />
              </div>

              <div className="absolute bottom-4 left-4 z-[1000] flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Low
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Medium
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  High
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-red-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  Critical
                </span>
              </div>

              <div className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-lg backdrop-blur">
                <span className="font-medium">1 km</span>
              </div>
            </div>

            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Live Incidents (5)
                  </h2>

                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View All Incidents
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {incidentCards.map((incident) => {
                    const Icon = incident.icon;

                    return (
                      <article
                        key={incident.title}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm text-red-600">
                            <Icon className="h-4 w-4" />
                          </div>

                          <SeverityBadge severity={incident.severity} />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-900">
                          {incident.title}
                        </h3>

                        <p className="mt-2 text-xs text-slate-500">
                          {incident.time}
                        </p>

                        <p className="text-xs text-slate-600">{incident.location}</p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Resources
                  </h2>

                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View All Resources
                  </button>
                </div>

                <div className="space-y-3">
                  {resourceStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {stat.label}
                            </p>

                            <p className="text-xs text-slate-500">
                              {stat.sublabel}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-semibold text-slate-900">
                            {stat.value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Activity
                  </h2>

                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Latest Updates
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    "Paramedic unit dispatched to Downtown",
                    "Shelter occupancy updated for West Zone",
                    "Road closure added near NH-12",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3"
                    >
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_0_6px_rgba(14,165,233,0.12)]" />
                      <p className="text-sm text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Map Filters
                </h2>

                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Reset
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Incident Type
                  </h3>

                  <div className="space-y-2 text-sm text-slate-700">
                    {incidentTypes.map((item, index) => (
                      <label
                        key={item}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={index === 0}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Severity
                  </h3>

                  <div className="space-y-2 text-sm text-slate-700">
                    {severityTypes.map((item) => (
                      <label
                        key={item.label}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={item.color}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full rounded-2xl bg-[#0D2A66] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#12357c]">
                  Apply Filters
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Cluster View
                </h2>

                <div className="h-6 w-11 rounded-full bg-blue-600 p-1">
                  <div className="ml-auto h-4 w-4 rounded-full bg-white shadow" />
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span>Critical incidents</span>
                  <span className="inline-flex items-center gap-2 text-red-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    2
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span>Active resources</span>
                  <span className="inline-flex items-center gap-2 text-emerald-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    18
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Legend
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>Critical Incident</span>
                </div>

                <div className="flex items-center gap-3">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>High Severity Incident</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>Medium Severity Incident</span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Resource Available</span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Team / Volunteer</span>
                </div>

                <div className="flex items-center gap-3">
                  <TentTree className="h-4 w-4 text-violet-600" />
                  <span>Shelter / Safe Zone</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}