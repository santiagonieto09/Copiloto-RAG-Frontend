import axios, { AxiosError } from 'axios';
import type {
  ApiMessageResponse,
  ChatMode,
  ChatResponse,
  CollectionStats,
  DocumentUploadResponse,
  HealthResponse,
  IngestDirectoryResponse,
  SessionsResponse,
} from '../types/api';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000,
  headers: {
    Accept: 'application/json',
  },
});

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;

    if (axiosError.response?.data?.detail) {
      return axiosError.response.data.detail;
    }

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Revisa si el backend sigue procesando o intenta de nuevo.';
    }

    if (axiosError.message === 'Network Error') {
      return `No se pudo conectar con el backend en ${API_BASE_URL}. Verifica que FastAPI esté corriendo.`;
    }

    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
}

export async function sendChatMessage(
  question: string,
  sessionId: string | null,
  mode: ChatMode,
): Promise<ChatResponse> {
  try {
    const endpoint = mode === 'rag' ? '/api/v1/chat' : '/api/v1/chat/direct';
    const { data } = await apiClient.post<ChatResponse>(endpoint, {
      question,
      session_id: sessionId,
    });
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<DocumentUploadResponse>(
      '/api/v1/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function ingestSampleDirectory(): Promise<IngestDirectoryResponse> {
  try {
    const { data } = await apiClient.post<IngestDirectoryResponse>('/api/v1/documents/ingest-directory');
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getDocumentStats(): Promise<CollectionStats> {
  try {
    const { data } = await apiClient.get<CollectionStats>('/api/v1/documents/stats');
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function clearIndexedDocuments(): Promise<ApiMessageResponse> {
  try {
    const { data } = await apiClient.delete<ApiMessageResponse>('/api/v1/documents');
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getSessions(): Promise<SessionsResponse> {
  try {
    const { data } = await apiClient.get<SessionsResponse>('/api/v1/sessions');
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function clearSession(sessionId: string): Promise<ApiMessageResponse> {
  try {
    const { data } = await apiClient.delete<ApiMessageResponse>(`/api/v1/sessions/${sessionId}`);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data } = await apiClient.get<HealthResponse>('/api/v1/health');
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
