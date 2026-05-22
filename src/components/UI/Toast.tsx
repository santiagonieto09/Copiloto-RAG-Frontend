import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-24 z-50 flex max-w-sm items-start gap-3 rounded-3xl border border-emerald-100 bg-white p-4 text-sm text-slate-700 shadow-soft dark:border-emerald-900/30 dark:bg-slate-800 dark:text-slate-200"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      <p className="flex-1 leading-6">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
