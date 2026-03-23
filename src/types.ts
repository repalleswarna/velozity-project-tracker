export type TaskStatus = "todo" | "inprogress" | "inreview" | "done";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type ViewType = "kanban" | "list" | "timeline";
export type SortField = "title" | "priority" | "dueDate" | null;
export type SortDirection = "asc" | "desc";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: Date;
  startDate?: Date;
  description: string;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Filters {
  status: TaskStatus[];
  priority: TaskPriority[];
  assignee: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface UIState {
  view: ViewType;
  sortField: SortField;
  sortDirection: SortDirection;
}
