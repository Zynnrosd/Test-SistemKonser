interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  active: {
    label: "Active",
    classes: "bg-emerald-500/15 text-emerald-700 border border-emerald-200/80",
    dot: "bg-emerald-500",
  },
  archived: {
    label: "Archived",
    classes: "bg-amber-500/15 text-amber-700 border border-amber-200/80",
    dot: "bg-amber-500",
  },
  booked: {
    label: "Booked",
    classes: "bg-indigo-500/15 text-indigo-700 border border-indigo-200/80",
    dot: "bg-indigo-500",
  },
  attended: {
    label: "Attended",
    classes: "bg-violet-500/15 text-violet-700 border border-violet-200/80",
    dot: "bg-violet-500",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-500/15 text-red-600 border border-red-200/80",
    dot: "bg-red-500",
  },
  "sold out": {
    label: "Sold Out",
    classes: "bg-gray-200/80 text-gray-600 border border-gray-300/60",
    dot: "bg-gray-400",
  },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cfg = CONFIG[status.toLowerCase()] ?? {
    label: status,
    classes: "bg-gray-200/80 text-gray-600 border border-gray-300/60",
    dot: "bg-gray-400",
  };
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5 gap-1" : "text-sm px-3 py-1 gap-1.5";
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold backdrop-blur-sm ${sizeClass} ${cfg.classes}`}
    >
      <span className={`rounded-full flex-shrink-0 ${dotSize} ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
