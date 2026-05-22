import { Bot, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types/api";
import { formatDateTime } from "../../utils/format";
import { SourcesPanel } from "./SourcesPanel";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={`max-w-[88%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-3xl px-4 py-3 shadow-sm ${
            isUser
              ? "rounded-br-md bg-slate-950 text-white"
              : message.error
                ? "rounded-bl-md border border-red-200 bg-red-50 text-red-800"
                : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
          }`}
        >
          <div
            className={`markdown text-sm leading-7 ${isUser ? "markdown-invert" : ""}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        <div
          className={`mt-1 flex flex-wrap gap-2 text-[11px] text-slate-400 ${isUser ? "justify-end" : "justify-start"}`}
        >
          <span>{formatDateTime(message.timestamp)}</span>
        </div>

        {!isUser && <SourcesPanel sources={message.sources} />}
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
