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
    const res = await api.get("/tasks");
    const all = res.data.tasks as Task[];
    const today = all.filter((t) => t.dueAt && dayjs(t.dueAt).isSame(dayjs(), "day"));
    setTasks(today);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <Layout>
      <h2 className="text-sm font-semibold mb-2">Today</h2>
      {loading && <p className="text-xs text-gray-400">Loading...</p>}
      {!loading && tasks.length === 0 && (
        <p className="text-xs text-gray-400">No tasks scheduled for today yet.</p>
      )}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Layout>
  );
};

