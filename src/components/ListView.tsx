import { memo, useMemo, useCallback } from "react";
import type {
  Task,
  TaskStatus,
  User,
  SortField,
  SortDirection,
} from "../types";
import { Avatar } from "./Avatar";
import { PriorityBadge } from "./PriorityBadge";
import { DueDateLabel } from "./DueDateLabel";
import { AvatarStack } from "./AvatarStack";
import { useVirtualScroll } from "../hooks/useVirtualScroll";

interface ListViewProps {
  tasks: Task[];
  users: User[];
  activeUsers: Map<string, string[]>;
  sortField: SortField;
  sortDirection: SortDirection;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onSort: (field: SortField) => void;
}

const ITEM_HEIGHT = 60;
const CONTAINER_HEIGHT = window.innerHeight - 200;

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  inreview: "In Review",
  done: "Done",
};

export const ListView = memo(
  ({
    tasks,
    users,
    activeUsers,
    sortField,
    sortDirection,
    onUpdateStatus,
    onSort,
  }: ListViewProps) => {
    const { scrollRef, totalHeight, visibleItems, handleScroll } =
      useVirtualScroll({
        itemHeight: ITEM_HEIGHT,
        containerHeight: CONTAINER_HEIGHT,
        itemCount: tasks.length,
        overscan: 5,
      });

    const userMap = useMemo(() => {
      return new Map(users.map((u) => [u.id, u]));
    }, [users]);

    const handleSort = useCallback(
      (field: SortField) => {
        onSort(field);
      },
      [onSort],
    );

    const SortIcon = ({ field }: { field: SortField }) => {
      if (sortField !== field) {
        return <span className="text-gray-400">↕</span>;
      }
      return <span>{sortDirection === "asc" ? "↑" : "↓"}</span>;
    };

    if (tasks.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <p className="text-lg">No tasks found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-700">
            <div
              className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-gray-900"
              onClick={() => handleSort("title")}
            >
              Title <SortIcon field="title" />
            </div>
            <div className="col-span-2">Status</div>
            <div
              className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-gray-900"
              onClick={() => handleSort("priority")}
            >
              Priority <SortIcon field="priority" />
            </div>
            <div
              className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-gray-900"
              onClick={() => handleSort("dueDate")}
            >
              Due Date <SortIcon field="dueDate" />
            </div>
            <div className="col-span-1">Assignee</div>
            <div className="col-span-1">Active</div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: "relative" }}>
            {visibleItems.map(({ index, offsetTop }) => {
              const task = tasks[index];
              const assignee = userMap.get(task.assignee);
              const taskActiveUsers = (activeUsers.get(task.id) || [])
                .map((uid) => userMap.get(uid))
                .filter((u): u is User => u !== undefined);

              if (!assignee) return null;

              return (
                <div
                  key={task.id}
                  className="absolute w-full border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  style={{
                    height: ITEM_HEIGHT,
                    top: offsetTop,
                  }}
                >
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center h-full">
                    <div className="col-span-4 text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </div>
                    <div className="col-span-2">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          onUpdateStatus(task.id, e.target.value as TaskStatus)
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="col-span-2">
                      <DueDateLabel date={task.dueDate} />
                    </div>
                    <div className="col-span-1">
                      <Avatar
                        initials={assignee.initials}
                        color={assignee.color}
                        size="sm"
                      />
                    </div>
                    <div className="col-span-1">
                      {taskActiveUsers.length > 0 && (
                        <AvatarStack users={taskActiveUsers} max={2} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

ListView.displayName = "ListView";
