import { AlertTriangle, Bot, CheckCircle2, Sparkles } from "lucide-react";

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

export default function AIInsights({ incidents = [] }) {
  const recent = incidents.slice(0, 3);
  const autoDetected = incidents.filter((incident) => incident.autoDetected).length;
  const duplicateSignals = incidents.filter((incident) => (incident.aiDuplicateMatches || []).length > 0).length;
  const criticalSignals = incidents.filter((incident) => incident.severity === "Critical").length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#0F172A] p-6 text-white shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          AI Intelligence
        </h2>

        <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
          ACTIVE
        </div>
      </div>

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

      <div className="space-y-4">
        {recent.length ? recent.map((incident) => (
          <div key={incident.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium leading-6">{incident.title}</p>
                <p className="mt-1 text-sm text-slate-300">
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

            <p className="mt-3 text-sm text-slate-300">
              {incident.aiSummary || incident.description || "AI analysis will appear once the incident is saved."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-200">
                Severity: {incident.aiSuggestedSeverity || incident.severity || "Medium"}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-200">
                {incident.aiDuplicateMatches?.length ? `${incident.aiDuplicateMatches.length} possible duplicates` : "No duplicates"}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-200">
                {incident.recommendedAction ? "Action ready" : "Needs review"}
              </span>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-300" />
            AI analysis will appear here once incidents are created or updated.
          </div>
        )}
      </div>
    </div>
  );
}