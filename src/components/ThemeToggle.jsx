import React from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 border ${
        isDark
          ? "bg-transparent border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-400"
          : "bg-transparent border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-600"
      }`}
      aria-label="Alternar tema"
    >
      {isDark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
    </button>
  );
};

export default ThemeToggle;
