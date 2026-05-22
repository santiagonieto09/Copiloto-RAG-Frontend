import { Archive, FileText, Trash2 } from "lucide-react";
import type { LocalDocumentRecord } from "../../types/api";
import { formatDateTime, truncateMiddle } from "../../utils/format";
import { DocumentUpload } from "./DocumentUpload";

interface DocumentsPanelProps {
  clearAllDocuments: () => Promise<void>;
  documents: LocalDocumentRecord[];
  error: string | null;
  isClearing: boolean;
  isUploading: boolean;
  removeLocalDocument: (documentId: string) => void;
  uploadDocument: (file: File) => Promise<LocalDocumentRecord>;
}

export function DocumentsPanel({
  clearAllDocuments,
  documents,
  error,
  isClearing,
  isUploading,
  removeLocalDocument,
  uploadDocument,
}: DocumentsPanelProps) {
  const handleClearAll = async () => {
    const shouldClear = window.confirm(
      "Esto eliminará los documentos preparados para el chat y limpiará esta lista. ¿Continuar?",
    );

    if (shouldClear) {
      await clearAllDocuments();
    }
  };

  return (
    <div className="space-y-5">
      <DocumentUpload isUploading={isUploading} onUpload={uploadDocument} />

      <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-emerald-600" />
              <h2 className="font-bold text-slate-950">Documentos</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Archivos disponibles para consultar en el chat. Esta lista se
              conserva en este navegador.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            {documents.length}
          </span>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
            {error}
          </p>
        )}

        {documents.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Aún no hay documentos cargados
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Sube un archivo para empezar a consultarlo en el chat.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {documents.map((document) => (
                <article
                  key={document.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          {document.doc_type}
                        </span>
                        <p
                          className="truncate text-sm font-bold text-slate-800"
                          title={document.filename}
                        >
                          {truncateMiddle(document.filename, 38)}
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Listo para consultar ·{" "}
                        {formatDateTime(document.uploadedAt)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLocalDocument(document.id)}
                      className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      title="Quitar de la lista visible"
                      aria-label={`Quitar ${document.filename} de la lista visible`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => void handleClearAll()}
                disabled={isClearing}
                className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {isClearing
                  ? "Eliminando documentos..."
                  : "Eliminar documentos"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
