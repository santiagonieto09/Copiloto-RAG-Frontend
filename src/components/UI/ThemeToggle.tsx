import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { Tooltip } from "./Tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip text={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
        className="inline-flex items-center justify-center rounded-2xl p-2.5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:hover:bg-slate-700"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-slate-300 transition-colors" />
        ) : (
          <Moon className="h-5 w-5 text-slate-600 transition-colors" />
        )}
      </button>
    </Tooltip>
  );
}
