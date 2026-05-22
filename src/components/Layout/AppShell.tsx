import type { ReactNode } from "react";
import { Bot, Landmark } from "lucide-react";
import { ThemeToggle } from "../UI/ThemeToggle";

interface AppShellProps {
  children: ReactNode;
  healthStatus: ReactNode;
  sidebar: ReactNode;
}

export function AppShell({ children, healthStatus, sidebar }: AppShellProps) {
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
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-6">
        <aside className="order-2 space-y-5 lg:order-1">{sidebar}</aside>
        <section className="order-1 min-h-[calc(100vh-132px)] lg:order-2">
          {children}
        </section>
      </main>
    </div>
  );
}
