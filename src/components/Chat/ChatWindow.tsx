import { useEffect, useRef } from "react";
import {
  BrainCircuit,
  Database,
  Eraser,
  MessageSquarePlus,
  Sparkles,
} from "lucide-react";
import type { ChatMessage, ChatMode } from "../../types/api";
import { truncateMiddle } from "../../utils/format";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  canSend: boolean;
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="flex h-full min-h-[calc(100vh-132px)] flex-col rounded-[2rem] border border-white/80 bg-white/80 shadow-soft backdrop-blur-xl">
      <div className="border-b border-slate-200/80 px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-950">Chat inteligente</h2>
                <p className="text-xs text-slate-500">
                  Conversación: {truncateMiddle(sessionId, 36)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => onModeChange("rag")}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  mode === "rag"
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Database className="h-4 w-4" />
                Con documentos
              </button>
              <button
                type="button"
                onClick={() => onModeChange("direct")}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  mode === "direct"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <BrainCircuit className="h-4 w-4" />
                General
              </button>
            </div>

            <button
              type="button"
              onClick={onNewSession}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
            >
              <MessageSquarePlus className="h-4 w-4" />
              Nuevo chat
            </button>
            <button
              type="button"
              onClick={() => void onClearSession()}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-700"
            >
              <Eraser className="h-4 w-4" />
              Limpiar chat
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isSending && (
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              Analizando y generando respuesta...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200/80 p-4">
        <ChatInput disabled={!canSend} isSending={isSending} onSend={onSend} />
      </div>
    </div>
  );
}
