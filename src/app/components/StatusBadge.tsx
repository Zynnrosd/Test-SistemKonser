interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  active: {
    label: "Active",
    classes: "bg-emerald-100 text-emerald-600 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  archived: {
    label: "Archived",
    classes: "bg-amber-100 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  booked: {
    label: "Booked",
    classes: "bg-primary/10 text-primary border border-primary/20",
    dot: "bg-primary",
  },
  attended: {
    label: "Attended",
    classes: "bg-violet-100 text-violet-600 border border-violet-200",
    dot: "bg-violet-500",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-100 text-red-600 border border-red-200",
    dot: "bg-red-500",
  },
  "sold out": {
    label: "Sold Out",
    classes: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
  sold_out: {
    label: "Sold Out",
    classes: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cfg = CONFIG[status.toLowerCase()] ?? {
    label: status,
    classes: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  };
  const sizeClass = size === "sm" ? "text-[10px] px-2.5 py-1 gap-1.5" : "text-xs px-4 py-1.5 gap-2";
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${sizeClass} ${cfg.classes}`}
    >
      <span className={`rounded-full flex-shrink-0 ${dotSize} ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
