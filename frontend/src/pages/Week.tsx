import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { api } from "../api/client";
import { TaskCard, Task } from "../components/TaskCard";
import { Layout } from "../components/Layout";

dayjs.extend(isoWeek);

export const WeekPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get("/tasks");
    const all = res.data.tasks as Task[];
    const start = dayjs().startOf("week");
    const end = dayjs().endOf("week");
    const weekTasks = all.filter(
      (t) => t.dueAt && dayjs(t.dueAt).isAfter(start) && dayjs(t.dueAt).isBefore(end)
    );
    setTasks(weekTasks);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <Layout>
      <h2 className="text-sm font-semibold mb-2">This Week</h2>
      {loading && <p className="text-xs text-gray-400">Loading...</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-xs text-gray-400">No tasks planned for this week yet.</p>
      )}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Layout>
  );
};

