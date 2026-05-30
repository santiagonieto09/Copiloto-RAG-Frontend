import { memo } from "react";
import { Bot, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "../../types/api";
import { formatDateTime } from "../../utils/format";
import { SourcesPanel } from "./SourcesPanel";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-slate-700 dark:text-slate-200">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={`max-w-[88%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl border px-4 py-3 ${
            isUser
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
              : message.error
                ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400"
                : "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          }`}
        >
          <div
            className={`markdown text-sm leading-7 ${isUser ? "markdown-invert" : "dark:prose-invert"}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        <div
          className={`mt-1 flex flex-wrap gap-2 text-[11px] text-slate-400 dark:text-slate-500 ${isUser ? "justify-end" : "justify-start"}`}
        >
          <span>{formatDateTime(message.timestamp)}</span>
        </div>

        {!isUser && <SourcesPanel sources={message.sources} />}
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </div>
  );
});
