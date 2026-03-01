import React from "react";
import dayjs from "dayjs";
import { clsx } from "clsx";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  dueAt?: string | null;
}

interface Props {
  task: Task;
  onToggleDone?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TaskCard: React.FC<Props> = ({ task, onToggleDone, onEdit, onDelete }) => {
  const isOverdue =
    task.dueAt && task.status !== "done" && dayjs(task.dueAt).isBefore(dayjs(), "minute");

  return (
    <div className="mb-3 rounded-2xl bg-white/5 border border-white/10 p-3 flex gap-3">
      <button
        onClick={onToggleDone}
        className={clsx(
          "mt-1 h-5 w-5 rounded-full border flex items-center justify-center",
          task.status === "done" ? "bg-primary border-primary" : "border-gray-500"
        )}
      >
        {task.status === "done" && <span className="text-[10px]">✓</span>}
      </button>
      <div className="flex-1">
        <div className="flex justify-between items-center gap-2">
          <div>
            <h3
              className={clsx(
                "text-sm font-medium",
                task.status === "done" ? "line-through text-gray-400" : ""
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{task.description}</p>
            )}
          </div>
          <span
            className={clsx(
              "text-[10px] px-2 py-0.5 rounded-full capitalize",
              task.priority === "high" && "bg-red-500/20 text-red-300",
              task.priority === "medium" && "bg-yellow-500/20 text-yellow-200",
              task.priority === "low" && "bg-emerald-500/20 text-emerald-200"
            )}
          >
            {task.priority}
          </span>
        </div>
        {task.dueAt && (
          <p
            className={clsx(
              "text-[11px] mt-1",
              isOverdue ? "text-red-400 font-medium" : "text-gray-400"
            )}
          >
            {isOverdue ? "Overdue · " : "Due · "}
            {dayjs(task.dueAt).format("DD MMM, HH:mm")}
          </p>
        )}
        <div className="flex gap-3 mt-2 text-[11px] text-gray-400">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete} className="text-red-400">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

