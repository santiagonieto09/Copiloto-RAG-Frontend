import { useEffect, useRef } from "react";
import { BookOpen, Bot, Database, FileText, Landmark, X } from "lucide-react";

interface HelpPanelProps {
  onClose: () => void;
}

export function HelpPanel({ onClose }: HelpPanelProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => dialogRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm dark:bg-slate-950/75"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-dialog-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-[2rem] border border-white/70 bg-white shadow-soft outline-none dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 px-6 pb-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 id="help-dialog-title" className="text-lg font-bold text-slate-950 dark:text-white">
                Cómo usar el Copiloto
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Consulta documentos financieros con inteligencia artificial
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-red-200 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:text-red-400"
            aria-label="Cerrar ayuda"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 pb-6">
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Modo Directo</h4>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Conversación general con el modelo de IA. Sirve para preguntas rápidas que no requieren consultar documentos.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Modo RAG</h4>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Consulta sobre documentos financieros indexados. El modelo busca en los archivos que hayas subido para darte respuestas con fuentes citadas.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Subir documentos</h4>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Sube archivos PDF, TXT o DOCX desde el panel lateral. El sistema los procesa y los indexa para que puedas consultarlos en el modo RAG.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Fuentes citadas</h4>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Cuando el modelo usa documentos en sus respuestas, puedes desplegar el panel de fuentes para ver exactamente qué fragmentos usó y de qué archivo provienen.
              </p>
            </div>
          </div>

          <p className="pt-2 text-center text-xs text-slate-400 dark:text-slate-500">
            Los documentos se almacenan localmente en tu navegador. Puedes eliminarlos cuando quieras desde el panel lateral.
          </p>
        </div>
      </section>
    </div>
  );
}
