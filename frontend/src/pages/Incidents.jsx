import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import incidentsSeed from "../assets/incidents";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import AutoDetectBadge from "../components/AutoDetectBadge";
import IncidentEditor from "../components/IncidentEditor";
import Modal from "../components/Modal";
import { sortByRelevance } from "../utils/incidentRelevance";
import { useAuth } from "../firebase/auth";
import {
  createIncident,
  listenToIncidents,
  removeIncident,
  updateIncident,
} from "../firebase/incidents";
import { analyzeIncident, formatDuplicateSummary } from "../services/incidentAnalysis";
import { buildIncidentNotification, createNotification } from "../firebase/notifications";

function formatIncidentTime(incident) {
  if (!incident?.timestamp) {
    return incident?.time || "Just now";
  }

  if (typeof incident.timestamp?.toDate === "function") {
    return incident.timestamp.toDate().toLocaleString();
  }

  if (incident.timestamp instanceof Date) {
    return incident.timestamp.toLocaleString();
  }

  return incident.time || "Just now";
}

function toDisplayIncident(incident) {
  return {
    ...incident,
    location: incident.locationDetail || incident.location || "Unknown location",
    reportedBy: incident.reportedBy || incident.source || "Public report",
    time: formatIncidentTime(incident),
  };
}

export default function Incidents() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = Boolean(user);
  const canDelete = Boolean(user) && user.role !== "Viewer";
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToIncidents((nextIncidents) => {
      setIncidents(nextIncidents.length ? nextIncidents : incidentsSeed);
      setLoading(false);
      setError("");
    }, (err) => {
      setError(err.message);
      setLoading(false);
      setIncidents(incidentsSeed);
    });

    return unsubscribe;
  }, []);

  const displayIncidents = useMemo(() => {
    return sortByRelevance(
      incidents
      .map(toDisplayIncident)
      .filter((incident) => {
        const matchesSearch =
          incident.title.toLowerCase().includes(search.toLowerCase()) ||
          incident.location.toLowerCase().includes(search.toLowerCase()) ||
          (incident.category || "").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
        const matchesSource =
          sourceFilter === "all" ||
          (sourceFilter === "auto" && incident.autoDetected) ||
          (sourceFilter === "manual" && !incident.autoDetected);

        return matchesSearch && matchesStatus && matchesSource;
      })
    );
  }, [incidents, search, statusFilter, sourceFilter]);

  const handleCreate = async (values) => {
    try {
      setSaving(true);
      const { imageUrl, latitude, longitude, ...payload } = values;
      const analysis = await analyzeIncident({
        ...payload,
        location: payload.location,
        description: payload.description,
      }, incidents);

      const incidentRef = await createIncident({
        ...payload,
        imageUrl: imageUrl || "",
        latitude,
        longitude,
        locationDetail: payload.location,
        coordinates: { latitude, longitude },
        aiSummary: analysis.summary,
        recommendedAction: analysis.recommendedAction,
        aiSuggestedSeverity: analysis.suggestedSeverity,
        aiDuplicateMatches: analysis.duplicateMatches,
        aiConfidence: analysis.confidence,
        aiAnalysisSource: analysis.source,
      });

      await createNotification(buildIncidentNotification({
        incident: {
          ...payload,
          id: incidentRef.id,
          severity: payload.severity,
          title: payload.title,
        },
        changeType: "created",
        analysis,
        actorName: user?.displayName || user?.email || "System",
        deliveryPreferences: user?.notificationPreferences || {},
      }));

      if (analysis.duplicateMatches.length > 0) {
        await createNotification({
          type: "ai",
          title: `Possible duplicate detected: ${payload.title}`,
          description: formatDuplicateSummary(analysis.duplicateMatches),
          severity: "Medium",
          audience: ["Coordinator", "Responder", "Super Admin"],
          incidentId: incidentRef.id,
          incidentTitle: payload.title,
          createdBy: "Gemini AI",
          source: analysis.source,
          deliveryChannels: ["in-app", ...(user?.notificationPreferences?.email === false ? [] : ["email"]), ...(user?.notificationPreferences?.push === false ? [] : ["push"])],
          metadata: { duplicateMatches: analysis.duplicateMatches },
        });
      }

      setShowCreate(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (incidentId) => {
    if (!window.confirm("Delete this incident?")) {
      return;
    }

    try {
      await removeIncident(incidentId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Incident Management</h1>
            <p className="mt-1 text-sm text-slate-500">Public overview with live Firestore data and write access for responders.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search incidents"
              className="min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 lg:w-80"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Monitoring">Monitoring</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="all">All sources</option>
              <option value="auto">AI auto-detected</option>
              <option value="manual">Manual reports</option>
            </select>
            {canCreate ? (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                New Incident
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <Modal
          open={showCreate && canCreate}
          onClose={() => setShowCreate(false)}
          title="Create Incident"
          description="Report a new incident with location, severity, and optional coordinates."
          size="full"
        >
          <IncidentEditor
            referenceIncidents={incidents}
            submitLabel="Create Incident"
            busy={saving}
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Incident</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Reported By</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {loading ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={7}>
                      Loading incidents...
                    </td>
                  </tr>
                ) : displayIncidents.length ? (
                  displayIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">{incident.title}</p>
                            {incident.autoDetected ? <AutoDetectBadge compact /> : null}
                          </div>
                          <p className="text-xs text-slate-500">{incident.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{incident.category || "-"}</td>
                      <td className="px-6 py-4"><SeverityBadge severity={incident.severity} /></td>
                      <td className="px-6 py-4"><StatusBadge status={incident.status} /></td>
                      <td className="px-6 py-4">{incident.reportedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{incident.time}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/incidents/${incident.id}`)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            View
                          </button>
                          {canDelete ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(incident.id)}
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500" colSpan={7}>
                      No incidents match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
