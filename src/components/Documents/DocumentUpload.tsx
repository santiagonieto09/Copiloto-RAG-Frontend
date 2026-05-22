import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { FileUp, Loader2, UploadCloud } from "lucide-react";
import type { LocalDocumentRecord } from "../../types/api";
import { formatFileSize } from "../../utils/format";

interface DocumentUploadProps {
  isUploading: boolean;
  onUpload: (file: File) => Promise<LocalDocumentRecord>;
  onUploadSuccess: (record: LocalDocumentRecord) => void;
}

export function DocumentUpload({
  isUploading,
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
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <FileUp className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-950">Subir documento</p>
          <p className="text-xs text-slate-500">PDF, TXT o DOCX</p>
        </div>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-4 cursor-pointer rounded-3xl border border-dashed p-5 text-center transition ${
          isDragging
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-300 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/60"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud className="mx-auto h-9 w-9 text-emerald-600" />
        <p className="mt-2 text-sm font-semibold text-slate-800">
          Arrastra un archivo o haz clic para seleccionar
        </p>
        <p className="mt-1 text-xs text-slate-500">
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
        <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">{selectedFile.name}</p>
          <p className="text-xs text-slate-500">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={() => void handleUpload()}
        disabled={isUploading || !selectedFile}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="h-4 w-4" />
        )}
        {isUploading ? "Preparando documento..." : "Subir documento"}
      </button>
    </div>
  );
}
