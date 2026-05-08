import {
  Bell,
  MessageCircle,
} from "lucide-react";

export default function Topbar() {
  return (
    <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Overview of crisis operations
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-slate-100 px-4 py-2 rounded-xl">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none"
          />
        </div>

        <Bell className="text-slate-600" />
        <MessageCircle className="text-slate-600" />

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />

          <span className="text-green-600 font-medium">
            Operational
          </span>
        </div>
      </div>
    </div>
  );
}