const DB_NAME = "VoiceAIDB";
const STORE_NAME = "recordings";
const DB_VERSION = 1;

export const storageService = {
  openDB: () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject("Erro ao abrir banco de dados");
    });
  },

  saveRecording: async (recordingData) => {
    const db = await storageService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const newItem = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...recordingData,
      };

      const request = store.add(newItem);

      request.onsuccess = () => resolve(newItem);
      request.onerror = () => reject("Erro ao salvar gravação");
    });
  },

  getAllRecordings: async () => {
    const db = await storageService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("createdAt");

      const request = index.openCursor(null, "prev");
      const results = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject("Erro ao listar gravações");
    });
  },

  deleteRecording: async (id) => {
    const db = await storageService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(`Erro ao deletar item ${id}`);
    });
  },

  clearStore: async () => {
    const db = await storageService.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject("Erro ao limpar histórico");
    });
  },
};
