import { ChatWindow } from './components/Chat/ChatWindow';
import { DocumentsPanel } from './components/Documents/DocumentsPanel';
import { HealthStatus } from './components/HealthStatus';
import { AppShell } from './components/Layout/AppShell';
import { useChat } from './hooks/useChat';
import { useDocuments } from './hooks/useDocuments';
import { useHealth } from './hooks/useHealth';

function App() {
  const chat = useChat();
  const documents = useDocuments();
  const health = useHealth();

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
      sidebar={<DocumentsPanel {...documents} />}
    >
      <ChatWindow
        canSend={chat.canSend}
        isSending={chat.isSending}
        messages={chat.messages}
        mode={chat.mode}
        onClearSession={chat.clearCurrentSession}
        onModeChange={chat.setMode}
        onNewSession={chat.startNewSession}
        onSend={chat.sendMessage}
        sessionId={chat.sessionId}
      />
    </AppShell>
  );
}

export default App;
