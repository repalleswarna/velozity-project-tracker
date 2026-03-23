import { memo } from "react";
import {
  isToday,
  isOverdue,
  getDaysOverdue,
  formatDate,
} from "../utils/dateUtils";

interface DueDateLabelProps {
  date: Date;
}

export const DueDateLabel = memo(({ date }: DueDateLabelProps) => {
  const today = isToday(date);
  const overdue = isOverdue(date);
  const daysOverdue = overdue ? getDaysOverdue(date) : 0;

  if (today) {
    return <span className="text-xs text-blue-600 font-medium">Due Today</span>;
  }

  if (overdue) {
    if (daysOverdue > 7) {
      return (
        <span className="text-xs text-red-600 font-medium">
          {daysOverdue} days overdue
        </span>
      );
    }
    return <span className="text-xs text-red-600 font-medium">Overdue</span>;
  }

  return <span className="text-xs text-gray-600">{formatDate(date)}</span>;
});

DueDateLabel.displayName = "DueDateLabel";
