import { useCallback, useEffect, useState } from "react";
import { getHealth } from "../api/client";
import type { HealthResponse } from "../types/api";

export function useHealth() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHealth = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getHealth();
      setHealth(response);
      setError(null);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "No se pudo preparar el asistente.";
      setError(message);
      setHealth(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshHealth();
    const intervalId = window.setInterval(() => {
      void refreshHealth();
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, [refreshHealth]);

  return {
    error,
    health,
    isLoading,
    refreshHealth,
  };
}
