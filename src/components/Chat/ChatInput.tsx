import { FormEvent, KeyboardEvent, useState } from "react";
import { SendHorizonal, Square } from "lucide-react";

const MAX_MESSAGE_LENGTH = 2000;

interface ChatInputProps {
  disabled: boolean;
  isSending: boolean;
  onCancel: () => void;
  onSend: (message: string) => Promise<void> | void;
}

function sanitizeMessage(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

export function ChatInput({ disabled, isSending, onCancel, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const cleanValue = sanitizeMessage(value);
  const hasReachedLimit = value.length >= MAX_MESSAGE_LENGTH;

  const submit = async () => {
    const message = sanitizeMessage(value);

    if (!message || disabled) {
      return;
    }

    setValue("");
    await onSend(message);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-end gap-1.5">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Pregunta sobre tus documentos, regulaciones o análisis financiero..."
          className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm leading-5 text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-600 dark:focus:ring-emerald-500"
          disabled={disabled}
          aria-label="Mensaje"
          aria-describedby="chat-hint"
        />
        {isSending ? (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
            aria-label="Detener generación"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={disabled || !cleanValue}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
            aria-label="Enviar pregunta"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1.5 text-[11px]">
        <p id="chat-hint" className="text-slate-400 dark:text-slate-500">
          Enter para enviar · Shift + Enter para nueva línea
        </p>
        <p
          className={
            hasReachedLimit
              ? "font-semibold text-amber-600 dark:text-amber-400"
              : "text-slate-400 dark:text-slate-500"
          }
        >
          {value.length}/{MAX_MESSAGE_LENGTH}
        </p>
      </div>
    </form>
  );
}
