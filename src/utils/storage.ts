import type { LocalDocumentRecord } from '../types/api';

const DOCUMENTS_STORAGE_KEY = 'copiloto-rag.documents.v1';
const SESSION_STORAGE_KEY = 'copiloto-rag.session-id.v1';

export function createId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createSessionId(): string {
  return createId('session');
}

export function getStoredSessionId(): string | null {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

export function storeSessionId(sessionId: string): void {
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
}

export function resetStoredSessionId(): string {
  const sessionId = createSessionId();
  storeSessionId(sessionId);
  return sessionId;
}

export function getStoredDocuments(): LocalDocumentRecord[] {
  const rawValue = localStorage.getItem(DOCUMENTS_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as LocalDocumentRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function storeDocuments(documents: LocalDocumentRecord[]): void {
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
}
