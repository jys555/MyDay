import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../api/client";
import { TaskCard, Task } from "../components/TaskCard";
import { Layout } from "../components/Layout";

export const TodayPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      const all = res.data.tasks as Task[];
      const today = all.filter((t) => t.dueAt && dayjs(t.dueAt).isSame(dayjs(), "day"));
      setTasks(today);
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

  const overdueCount = tasks.filter(
    (t) => t.dueAt && t.status !== "done" && dayjs(t.dueAt).isBefore(dayjs())
  ).length;

  return (
    <Layout>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Today</h2>
        {overdueCount > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200">
            {overdueCount} overdue
          </span>
        )}
      </div>
      {loading && <p className="text-xs text-gray-400">Loading...</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-xs text-gray-400">No tasks scheduled for today yet.</p>
      )}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleDone={() => void handleToggleDone(task)}
          onDelete={() => void handleDelete(task.id)}
        />
      ))}
    </Layout>
  );
};

