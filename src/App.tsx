import { useMemo } from "react";
import { useStore } from "./store/useStore";
import { useFilteredTasks } from "./hooks/useFilteredTasks";
import { Header } from "./components/Header";
import { Filters } from "./components/Filters";
import { KanbanView } from "./components/KanbanView";
import { ListView } from "./components/ListView";
import { TimelineView } from "./components/TimelineView";
import type { SortField } from "./types";

function App() {
  const {
    tasks,
    users,
    filters,
    uiState,
    activeUsers,
    updateTaskStatus,
    setFilters,
    setView,
    setSorting,
  } = useStore();

  const filteredTasks = useFilteredTasks(
    tasks,
    filters,
    uiState.sortField,
    uiState.sortDirection,
  );

  const activeUsersList = useMemo(() => {
    const userIds = new Set<string>();
    activeUsers.forEach((userList) => {
      userList.forEach((userId) => userIds.add(userId));
    });
    return users.filter((u) => userIds.has(u.id));
  }, [activeUsers, users]);

  const handleSort = (field: SortField) => {
    if (uiState.sortField === field) {
      setSorting(field, uiState.sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSorting(field, "asc");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header
        view={uiState.view}
        onViewChange={setView}
        activeUsers={activeUsersList}
      />

      <Filters filters={filters} users={users} onFilterChange={setFilters} />

      <main className="flex-1 overflow-hidden">
        {uiState.view === "kanban" && (
          <KanbanView
            tasks={filteredTasks}
            users={users}
            activeUsers={activeUsers}
            onUpdateStatus={updateTaskStatus}
          />
        )}

        {uiState.view === "list" && (
          <ListView
            tasks={filteredTasks}
            users={users}
            activeUsers={activeUsers}
            sortField={uiState.sortField}
            sortDirection={uiState.sortDirection}
            onUpdateStatus={updateTaskStatus}
            onSort={handleSort}
          />
        )}

        {uiState.view === "timeline" && (
          <TimelineView tasks={filteredTasks} users={users} />
        )}
      </main>
    </div>
  );
}

export default App;
