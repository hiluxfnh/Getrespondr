import DashboardLayout from "../layouts/DashboardLayout";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  ListTodo,
  Plus,
  Search,
  Users,
  Zap,
} from "lucide-react";

const taskColumns = [
  {
    title: "Backlog",
    count: 8,
    color: "bg-slate-500",
    cards: [
      {
        title: "Assign medics to North Zone",
        owner: "Sarah Johnson",
        due: "Today, 3:30 PM",
        tag: "High priority",
      },
      {
        title: "Confirm shelter capacity update",
        owner: "Michael Chen",
        due: "Today, 5:00 PM",
        tag: "Planning",
      },
    ],
  },
  {
    title: "In Progress",
    count: 6,
    color: "bg-blue-500",
    cards: [
      {
        title: "Deploy rescue unit to Highway 12",
        owner: "David Wilson",
        due: "In 40 mins",
        tag: "Live response",
      },
      {
        title: "Coordinate supply route to West Shelter",
        owner: "Emily Davis",
        due: "In 1 hour",
        tag: "Logistics",
      },
    ],
  },
  {
    title: "Review",
    count: 4,
    color: "bg-amber-500",
    cards: [
      {
        title: "Validate road closure notices",
        owner: "Alex Morgan",
        due: "This evening",
        tag: "Approvals",
      },
      {
        title: "Approve volunteer shift changes",
        owner: "Nina Patel",
        due: "Tomorrow, 9:00 AM",
        tag: "Staffing",
      },
    ],
  },
  {
    title: "Completed",
    count: 12,
    color: "bg-emerald-500",
    cards: [
      {
        title: "Brief fire response team",
        owner: "Ops Center",
        due: "Completed 12 min ago",
        tag: "Done",
      },
      {
        title: "Dispatch food packs to Shelter B",
        owner: "Ops Center",
        due: "Completed 25 min ago",
        tag: "Done",
      },
    ],
  },
];

const priorityTasks = [
  {
    title: "Flood barrier inspection",
    zone: "Downtown Riverbank",
    time: "Due in 25 min",
    status: "Critical",
  },
  {
    title: "Volunteer check-in sweep",
    zone: "West Sector",
    time: "Due in 1 hr",
    status: "High",
  },
  {
    title: "Medical kit inventory",
    zone: "Central Warehouse",
    time: "Due tomorrow",
    status: "Medium",
  },
];

const teamWorkload = [
  {
    name: "Sarah Johnson",
    role: "Field Lead",
    score: "92%",
  },
  {
    name: "Michael Chen",
    role: "Logistics",
    score: "84%",
  },
  {
    name: "David Wilson",
    role: "Medical Ops",
    score: "78%",
  },
  {
    name: "Emily Davis",
    role: "Volunteer Lead",
    score: "71%",
  },
];

export default function Tasks() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Task Center
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Task Coordination
            </h1>
            <p className="mt-2 text-slate-500">
              Organize response work, assign owners, and track progress across all operational teams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-[#0D2A66] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#12357c]">
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Open Tasks</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">84</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                <ListTodo className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-emerald-600">↑ 8% from yesterday</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Due Today</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">18</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-orange-600">7 high priority</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">212</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-emerald-600">↑ 14% this week</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Assigned Teams</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">12</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-sm text-violet-600">3 active now</p>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)] gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Task Board</h2>
                <p className="text-sm text-slate-500">Kanban view for operational priorities</p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 w-80">
                <Search className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search tasks, owners, or zones..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-4">
              {taskColumns.map((column) => (
                <section key={column.title} className="rounded-2xl bg-slate-50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                      <h3 className="text-sm font-semibold text-slate-900">{column.title}</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{column.count}</span>
                  </div>

                  <div className="space-y-3">
                    {column.cards.map((card) => (
                      <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-sm font-semibold text-slate-900">{card.title}</h4>
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                            {card.tag}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Owner: {card.owner}</p>
                        <p className="mt-1 text-xs text-slate-400">{card.due}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Priority Tasks</h2>
                  <p className="text-sm text-slate-500">Urgent work needing attention</p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">
                  <Zap className="h-4 w-4" />
                  3 urgent
                </div>
              </div>

              <div className="space-y-3">
                {priorityTasks.map((task) => (
                  <div key={task.title} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{task.zone}</p>
                        <p className="mt-1 text-xs text-slate-400">{task.time}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.status === "Critical" ? "bg-red-50 text-red-600" : task.status === "High" ? "bg-orange-50 text-orange-600" : "bg-amber-50 text-amber-600"}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Team Workload</h2>
                  <p className="text-sm text-slate-500">Capacity and assignment load</p>
                </div>

                <CalendarDays className="h-5 w-5 text-slate-400" />
              </div>

              <div className="space-y-4">
                {teamWorkload.map((member) => (
                  <div key={member.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="text-slate-500">{member.role}</p>
                      </div>
                      <p className="font-semibold text-slate-700">{member.score}</p>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: member.score }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0d2a66] to-[#102d5c] p-5 text-white shadow-lg shadow-blue-950/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Task Summary</h2>
                  <p className="mt-1 text-sm text-white/70">Current operational load across all groups</p>
                </div>
                <ListTodo className="h-5 w-5 text-white/70" />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-bold">212</p>
                  <p className="text-xs text-white/70">Done</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-bold">198</p>
                  <p className="text-xs text-white/70">In Progress</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-bold">274</p>
                  <p className="text-xs text-white/70">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}