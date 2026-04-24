interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const CONFIG: Record<string, { label: string; classes: string }> = {
  active: {
    label: "Active",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  archived: {
    label: "Archived",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  booked: {
    label: "Booked",
    classes: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  attended: {
    label: "Attended",
    classes: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-red-50 text-red-600 border border-red-200",
  },
  "sold out": {
    label: "Sold Out",
    classes: "bg-gray-100 text-gray-600 border border-gray-200",
  },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const cfg = CONFIG[status.toLowerCase()] ?? {
    label: status,
    classes: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}
