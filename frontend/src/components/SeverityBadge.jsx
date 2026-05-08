export default function SeverityBadge({
  severity,
}) {
  const colors = {
    Low: "bg-yellow-100 text-yellow-700",

    Medium:
      "bg-orange-100 text-orange-700",

    High: "bg-red-100 text-red-700",

    Critical:
      "bg-red-600 text-white",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colors[severity]}`}
    >
      {severity}
    </span>
  );
}