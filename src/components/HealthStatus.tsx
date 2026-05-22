import { Activity, AlertTriangle, RefreshCw } from "lucide-react";
import type { HealthResponse } from "../types/api";

interface HealthStatusProps {
  error: string | null;
  health: HealthResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function HealthStatus({
  error,
  health,
  isLoading,
  onRefresh,
}: HealthStatusProps) {
  const isReady = health?.status === "healthy";
  const title =
    isLoading && !health
      ? "Cargando servidor"
      : isReady
        ? "Asistente listo"
        : "Preparando asistente";
  const subtitle = isReady
    ? "Modelo listo para responder"
    : error || "Revisando conexión...";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          isReady
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        }`}
      >
        {isReady ? (
          <Activity className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        )}
      </div>

      <div className="hidden min-w-0 text-sm sm:block">
        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        disabled={isLoading}
        aria-label="Actualizar estado del asistente"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}
