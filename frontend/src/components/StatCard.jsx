export default function StatCard({
  title,
  value,
  color,
  icon: Icon,
  trend,
  trendLabel,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-medium">
            {title}
          </p>

          <h2 className={`text-4xl font-bold mt-3 ${color}`}>
            {value}
          </h2>

          {trend && (
            <p className="mt-2 text-sm">
              <span className={trend.startsWith("↑") ? "text-emerald-600" : "text-orange-600"}>
                {trend}
              </span>
              <span className="text-slate-500"> {trendLabel}</span>
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${color.replace("text-", "bg-").replace("-500", "-100")}`}>
            <Icon size={24} className={color} />
          </div>
        )}
      </div>
    </div>
  );
}