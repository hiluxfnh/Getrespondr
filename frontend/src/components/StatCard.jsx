export default function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <p className="text-slate-500 text-sm">
        {title}
      </p>

      <h2
        className={`text-3xl font-bold mt-2 ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}