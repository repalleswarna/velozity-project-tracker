import { memo } from "react";
import { Avatar } from "./Avatar";
import type { User } from "../types";

interface AvatarStackProps {
  users: User[];
  max?: number;
}

export const AvatarStack = memo(({ users, max = 3 }: AvatarStackProps) => {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user) => (
        <div key={user.id} className="ring-2 ring-white rounded-full">
          <Avatar initials={user.initials} color={user.color} size="sm" />
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  );
});

AvatarStack.displayName = "AvatarStack";
