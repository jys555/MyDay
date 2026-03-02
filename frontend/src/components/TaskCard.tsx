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
  kind?: "regular" | "one_time";
  timeOfDay?: "anytime" | "morning" | "afternoon" | "evening";
  goalType?: "off" | "duration" | "repeat";
  goalMinutes?: number | null;
  goalReps?: number | null;
  icon?: string | null;
  color?: string | null;
}

interface Props {
  task: Task;
  onToggleDone?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showGoalActions?: boolean;
}

export const TaskCard: React.FC<Props> = ({
  task,
  onToggleDone,
  onEdit,
  onDelete,
  showGoalActions
}) => {
  const isOverdue =
    task.dueAt && task.status !== "done" && dayjs(task.dueAt).isBefore(dayjs(), "minute");

  return (
    <div className="mb-3 rounded-2xl bg-gradient-to-r from-sky-500/60 to-sky-600/60 border border-white/10 p-3 flex gap-3">
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
              <span className="mr-1">{task.icon ?? "✅"}</span>
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
        <div className="flex gap-3 mt-2 text-[11px] text-gray-200 justify-between items-center">
          <div className="flex gap-3">
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete} className="text-red-200">
              Delete
            </button>
          </div>
          {task.kind === "regular" && task.timeOfDay && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 uppercase tracking-wide">
              {task.timeOfDay}
            </span>
          )}
        </div>

        {showGoalActions && task.status !== "done" && (
          <div className="mt-2 flex gap-2">
            {task.goalType === "duration" && (
              <>
                <button className="flex-1 rounded-xl bg-black/20 py-1.5 text-[11px]">
                  Timer {task.goalMinutes ? `· ${task.goalMinutes} min` : ""}
                </button>
                <button className="flex-1 rounded-xl bg-emerald-400 text-black py-1.5 text-[11px] font-semibold">
                  Finish
                </button>
              </>
            )}
            {task.goalType === "repeat" && (
              <>
                <button className="flex-1 rounded-xl bg-black/20 py-1.5 text-[11px]">
                  Finish 1 rep
                </button>
                <button className="flex-1 rounded-xl bg-emerald-400 text-black py-1.5 text-[11px] font-semibold">
                  Finish all
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

