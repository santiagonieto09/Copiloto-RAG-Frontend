import axios, { AxiosError } from "axios";
import type {
  ApiMessageResponse,
  ChatMode,
  ChatResponse,
  DocumentUploadResponse,
  HealthResponse,
  SessionsResponse,
} from "../types/api";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000,
  headers: {
    Accept: "application/json",
  },
});

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      detail?: string;
      message?: string;
    }>;

    if (axiosError.response?.data?.detail) {
      return axiosError.response.data.detail;
    }

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.code === "ECONNABORTED") {
      return "La solicitud tardó demasiado. El servidor puede seguir preparando la respuesta; intenta de nuevo en unos segundos.";
    }

    if (axiosError.message === "Network Error") {
      return `No se pudo conectar con el servidor en ${API_BASE_URL}. Verifica que esté iniciado.`;
    }

    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
}

export async function sendChatMessage(
  question: string,
  sessionId: string | null,
  mode: ChatMode,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  try {
    const endpoint = mode === "rag" ? "/api/v1/chat" : "/api/v1/chat/direct";
    const { data } = await apiClient.post<ChatResponse>(endpoint, {
      question,
      session_id: sessionId,
    }, { signal });
    return data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    throw new Error(getApiErrorMessage(error));
  }
}

export async function uploadDocument(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<DocumentUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<DocumentUploadResponse>(
      "/api/v1/documents/upload",
      formData,
      {
        onUploadProgress(progressEvent) {
          if (onProgress && progressEvent.total) {
            onProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
          }
        },
      },
    );

    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function clearIndexedDocuments(): Promise<ApiMessageResponse> {
  try {
    const { data } =
      await apiClient.delete<ApiMessageResponse>("/api/v1/documents");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getSessions(): Promise<SessionsResponse> {
  try {
    const { data } = await apiClient.get<SessionsResponse>("/api/v1/sessions");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function clearSession(
  sessionId: string,
): Promise<ApiMessageResponse> {
  try {
    const { data } = await apiClient.delete<ApiMessageResponse>(
      `/api/v1/sessions/${sessionId}`,
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data } = await apiClient.get<HealthResponse>("/api/v1/health");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
