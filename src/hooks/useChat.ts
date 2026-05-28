import { useCallback, useMemo, useRef, useState } from "react";
import { clearSession, sendChatMessage } from "../api/client";
import type { ChatMessage, ChatMode } from "../types/api";
import {
  createId,
  getStoredSessionId,
  resetStoredSessionId,
  storeSessionId,
} from "../utils/storage";

function createWelcomeMessage(): ChatMessage {
  return {
    id: createId("message"),
    role: "assistant",
    content:
      "Hola, soy tu copiloto financiero. Puedes preguntarme sobre regulaciones, auditoría, riesgos, productos financieros o documentos que hayas cargado.",
    timestamp: new Date().toISOString(),
  };
}

export function useChat() {
  const [sessionId, setSessionId] = useState(() => {
    const storedSessionId = getStoredSessionId();
    if (storedSessionId) {
      return storedSessionId;
    }

    return resetStoredSessionId();
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(),
  ]);
  const [mode, setMode] = useState<ChatMode>("direct");
  const [isSending, setIsSending] = useState(false);
  const requestVersionRef = useRef(0);

  const canSend = useMemo(() => !isSending, [isSending]);

  const sendMessage = useCallback(
    async (question: string) => {
      const cleanQuestion = question.trim();

      if (!cleanQuestion || isSending) {
        return;
      }

      const userMessage: ChatMessage = {
        id: createId("message"),
        role: "user",
        content: cleanQuestion,
        timestamp: new Date().toISOString(),
      };

      setMessages((currentMessages) => [...currentMessages, userMessage]);
      setIsSending(true);
      const requestVersion = requestVersionRef.current;

      try {
        const response = await sendChatMessage(cleanQuestion, sessionId, mode);

        if (requestVersionRef.current !== requestVersion) {
          return;
        }

        storeSessionId(response.session_id);
        setSessionId(response.session_id);

        const assistantMessage: ChatMessage = {
          id: createId("message"),
          role: "assistant",
          content: response.answer,
          sources: response.sources,
          model: response.model,
          timestamp: response.timestamp,
        };

        setMessages((currentMessages) => [
          ...currentMessages,
          assistantMessage,
        ]);
      } catch (error) {
        if (requestVersionRef.current !== requestVersion) {
          return;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "No fue posible obtener respuesta del asistente.";

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: createId("message"),
            role: "assistant",
            content: errorMessage,
            timestamp: new Date().toISOString(),
            error: true,
          },
        ]);
      } finally {
        if (requestVersionRef.current === requestVersion) {
          setIsSending(false);
        }
      }
    },
    [isSending, mode, sessionId],
  );

  const startNewSession = useCallback(() => {
    requestVersionRef.current += 1;
    const nextSessionId = resetStoredSessionId();
    setSessionId(nextSessionId);
    setMessages([createWelcomeMessage()]);
    setIsSending(false);
  }, []);

  const clearCurrentSession = useCallback(async () => {
    try {
      await clearSession(sessionId);
    } catch {
      // Si el servidor no encuentra la conversación, igual limpiamos la vista local.
    } finally {
      startNewSession();
    }
  }, [sessionId, startNewSession]);

  return {
    canSend,
    clearCurrentSession,
    isSending,
    messages,
    mode,
    sendMessage,
    sessionId,
    setMode,
    startNewSession,
  };
}
