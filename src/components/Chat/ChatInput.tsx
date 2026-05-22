import { FormEvent, KeyboardEvent, useState } from 'react';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  disabled: boolean;
  isSending: boolean;
  onSend: (message: string) => Promise<void> | void;
}

export function ChatInput({ disabled, isSending, onSend }: ChatInputProps) {
  const [value, setValue] = useState('');

  const submit = async () => {
    const cleanValue = value.trim();

    if (!cleanValue || disabled) {
      return;
    }

    setValue('');
    await onSend(cleanValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-2 shadow-soft">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pregunta sobre tus documentos, regulaciones, compliance o análisis financiero..."
          className="max-h-36 min-h-[56px] flex-1 resize-none rounded-2xl border-0 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          aria-label="Enviar pregunta"
        >
          <SendHorizonal className={`h-5 w-5 ${isSending ? 'animate-pulse' : ''}`} />
        </button>
      </div>
      <p className="px-3 pt-2 text-[11px] text-slate-400">Enter para enviar · Shift + Enter para nueva línea</p>
    </form>
  );
}
