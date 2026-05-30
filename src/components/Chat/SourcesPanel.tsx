import { memo, useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import type { SourceDocument } from '../../types/api';
import { truncateMiddle } from '../../utils/format';

interface SourcesPanelProps {
  sources?: SourceDocument[];
}

const CONTENT_CHAR_THRESHOLD = 200;

const SourceCard = memo(function SourceCard({ source, index }: { source: SourceDocument; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = source.content.length > CONTENT_CHAR_THRESHOLD;

  return (
    <article className="rounded-xl border border-emerald-100 bg-white p-3 shadow-sm dark:border-emerald-900/30 dark:bg-slate-800">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
          {truncateMiddle(source.source || `Fuente ${index + 1}`, 54)}
        </span>
        {typeof source.page === 'number' && <span>Página {source.page}</span>}
        {typeof source.relevance_score === 'number' && (
          <span>Relevancia {(source.relevance_score * 100).toFixed(0)}%</span>
        )}
      </div>
      <div className={`mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-600 dark:text-slate-400 ${!isExpanded && isLong ? 'line-clamp-5' : ''}`}>
        {source.content}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {isExpanded ? (
            <>Ver menos <ChevronUp className="h-3.5 w-3.5" /></>
          ) : (
            <>Ver más <ChevronDown className="h-3.5 w-3.5" /></>
          )}
        </button>
      )}
    </article>
  );
});

export function SourcesPanel({ sources = [] }: SourcesPanelProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <details className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-sm dark:border-emerald-900/30 dark:bg-emerald-900/20">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-400">
        <FileText className="h-4 w-4" />
        {sources.length} fuente{sources.length === 1 ? '' : 's'} usada{sources.length === 1 ? '' : 's'}
      </summary>

      <div className="mt-3 space-y-3">
        {sources.map((source, index) => (
          <SourceCard key={`source-${index}`} source={source} index={index} />
        ))}
      </div>
    </details>
  );
}
