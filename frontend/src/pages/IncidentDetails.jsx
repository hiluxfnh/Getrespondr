import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import IncidentEditor from "../components/IncidentEditor";
import { useAuth } from "../firebase/auth";
import {
  loadIncident,
  removeIncident,
  updateIncident,
} from "../firebase/incidents";
import { analyzeIncident, formatDuplicateSummary } from "../services/incidentAnalysis";
import { buildIncidentNotification, createNotification } from "../firebase/notifications";
import incidentsSeed from "../assets/incidents";

import {
  ArrowLeft,
  Clock,
  House,
  Pencil,
  Trash2,
  Users,
  ShieldAlert,
} from "lucide-react";

function normalizeIncident(incident) {
  if (!incident) {
    return null;
  }

  return {
    ...incident,
    location: incident.locationDetail || incident.location || "Unknown location",
    reportedBy: incident.reportedBy || incident.source || "Public report",
    aiSummary: incident.aiSummary || "No AI summary available yet.",
    recommendedAction: incident.recommendedAction || "No recommendation available yet.",
    images: incident.images || [],
    description: incident.description || "No description provided.",
  };
}

function formatTime(value) {
  if (!value) {
    return "Just now";
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString();
  }

  if (value instanceof Date) {
    return value.toLocaleString();
  }

  return typeof value === "string" ? value : "Just now";
}

export default function IncidentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const canEdit = Boolean(user);
  const canDelete = Boolean(user) && user.role !== "Viewer";
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchIncident() {
      setLoading(true);
      setError("");

      try {
        const firestoreIncident = await loadIncident(id);
        const fallbackIncident = incidentsSeed.find((entry) => String(entry.id) === String(id));
        const resolved = normalizeIncident(firestoreIncident || fallbackIncident || null);

        if (active) {
          setIncident(resolved);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchIncident();

    return () => {
      active = false;
    };
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/incidents");
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      setError("");
      const { imageUrl, latitude, longitude, ...payload } = values;
      const images = imageUrl ? [imageUrl] : (incident?.images || []);
      const analysis = await analyzeIncident({
        ...incident,
        ...payload,
        location: payload.location,
        description: payload.description,
      }, []);

      await updateIncident(id, {
        ...payload,
        imageUrl: imageUrl || "",
        latitude,
        longitude,
        locationDetail: payload.location,
        coordinates: {
          latitude,
          longitude,
        },
        images,
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
          id,
          severity: payload.severity,
          title: payload.title,
        },
        changeType: "updated",
        analysis,
        actorName: user?.displayName || user?.email || "System",
        deliveryPreferences: user?.notificationPreferences || {},
      }));

      if (analysis.duplicateMatches.length > 0) {
        await createNotification({
          type: "ai",
          title: `Potential duplicate review: ${payload.title}`,
          description: formatDuplicateSummary(analysis.duplicateMatches),
          severity: "Medium",
          audience: ["Coordinator", "Responder", "Super Admin"],
          incidentId: id,
          incidentTitle: payload.title,
          createdBy: "Gemini AI",
          source: analysis.source,
          deliveryChannels: ["in-app", ...(user?.notificationPreferences?.email === false ? [] : ["email"]), ...(user?.notificationPreferences?.push === false ? [] : ["push"])],
          metadata: { duplicateMatches: analysis.duplicateMatches },
        });
      }

      const refreshed = await loadIncident(id);
      setIncident(normalizeIncident(refreshed));
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this incident?")) {
      return;
    }

    try {
      await removeIncident(id);
      navigate("/incidents");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Back to incidents
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <House size={16} />
            Landing Page
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">Loading incident...</div>
        ) : incident ? (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900">{incident.title}</h1>
                <p className="mt-2 text-slate-500">
                  {incident.location} • Reported {formatTime(incident.timestamp || incident.time)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">Category: {incident.category || "Unknown"}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Source: {incident.source || incident.reportedBy}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
                {canEdit ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditMode((current) => !current)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      {editMode ? "Close Edit" : "Edit"}
                    </button>
                    {canDelete ? (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>

            {editMode && canEdit ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="mb-5 text-xl font-semibold text-slate-900">Edit Incident</h2>
                <IncidentEditor
                  initialValues={incident}
                  referenceIncidents={[incident, ...incidentsSeed]}
                  submitLabel="Save Changes"
                  busy={saving}
                  onSubmit={handleSave}
                  onCancel={() => setEditMode(false)}
                />
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Incident Description</h2>
                  <p className="leading-relaxed text-slate-600">{incident.description}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">AI Intelligence Summary</h2>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-700">{incident.aiSummary}</div>
                    <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-orange-700">Recommended Action: {incident.recommendedAction}</div>
                    {incident.aiSuggestedSeverity ? (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
                        AI Suggested Severity: {incident.aiSuggestedSeverity}
                      </div>
                    ) : null}
                    {incident.aiDuplicateMatches?.length ? (
                      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-700">
                        {formatDuplicateSummary(incident.aiDuplicateMatches)}
                      </div>
                    ) : null}
                  </div>
                </div>

                {incident.images?.length ? (
                  <div className="rounded-2xl border border-slate-200 p-6">
                    <h2 className="mb-4 text-xl font-bold text-slate-900">Uploaded Evidence</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {incident.images.map((imageUrl) => (
                        <img
                          key={imageUrl}
                          src={imageUrl}
                          alt={`${incident.title} evidence`}
                          className="h-56 w-full rounded-2xl object-cover"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-slate-200 p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Incident Timeline</h2>
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="mt-2 h-3 w-3 rounded-full bg-red-500" />
                      <div>
                        <p className="font-medium">Incident reported</p>
                        <p className="text-sm text-slate-500">{incident.reportedBy}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-2 h-3 w-3 rounded-full bg-blue-500" />
                      <div>
                        <p className="font-medium">Severity classified as {incident.severity}</p>
                        <p className="text-sm text-slate-500">AI review and response planning</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="mt-2 h-3 w-3 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium">Current status: {incident.status}</p>
                        <p className="text-sm text-slate-500">Live operational tracking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Incident Facts</h2>
                  <div className="space-y-4 text-sm text-slate-700">
                    <div className="flex items-center gap-3">
                      <Users className="text-blue-500" />
                      <div>
                        <p className="font-medium">Reported By</p>
                        <p className="text-slate-500">{incident.reportedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="text-orange-500" />
                      <div>
                        <p className="font-medium">Category</p>
                        <p className="text-slate-500">{incident.category || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="text-green-500" />
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-slate-500">{formatTime(incident.updatedAt || incident.timestamp || incident.time)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-6">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Coordinates</h2>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>Latitude: {incident.latitude ?? incident.coordinates?.latitude ?? "-"}</p>
                    <p>Longitude: {incident.longitude ?? incident.coordinates?.longitude ?? "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Incident not found</p>
            <p className="mt-2 text-sm text-slate-600">The record may have been deleted or does not exist.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
