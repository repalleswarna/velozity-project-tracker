import { memo } from "react";
import type { Task, User } from "../types";
import { Avatar } from "./Avatar";
import { PriorityBadge } from "./PriorityBadge";
import { DueDateLabel } from "./DueDateLabel";
import { AvatarStack } from "./AvatarStack";

interface TaskCardProps {
  task: Task;
  assignee: User;
  activeUsers?: User[];
  isDragging?: boolean;
  isPlaceholder?: boolean;
  onPointerDown?: (event: React.PointerEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export const TaskCard = memo(
  ({
    task,
    assignee,
    activeUsers = [],
    isDragging = false,
    isPlaceholder = false,
    onPointerDown,
    style,
  }: TaskCardProps) => {
    if (isPlaceholder) {
      return (
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-3 mb-2 h-24" />
      );
    }

    return (
      <div
        data-task-id={task.id}
        className={`bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
          isDragging ? "opacity-50" : ""
        }`}
        onPointerDown={onPointerDown}
        style={style}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900 flex-1 mr-2">
            {task.title}
          </h3>
          <Avatar
            initials={assignee.initials}
            color={assignee.color}
            size="sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <PriorityBadge priority={task.priority} />
          <DueDateLabel date={task.dueDate} />
        </div>

        {activeUsers.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <AvatarStack users={activeUsers} />
          </div>
        )}
      </div>
    );
  },
);

TaskCard.displayName = "TaskCard";
