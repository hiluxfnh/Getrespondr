import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/Modal";
import seedTasks from "../assets/seedTasks";
import { createTask, listenToTasks } from "../firebase/tasks";
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

const COLUMN_META = [
  { title: "Backlog", color: "bg-slate-500" },
  { title: "In Progress", color: "bg-blue-500" },
  { title: "Review", color: "bg-amber-500" },
  { title: "Completed", color: "bg-emerald-500" },
];

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

function TaskForm({ values, onChange, onSubmit, busy, submitLabel }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Title</span>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Owner</span>
          <input
            name="owner"
            value={values.owner}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Zone</span>
          <input
            name="zone"
            value={values.zone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COLUMN_META.map((column) => (
              <option key={column.title} value={column.title}>{column.title}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Priority</span>
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Due</span>
          <input
            name="due"
            value={values.due}
            onChange={handleChange}
            placeholder="Today, 3:30 PM"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Tag</span>
          <input
            name="tag"
            value={values.tag}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-xl bg-[#0D2A66] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12357c] disabled:opacity-60"
      >
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

const emptyTask = {
  title: "",
  owner: "",
  status: "Backlog",
  priority: "Medium",
  zone: "",
  due: "",
  tag: "",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyTask);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = listenToTasks(
      (next) => setTasks(next.length ? next : seedTasks),
      () => setTasks(seedTasks)
    );
    return unsubscribe;
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const haystack = `${task.title} ${task.owner} ${task.zone} ${task.tag}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const columns = useMemo(() => {
    return COLUMN_META.map((column) => ({
      ...column,
      cards: filteredTasks.filter((task) => task.status === column.title),
      count: filteredTasks.filter((task) => task.status === column.title).length,
    }));
  }, [filteredTasks]);

  const stats = useMemo(() => {
    const open = tasks.filter((task) => task.status !== "Completed").length;
    const dueToday = tasks.filter((task) => /today/i.test(task.due || "")).length;
    const completed = tasks.filter((task) => task.status === "Completed").length;
    const urgent = tasks.filter((task) => task.priority === "Critical" || task.priority === "High").length;
    return { open, dueToday, completed, urgent };
  }, [tasks]);

  const priorityTasks = useMemo(() => {
    return [...filteredTasks]
      .filter((task) => task.priority === "Critical" || task.priority === "High")
      .slice(0, 3);
  }, [filteredTasks]);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await createTask(form);
      setForm(emptyTask);
      setShowCreate(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Task Center</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Task Coordination</h1>
            <p className="mt-2 text-slate-500">Organize response work, assign owners, and track progress across operational teams.</p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0D2A66] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#12357c]"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700"
            >
              <option value="all">All statuses</option>
              {COLUMN_META.map((column) => (
                <option key={column.title} value={column.title}>{column.title}</option>
              ))}
            </select>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Open Tasks</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stats.open}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><ListTodo className="h-5 w-5" /></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Due Today</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stats.dueToday}</p>
              </div>
              <div className="rounded-2xl bg-orange-50 p-3 text-orange-600"><Clock3 className="h-5 w-5" /></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stats.completed}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600"><CheckCircle2 className="h-5 w-5" /></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">High Priority</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stats.urgent}</p>
              </div>
              <div className="rounded-2xl bg-violet-50 p-3 text-violet-600"><Users className="h-5 w-5" /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Task Board</h2>
                <p className="text-sm text-slate-500">Kanban view for operational priorities</p>
              </div>
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 w-full lg:max-w-xs">
                <Search className="h-4 w-4 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks, owners, or zones..."
                  className="min-w-0 w-full bg-transparent outline-none"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {columns.map((column) => (
                <section key={column.title} className="min-w-0 rounded-2xl bg-slate-50 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                      <h3 className="text-sm font-semibold text-slate-900">{column.title}</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{column.count}</span>
                  </div>
                  <div className="space-y-3">
                    {column.cards.map((card) => (
                      <article key={card.id || card.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900">{card.title}</h4>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                            {card.tag || card.priority}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">Owner: {card.owner}</p>
                        <p className="mt-1 text-xs text-slate-400">{card.due || "No due date"}</p>
                      </article>
                    ))}
                    {!column.cards.length ? (
                      <p className="py-6 text-center text-xs text-slate-400">No tasks</p>
                    ) : null}
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
                  {priorityTasks.length} urgent
                </div>
              </div>
              <div className="space-y-3">
                {priorityTasks.map((task) => (
                  <div key={task.id || task.title} className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{task.zone || "General"}</p>
                    <p className="mt-1 text-xs text-slate-400">{task.due || "No due date"}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0d2a66] to-[#102d5c] p-5 text-white shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Task Summary</h2>
                  <p className="mt-1 text-sm text-white/70">Current operational load</p>
                </div>
                <CalendarDays className="h-5 w-5 text-white/70" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-white/70">Done</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-bold">{tasks.filter((t) => t.status === "In Progress").length}</p>
                  <p className="text-xs text-white/70">In Progress</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-2xl font-bold">{stats.open}</p>
                  <p className="text-xs text-white/70">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Task"
        description="Add a coordination task for your response teams."
        size="lg"
      >
        <TaskForm
          values={form}
          onChange={setForm}
          onSubmit={handleCreate}
          busy={saving}
          submitLabel="Create Task"
        />
      </Modal>
    </DashboardLayout>
  );
}
