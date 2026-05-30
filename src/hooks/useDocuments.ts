import { useCallback, useState } from "react";
import {
  clearIndexedDocuments,
  uploadDocument as uploadDocumentApi,
} from "../api/client";
import type { DocumentType, LocalDocumentRecord } from "../types/api";
import { createId, getStoredDocuments, storeDocuments } from "../utils/storage";

const ALLOWED_EXTENSIONS = ["pdf", "txt", "docx"] as const;

type DocumentsUpdate =
  | LocalDocumentRecord[]
  | ((currentDocuments: LocalDocumentRecord[]) => LocalDocumentRecord[]);

function getDocumentTypeFromFile(file: File): DocumentType | null {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension) {
    return null;
  }

  return ALLOWED_EXTENSIONS.includes(extension as DocumentType)
    ? (extension as DocumentType)
    : null;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<LocalDocumentRecord[]>(() =>
    getStoredDocuments(),
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistDocuments = useCallback(
    (update: DocumentsUpdate) => {
      setDocuments((currentDocuments) => {
        const nextDocuments =
          typeof update === "function" ? update(currentDocuments) : update;

        storeDocuments(nextDocuments);
        return nextDocuments;
      });
    },
    [],
  );

  const uploadDocument = useCallback(
    async (file: File) => {
      const docType = getDocumentTypeFromFile(file);

      if (!docType) {
        throw new Error("Formato no soportado. Sube archivos PDF, TXT o DOCX.");
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const response = await uploadDocumentApi(file, setUploadProgress);
        const record: LocalDocumentRecord = {
          ...response,
          id: createId("document"),
          uploadedAt: new Date().toISOString(),
        };
        persistDocuments((currentDocuments) => [record, ...currentDocuments]);
        return record;
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "No se pudo subir el documento.";
        setError(message);
        throw new Error(message);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [persistDocuments],
  );

  const clearAllDocuments = useCallback(async () => {
    setIsClearing(true);
    setError(null);

    try {
      await clearIndexedDocuments();
      persistDocuments([]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron eliminar los documentos.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsClearing(false);
    }
  }, [persistDocuments]);

  return {
    clearAllDocuments,
    documents,
    error,
    isClearing,
    isUploading,
    uploadProgress,
    uploadDocument,
  };
}
