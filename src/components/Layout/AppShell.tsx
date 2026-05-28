import type { ReactNode } from "react";
import { useState } from "react";
import { Bot, FileText, Landmark, X } from "lucide-react";
import { ThemeToggle } from "../UI/ThemeToggle";

interface AppShellProps {
  children: ReactNode;
  healthStatus: ReactNode;
  sidebar: ReactNode;
}

export function AppShell({ children, healthStatus, sidebar }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d1fae5,_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900 dark:bg-[linear-gradient(135deg,_#0f172a_0%,_#1a1f3a_100%)] dark:text-slate-50">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                  Copiloto Financiero RAG
                </h1>
                <Bot className="hidden h-5 w-5 text-emerald-600 dark:text-emerald-400 sm:block" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                Chat con IA para consultar documentos financieros
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {healthStatus}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-emerald-900/50 dark:hover:text-emerald-400"
              aria-label="Abrir panel de documentos"
              aria-expanded={isSidebarOpen}
            >
              <FileText className="h-4 w-4" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-6">
        {isSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar panel de documentos"
          />
        )}

        <aside
          className={`${
            isSidebarOpen ? "fixed inset-y-0 left-0 z-40 block" : "hidden"
          } w-full max-w-md overflow-y-auto bg-slate-50 p-4 shadow-2xl lg:static lg:z-auto lg:order-1 lg:block lg:max-w-none lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none dark:bg-slate-950 lg:dark:bg-transparent`}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-slate-950 dark:text-white">
                Documentos
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:text-red-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:text-red-400"
              aria-label="Cerrar panel de documentos"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {sidebar}
        </aside>
        <section className="order-1 min-h-[calc(100vh-132px)] lg:order-2">
          {children}
        </section>
      </main>
    </div>
  );
}
