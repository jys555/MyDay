import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { TodayPage } from "./pages/Today";
import { WeekPage } from "./pages/Week";
import { TasksPage } from "./pages/Tasks";
import { SettingsPage } from "./pages/Settings";

const AppRoutes: React.FC = () => {
  const { loading, error } = useAuth();

  if (loading) {
    return (
      <div className="safe-area min-h-screen flex items-center justify-center bg-bg text-gray-300">
        <p className="text-sm">Connecting to Telegram...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="safe-area min-h-screen flex items-center justify-center bg-bg text-red-300 px-4 text-center text-sm">
        {error}
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route path="/today" element={<TodayPage />} />
      <Route path="/week" element={<WeekPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

