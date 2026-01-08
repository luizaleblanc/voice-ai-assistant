import { useState, useCallback } from "react";
import { apiService } from "../services/apiService";

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const transcribe = useCallback(async (audioBlob) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!audioBlob) {
        throw new Error("Áudio não fornecido para transcrição.");
      }

      const text = await apiService.transcribeAudio(audioBlob);
      return text;
    } catch (err) {
      console.error("Erro no hook useOpenAI (transcribe):", err);
      const errorMessage = err.message || "Falha ao transcrever áudio.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const complete = useCallback(async (userMessage, conversationHistory = []) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!userMessage) {
        throw new Error("Mensagem vazia.");
      }

      const response = await apiService.getChatCompletion(userMessage, conversationHistory);
      return response;
    } catch (err) {
      console.error("Erro no hook useOpenAI (complete):", err);
      const errorMessage = err.message || "Falha ao obter resposta da IA.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transcribe,
    complete,
    isLoading,
    error,
  };
};
