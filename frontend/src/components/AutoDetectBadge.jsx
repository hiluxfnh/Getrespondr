import { Bot } from "lucide-react";

export default function AutoDetectBadge({ compact = false }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
        <Bot className="h-3 w-3" />
        AI
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
      <Bot className="h-3.5 w-3.5" />
      Auto-detected
    </span>
  );
}
