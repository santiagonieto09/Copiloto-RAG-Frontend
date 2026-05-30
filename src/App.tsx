import { useEffect, useRef } from "react";
import { ChatWindow } from "./components/Chat/ChatWindow";
import { DocumentsPanel } from "./components/Documents/DocumentsPanel";
import { HealthStatus } from "./components/HealthStatus";
import { AppShell } from "./components/Layout/AppShell";
import { ThemeProvider } from "./context/ThemeContext";
import { useChat } from "./hooks/useChat";
import { useDocuments } from "./hooks/useDocuments";
import { useHealth } from "./hooks/useHealth";

function AppContent() {
  const chat = useChat();
  const documents = useDocuments();
  const health = useHealth();
  const documentCount = documents.documents.length;
  const serverDocumentCount = health.health?.total_documents ?? 0;
  const hasDocuments = documentCount > 0 || serverDocumentCount > 0;
  const previousDocumentCountRef = useRef(documentCount);
  const { mode, setMode } = chat;

  useEffect(() => {
    const previousDocumentCount = previousDocumentCountRef.current;

    if (!hasDocuments && mode === "rag") {
      setMode("direct");
    }

    if (documentCount > previousDocumentCount) {
      setMode("rag");
    }

    previousDocumentCountRef.current = documentCount;
  }, [documentCount, hasDocuments, mode, setMode]);

  const uploadDocument = async (file: File) => {
    const record = await documents.uploadDocument(file);
    void health.refreshHealth();
    return record;
  };

  const clearAllDocuments = async () => {
    await documents.clearAllDocuments();
    void health.refreshHealth();
  };

  return (
    <AppShell
      healthStatus={
        <HealthStatus
          error={health.error}
          health={health.health}
          isLoading={health.isLoading}
          onRefresh={health.refreshHealth}
        />
      }
      sidebar={
        <DocumentsPanel
          {...documents}
          uploadProgress={documents.uploadProgress}
          clearAllDocuments={clearAllDocuments}
          uploadDocument={uploadDocument}
        />
      }
    >
      <ChatWindow
        canSend={chat.canSend}
        isSending={chat.isSending}
        messages={chat.messages}
        hasDocuments={hasDocuments}
        mode={chat.mode}
        onCancel={chat.cancel}
        onClearSession={chat.clearCurrentSession}
        onDeleteSession={chat.deleteSessionFromHistory}
        onLoadSession={chat.loadSession}
        onModeChange={chat.setMode}
        onNewSession={chat.startNewSession}
        onSend={chat.sendMessage}
        sessionHistory={chat.sessionHistory}
        sessionId={chat.sessionId}
      />
    </AppShell>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
