import { AlertTriangle, Bot, CheckCircle2, Sparkles } from "lucide-react";
import { sortByRelevance } from "../utils/incidentRelevance";

function InsightCard({ title, description, tone = "blue" }) {
  const toneStyles = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${toneStyles[tone] || toneStyles.blue}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 opacity-90">{description}</p>
    </div>
  );
}

export default function AIInsights({ incidents = [], compact = false }) {
  const recent = sortByRelevance(incidents).slice(0, compact ? 2 : 3);
  const autoDetected = incidents.filter((incident) => incident.autoDetected).length;
  const duplicateSignals = incidents.filter((incident) => (incident.aiDuplicateMatches || []).length > 0).length;
  const criticalSignals = incidents.filter((incident) => incident.severity === "Critical").length;

  return (
    <div className={`text-white ${compact ? "" : "h-full rounded-2xl border border-slate-200 bg-[#0F172A] p-6 shadow-sm"}`}>
      {!compact ? (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">AI Intelligence</h2>
          <div className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">ACTIVE</div>
        </div>
      ) : null}

      {!compact ? (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InsightCard
            title="Live Incidents"
            description={`${incidents.length} incidents analyzed in realtime.`}
            tone="blue"
          />
          <InsightCard
            title="Auto-detected"
            description={`${autoDetected} climate incident${autoDetected === 1 ? "" : "s"} from trusted sources.`}
            tone="emerald"
          />
          <InsightCard
            title="Critical Signals"
            description={`${criticalSignals} incidents currently flagged as Critical.`}
            tone="amber"
          />
          <InsightCard
            title="Duplicate Watch"
            description={`${duplicateSignals} incident${duplicateSignals === 1 ? "" : "s"} have possible duplicate matches.`}
            tone="emerald"
          />
        </div>
      ) : null}

      <div className="space-y-4">
        {recent.length ? recent.map((incident) => (
          <div key={incident.id} className={`rounded-2xl border p-4 ${compact ? "border-slate-200 bg-slate-50 text-slate-900" : "border-white/10 bg-white/5"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium leading-6">{incident.title}</p>
                <p className={`mt-1 text-sm ${compact ? "text-slate-500" : "text-slate-300"}`}>
                  {incident.locationDetail || incident.location || "Unknown location"}
                </p>
              </div>
              {incident.autoDetected ? (
                <Bot className="h-5 w-5 text-violet-300" />
              ) : incident.severity === "Critical" ? (
                <AlertTriangle className="h-5 w-5 text-red-300" />
              ) : (
                <Sparkles className="h-5 w-5 text-blue-300" />
              )}
            </div>

            <p className={`mt-3 text-sm ${compact ? "text-slate-600 line-clamp-2" : "text-slate-300"}`}>
              {incident.aiSummary || incident.description || "AI analysis will appear once the incident is saved."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className={`rounded-full px-2.5 py-1 ${compact ? "bg-slate-200 text-slate-700" : "bg-white/10 text-slate-200"}`}>
                Severity: {incident.aiSuggestedSeverity || incident.severity || "Medium"}
              </span>
              <span className={`rounded-full px-2.5 py-1 ${compact ? "bg-slate-200 text-slate-700" : "bg-white/10 text-slate-200"}`}>
                {incident.aiDuplicateMatches?.length ? `${incident.aiDuplicateMatches.length} possible duplicates` : "No duplicates"}
              </span>
              <span className={`rounded-full px-2.5 py-1 ${compact ? "bg-slate-200 text-slate-700" : "bg-white/10 text-slate-200"}`}>
                {incident.recommendedAction ? "Action ready" : "Needs review"}
              </span>
            </div>
          </div>
        )) : (
          <div className={`rounded-2xl border p-4 text-sm ${compact ? "border-slate-200 bg-slate-50 text-slate-500" : "border-white/10 bg-white/5 text-slate-300"}`}>
            <CheckCircle2 className={`mb-2 h-5 w-5 ${compact ? "text-emerald-600" : "text-emerald-300"}`} />
            AI analysis will appear here once incidents are created or updated.
          </div>
        )}
      </div>
    </div>
  );
}