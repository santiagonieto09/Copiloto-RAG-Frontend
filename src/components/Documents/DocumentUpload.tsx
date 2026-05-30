import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import type { LocalDocumentRecord } from "../../types/api";
import { formatFileSize } from "../../utils/format";

interface DocumentUploadProps {
  isUploading: boolean;
  uploadProgress: number;
  onUpload: (file: File) => Promise<LocalDocumentRecord>;
  onUploadSuccess: (record: LocalDocumentRecord) => void;
}

export function DocumentUpload({
  isUploading,
  uploadProgress,
  onUpload,
  onUploadSuccess,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectFile = (file: File | null) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0] ?? null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Selecciona un archivo antes de subirlo.");
      return;
    }

    try {
      const record = await onUpload(selectedFile);
      onUploadSuccess(record);
      setSelectedFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "No se pudo subir el archivo.";
      setError(message);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <FileUp className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-950 dark:text-white">Subir documento</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">PDF, TXT o DOCX</p>
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`mt-4 cursor-pointer rounded-3xl border border-dashed p-5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
          isDragging
            ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600/50 dark:bg-emerald-900/20"
            : "border-slate-300 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/60 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-emerald-600/50 dark:hover:bg-emerald-900/20"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud className="mx-auto h-9 w-9 text-emerald-600 dark:text-emerald-400" />
        <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Arrastra un archivo o haz clic para seleccionar
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Lo prepararemos para que el asistente pueda responder usando su
          contenido.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      {isUploading && (
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full origin-left rounded-full bg-emerald-500 transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${uploadProgress / 100})` }}
            />
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {uploadProgress < 100 ? `Subiendo... ${uploadProgress}%` : "Procesando documento..."}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => void handleUpload()}
        disabled={isUploading || !selectedFile}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:disabled:bg-slate-700"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="h-4 w-4" />
        )}
        {isUploading ? "Subiendo documento..." : "Subir documento"}
      </button>
    </div>
  );
}
