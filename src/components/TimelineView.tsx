import { memo, useMemo } from "react";
import type { Task, User } from "../types";
import { Avatar } from "./Avatar";
import {
  getMonthsBetween,
  getDaysInMonth,
  formatMonthYear,
} from "../utils/dateUtils";

interface TimelineViewProps {
  tasks: Task[];
  users: User[];
}

const DAY_WIDTH = 40;
const ROW_HEIGHT = 50;

export const TimelineView = memo(({ tasks, users }: TimelineViewProps) => {
  const userMap = useMemo(() => {
    return new Map(users.map((u) => [u.id, u]));
  }, [users]);

  const { months, minDate, todayPosition } = useMemo(() => {
    if (tasks.length === 0) {
      return {
        months: [],
        minDate: new Date(),
        maxDate: new Date(),
        todayPosition: 0,
      };
    }

    const dates = tasks.flatMap((t) => [
      t.dueDate,
      ...(t.startDate ? [t.startDate] : []),
    ]);

    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));

    min.setDate(1);
    max.setMonth(max.getMonth() + 1);
    max.setDate(0);

    const months = getMonthsBetween(min, max);

    const today = new Date();
    const daysSinceStart = Math.floor(
      (today.getTime() - min.getTime()) / (1000 * 60 * 60 * 24),
    );
    const todayPos = daysSinceStart * DAY_WIDTH;

    return {
      months,
      minDate: min,
      todayPosition: todayPos,
    };
  }, [tasks]);

  const getTaskPosition = (task: Task) => {
    const start = task.startDate || task.dueDate;
    const end = task.dueDate;

    const startDays = Math.floor(
      (start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const endDays = Math.floor(
      (end.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const left = startDays * DAY_WIDTH;
    const width =
      task.startDate ?
        Math.max((endDays - startDays) * DAY_WIDTH, DAY_WIDTH)
      : DAY_WIDTH;

    return { left, width };
  };

  const priorityColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <p className="text-lg">No tasks to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="relative" style={{ minWidth: "max-content" }}>
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 flex">
          {months.map((month, idx) => {
            const daysInMonth = getDaysInMonth(month);
            const width = daysInMonth * DAY_WIDTH;

            return (
              <div
                key={idx}
                className="border-r border-gray-200 px-4 py-3 font-medium text-sm text-gray-700"
                style={{ width }}
              >
                {formatMonthYear(month)}
              </div>
            );
          })}
        </div>

        <div className="relative">
          {months.map((month, monthIdx) => {
            const daysInMonth = getDaysInMonth(month);
            const monthStart =
              monthIdx *
              months
                .slice(0, monthIdx)
                .reduce((sum, m) => sum + getDaysInMonth(m), 0);

            return (
              <div
                key={monthIdx}
                className="absolute top-0 bottom-0 flex"
                style={{ left: monthStart * DAY_WIDTH }}
              >
                {Array.from({ length: daysInMonth }).map((_, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="border-r border-gray-100"
                    style={{ width: DAY_WIDTH }}
                  />
                ))}
              </div>
            );
          })}

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20"
            style={{ left: todayPosition }}
          >
            <div className="absolute -top-1 -left-2 w-4 h-4 bg-blue-500 rounded-full" />
          </div>

          <div
            className="relative"
            style={{ minHeight: tasks.length * ROW_HEIGHT }}
          >
            {tasks.map((task, idx) => {
              const { left, width } = getTaskPosition(task);
              const assignee = userMap.get(task.assignee);
              const isMarker = !task.startDate;

              return (
                <div
                  key={task.id}
                  className="absolute flex items-center gap-2 px-2"
                  style={{
                    top: idx * ROW_HEIGHT + 10,
                    left,
                    width: isMarker ? "auto" : width,
                    height: ROW_HEIGHT - 20,
                  }}
                >
                  {isMarker ?
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}
                      />
                      <span className="text-xs text-gray-700 whitespace-nowrap bg-white px-2 py-1 rounded border border-gray-200">
                        {task.title}
                      </span>
                    </div>
                  : <div
                      className={`${priorityColors[task.priority]} rounded px-3 py-2 flex items-center gap-2 w-full`}
                    >
                      {assignee && (
                        <Avatar
                          initials={assignee.initials}
                          color={assignee.color}
                          size="sm"
                        />
                      )}
                      <span className="text-xs text-white font-medium truncate">
                        {task.title}
                      </span>
                    </div>
                  }
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

TimelineView.displayName = "TimelineView";
