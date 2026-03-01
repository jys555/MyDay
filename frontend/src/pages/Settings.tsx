import React from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h2 className="text-sm font-semibold mb-3">Settings</h2>
      <div className="rounded-2xl bg-white/5 p-3 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Telegram</span>
          <span className="font-medium">
            {user?.firstName} {user?.username && `(@${user.username})`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Timezone</span>
          <span>{user?.timezone ?? "Asia/Tashkent"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Chat linked</span>
          <span>{user?.chatId ? "Yes" : "No (open /start in bot)"}</span>
        </div>
      </div>
      <p className="mt-4 text-[11px] text-gray-500">
        To receive reminders, open the MyDay bot in Telegram and press{" "}
        <span className="font-semibold">/start</span> to link your chat.
      </p>
    </Layout>
  );
};

