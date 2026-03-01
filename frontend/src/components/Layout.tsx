import React from "react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

const tabs = [
  { to: "/today", label: "Today" },
  { to: "/week", label: "Week" },
  { to: "/tasks", label: "Tasks" },
  { to: "/settings", label: "Settings" }
];

export const Layout: React.FC<{ children: React.ReactNode; onAdd?: () => void }> = ({
  children,
  onAdd
}) => {
  return (
    <div className="safe-area min-h-screen flex flex-col bg-gradient-to-b from-bg-softer via-bg-soft to-bg">
      <header className="px-4 pt-3 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">MyDay</h1>
        <p className="text-xs text-gray-400">Focus on just today.</p>
      </header>
      <main className="flex-1 overflow-y-auto px-3 pb-4">{children}</main>
      <nav className="border-t border-white/10 bg-bg-softer px-4 py-2 flex justify-between text-xs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              clsx(
                "flex-1 text-center py-1 rounded-full mx-1",
                isActive ? "bg-primary/20 text-primary font-medium" : "text-gray-400"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      {onAdd && (
        <button
          onClick={onAdd}
          className="fixed bottom-20 right-5 h-12 w-12 rounded-full bg-gradient-to-tr from-accent.pink to-accent.purple shadow-lg flex items-center justify-center text-2xl"
        >
          +
        </button>
      )}
    </div>
  );
};

