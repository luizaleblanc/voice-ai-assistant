import { useState, useCallback, useEffect } from "react";
import { storageService } from "../services/storageService";

export const useRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshRecordings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storageService.getAllRecordings();
      setRecordings(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refreshRecordings();
  }, [refreshRecordings]);

  const saveRecording = async (data) => {
    try {
      const newRec = await storageService.saveRecording(data);
      setRecordings((prev) => [newRec, ...prev]);
      return newRec;
    } catch (err) {
      setError("Falha ao salvar");
      throw err;
    }
  };

  const deleteRecording = async (id) => {
    try {
      await storageService.deleteRecording(id);
      setRecordings((prev) => prev.filter((rec) => rec.id !== id));
    } catch (err) {
      setError("Falha ao remover");
    }
  };

  const clearAllRecordings = useCallback(async () => {
    try {
      setRecordings([]);
      await refreshRecordings();
    } catch (err) {
      setError(err.message);
    }
  }, [refreshRecordings]);

  return {
    recordings,
    loading,
    error,
    saveRecording,
    deleteRecording,
    refreshRecordings,
    clearAllRecordings,
  };
};
