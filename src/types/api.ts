export type ChatMode = 'rag' | 'direct';

export type DocumentType = 'pdf' | 'txt' | 'docx';

export interface SourceDocument {
  content: string;
  source: string;
  page?: number | null;
  relevance_score?: number | null;
}

export interface ChatRequest {
  question: string;
  session_id?: string | null;
}

export interface ChatResponse {
  answer: string;
  sources: SourceDocument[];
  session_id: string;
  model: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SourceDocument[];
  model?: string;
  error?: boolean;
}

export interface DocumentUploadResponse {
  filename: string;
  chunks_created: number;
  doc_type: DocumentType;
  message: string;
}

export interface LocalDocumentRecord extends DocumentUploadResponse {
  id: string;
  uploadedAt: string;
}

export interface CollectionStats {
  total_documents: number;
  collection_name: string;
}

export interface IngestDirectoryResponse {
  processed_files: number;
  total_chunks_created: number;
  errors: number;
  details: Array<Record<string, unknown>>;
}

export interface SessionsResponse {
  sessions: string[];
}

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
  groq_model: string;
  embedding_model: string;
  total_documents: number;
}

export interface ApiMessageResponse {
  message: string;
}
