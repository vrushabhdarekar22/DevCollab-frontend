import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme(); // here u get theme using context
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-sm font-medium transition-colors duration-200 bg-white/5 hover:border-blue-500/40 hover:text-blue-100 dark:bg-white/5 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"} mode</span>
    </button>
  );
}

export default ThemeToggle;
