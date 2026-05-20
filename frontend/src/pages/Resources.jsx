import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/Modal";
import seedResources from "../assets/seedResources";
import { createResource, listenToResources } from "../firebase/resources";
import {
  Box,
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

const TYPE_OPTIONS = ["Supplies", "Shelter", "Safety", "Equipment", "Vehicle"];
const STATUS_OPTIONS = ["Available", "Low Stock", "In Use", "Maintenance"];

const emptyResource = {
  name: "",
  type: "Supplies",
  category: "",
  quantity: "",
  available: "",
  location: "",
  status: "Available",
};

function ResourceForm({ values, onChange, onSubmit, busy, submitLabel }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-slate-700">Resource name</span>
        <input name="name" value={values.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Type</span>
          <select name="type" value={values.type} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
            {TYPE_OPTIONS.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Category</span>
          <input name="category" value={values.category} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Total quantity</span>
          <input name="quantity" type="number" min="0" value={values.quantity} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Available</span>
          <input name="available" type="number" min="0" value={values.available} onChange={handleChange} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Location</span>
          <input name="location" value={values.location} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select name="status" value={values.status} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500">
            {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>
      <button type="submit" disabled={busy} className="inline-flex items-center justify-center rounded-xl bg-[#0D2A66] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12357c] disabled:opacity-60">
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function iconForType(type) {
  switch (type) {
    case "Vehicle": return Truck;
    case "Shelter": return Warehouse;
    case "Safety": return ShieldAlert;
    case "Equipment": return SlidersHorizontal;
    case "Fuel": return Fuel;
    default: return Box;
  }
}

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyResource);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const unsubscribe = listenToResources(
      (next) => setResources(next.length ? next : seedResources),
      () => setResources(seedResources)
    );
    return unsubscribe;
  }, []);

  const displayResources = useMemo(() => {
    return resources
      .map((resource, index) => ({
        ...resource,
        code: resource.code || `RES-${2024}-${String(index + 1).padStart(3, "0")}`,
        quantity: Number(resource.quantity) || 0,
        available: Number(resource.available) || 0,
        updated: resource.updated || "Just now",
      }))
      .filter((resource) => {
        const haystack = `${resource.name} ${resource.code} ${resource.location} ${resource.category}`.toLowerCase();
        const matchesSearch = !search || haystack.includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || resource.status === statusFilter;
        const matchesType = typeFilter === "all" || resource.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
      });
  }, [resources, search, statusFilter, typeFilter]);

  const pagedResources = displayResources.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(displayResources.length / rowsPerPage));

  const stats = useMemo(() => {
    const total = resources.length;
    const available = resources.filter((r) => r.status === "Available").length;
    const inUse = resources.filter((r) => r.status === "In Use").length;
    const lowStock = resources.filter((r) => r.status === "Low Stock").length;
    const maintenance = resources.filter((r) => r.status === "Maintenance").length;
    return { total, available, inUse, lowStock, maintenance };
  }, [resources]);

  const lowStockAlerts = useMemo(() => {
    return displayResources.filter((r) => r.status === "Low Stock").slice(0, 5);
  }, [displayResources]);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await createResource({
        ...form,
        quantity: Number(form.quantity),
        available: Number(form.available),
        updated: "Just now",
      });
      setForm(emptyResource);
      setShowCreate(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { label: "Total Resources", value: String(stats.total), delta: "In inventory", icon: Box, accent: "text-blue-600", bg: "bg-blue-50" },
    { label: "Available", value: String(stats.available), delta: "Ready to deploy", icon: CircleCheck, accent: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "In Use", value: String(stats.inUse), delta: "Deployed", icon: Truck, accent: "text-amber-600", bg: "bg-amber-50" },
    { label: "Low Stock", value: String(stats.lowStock), delta: "Needs restock", icon: ShieldAlert, accent: "text-red-600", bg: "bg-red-50" },
    { label: "Maintenance", value: String(stats.maintenance), delta: "Under service", icon: FlaskConical, accent: "text-violet-600", bg: "bg-violet-50" },
  ];

  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-600",
    "Low Stock": "bg-orange-50 text-orange-600",
    "In Use": "bg-blue-50 text-blue-600",
    Maintenance: "bg-violet-50 text-violet-600",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Resources</h1>
            <p className="mt-2 text-slate-500">Manage and track available resources and inventory.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setShowFilters((c) => !c)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <button type="button" onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0D2A66] px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#12357c]">
              <Plus className="h-4 w-4" /> Add Resource
            </button>
          </div>
        </div>

        {showFilters ? (
          <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
              <option value="all">All types</option>
              {TYPE_OPTIONS.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
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
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg}`}><Icon className={`h-5 w-5 ${stat.accent}`} /></div>
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search resources..." className="min-w-0 w-full bg-transparent outline-none" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Resource</th>
                    <th className="px-4 py-4 font-semibold">Type</th>
                    <th className="px-4 py-4 font-semibold">Qty</th>
                    <th className="px-4 py-4 font-semibold">Available</th>
                    <th className="px-4 py-4 font-semibold">Location</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedResources.map((row) => {
                    const Icon = iconForType(row.type);
                    return (
                      <tr key={row.id || row.code} className="border-t border-slate-100 hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600"><Icon className="h-5 w-5" /></div>
                            <div>
                              <p className="font-semibold text-slate-900">{row.name}</p>
                              <p className="text-xs text-slate-500">{row.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{row.type}</td>
                        <td className="px-4 py-4 font-medium text-slate-900">{row.quantity}</td>
                        <td className="px-4 py-4 font-medium text-emerald-600">{row.available}</td>
                        <td className="px-4 py-4 text-slate-600">{row.location}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status] || statusStyles.Available}`}>{row.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
              <p>Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, displayResources.length)} of {displayResources.length}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <span>{page} / {totalPages}</span>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Low Stock Alerts</h2>
              <div className="mt-4 space-y-3">
                {lowStockAlerts.length ? lowStockAlerts.map((item) => (
                  <div key={item.id || item.code} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    <span className="text-sm font-semibold text-orange-500">{item.available} left</span>
                  </div>
                )) : (
                  <p className="text-sm text-slate-500">No low stock items.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Resource" description="Register inventory for response operations." size="lg">
        <ResourceForm values={form} onChange={setForm} onSubmit={handleCreate} busy={saving} submitLabel="Add Resource" />
      </Modal>
    </DashboardLayout>
  );
}
