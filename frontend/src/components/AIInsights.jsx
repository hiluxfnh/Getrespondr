export default function AIInsights() {
  return (
    <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          AI Intelligence
        </h2>

        <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
          ACTIVE
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="font-medium">
            Flood probability increasing in North Zone.
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Heavy rainfall patterns detected by AI analysis.
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="font-medium">
            12 duplicate incident reports merged.
          </p>

          <p className="text-sm text-slate-400 mt-2">
            AI reduced dashboard noise by 34%.
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="font-medium">
            Medical resource shortage predicted.
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Risk escalation expected within 2 hours.
          </p>
        </div>
      </div>
    </div>
  );
}