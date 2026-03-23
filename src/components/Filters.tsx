import { memo } from "react";
import type {
  Filters as FiltersType,
  TaskStatus,
  TaskPriority,
  User,
} from "../types";

interface FiltersProps {
  filters: FiltersType;
  users: User[];
  onFilterChange: (filters: Partial<FiltersType>) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "inreview", label: "In Review" },
  { value: "done", label: "Done" },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const Filters = memo(
  ({ filters, users, onFilterChange }: FiltersProps) => {
    const handleStatusToggle = (status: TaskStatus) => {
      const newStatus =
        filters.status.includes(status) ?
          filters.status.filter((s) => s !== status)
        : [...filters.status, status];
      onFilterChange({ status: newStatus });
    };

    const handlePriorityToggle = (priority: TaskPriority) => {
      const newPriority =
        filters.priority.includes(priority) ?
          filters.priority.filter((p) => p !== priority)
        : [...filters.priority, priority];
      onFilterChange({ priority: newPriority });
    };

    const handleDateRangeChange = (type: "start" | "end", value: string) => {
      const newDateRange = { ...filters.dateRange };
      newDateRange[type] = value ? new Date(value) : null;
      onFilterChange({ dateRange: newDateRange });
    };

    const hasActiveFilters =
      filters.status.length > 0 ||
      filters.priority.length > 0 ||
      filters.assignee.length > 0 ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null;

    const clearFilters = () => {
      onFilterChange({
        status: [],
        priority: [],
        assignee: [],
        dateRange: { start: null, end: null },
      });
    };

    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusToggle(option.value)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    filters.status.includes(option.value) ?
                      "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Priority:</span>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePriorityToggle(option.value)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    filters.priority.includes(option.value) ?
                      "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Assignee:</span>
            <select
              multiple
              value={filters.assignee}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                );
                onFilterChange({ assignee: selected });
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              size={1}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Date Range:
            </span>
            <input
              type="date"
              value={
                filters.dateRange.start ?
                  filters.dateRange.start.toISOString().split("T")[0]
                : ""
              }
              onChange={(e) => handleDateRangeChange("start", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={
                filters.dateRange.end ?
                  filters.dateRange.end.toISOString().split("T")[0]
                : ""
              }
              onChange={(e) => handleDateRangeChange("end", e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    );
  },
);

Filters.displayName = "Filters";
