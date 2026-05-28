import { useEffect, useRef } from "react";
import { Bot, Database, Eraser, MessageSquarePlus, Sparkles } from "lucide-react";
import type { ChatMessage, ChatMode } from "../../types/api";
import { truncateMiddle } from "../../utils/format";
import { Tooltip } from "../UI/Tooltip";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  canSend: boolean;
  hasDocuments: boolean;
  isSending: boolean;
  messages: ChatMessage[];
  mode: ChatMode;
  onClearSession: () => Promise<void> | void;
  onModeChange: (mode: ChatMode) => void;
  onNewSession: () => void;
  onSend: (message: string) => Promise<void> | void;
  sessionId: string;
}

export function ChatWindow({
  canSend,
  hasDocuments,
  isSending,
  messages,
  mode,
  onClearSession,
  onModeChange,
  onNewSession,
  onSend,
  sessionId,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isUsingDocuments = hasDocuments && mode === "rag";
  const documentsTooltip = isSending
    ? "Espera a que termine la respuesta"
    : !hasDocuments
    ? "Sube un documento para activar esta opción"
    : isUsingDocuments
      ? "Desactivar uso de documentos"
      : "Activar uso de documentos";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="flex h-full min-h-[calc(100svh-92px)] flex-col rounded-2xl border border-white/80 bg-white/80 shadow-soft backdrop-blur-xl sm:min-h-[calc(100vh-132px)] sm:rounded-[2rem] dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-soft">
      <div className="border-b border-slate-200/80 px-3 py-3 sm:px-5 sm:py-4 dark:border-slate-700">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-950 dark:text-white">Chat inteligente</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Conversación: {truncateMiddle(sessionId, 36)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2">
            <Tooltip text={documentsTooltip}>
              <button
                type="button"
                role="switch"
                aria-checked={isUsingDocuments}
                aria-disabled={!hasDocuments || isSending}
                aria-label={documentsTooltip}
                onClick={() => {
                  if (!hasDocuments || isSending) {
                    return;
                  }
                  onModeChange(isUsingDocuments ? "direct" : "rag");
                }}
                className={`flex h-9 items-center gap-2 rounded-xl border px-2.5 text-xs font-semibold transition ${
                  isUsingDocuments
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : hasDocuments && !isSending
                      ? "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
                      : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600"
                }`}
              >
                <Database className="h-4 w-4" />
                <span
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                    isUsingDocuments ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      isUsingDocuments ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            </Tooltip>

            <Tooltip text="Nuevo chat">
              <button
                type="button"
                onClick={onNewSession}
                disabled={isSending}
                aria-label="Nuevo chat"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-900/50 dark:hover:text-emerald-400"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </button>
            </Tooltip>

            <Tooltip text="Limpiar chat">
              <button
                type="button"
                onClick={() => void onClearSession()}
                disabled={isSending}
                aria-label="Limpiar chat"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:text-red-400"
              >
                <Eraser className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4 sm:space-y-5 sm:px-5 sm:py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isSending && (
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-slate-700 dark:text-slate-200">
              <Bot className="h-4 w-4" />
            </div>
            <div
              className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              aria-label="El bot está escribiendo"
              role="status"
            >
              {[0, 120, 240].map((delay) => (
                <span
                  key={delay}
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-300"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200/80 p-3 sm:p-4 dark:border-slate-700">
        <ChatInput disabled={!canSend} isSending={isSending} onSend={onSend} />
      </div>
    </div>
  );
}
