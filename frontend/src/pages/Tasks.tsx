import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../api/client";
import { TaskCard, Task } from "../components/TaskCard";
import { Layout } from "../components/Layout";

type DraftTask = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  kind: "regular" | "one_time";
  repeatDays: string[];
  timeOfDay: "anytime" | "morning" | "afternoon" | "evening";
  goalType: "off" | "duration" | "repeat";
  goalMinutes: string;
  goalReps: string;
  icon: string;
  color: string;
  dueAt: string;
};

const emptyDraft: DraftTask = {
  title: "",
  description: "",
  priority: "medium",
  kind: "regular",
  repeatDays: [],
  timeOfDay: "anytime",
  goalType: "off",
  goalMinutes: "",
  goalReps: "",
  icon: "🙂",
  color: "#38bdf8",
  dueAt: ""
};

const weekdayOptions = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" }
];

const icons = ["🙂", "💪", "📚", "💧", "🧠", "🏃‍♂️"];
const colors = ["#38bdf8", "#22c55e", "#eab308", "#f97316", "#ec4899", "#a855f7"];

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
      priority: draft.priority,
      kind: draft.kind,
      repeatDays: draft.kind === "regular" ? draft.repeatDays : [],
      timeOfDay: draft.timeOfDay,
      goalType: draft.goalType,
      goalMinutes:
        draft.goalType === "duration" && draft.goalMinutes
          ? Number(draft.goalMinutes)
          : null,
      goalReps:
        draft.goalType === "repeat" && draft.goalReps ? Number(draft.goalReps) : null,
      icon: draft.icon,
      color: draft.color
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
      kind: (task.kind as any) ?? "regular",
      repeatDays: (task as any).repeatDays ?? [],
      timeOfDay: (task.timeOfDay as any) ?? "anytime",
      goalType: (task.goalType as any) ?? "off",
      goalMinutes: task.goalMinutes ? String(task.goalMinutes) : "",
      goalReps: task.goalReps ? String(task.goalReps) : "",
      icon: task.icon ?? "🙂",
      color: task.color ?? "#38bdf8",
      dueAt: task.dueAt ? dayjs(task.dueAt).format("YYYY-MM-DDTHH:mm") : ""
    });
  }

  const overdueCount = tasks.filter(
    (t) => t.dueAt && t.status !== "done" && dayjs(t.dueAt).isBefore(dayjs())
  ).length;

  return (
    <Layout>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Habits & Tasks</h2>
        {overdueCount > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-200">
            Overdue: {overdueCount}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-4 space-y-3 rounded-2xl bg-white/5 p-3">
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
        <div className="flex gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, kind: "regular" }))}
            className={`flex-1 py-1.5 rounded-xl border ${
              draft.kind === "regular"
                ? "bg-primary text-black border-primary"
                : "border-white/10 text-gray-300"
            }`}
          >
            Regular habit
          </button>
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, kind: "one_time" }))}
            className={`flex-1 py-1.5 rounded-xl border ${
              draft.kind === "one_time"
                ? "bg-primary text-black border-primary"
                : "border-white/10 text-gray-300"
            }`}
          >
            One-time task
          </button>
        </div>

        {draft.kind === "regular" && (
          <>
            <div className="mt-1">
              <p className="text-[11px] text-gray-300 mb-1">Habit days</p>
              <div className="flex flex-wrap gap-1">
                {weekdayOptions.map((d) => {
                  const active = draft.repeatDays.includes(d.key);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          repeatDays: active
                            ? prev.repeatDays.filter((k) => k !== d.key)
                            : [...prev.repeatDays, d.key]
                        }))
                      }
                      className={`px-2 py-1 rounded-full text-[11px] ${
                        active ? "bg-white text-black" : "bg-black/30 text-gray-300"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-2">
              <p className="text-[11px] text-gray-300 mb-1">Do it at</p>
              <div className="flex rounded-full bg-black/30 p-1 text-[11px]">
                {["anytime", "morning", "afternoon", "evening"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({ ...d, timeOfDay: key as DraftTask["timeOfDay"] }))
                    }
                    className={`flex-1 py-1 rounded-full capitalize ${
                      draft.timeOfDay === key
                        ? "bg-white text-black font-semibold"
                        : "text-gray-300"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <p className="text-[11px] text-gray-300 mb-1">Daily goal</p>
              <div className="flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, goalType: "off" }))}
                  className={`flex-1 py-1.5 rounded-xl border ${
                    draft.goalType === "off"
                      ? "bg-primary text-black border-primary"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  Off
                </button>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, goalType: "duration" }))}
                  className={`flex-1 py-1.5 rounded-xl border ${
                    draft.goalType === "duration"
                      ? "bg-primary text-black border-primary"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  Duration
                </button>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, goalType: "repeat" }))}
                  className={`flex-1 py-1.5 rounded-xl border ${
                    draft.goalType === "repeat"
                      ? "bg-primary text-black border-primary"
                      : "border-white/10 text-gray-300"
                  }`}
                >
                  Repeat
                </button>
              </div>

              {draft.goalType === "duration" && (
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="text-gray-300 w-14">Minutes</span>
                  <input
                    type="number"
                    min={1}
                    className="flex-1 rounded-xl bg-black/30 px-3 py-1.5 border border-white/10 text-xs"
                    value={draft.goalMinutes}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, goalMinutes: e.target.value }))
                    }
                  />
                </div>
              )}

              {draft.goalType === "repeat" && (
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="text-gray-300 w-14">Reps</span>
                  <input
                    type="number"
                    min={1}
                    className="flex-1 rounded-xl bg-black/30 px-3 py-1.5 border border-white/10 text-xs"
                    value={draft.goalReps}
                    onChange={(e) => setDraft((d) => ({ ...d, goalReps: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex gap-2 items-center mt-1">
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

        <div className="flex items-center justify-between gap-2 text-[11px]">
          <div>
            <p className="text-gray-300 mb-1">Icon</p>
            <div className="flex gap-1">
              {icons.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, icon: ic }))}
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-lg ${
                    draft.icon === ic ? "bg-white text-black" : "bg-black/30"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-300 mb-1">Color</p>
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, color: c }))}
                  className={`h-6 w-6 rounded-full border ${
                    draft.color === c ? "border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
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

