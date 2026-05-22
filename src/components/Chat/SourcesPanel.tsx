import { FileText } from 'lucide-react';
import type { SourceDocument } from '../../types/api';
import { truncateMiddle } from '../../utils/format';

interface SourcesPanelProps {
  sources?: SourceDocument[];
}

export function SourcesPanel({ sources = [] }: SourcesPanelProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <details className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-emerald-800">
        <FileText className="h-4 w-4" />
        {sources.length} fuente{sources.length === 1 ? '' : 's'} usada{sources.length === 1 ? '' : 's'}
      </summary>

      <div className="mt-3 space-y-3">
        {sources.map((source, index) => (
          <article key={`${source.source}-${index}`} className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                {truncateMiddle(source.source || `Fuente ${index + 1}`, 54)}
              </span>
              {typeof source.page === 'number' && <span>Página {source.page}</span>}
              {typeof source.relevance_score === 'number' && (
                <span>Relevancia {(source.relevance_score * 100).toFixed(0)}%</span>
              )}
            </div>
            <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-xs leading-relaxed text-slate-600">{source.content}</p>
          </article>
        ))}
      </div>
    </details>
  );
}
