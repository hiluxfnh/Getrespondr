const activities = [
  {
    title: "Flood reported near Downtown",
    time: "2 mins ago",
  },

  {
    title: "Volunteer Team Alpha assigned",
    time: "5 mins ago",
  },

  {
    title: "Medical supplies dispatched",
    time: "10 mins ago",
  },

  {
    title: "AI detected duplicate incidents",
    time: "12 mins ago",
  },
];

export default function ActivityStream() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Live Activity
        </h2>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

          <span className="text-sm text-green-600">
            Live
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 pl-4 py-2"
          >
            <h3 className="font-medium text-slate-800">
              {activity.title}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {activity.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}