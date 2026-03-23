import { memo, useMemo } from "react";
import type { Task, TaskStatus, User } from "../types";
import { TaskCard } from "./TaskCard";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

interface KanbanViewProps {
  tasks: Task[];
  users: User[];
  activeUsers: Map<string, string[]>;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "inreview", title: "In Review" },
  { id: "done", title: "Done" },
];

export const KanbanView = memo(
  ({ tasks, users, activeUsers, onUpdateStatus }: KanbanViewProps) => {
    const { dragState, handleDragStart, setTargetColumn, setDropIndex } =
      useDragAndDrop(onUpdateStatus);

    const tasksByStatus = useMemo(() => {
      const grouped = new Map<TaskStatus, Task[]>();
      columns.forEach((col) => grouped.set(col.id, []));

      tasks.forEach((task) => {
        const list = grouped.get(task.status);
        if (list) list.push(task);
      });

      return grouped;
    }, [tasks]);

    const userMap = useMemo(() => {
      return new Map(users.map((u) => [u.id, u]));
    }, [users]);

    return (
      <div className="flex gap-4 h-full overflow-x-auto p-4">
        {columns.map((column) => {
          const columnTasks = tasksByStatus.get(column.id) || [];
          const isTargetColumn = dragState.targetColumn === column.id;

          return (
            <div
              key={column.id}
              className="shrink-0 w-80 bg-gray-200 rounded-lg p-4 flex flex-col"
              style={{ height: "calc(100vh - 180px)" }}
              onPointerEnter={() =>
                dragState.isDragging && setTargetColumn(column.id)
              }
              onPointerLeave={() =>
                dragState.isDragging && setTargetColumn(null)
              }
            >
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h2 className="font-semibold text-gray-900">{column.title}</h2>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                  {columnTasks.length}
                </span>
              </div>

              <div
                className={`overflow-y-auto pr-2 flex-1 transition-colors ${
                  isTargetColumn ? "bg-blue-50 rounded-lg p-2 -m-2" : ""
                }`}
                onPointerMove={(e) => {
                  if (!dragState.isDragging) return;

                  const container = e.currentTarget;
                  const cards = Array.from(container.children).filter((el) =>
                    el.getAttribute("data-task-id"),
                  );

                  let dropIdx = columnTasks.length;

                  for (let i = 0; i < cards.length; i++) {
                    const card = cards[i] as HTMLElement;
                    const rect = card.getBoundingClientRect();
                    const midpoint = rect.top + rect.height / 2;

                    if (e.clientY < midpoint) {
                      dropIdx = i;
                      break;
                    }
                  }

                  setDropIndex(dropIdx);
                }}
              >
                {columnTasks.length === 0 ?
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No tasks
                  </div>
                : columnTasks.map((task) => {
                    const assignee = userMap.get(task.assignee);
                    const taskActiveUsers = (activeUsers.get(task.id) || [])
                      .map((uid) => userMap.get(uid))
                      .filter((u): u is User => u !== undefined);

                    const isDragging = dragState.draggedTaskId === task.id;

                    if (!assignee) return null;

                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        assignee={assignee}
                        activeUsers={taskActiveUsers}
                        isDragging={isDragging}
                        onPointerDown={(e) =>
                          handleDragStart(task.id, task.status, e)
                        }
                      />
                    );
                  })
                }

                {dragState.isDragging &&
                  isTargetColumn &&
                  dragState.sourceColumn !== column.id && (
                    <TaskCard
                      task={
                        tasks.find((t) => t.id === dragState.draggedTaskId)!
                      }
                      assignee={
                        userMap.get(
                          tasks.find((t) => t.id === dragState.draggedTaskId)!
                            .assignee,
                        )!
                      }
                      isPlaceholder
                    />
                  )}
              </div>
            </div>
          );
        })}

        {dragState.isDragging && dragState.draggedTaskId && (
          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: dragState.position.x - dragState.offset.x,
              top: dragState.position.y - dragState.offset.y,
              width: "320px",
            }}
          >
            <TaskCard
              task={tasks.find((t) => t.id === dragState.draggedTaskId)!}
              assignee={
                userMap.get(
                  tasks.find((t) => t.id === dragState.draggedTaskId)!.assignee,
                )!
              }
            />
          </div>
        )}
      </div>
    );
  },
);

KanbanView.displayName = "KanbanView";
