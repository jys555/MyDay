import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../api/client";
import { TaskCard, Task } from "../components/TaskCard";
import { Layout } from "../components/Layout";

type Segment = "all" | "morning" | "afternoon" | "evening";

const weekdayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const TodayPage: React.FC = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [segment, setSegment] = useState<Segment>("all");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setAllTasks(res.data.tasks as Task[]);
    } catch (e) {
      console.error("Failed to load tasks:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleToggleDone(task: Task) {
    const nextStatus = task.status === "done" ? "todo" : "done";
    try {
      await api.patch(`/tasks/${task.id}`, { status: nextStatus });
      await load();
    } catch (e) {
      console.error("Failed to update task:", e);
    }
  }

  async function handleDelete(taskId: number) {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      await load();
    } catch (e) {
      console.error("Failed to delete task:", e);
    }
  }

  const todayKey = weekdayKeys[dayjs().day()];

  const todayTasks = allTasks.filter((t) => {
    if (t.kind === "regular") {
      const days = (t as any).repeatDays as string[] | undefined;
      const activeToday = !days || days.length === 0 || days.includes(todayKey);
      if (!activeToday) return false;
    } else {
      if (!t.dueAt || !dayjs(t.dueAt).isSame(dayjs(), "day")) return false;
    }
    if (segment === "all") return true;
    if (t.timeOfDay === "anytime" || !t.timeOfDay) return true;
    return t.timeOfDay === segment;
  });

  const overdueCount = todayTasks.filter(
    (t) => t.dueAt && t.status !== "done" && dayjs(t.dueAt).isBefore(dayjs())
  ).length;

  return (
    <Layout>
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold">Today</h2>
          {overdueCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200">
              {overdueCount} overdue
            </span>
          )}
        </div>

        <div className="flex rounded-full bg-black/30 p-1 text-[11px]">
          {["all", "morning", "afternoon", "evening"].map((key) => (
            <button
              key={key}
              onClick={() => setSegment(key as Segment)}
              className={clsx(
                "flex-1 py-1 rounded-full capitalize",
                segment === key ? "bg-white text-black font-semibold" : "text-gray-300"
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-xs text-gray-400">Loading...</p>}
      {!loading && todayTasks.length === 0 && (
        <p className="text-xs text-gray-400">Nothing planned for this segment today.</p>
      )}
      {todayTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleDone={() => void handleToggleDone(task)}
          onDelete={() => void handleDelete(task.id)}
          showGoalActions
        />
      ))}
    </Layout>
  );
};

