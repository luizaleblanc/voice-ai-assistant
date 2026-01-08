// Service será implementado na Phase 3/4
// Responsável por chamadas HTTP

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const apiService = {
  // TODO: Implementar na Fase 3
  transcribeAudio: async (audioBlob) => {
    console.log("apiService: transcribeAudio");
    throw new Error("Not implemented yet");
  },

  getChatCompletion: async (text) => {
    console.log("apiService: getChatCompletion");
    throw new Error("Not implemented yet");
  },
};
