import { useState, useCallback } from "react";
import type { TaskStatus } from "../types";

interface DragState {
  isDragging: boolean;
  draggedTaskId: string | null;
  sourceColumn: TaskStatus | null;
  targetColumn: TaskStatus | null;
  dropIndex: number | null;
  position: { x: number; y: number };
  offset: { x: number; y: number };
}

export function useDragAndDrop(
  onDrop: (taskId: string, newStatus: TaskStatus, dropIndex: number) => void,
) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedTaskId: null,
    sourceColumn: null,
    targetColumn: null,
    dropIndex: null,
    position: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });

  const handleDragStart = useCallback(
    (
      taskId: string,
      status: TaskStatus,
      event: React.PointerEvent<HTMLElement>,
    ) => {
      event.stopPropagation();
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();

      document.body.classList.add("dragging");

      setDragState({
        isDragging: true,
        draggedTaskId: taskId,
        sourceColumn: status,
        targetColumn: status,
        dropIndex: null,
        position: { x: event.clientX, y: event.clientY },
        offset: {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
      });

      const handleMove = (e: PointerEvent) => {
        setDragState((prev) => ({
          ...prev,
          position: { x: e.clientX, y: e.clientY },
        }));
      };

      const handleEnd = () => {
        document.body.classList.remove("dragging");

        setDragState((prev) => {
          if (
            prev.targetColumn &&
            prev.draggedTaskId &&
            prev.dropIndex !== null
          ) {
            onDrop(prev.draggedTaskId, prev.targetColumn, prev.dropIndex);
          }
          return {
            isDragging: false,
            draggedTaskId: null,
            sourceColumn: null,
            targetColumn: null,
            dropIndex: null,
            position: { x: 0, y: 0 },
            offset: { x: 0, y: 0 },
          };
        });
        document.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerup", handleEnd);
      };

      document.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerup", handleEnd);
    },
    [onDrop],
  );

  const setTargetColumn = useCallback((column: TaskStatus | null) => {
    setDragState((prev) => ({
      ...prev,
      targetColumn: column,
    }));
  }, []);

  const setDropIndex = useCallback((index: number | null) => {
    setDragState((prev) => ({
      ...prev,
      dropIndex: index,
    }));
  }, []);

  return {
    dragState,
    handleDragStart,
    setTargetColumn,
    setDropIndex,
  };
}
