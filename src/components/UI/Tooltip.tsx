interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-slate-700">
          {text}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900 dark:border-b-slate-700" />
        </div>
      </div>
    </div>
  );
}
