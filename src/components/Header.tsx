import { memo } from "react";
import type { ViewType } from "../types";
import { AvatarStack } from "./AvatarStack";
import type { User } from "../types";

interface HeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  activeUsers: User[];
}

const views: { id: ViewType; label: string }[] = [
  { id: "kanban", label: "Kanban" },
  { id: "list", label: "List" },
  { id: "timeline", label: "Timeline" },
];

export const Header = memo(
  ({ view, onViewChange, activeUsers }: HeaderProps) => {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Project Management
            </h1>
            <div className="flex gap-2 ml-8">
              {views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onViewChange(v.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === v.id ?
                      "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {activeUsers.length} {activeUsers.length === 1 ? "user" : "users"}{" "}
              active
            </span>
            <AvatarStack users={activeUsers} max={5} />
          </div>
        </div>
      </header>
    );
  },
);

Header.displayName = "Header";
