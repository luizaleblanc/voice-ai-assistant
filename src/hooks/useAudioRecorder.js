import { useState, useRef, useCallback } from "react";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = useCallback(async () => {
    console.log("=== INICIO DO PROCESSO DE GRAVACAO ===");
    console.log("Timestamp:", new Date().toISOString());

    try {
      console.log("STEP 1: Resetando estados");
      setError(null);
      setAudioBlob(null);
      chunksRef.current = [];
      setRecordingTime(0);

      console.log("STEP 2: Verificando suporte do navegador");
      if (!navigator.mediaDevices) {
        throw new Error("navigator.mediaDevices nao existe");
      }
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia nao esta disponivel");
      }

      console.log("STEP 3: Solicitando acesso ao microfone");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      console.log("STEP 4: Detectando MIME type suportado");
      let mimeType = "audio/webm";
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];

      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log("MIME type selecionado:", type);
          break;
        }
      }

      console.log("STEP 5: Criando MediaRecorder");
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      console.log("STEP 6: Configurando event listeners");

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log("Chunk adicionado. Total de chunks:", chunksRef.current.length);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("=== GRAVACAO PARADA ===");

        if (chunksRef.current.length === 0) {
          console.error("ERRO: Nenhum chunk foi coletado!");
          setError("Nenhum áudio foi capturado"); // Corrigido
          return;
        }

        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("ERRO no MediaRecorder:", event.error);
        setError(`Erro na gravação: ${event.error.message}`); // Corrigido
      };

      console.log("STEP 7: Iniciando gravacao");
      mediaRecorder.start(1000);

      console.log("STEP 8: Atualizando estado React para isRecording=true");
      setIsRecording(true);

      console.log("STEP 9: Iniciando timer");
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("=== ERRO AO INICIAR GRAVACAO ===");
      let userMessage = `Erro: ${err.message}`;

      if (err.name === "NotAllowedError") {
        userMessage = "Permissão negada. Autorize o microfone nas configurações do navegador."; // Corrigido
      } else if (err.name === "NotFoundError") {
        userMessage = "Nenhum microfone encontrado. Conecte um microfone.";
      } else if (err.name === "NotReadableError") {
        userMessage = "Microfone em uso por outro aplicativo.";
      }

      setError(userMessage);
      setIsRecording(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log("=== PARANDO GRAVACAO ===");
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
  }, []);

  return {
    startRecording,
    stopRecording,
    clearRecording,
    audioBlob,
    isRecording,
    error,
    recordingTime,
  };
};
