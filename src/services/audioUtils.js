// Utilitários para manipulação de áudio
// Será implementado na Phase 3

export const audioUtils = {
  // TODO: Implementar na Phase 3

  blobToBase64: (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  validateAudioBlob: (blob, maxSize = 25000000) => {
    if (!blob || blob.size === 0) {
      throw new Error("Áudio vazio");
    }
    if (blob.size > maxSize) {
      throw new Error(`Áudio muito grande (máx: ${maxSize / 1000000}MB)`);
    }
    return true;
  },
};
