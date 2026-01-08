import { useState, useEffect } from "react";

export const usePermissions = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionState, setPermissionState] = useState("prompt");
  const [error, setError] = useState(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Seu navegador não suporta gravação de áudio");
      }

      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: "microphone" });
        setPermissionState(result.state);
        setHasPermission(result.state === "granted");

        result.onchange = () => {
          setPermissionState(result.state);
          setHasPermission(result.state === "granted");
        };
      }
    } catch (err) {
      console.error("Erro ao verificar permissão:", err);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setHasPermission(true);
      setPermissionState("granted");

      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (err) {
      console.error("Erro ao solicitar permissão:", err);

      setHasPermission(false);
      setPermissionState("denied");

      if (err.name === "NotAllowedError") {
        setError(
          "Permissão negada. Por favor, permita o acesso ao microfone nas configurações do navegador."
        );
      } else if (err.name === "NotFoundError") {
        setError("Nenhum microfone encontrado. Conecte um microfone e tente novamente.");
      } else if (err.name === "NotReadableError") {
        setError(
          "Microfone está sendo usado por outro aplicativo. Feche outros programas e tente novamente."
        );
      } else {
        setError(`Erro ao acessar microfone: ${err.message}`);
      }

      return false;
    }
  };

  return {
    hasPermission,
    permissionState,
    error,
    requestMicrophonePermission,
    checkPermission,
  };
};
