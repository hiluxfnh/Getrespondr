export default function StatusBadge({
  status,
}) {
  const colors = {
    Active: "bg-red-100 text-red-700",

    Investigating:
      "bg-yellow-100 text-yellow-700",

    Resolved:
      "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
}