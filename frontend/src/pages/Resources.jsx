import DashboardLayout from "../layouts/DashboardLayout";
import {
  ArrowUpRight,
  Box,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Filter,
  FlaskConical,
  Fuel,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Truck,
  Warehouse,
} from "lucide-react";

const stats = [
  {
    label: "Total Resources",
    value: "812",
    delta: "+16% from last week",
    icon: Box,
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Available",
    value: "628",
    delta: "77% of total",
    icon: CircleCheck,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "In Use",
    value: "112",
    delta: "+14% of total",
    icon: Truck,
    accent: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Low Stock",
    value: "72",
    delta: "+9% of total",
    icon: ShieldAlert,
    accent: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Maintenance",
    value: "24",
    delta: "+3% of total",
    icon: FlaskConical,
    accent: "text-violet-600",
    bg: "bg-violet-50",
  },
];

const resourceRows = [
  {
    name: "Medical Kits",
    code: "RES-2024-001",
    type: "Supplies",
    category: "Medical",
    quantity: 320,
    available: 120,
    location: "Warehouse 1",
    status: "Available",
    updated: "2 min ago",
    icon: FlaskConical,
    iconBg: "bg-red-50 text-red-600",
  },
  {
    name: "Water Bottles (1L)",
    code: "RES-2024-002",
    type: "Supplies",
    category: "Essentials",
    quantity: 1200,
    available: 850,
    location: "Warehouse 1",
    status: "Available",
    updated: "3 min ago",
    icon: CircleCheck,
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    name: "Blankets",
    code: "RES-2024-003",
    type: "Supplies",
    category: "Shelter",
    quantity: 500,
    available: 200,
    location: "Warehouse 1",
    status: "Low Stock",
    updated: "5 min ago",
    icon: Box,
    iconBg: "bg-orange-50 text-orange-500",
  },
  {
    name: "Tents",
    code: "RES-2024-004",
    type: "Shelter",
    category: "Shelter",
    quantity: 150,
    available: 45,
    location: "Warehouse 3",
    status: "Low Stock",
    updated: "8 min ago",
    icon: Warehouse,
    iconBg: "bg-violet-50 text-violet-600",
  },
  {
    name: "Life Jackets",
    code: "RES-2024-005",
    type: "Safety",
    category: "Rescue",
    quantity: 80,
    available: 20,
    location: "Warehouse 2",
    status: "Low Stock",
    updated: "10 min ago",
    icon: ShieldAlert,
    iconBg: "bg-green-50 text-green-600",
  },
  {
    name: "Flashlights",
    code: "RES-2024-006",
    type: "Equipment",
    category: "Tools",
    quantity: 300,
    available: 95,
    location: "Warehouse 1",
    status: "Available",
    updated: "12 min ago",
    icon: Filter,
    iconBg: "bg-amber-50 text-amber-500",
  },
  {
    name: "Ambulances",
    code: "RES-2024-007",
    type: "Vehicle",
    category: "Medical",
    quantity: 12,
    available: 5,
    location: "Central Depot",
    status: "In Use",
    updated: "15 min ago",
    icon: Truck,
    iconBg: "bg-blue-50 text-blue-600",
  },
  {
    name: "Rescue Boats",
    code: "RES-2024-008",
    type: "Vehicle",
    category: "Rescue",
    quantity: 6,
    available: 2,
    location: "River Station",
    status: "In Use",
    updated: "18 min ago",
    icon: Truck,
    iconBg: "bg-green-50 text-green-600",
  },
  {
    name: "Generators",
    code: "RES-2024-009",
    type: "Equipment",
    category: "Power",
    quantity: 25,
    available: 18,
    location: "Warehouse 2",
    status: "Available",
    updated: "20 min ago",
    icon: SlidersHorizontal,
    iconBg: "bg-violet-50 text-violet-600",
  },
  {
    name: "Fuel Canisters (20L)",
    code: "RES-2024-010",
    type: "Supplies",
    category: "Fuel",
    quantity: 200,
    available: 60,
    location: "Warehouse 2",
    status: "Low Stock",
    updated: "25 min ago",
    icon: Fuel,
    iconBg: "bg-cyan-50 text-cyan-600",
  },
];

const lowStockAlerts = [
  { name: "Blankets", left: "200 left", icon: Box, color: "text-orange-500" },
  { name: "Tents", left: "45 left", icon: Warehouse, color: "text-violet-600" },
  { name: "Life Jackets", left: "20 left", icon: ShieldAlert, color: "text-green-600" },
  { name: "Fuel Canisters (20L)", left: "60 left", icon: Fuel, color: "text-cyan-600" },
  { name: "Walkie Talkies", left: "15 left", icon: SlidersHorizontal, color: "text-violet-600" },
];

const recentActivity = [
  {
    title: "Medical Kits added to Warehouse 1",
    time: "5 min ago",
    icon: CircleCheck,
    color: "text-green-600",
  },
  {
    title: "20 Life Jackets deployed",
    time: "15 min ago",
    icon: ArrowUpRight,
    color: "text-blue-600",
  },
  {
    title: "Blankets stock is low",
    time: "25 min ago",
    icon: ShieldAlert,
    color: "text-orange-500",
  },
  {
    title: "Emergency Lights added to Warehouse 2",
    time: "1 hr ago",
    icon: Box,
    color: "text-green-600",
  },
  {
    title: "5 Generators sent for maintenance",
    time: "2 hr ago",
    icon: ArrowUpRight,
    color: "text-blue-600",
  },
];

function DonutChart() {
  const segments = [
    { value: 77, color: "#22c55e" },
    { value: 14, color: "#3b82f6" },
    { value: 9, color: "#f59e0b" },
    { value: 3, color: "#8b5cf6" },
  ];

  const circumference = 2 * Math.PI * 56;
  let offset = 0;

  return (
    <svg viewBox="0 0 160 160" className="mx-auto h-52 w-52">
      <circle cx="80" cy="80" r="56" stroke="#e2e8f0" strokeWidth="18" fill="none" />
      {segments.map((segment) => {
        const dash = (segment.value / 100) * circumference;
        const circle = (
          <circle
            key={segment.color}
            cx="80"
            cy="80"
            r="56"
            stroke={segment.color}
            strokeWidth="18"
            fill="none"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
        offset += dash;
        return circle;
      })}
      <circle cx="80" cy="80" r="40" fill="white" />
      <text x="80" y="78" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1f2937">
        628
      </text>
      <text x="80" y="98" textAnchor="middle" fontSize="10" fill="#64748b">
        Available
      </text>
    </svg>
  );
}

export default function Resources() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Resources</h1>
            <p className="mt-2 text-slate-500">Manage and track all available resources and inventory</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-[#0D2A66] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#12357c]">
              <Plus className="h-4 w-4" />
              Add Resource
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.accent}`} />
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className="mt-2 text-xs text-slate-500">{stat.delta}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
              <div className="flex min-w-64 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500">
                <Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {[
                "All Types",
                "All Categories",
                "All Status",
                "All Locations",
              ].map((label) => (
                <button key={label} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                  {label}
                  <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Resource</th>
                    <th className="px-4 py-4 font-semibold">Type</th>
                    <th className="px-4 py-4 font-semibold">Category</th>
                    <th className="px-4 py-4 font-semibold">Quantity</th>
                    <th className="px-4 py-4 font-semibold">Available</th>
                    <th className="px-4 py-4 font-semibold">Location</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Last Updated</th>
                    <th className="px-4 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {resourceRows.map((row) => {
                    const Icon = row.icon;
                    const statusStyles = {
                      Available: "bg-emerald-50 text-emerald-600",
                      "Low Stock": "bg-orange-50 text-orange-600",
                      "In Use": "bg-blue-50 text-blue-600",
                    };

                    return (
                      <tr key={row.code} className="border-t border-slate-100 hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`grid h-10 w-10 place-items-center rounded-full ${row.iconBg}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{row.name}</p>
                              <p className="text-xs text-slate-500">{row.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{row.type}</td>
                        <td className="px-4 py-4 text-slate-600">{row.category}</td>
                        <td className="px-4 py-4 font-medium text-slate-900">{row.quantity}</td>
                        <td className="px-4 py-4 font-medium text-emerald-600">{row.available}</td>
                        <td className="px-4 py-4 text-slate-600">{row.location}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-500">{row.updated}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                              <CalendarDays className="h-4 w-4" />
                            </button>
                            <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                              <SlidersHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
              <p>Showing 1 to 10 of 812 resources</p>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="rounded-lg bg-[#0D2A66] px-3 py-2 font-semibold text-white">1</button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">2</button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">3</button>
                <span>...</span>
                <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">82</button>
                <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  10
                  <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Resource Availability</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative">
                  <DonutChart />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-end text-xs">
                    <div className="mr-2 space-y-2 text-slate-600">
                      <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Available 628 (77%)</p>
                      <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />In Use 112 (14%)</p>
                      <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Low Stock 72 (9%)</p>
                      <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Maintenance 24 (3%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Low Stock Alerts</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <div className="space-y-3">
                {lowStockAlerts.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-orange-500">{item.left}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.title} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full bg-slate-50 p-2 ${activity.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}