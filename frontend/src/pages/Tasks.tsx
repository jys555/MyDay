import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../api/client";
import { TaskCard, Task } from "../components/TaskCard";
import { Layout } from "../components/Layout";

type DraftTask = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueAt: string;
};

const emptyDraft: DraftTask = {
  title: "",
  description: "",
  priority: "medium",
  dueAt: ""
};

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<DraftTask>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await api.get("/tasks");
    setTasks(res.data.tasks as Task[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim()) return;

    const payload: any = {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      priority: draft.priority
    };
    if (draft.dueAt) {
      payload.dueAt = new Date(draft.dueAt).toISOString();
    }

    if (editingId) {
      await api.patch(`/tasks/${editingId}`, payload);
    } else {
      payload.status = "todo";
      await api.post("/tasks", payload);
    }

    setDraft(emptyDraft);
    setEditingId(null);
    await load();
  }

  async function handleToggleDone(task: Task) {
    const nextStatus = task.status === "done" ? "todo" : "done";
    await api.patch(`/tasks/${task.id}`, { status: nextStatus });
    await load();
  }

  async function handleDelete(taskId: number) {
    await api.delete(`/tasks/${taskId}`);
    await load();
  }

  async function handleAddReminder(task: Task) {
    const defaultTime = task.dueAt ? dayjs(task.dueAt).toISOString().slice(0, 16) : "";
    const value = window.prompt("Reminder time (YYYY-MM-DD HH:mm, local time):", defaultTime);
    if (!value) return;
    const parsed = dayjs(value);
    if (!parsed.isValid()) {
      window.alert("Invalid date");
      return;
    }
    await api.post("/reminders", { taskId: task.id, remindAt: parsed.toISOString() });
    window.alert("Reminder set");
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setDraft({
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      dueAt: task.dueAt ? dayjs(task.dueAt).format("YYYY-MM-DDTHH:mm") : ""
    });
  }

  const overdueCount = tasks.filter(
    (t) => t.dueAt && t.status !== "done" && dayjs(t.dueAt).isBefore(dayjs())
  ).length;

  return (
    <Layout>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">All Tasks</h2>
        {overdueCount > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200">
            Overdue: {overdueCount}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2 rounded-2xl bg-white/5 p-3">
        <input
          className="w-full rounded-xl bg-black/20 px-3 py-2 text-sm outline-none border border-white/10"
          placeholder="Task title"
          value={draft.title}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />
        <textarea
          className="w-full rounded-xl bg-black/20 px-3 py-2 text-xs outline-none border border-white/10 resize-none h-16"
          placeholder="Optional description"
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
        />
        <div className="flex gap-2 items-center">
          <select
            className="flex-1 rounded-xl bg-black/20 px-3 py-2 text-xs outline-none border border-white/10"
            value={draft.priority}
            onChange={(e) =>
              setDraft((d) => ({ ...d, priority: e.target.value as DraftTask["priority"] }))
            }
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <input
            type="datetime-local"
            className="flex-1 rounded-xl bg-black/20 px-3 py-2 text-xs outline-none border border-white/10"
            value={draft.dueAt}
            onChange={(e) => setDraft((d) => ({ ...d, dueAt: e.target.value }))}
          />
        </div>
        <button
          type="submit"
          className="w-full mt-1 rounded-xl bg-primary text-black text-sm py-2 font-medium"
        >
          {editingId ? "Save changes" : "Add task"}
        </button>
      </form>

      {loading && <p className="text-xs text-gray-400">Loading...</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-xs text-gray-400">No tasks yet. Add your first one above.</p>
      )}

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleDone={() => void handleToggleDone(task)}
          onEdit={() => startEdit(task)}
          onDelete={() => void handleDelete(task.id)}
        />
      ))}

      <p className="mt-3 text-[11px] text-gray-500">
        Tap a task to mark as done, edit details, or add a reminder.
        <br />
        Reminders send you a Telegram message at the selected time.
      </p>

      {/* Hidden action for reminder via context menu in future; for now long-press not wired */}
      {false && (
        <button onClick={() => void handleAddReminder(tasks[0])}>Add reminder (debug)</button>
      )}
    </Layout>
  );
};

