const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_BASE_URL = "https://api.openai.com/v1";

export const apiService = {
  transcribeAudio: async (audioBlob) => {
    if (!API_KEY || API_KEY === "sk-proj-YOUR_API_KEY_HERE") {
      throw new Error("API key não configurada. Edite o arquivo .env");
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "pt");

    const response = await fetch(`${OPENAI_BASE_URL}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na transcrição");
    }

    const data = await response.json();
    return data.text;
  },

  getChatCompletion: async (userMessage, conversationHistory = []) => {
    if (!API_KEY || API_KEY === "sk-proj-YOUR_API_KEY_HERE") {
      throw new Error("API key não configurada. Edite o arquivo .env");
    }

    const messages = [
      {
        role: "system",
        content:
          "Você é um assistente útil e amigável. Responda de forma clara e concisa em português do Brasil.",
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro ao gerar resposta");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  isConfigured: () => {
    return API_KEY && API_KEY !== "sk-proj-YOUR_API_KEY_HERE";
  },
};
