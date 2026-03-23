import { create } from "zustand";
import type {
  Task,
  User,
  Filters,
  UIState,
  TaskStatus,
  SortField,
  SortDirection,
  ViewType,
} from "../types";
import { generateTasks, generateUsers } from "../utils/dataGenerator";
import { syncFiltersToURL, getInitialStateFromURL } from "../utils/urlSync";

interface StoreState {
  tasks: Task[];
  users: User[];
  filters: Filters;
  uiState: UIState;
  activeUsers: Map<string, string[]>; // taskId -> userId[]

  updateTaskStatus: (
    taskId: string,
    status: TaskStatus,
    dropIndex: number,
  ) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setView: (view: ViewType) => void;
  setSorting: (field: SortField, direction: SortDirection) => void;
  simulateCollaboration: () => void;
}

const initialState = getInitialStateFromURL();

const users = generateUsers();
const tasks = generateTasks(500, users);

export const useStore = create<StoreState>((set, get) => ({
  tasks,
  users,
  filters: {
    status: initialState.filters.status || [],
    priority: initialState.filters.priority || [],
    assignee: initialState.filters.assignee || [],
    dateRange: initialState.filters.dateRange || { start: null, end: null },
  },
  uiState: {
    view: initialState.view,
    sortField: initialState.sortField,
    sortDirection: initialState.sortDirection,
  },
  activeUsers: new Map(),

  updateTaskStatus: (taskId: string, status: TaskStatus, dropIndex: number) => {
    set((state) => {
      const tasks = [...state.tasks];
      const taskIndex = tasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) return state;

      const [task] = tasks.splice(taskIndex, 1);

      task.status = status;

      const statusTasks = tasks.filter((t) => t.status === status);

      let insertIndex = 0;
      if (dropIndex === 0) {
        insertIndex = tasks.findIndex((t) => t.status === status);
        if (insertIndex === -1) insertIndex = tasks.length;
      } else if (dropIndex >= statusTasks.length) {
        const lastIndex = tasks
          .map((t, i) => (t.status === status ? i : -1))
          .filter((i) => i !== -1)
          .pop();
        insertIndex = lastIndex !== undefined ? lastIndex + 1 : tasks.length;
      } else {
        const targetTask = statusTasks[dropIndex];
        insertIndex = tasks.findIndex((t) => t.id === targetTask.id);
      }

      tasks.splice(insertIndex, 0, task);

      return { tasks };
    });
  },

  setFilters: (newFilters: Partial<Filters>) => {
    set((state) => {
      const filters = { ...state.filters, ...newFilters };
      syncFiltersToURL(
        filters,
        state.uiState.view,
        state.uiState.sortField,
        state.uiState.sortDirection,
      );
      return { filters };
    });
  },

  setView: (view: ViewType) => {
    set((state) => {
      const uiState = { ...state.uiState, view };
      syncFiltersToURL(
        state.filters,
        view,
        state.uiState.sortField,
        state.uiState.sortDirection,
      );
      return { uiState };
    });
  },

  setSorting: (field: SortField, direction: SortDirection) => {
    set((state) => {
      const uiState = {
        ...state.uiState,
        sortField: field,
        sortDirection: direction,
      };
      syncFiltersToURL(state.filters, state.uiState.view, field, direction);
      return { uiState };
    });
  },

  simulateCollaboration: () => {
    const state = get();
    const activeUsers = new Map<string, string[]>();

    const numActiveUsers = Math.floor(Math.random() * 3) + 2;
    const selectedUsers = state.users
      .sort(() => Math.random() - 0.5)
      .slice(0, numActiveUsers);

    selectedUsers.forEach((user) => {
      const randomTask =
        state.tasks[Math.floor(Math.random() * state.tasks.length)];
      const current = activeUsers.get(randomTask.id) || [];
      activeUsers.set(randomTask.id, [...current, user.id]);
    });

    set({ activeUsers });
  },
}));

setInterval(() => {
  useStore.getState().simulateCollaboration();
}, 5000);
