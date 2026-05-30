import { useState } from "react";
import { BookOpen, Clock, Eraser, MessageSquarePlus, MoreVertical, Trash2 } from "lucide-react";
import type { SessionHistoryEntry } from "../../utils/storage";
import { formatDateTime } from "../../utils/format";

interface OverflowMenuProps {
  isSending: boolean;
  sessionHistory: SessionHistoryEntry[];
  onClearSession: () => Promise<void> | void;
  onDeleteSession: (id: string) => void;
  onHelpOpen: () => void;
  onLoadSession: (entry: SessionHistoryEntry) => void;
  onNewSession: () => void;
}

export function OverflowMenu({
  isSending,
  sessionHistory,
  onClearSession,
  onDeleteSession,
  onHelpOpen,
  onLoadSession,
  onNewSession,
}: OverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[44px] w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-900/50 dark:hover:text-emerald-400"
        aria-label="Más opciones"
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30"
            onClick={close}
            aria-label="Cerrar menú"
          />
          <div role="menu" className="absolute right-0 top-full z-40 mt-2 min-w-[280px] max-w-[90vw] origin-top-right rounded-3xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                onNewSession();
                close();
              }}
              disabled={isSending}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <MessageSquarePlus className="h-4 w-4" />
              Nuevo chat
            </button>

            <button
              role="menuitem"
              type="button"
              onClick={() => {
                void onClearSession();
                close();
              }}
              disabled={isSending}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Eraser className="h-4 w-4" />
              Limpiar chat
            </button>

            {sessionHistory.length > 0 && (
              <>
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <div className="px-3 py-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    Conversaciones recientes
                  </div>
                </div>
                <div className="max-h-48 space-y-0.5 overflow-y-auto">
                  {sessionHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="group flex items-start gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <button
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          onLoadSession(entry);
                          close();
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(entry.id);
                      }}
                      className="mt-0.5 shrink-0 rounded-lg p-1 text-slate-400 opacity-0 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      aria-label={`Eliminar conversación: ${entry.preview}`}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                onHelpOpen();
                close();
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <BookOpen className="h-4 w-4" />
              Ayuda
            </button>
          </div>
        </>
      )}
    </div>
  );
}
