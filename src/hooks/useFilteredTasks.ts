import { useMemo } from "react";
import type { Task, Filters, SortField, SortDirection } from "../types";

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export function useFilteredTasks(
  tasks: Task[],
  filters: Filters,
  sortField: SortField,
  sortDirection: SortDirection,
): Task[] {
  return useMemo(() => {
    let filtered = tasks;

    if (filters.status.length > 0) {
      filtered = filtered.filter((task) =>
        filters.status.includes(task.status),
      );
    }

    if (filters.priority.length > 0) {
      filtered = filtered.filter((task) =>
        filters.priority.includes(task.priority),
      );
    }

    if (filters.assignee.length > 0) {
      filtered = filtered.filter((task) =>
        filters.assignee.includes(task.assignee),
      );
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.dueDate);
        if (filters.dateRange.start && taskDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && taskDate > filters.dateRange.end) {
          return false;
        }
        return true;
      });
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "priority":
            comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            break;
          case "dueDate":
            comparison =
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            break;
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [tasks, filters, sortField, sortDirection]);
}
