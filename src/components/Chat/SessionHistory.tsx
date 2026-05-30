import { useState } from "react";
import { Clock, History, Trash2, X } from "lucide-react";
import type { SessionHistoryEntry } from "../../utils/storage";
import { formatDateTime } from "../../utils/format";

interface SessionHistoryProps {
  sessions: SessionHistoryEntry[];
  onLoad: (entry: SessionHistoryEntry) => void;
  onDelete: (id: string) => void;
}

export function SessionHistory({ sessions, onLoad, onDelete }: SessionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-900/50 dark:hover:text-emerald-400"
        aria-label="Historial de conversaciones"
        aria-expanded={isOpen}
      >
        <History className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar historial"
          />
          <div className="absolute right-0 top-full z-40 mt-2 w-80 origin-top-right rounded-3xl border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Clock className="h-4 w-4" />
                Conversaciones recientes
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                aria-label="Cerrar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {sessions.length === 0 ? (
              <p className="px-1 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                Aún no hay conversaciones guardadas
              </p>
            ) : (
              <div className="space-y-1">
                {sessions.map((entry) => (
                  <div
                    key={entry.id}
                    className="group flex items-start gap-2 rounded-2xl px-2 py-2 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onLoad(entry);
                        setIsOpen(false);
                      }}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {entry.preview}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                        {entry.messageCount} mensajes · {formatDateTime(entry.updatedAt)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(entry.id)}
                      className="mt-0.5 shrink-0 rounded-lg p-1 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      aria-label={`Eliminar conversación: ${entry.preview}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
