import type { ChatMessage, LocalDocumentRecord } from '../types/api';

const DOCUMENTS_STORAGE_KEY = 'copiloto-rag.documents.v1';
const SESSION_STORAGE_KEY = 'copiloto-rag.session-id.v1';
const SESSION_HISTORY_KEY = 'copiloto-rag.session-history.v1';

const MAX_SESSION_HISTORY = 10;

export interface SessionHistoryEntry {
  id: string;
  preview: string;
  messages: ChatMessage[];
  messageCount: number;
  updatedAt: string;
}

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

export function getSessionHistory(): SessionHistoryEntry[] {
  try {
    const raw = localStorage.getItem(SESSION_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SessionHistoryEntry[];
  } catch {
    return [];
  }
}

function storeSessionHistory(history: SessionHistoryEntry[]): void {
  localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
}

export function saveSessionToHistory(
  sessionId: string,
  messages: ChatMessage[],
): void {
  const userMessages = messages.filter((m) => m.role === "user");
  const preview = userMessages.length > 0
    ? userMessages[0].content.slice(0, 100)
    : "Nueva conversación";

  const entry: SessionHistoryEntry = {
    id: sessionId,
    preview,
    messages,
    messageCount: messages.length,
    updatedAt: new Date().toISOString(),
  };

  const history = getSessionHistory().filter((h) => h.id !== sessionId);
  history.unshift(entry);

  storeSessionHistory(history.slice(0, MAX_SESSION_HISTORY));
}

export function removeSessionFromHistory(sessionId: string): void {
  const history = getSessionHistory().filter((h) => h.id !== sessionId);
  storeSessionHistory(history);
}
