const API_URL = "http://localhost:3001/api/recordings";

export const storageService = {
  saveRecording: async (recordingData) => {
    const newItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...recordingData,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });

    if (!response.ok) {
      throw new Error("Erro ao salvar no banco de dados");
    }

    return newItem;
  },

  getAllRecordings: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }
    return await response.json();
  },

  deleteRecording: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar item ${id}`);
    }
    return true;
  },

  clearStore: async () => {
    const response = await fetch(API_URL, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao limpar histórico");
    }
  },
};
