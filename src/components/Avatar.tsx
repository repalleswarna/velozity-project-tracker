import { memo } from "react";

interface AvatarProps {
  initials: string;
  color: string;
  size?: "sm" | "md";
}

export const Avatar = memo(({ initials, color, size = "md" }: AvatarProps) => {
  const sizeClasses = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center text-white font-medium`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
});

Avatar.displayName = "Avatar";
