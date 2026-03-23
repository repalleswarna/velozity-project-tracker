import { memo } from "react";
import type { TaskPriority } from "../types";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const priorityConfig = {
  critical: { label: "Critical", color: "bg-red-100 text-red-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "Low", color: "bg-green-100 text-green-700" },
};

export const PriorityBadge = memo(({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
});

PriorityBadge.displayName = "PriorityBadge";
