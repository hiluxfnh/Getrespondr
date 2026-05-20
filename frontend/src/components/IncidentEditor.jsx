import { useEffect, useState } from "react";
import { AlertTriangle, Loader, Sparkles, Upload, X } from "lucide-react";
import cloudinaryService from "../services/cloudinaryService";
import LocationSearch from "./LocationSearch";
import { analyzeIncident, formatDuplicateSummary } from "../services/incidentAnalysis";
import { validateCoordinates } from "../utils/coordinates";

const defaultValues = {
  title: "",
  description: "",
  category: "Flood",
  severity: "Medium",
  status: "Investigating",
  location: "",
  latitude: "",
  longitude: "",
  source: "Human Report",
  aiSummary: "",
  recommendedAction: "",
};

const categoryOptions = [
  "Flood", "Fire", "Earthquake", "Medical", "Accident", "Infrastructure Failure",
  "Heatwave", "Wildfire", "Hurricane", "Drought",
];
const severityOptions = ["Low", "Medium", "High", "Critical"];
const statusOptions = ["Active", "Investigating", "Resolved"];
const sourceOptions = ["Human Report", "AI External Report", "Citizen Report", "Volunteer Report"];

function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export default function IncidentEditor({
  initialValues,
  referenceIncidents = [],
  onSubmit,
  onCancel,
  submitLabel = "Save Incident",
  busy = false,
}) {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialValues?.images?.[0] || "");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [coordError, setCoordError] = useState("");

  useEffect(() => {
    setForm({ ...defaultValues, ...initialValues });
    setImageFile(null);
    setImageUrl(initialValues?.images?.[0] || "");
    setImagePreview(null);
    setUploadError("");
    setAnalysis(null);
    setAnalysisError("");
  }, [initialValues]);

  useEffect(() => {
    let active = true;
    const previewIncident = {
      ...form,
      imageUrl,
      location: form.location,
      description: form.description,
    };

    const hasEnoughContext = form.title.trim().length > 2 || form.description.trim().length > 10 || form.location.trim().length > 2;

    if (!hasEnoughContext) {
      setAnalysis(null);
      setAnalysisError("");
      setAnalysisLoading(false);
      return undefined;
    }

    setAnalysisLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const result = await analyzeIncident(previewIncident, referenceIncidents);
        if (active) {
          setAnalysis(result);
          setAnalysisError("");
        }
      } catch (error) {
        if (active) {
          setAnalysisError(error.message);
        }
      } finally {
        if (active) {
          setAnalysisLoading(false);
        }
      }
    }, 500);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [form, imageUrl, referenceIncidents]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (name === "latitude" || name === "longitude") {
      setCoordError("");
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadError("");
    setImageFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    try {
      setUploading(true);
      const url = await cloudinaryService.uploadImage(file);
      setImageUrl(url);
      setImagePreview(null); // Clear preview after successful upload
      setImageFile(null);
    } catch (error) {
      setUploadError(error.message);
      setImagePreview(null);
      setImageFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImagePreview(null);
    setImageFile(null);
    setUploadError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const coordCheck = validateCoordinates(form.latitude, form.longitude);
    if (!coordCheck.valid) {
      setCoordError(coordCheck.error);
      return;
    }

    setCoordError("");
    await onSubmit({
      ...form,
      latitude: coordCheck.latitude ?? "",
      longitude: coordCheck.longitude ?? "",
      imageUrl: imageUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Flood in Downtown"
          />
        </Field>

        <Field label="Location" hint="Search for a place or click on the map to select.">
          <LocationSearch
            value={form.location}
            latitude={form.latitude}
            longitude={form.longitude}
            onLocationSelect={(location) => {
              setForm((current) => ({
                ...current,
                location: location.location,
                latitude: location.latitude,
                longitude: location.longitude,
              }));
            }}
          />
        </Field>

        <Field label="Category">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>

        <Field label="Source">
          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sourceOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>

        <Field label="Severity">
          <select
            name="severity"
            value={form.severity}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {severityOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </Field>

        <Field label="Latitude" hint="Decimal degrees, -90 to 90. Leave empty if unknown.">
          <input
            name="latitude"
            type="text"
            inputMode="decimal"
            value={form.latitude}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="40.7128"
          />
        </Field>

        <Field label="Longitude" hint="Decimal degrees, -180 to 180. Use negative values for west.">
          <input
            name="longitude"
            type="text"
            inputMode="decimal"
            value={form.longitude}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="-74.0060"
          />
        </Field>
      </div>

      {coordError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {coordError}
        </div>
      ) : null}

      <Field label="Description">
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe what happened, where, and who is affected."
        />
      </Field>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Live Gemini Preview</p>
            <p className="text-xs text-slate-500">This updates before you save the incident.</p>
          </div>
        </div>

        {analysisError ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {analysisError}
          </div>
        ) : analysisLoading ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
            <Loader className="h-4 w-4 animate-spin" />
            Analyzing incident details...
          </div>
        ) : analysis ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-semibold">AI Summary</p>
              <p className="mt-2 leading-6">{analysis.summary}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">Suggested Severity</p>
                <p className="mt-2 text-lg font-bold">{analysis.suggestedSeverity}</p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800 md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">Recommended Action</p>
                <p className="mt-2 leading-6">{analysis.recommendedAction}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Duplicate Check</p>
              {analysis.duplicateMatches?.length ? (
                <div className="mt-3 space-y-2">
                  <p className="font-medium text-slate-900">{formatDuplicateSummary(analysis.duplicateMatches)}</p>
                  {analysis.duplicateMatches.map((match) => (
                    <div key={match.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                      <p className="font-medium text-slate-900">{match.title}</p>
                      <p className="text-xs text-slate-500">
                        {match.location} • Match {Math.round((match.score || 0) * 100)}%
                        {typeof match.ageDays === "number" ? ` • ${match.ageDays}d ago` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-slate-600">No likely duplicates found yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
            <AlertTriangle className="h-4 w-4 text-slate-400" />
            Start typing a title, description, or location to see the AI preview.
          </div>
        )}
      </div>

      <Field label="AI Summary" hint="Concise operational summary for responders.">
        <textarea
          name="aiSummary"
          value={form.aiSummary}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="AI-generated summary will appear here."
        />
      </Field>

      <Field label="Recommended Action" hint="Evacuation, rescue deployment, medical response, etc.">
        <textarea
          name="recommendedAction"
          value={form.recommendedAction}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Recommended action for field teams."
        />
      </Field>

      <Field label="Incident Image" hint="Optional image upload to Cloudinary (JPEG, PNG, GIF, or WebP up to 10MB).">
        <div className="space-y-3">
          {uploadError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {uploadError}
            </div>
          ) : null}

          {imagePreview ? (
            <div className="relative flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50">
              <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black bg-opacity-50">
                  <Loader className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : null}
            </div>
          ) : imageUrl ? (
            <div className="relative flex rounded-xl border border-slate-200 bg-white">
              <img src={imageUrl} alt="Uploaded" className="h-40 w-40 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col items-start justify-center gap-2 p-4">
                <p className="text-sm font-medium text-slate-700">Image uploaded</p>
                <p className="text-xs text-slate-500">Stored in Cloudinary</p>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  <X size={14} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 transition hover:border-slate-400 hover:bg-slate-100">
              <Upload size={24} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Click to upload image</span>
              <span className="text-xs text-slate-500">or drag and drop</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                disabled={uploading}
                className="hidden"
              />
            </label>
          )}
        </div>
      </Field>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Saving..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
