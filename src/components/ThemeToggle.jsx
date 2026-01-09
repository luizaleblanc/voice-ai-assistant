import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-full transition-all duration-300 focus:outline-none 
      bg-white border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:shadow-sm
      dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:border-blue-500/50"
      title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      <div className="relative w-5 h-5">
        <Sun
          size={20}
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "dark" ? "rotate-90 opacity-0 scale-0" : "rotate-0 opacity-100 scale-100"
          }`}
        />
        <Moon
          size={20}
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === "dark" ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-0"
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
