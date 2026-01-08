// Hook será implementado na prototipação final
// Responsável por comunicação com OpenAI API

export const useOpenAI = () => {
  // TODO: A Implementar
  return {
    transcribe: async (audioBlob) => console.log("useOpenAI: transcribe"),
    complete: async (text) => console.log("useOpenAI: complete"),
    isLoading: false,
    error: null,
  };
};
