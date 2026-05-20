import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/Modal";
import seedVolunteers from "../assets/seedVolunteers";
import { createVolunteer, listenToVolunteers } from "../firebase/volunteers";
import {
  Bell,
  CheckCircle2,
  CircleSlash2,
  Clock3,
  Download,
  Filter,
  Plus,
  Search,
  ShieldAlert,
  SquareActivity,
  Users,
} from "lucide-react";

const STATUS_OPTIONS = ["Available", "On Duty", "Deployed", "Unavailable"];
const TEAM_OPTIONS = ["Team Alpha", "Team Bravo", "Team Charlie", "Team Delta", "Team Echo"];

const statusStyles = {
  Available: "bg-emerald-50 text-emerald-600",
  "On Duty": "bg-orange-50 text-orange-600",
  Deployed: "bg-violet-50 text-violet-600",
  Unavailable: "bg-red-50 text-red-600",
};

const teamStyles = {
  "Team Alpha": "bg-blue-50 text-blue-600",
  "Team Bravo": "bg-emerald-50 text-emerald-600",
  "Team Charlie": "bg-violet-50 text-violet-600",
  "Team Delta": "bg-blue-50 text-blue-600",
  "Team Echo": "bg-orange-50 text-orange-600",
};

const emptyVolunteer = {
  name: "",
  email: "",
  phone: "",
  team: "Team Alpha",
  skills: "",
  status: "Available",
  availability: "Available Now",
};

function VolunteerForm({ values, onChange, onSubmit, busy, submitLabel }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Full name</span>
        <input name="name" value={values.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input name="email" type="email" value={values.email} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input name="phone" value={values.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Team</span>
          <select name="team" value={values.team} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
            {TEAM_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select name="status" value={values.status} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Skills (comma-separated)</span>
          <input name="skills" value={values.skills} onChange={handleChange} placeholder="First Aid, Logistics" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="block space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">Availability</span>
          <input name="availability" value={values.availability} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
      </div>
      <button type="submit" disabled={busy} className="inline-flex items-center justify-center rounded-xl bg-[#0D2A66] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12357c] disabled:opacity-60">
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function VolunteerChart({ total }) {
  return (
    <svg viewBox="0 0 160 160" className="mx-auto h-52 w-52">
      <circle cx="80" cy="80" r="56" stroke="#e2e8f0" strokeWidth="18" fill="none" />
      <circle cx="80" cy="80" r="40" fill="white" />
      <text x="80" y="78" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1f2937">{total}</text>
      <text x="80" y="98" textAnchor="middle" fontSize="10" fill="#64748b">Total</text>
    </svg>
  );
}

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyVolunteer);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const unsubscribe = listenToVolunteers(
      (next) => setVolunteers(next.length ? next : seedVolunteers),
      () => setVolunteers(seedVolunteers)
    );
    return unsubscribe;
  }, []);

  const displayVolunteers = useMemo(() => {
    return volunteers
      .map((volunteer, index) => ({
        ...volunteer,
        id: volunteer.id || `VOL-${10001 + index}`,
        skills: Array.isArray(volunteer.skills)
          ? volunteer.skills
          : String(volunteer.skills || "").split(",").map((s) => s.trim()).filter(Boolean),
        lastActive: volunteer.lastActive || "Recently",
        statusClass: statusStyles[volunteer.status] || statusStyles.Available,
        teamClass: teamStyles[volunteer.team] || teamStyles["Team Alpha"],
      }))
      .filter((volunteer) => {
        const haystack = `${volunteer.name} ${volunteer.email} ${volunteer.id} ${volunteer.phone}`.toLowerCase();
        const matchesSearch = !search || haystack.includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || volunteer.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
  }, [volunteers, search, statusFilter]);

  const pagedVolunteers = displayVolunteers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(displayVolunteers.length / rowsPerPage));

  const statCards = useMemo(() => {
    const total = volunteers.length;
    const available = volunteers.filter((v) => v.status === "Available").length;
    const onDuty = volunteers.filter((v) => v.status === "On Duty").length;
    const deployed = volunteers.filter((v) => v.status === "Deployed").length;
    const unavailable = volunteers.filter((v) => v.status === "Unavailable").length;
    return [
      { title: "Total Volunteers", value: String(total), note: "Registered in system", icon: Users, accent: "text-blue-600", bg: "bg-blue-50" },
      { title: "Available", value: String(available), note: `${total ? Math.round((available / total) * 100) : 0}% of total`, icon: CheckCircle2, accent: "text-emerald-600", bg: "bg-emerald-50" },
      { title: "On Duty", value: String(onDuty), note: "Currently assigned", icon: Clock3, accent: "text-orange-500", bg: "bg-orange-50" },
      { title: "Deployed", value: String(deployed), note: "Field deployment", icon: SquareActivity, accent: "text-violet-600", bg: "bg-violet-50" },
      { title: "Unavailable", value: String(unavailable), note: "Not reachable", icon: CircleSlash2, accent: "text-red-600", bg: "bg-red-50" },
    ];
  }, [volunteers]);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const skills = String(form.skills).split(",").map((s) => s.trim()).filter(Boolean);
      await createVolunteer({
        ...form,
        skills,
        lastActive: "Just now",
      });
      setForm(emptyVolunteer);
      setShowCreate(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const header = ["Name", "Email", "Phone", "Team", "Status", "Skills"];
    const rows = displayVolunteers.map((v) => [
      v.name,
      v.email,
      v.phone,
      v.team,
      v.status,
      (v.skills || []).join("; "),
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "volunteers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Volunteers</h1>
            <p className="mt-2 text-slate-500">Manage volunteers, availability, skills, and deployments.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowFilters((c) => !c)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <button type="button" onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0D2A66] px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#12357c]">
              <Plus className="h-4 w-4" /> Add Volunteer
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        ) : null}

        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg}`}><Icon className={`h-5 w-5 ${stat.accent}`} /></div>
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search volunteers..." className="min-w-0 w-full bg-transparent outline-none text-slate-700" />
              </div>
              <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Download className="h-4 w-4" /> Export
              </button>
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
                  </tr>
                </thead>
                <tbody>
                  {pagedVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{volunteer.name}</p>
                        <p className="text-xs text-slate-500">ID: {volunteer.id}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-600">{volunteer.email}</p>
                        <p className="text-xs text-slate-500">{volunteer.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${volunteer.teamClass}`}>{volunteer.team}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(volunteer.skills || []).slice(0, 2).map((skill) => (
                            <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{skill}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${volunteer.statusClass}`}>{volunteer.status}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{volunteer.availability}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
              <p>Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, displayVolunteers.length)} of {displayVolunteers.length}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40">Prev</button>
                <span>{page} / {totalPages}</span>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Volunteer Overview</h2>
              <VolunteerChart total={volunteers.length} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <button type="button" onClick={() => setShowCreate(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                <ShieldAlert className="h-4 w-4" /> Assign to Incident
              </button>
              <p className="mt-2 text-center text-xs text-slate-500">Opens volunteer registration — link volunteers to incidents from incident details.</p>
            </div>
          </aside>
        </div>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Volunteer" description="Register a new volunteer for deployment." size="lg">
        <VolunteerForm values={form} onChange={setForm} onSubmit={handleCreate} busy={saving} submitLabel="Add Volunteer" />
      </Modal>
    </DashboardLayout>
  );
}
