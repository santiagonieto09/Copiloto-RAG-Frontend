import { useEffect, useState } from "react";
import { Archive, FileText, Trash2 } from "lucide-react";
import type { LocalDocumentRecord } from "../../types/api";
import { formatDateTime, truncateMiddle } from "../../utils/format";
import { ConfirmDialog } from "../UI/ConfirmDialog";
import { Toast } from "../UI/Toast";
import { DocumentUpload } from "./DocumentUpload";

interface DocumentsPanelProps {
  clearAllDocuments: () => Promise<void>;
  documents: LocalDocumentRecord[];
  error: string | null;
  isClearing: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadDocument: (file: File) => Promise<LocalDocumentRecord>;
}

export function DocumentsPanel({
  clearAllDocuments,
  documents,
  error,
  isClearing,
  isUploading,
  uploadProgress,
  uploadDocument,
}: DocumentsPanelProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!notificationMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotificationMessage(null);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [notificationMessage]);

  const handleClearAll = async () => {
    try {
      await clearAllDocuments();
      setNotificationMessage("Los documentos fueron eliminados correctamente.");
      setIsConfirmDialogOpen(false);
    } catch {
      setIsConfirmDialogOpen(false);
    }
  };

  const handleUploadSuccess = (record: LocalDocumentRecord) => {
    setNotificationMessage(
      `${record.filename} quedó listo para consultar en el chat.`,
    );
  };

  return (
    <div className="space-y-5">
      <Toast
        message={notificationMessage}
        onClose={() => setNotificationMessage(null)}
      />
      <ConfirmDialog
        confirmLabel="Eliminar"
        description="Se eliminarán los documentos preparados para el chat. Puedes volver a subirlos cuando quieras."
        isConfirming={isClearing}
        isOpen={isConfirmDialogOpen}
        onCancel={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleClearAll}
        title="¿Eliminar documentos?"
      />

      <DocumentUpload
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onUpload={uploadDocument}
        onUploadSuccess={handleUploadSuccess}
      />

      <section className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-slate-950 dark:text-white">Documentos</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Archivos disponibles para consultar en el chat. Esta lista se
              conserva en este navegador.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {documents.length}
          </span>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            {error}
          </p>
        )}

        {documents.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-800">
            <FileText className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-600" />
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Aún no hay documentos cargados
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sube un archivo para empezar a consultarlo en el chat.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3">
              {documents.map((document) => (
                <article
                  key={document.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {document.doc_type}
                        </span>
                        <p
                          className="truncate text-sm font-bold text-slate-800 dark:text-slate-200"
                          title={document.filename}
                        >
                          {truncateMiddle(document.filename, 38)}
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Listo para consultar ·{" "}
                        {formatDateTime(document.uploadedAt)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmDialogOpen(true)}
                disabled={isClearing}
                className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
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
