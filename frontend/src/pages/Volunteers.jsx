import DashboardLayout from "../layouts/DashboardLayout";
import {
  Bell,
  CheckCircle2,
  CircleSlash2,
  Clock3,
  Download,
  Filter,
  Plus,
  MapPin,
  Search,
  ShieldAlert,
  SquareActivity,
  Users,
} from "lucide-react";

const statCards = [
  {
    title: "Total Volunteers",
    value: "5,432",
    note: "+12% from last month",
    icon: Users,
    accent: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Available",
    value: "3,892",
    note: "71% of total",
    icon: CheckCircle2,
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "On Duty",
    value: "1,128",
    note: "21% of total",
    icon: Clock3,
    accent: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    title: "Deployed",
    value: "412",
    note: "8% of total",
    icon: SquareActivity,
    accent: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "Unavailable",
    value: "1,724",
    note: "↓ 31% of total",
    icon: CircleSlash2,
    accent: "text-red-600",
    bg: "bg-red-50",
  },
];

const volunteers = [
  {
    name: "Sarah Johnson",
    id: "VOL-10001",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 234-5678",
    team: "Team Alpha",
    skills: ["First Aid", "Search & Rescue"],
    extraSkills: 2,
    status: "Available",
    availability: "Available Now",
    lastActive: "5 min ago",
    statusClass: "bg-emerald-50 text-emerald-600",
    teamClass: "bg-blue-50 text-blue-600",
  },
  {
    name: "Michael Chen",
    id: "VOL-10002",
    email: "michael.chen@email.com",
    phone: "+1 (555) 456-7890",
    team: "Team Bravo",
    skills: ["Medical", "Logistics"],
    extraSkills: 1,
    status: "On Duty",
    availability: "Until 6:00 PM",
    lastActive: "1 hr ago",
    statusClass: "bg-orange-50 text-orange-600",
    teamClass: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Emily Rodriguez",
    id: "VOL-10003",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    team: "Team Charlie",
    skills: ["Communications", "Planning"],
    extraSkills: 2,
    status: "Deployed",
    availability: "Deployment",
    lastActive: "30 min ago",
    statusClass: "bg-violet-50 text-violet-600",
    teamClass: "bg-violet-50 text-violet-600",
  },
  {
    name: "David Thompson",
    id: "VOL-10004",
    email: "david.thompson@email.com",
    phone: "+1 (555) 567-8901",
    team: "Team Delta",
    skills: ["Driver", "Equipment"],
    extraSkills: 1,
    status: "Available",
    availability: "Available Now",
    lastActive: "2 hr ago",
    statusClass: "bg-emerald-50 text-emerald-600",
    teamClass: "bg-blue-50 text-blue-600",
  },
  {
    name: "Lisa Patel",
    id: "VOL-10005",
    email: "lisa.patel@email.com",
    phone: "+1 (555) 678-9012",
    team: "Team Echo",
    skills: ["First Aid", "Shelter Mgmt"],
    extraSkills: 1,
    status: "Unavailable",
    availability: "Unavailable",
    lastActive: "1 day ago",
    statusClass: "bg-red-50 text-red-600",
    teamClass: "bg-orange-50 text-orange-600",
  },
  {
    name: "James Wilson",
    id: "VOL-10006",
    email: "james.wilson@email.com",
    phone: "+1 (555) 789-0123",
    team: "Team Alpha",
    skills: ["Search & Rescue", "Rope Ops"],
    extraSkills: 2,
    status: "On Duty",
    availability: "Until 10:00 PM",
    lastActive: "45 min ago",
    statusClass: "bg-orange-50 text-orange-600",
    teamClass: "bg-blue-50 text-blue-600",
  },
  {
    name: "Maria Garcia",
    id: "VOL-10007",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 890-1234",
    team: "Team Bravo",
    skills: ["Medical", "Mental Health"],
    extraSkills: 1,
    status: "Available",
    availability: "Available Now",
    lastActive: "10 min ago",
    statusClass: "bg-emerald-50 text-emerald-600",
    teamClass: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Robert Kim",
    id: "VOL-10008",
    email: "robert.kim@email.com",
    phone: "+1 (555) 901-2345",
    team: "Team Charlie",
    skills: ["Communications", "IT Support"],
    extraSkills: 1,
    status: "Deployed",
    availability: "Deployment",
    lastActive: "15 min ago",
    statusClass: "bg-violet-50 text-violet-600",
    teamClass: "bg-violet-50 text-violet-600",
  },
  {
    name: "Jessica Lee",
    id: "VOL-10009",
    email: "jessica.lee@email.com",
    phone: "+1 (555) 012-3456",
    team: "Team Delta",
    skills: ["Logistics", "Administration"],
    extraSkills: 1,
    status: "Unavailable",
    availability: "Unavailable",
    lastActive: "3 days ago",
    statusClass: "bg-red-50 text-red-600",
    teamClass: "bg-blue-50 text-blue-600",
  },
  {
    name: "Daniel Brown",
    id: "VOL-10010",
    email: "daniel.brown@email.com",
    phone: "+1 (555) 123-4567",
    team: "Team Echo",
    skills: ["Driver", "Heavy Equipment"],
    extraSkills: 1,
    status: "Available",
    availability: "Available Now",
    lastActive: "1 hr ago",
    statusClass: "bg-emerald-50 text-emerald-600",
    teamClass: "bg-orange-50 text-orange-600",
  },
];

const skillsBreakdown = [
  { name: "First Aid", count: 1842, color: "bg-red-500" },
  { name: "Search & Rescue", count: 1576, color: "bg-blue-500" },
  { name: "Medical", count: 1223, color: "bg-emerald-500" },
  { name: "Communications", count: 1098, color: "bg-violet-500" },
  { name: "Logistics", count: 987, color: "bg-sky-500" },
  { name: "Driver", count: 832, color: "bg-indigo-500" },
  { name: "Shelter Management", count: 764, color: "bg-amber-500" },
  { name: "Other Skills", count: 1345, color: "bg-slate-400" },
];

const certificationStatus = [
  { label: "First Aid Certified", value: 82 },
  { label: "CPR Certified", value: 74 },
  { label: "Search & Rescue", value: 61 },
  { label: "Bloodborne Pathogens", value: 58 },
  { label: "ICS 100/200", value: 40 },
];

function VolunteerChart() {
  const segments = [
    { value: 71, color: "#22c55e" },
    { value: 21, color: "#f59e0b" },
    { value: 8, color: "#3b82f6" },
    { value: 31, color: "#ef4444" },
  ];

  const circumference = 2 * Math.PI * 56;
  let offset = 0;

  return (
    <svg viewBox="0 0 160 160" className="mx-auto h-52 w-52">
      <circle cx="80" cy="80" r="56" stroke="#e2e8f0" strokeWidth="18" fill="none" />
      {segments.map((segment) => {
        const dash = (segment.value / 100) * circumference;
        const node = (
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
        return node;
      })}
      <circle cx="80" cy="80" r="40" fill="white" />
      <text x="80" y="78" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1f2937">
        5,432
      </text>
      <text x="80" y="98" textAnchor="middle" fontSize="10" fill="#64748b">
        Total
      </text>
    </svg>
  );
}

export default function Volunteers() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Volunteers</h1>
            <p className="mt-2 text-slate-500">
              Manage volunteers, their availability, skills, and deployments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-[#0D2A66] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#12357c]">
              <Plus className="h-4 w-4" />
              Add Volunteer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.accent}`} />
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
              <div className="flex min-w-72 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500">
                <Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search volunteers by name, email, ID, or phone..."
                  className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {["All Status", "All Skills", "All Teams", "All Certifications"].map((label) => (
                <button
                  key={label}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  {label}
                  <span className="text-slate-400">▾</span>
                </button>
              ))}

              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                Filters
              </button>

              <button className="inline-flex items-center gap-2 rounded-xl bg-[#0D2A66] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#12357c]">
                <Plus className="h-4 w-4" />
                Add Volunteer
              </button>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">All Volunteers</h2>
                <p className="text-sm text-slate-500">Showing 1 to 10 of 5,432 volunteers</p>
              </div>

              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button className="rounded-xl bg-blue-600 p-2 text-white shadow-sm hover:bg-blue-700">
                  <Users className="h-4 w-4" />
                </button>
                <button className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                  <ShieldAlert className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-y border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Volunteer</th>
                    <th className="px-4 py-4 font-semibold">Contact</th>
                    <th className="px-4 py-4 font-semibold">Team</th>
                    <th className="px-4 py-4 font-semibold">Skills</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Availability</th>
                    <th className="px-4 py-4 font-semibold">Last Active</th>
                    <th className="px-4 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 via-orange-100 to-amber-400 p-[2px]">
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700">
                              {volunteer.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{volunteer.name}</p>
                            <p className="text-xs text-slate-500">ID: {volunteer.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-slate-600">{volunteer.email}</p>
                        <p className="text-xs text-slate-500">{volunteer.phone}</p>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${volunteer.teamClass}`}>
                          {volunteer.team}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {volunteer.skills.map((skill) => (
                            <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                              {skill}
                            </span>
                          ))}
                          {volunteer.extraSkills > 0 ? (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                              +{volunteer.extraSkills}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${volunteer.statusClass}`}>
                          {volunteer.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-600">{volunteer.availability}</td>

                      <td className="px-4 py-4 text-slate-500">{volunteer.lastActive}</td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                            <Bell className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                            <Clock3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
              <p>Showing 1 to 10 of 5,432 volunteers</p>

              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">1</button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">2</button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">3</button>
                <span>...</span>
                <button className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">544</button>
                <button className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
                  <MapPin className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  10
                  <span className="text-slate-400">▾</span>
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Volunteer Overview</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <VolunteerChart />

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Available 3,892 (71%)</p>
                <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" />On Duty 1,128 (21%)</p>
                <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Deployed 412 (8%)</p>
                <p className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Unavailable 1,724 (31%)</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Skills Breakdown</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <div className="space-y-3">
                {skillsBreakdown.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${skill.color}`} />
                      <span className="text-slate-700">{skill.name}</span>
                    </div>
                    <span className="text-slate-500">{skill.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Certification Status</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
              </div>

              <div className="space-y-3">
                {certificationStatus.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
                Manage Skills & Certifications
              </button>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}