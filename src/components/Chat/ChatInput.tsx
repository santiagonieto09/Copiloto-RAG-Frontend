import { FormEvent, KeyboardEvent, useState } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  disabled: boolean;
  isSending: boolean;
  onSend: (message: string) => Promise<void> | void;
}

export function ChatInput({ disabled, isSending, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const cleanValue = value.trim();

    if (!cleanValue || disabled) {
      return;
    }

    setValue("");
    await onSend(cleanValue);
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
      className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
    >
      <div className="flex items-end gap-1.5">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregunta sobre tus documentos, regulaciones o análisis financiero..."
          className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-sm leading-5 text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          aria-label="Enviar pregunta"
        >
          <SendHorizonal
            className={`h-4 w-4 ${isSending ? "animate-pulse" : ""}`}
          />
        </button>
      </div>
      <p className="px-2 pt-1.5 text-[11px] text-slate-400">
        Enter para enviar · Shift + Enter para nueva línea
      </p>
    </form>
  );
}
