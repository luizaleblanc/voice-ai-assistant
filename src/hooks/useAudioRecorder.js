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
      console.log("Estados resetados com sucesso");

      console.log("STEP 2: Verificando suporte do navegador");
      if (!navigator.mediaDevices) {
        throw new Error("navigator.mediaDevices nao existe");
      }
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia nao esta disponivel");
      }
      console.log("Navegador suporta MediaDevices");

      console.log("STEP 3: Solicitando acesso ao microfone");
      console.log("Chamando getUserMedia...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("SUCESSO: Stream obtido");
      console.log("Stream ID:", stream.id);
      console.log("Audio tracks:", stream.getAudioTracks().length);
      stream.getAudioTracks().forEach((track, index) => {
        console.log(`Track ${index}:`, {
          id: track.id,
          kind: track.kind,
          label: track.label,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
        });
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

      console.log("MediaRecorder criado:", {
        state: mediaRecorder.state,
        mimeType: mediaRecorder.mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      console.log("STEP 6: Configurando event listeners");

      mediaRecorder.ondataavailable = (event) => {
        console.log("Evento ondataavailable:", {
          size: event.data.size,
          type: event.data.type,
        });
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log("Chunk adicionado. Total de chunks:", chunksRef.current.length);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("=== GRAVACAO PARADA ===");
        console.log("Total de chunks coletados:", chunksRef.current.length);

        if (chunksRef.current.length === 0) {
          console.error("ERRO: Nenhum chunk foi coletado!");
          setError("Nenhum audio foi capturado");
          return;
        }

        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log("Blob criado:", {
          size: blob.size,
          type: blob.type,
        });

        setAudioBlob(blob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            console.log("Parando track:", track.id);
            track.stop();
          });
          streamRef.current = null;
        }

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("ERRO no MediaRecorder:", event.error);
        setError(`Erro na gravacao: ${event.error.message}`);
      };

      mediaRecorder.onstart = () => {
        console.log("Evento onstart disparado");
      };

      console.log("STEP 7: Iniciando gravacao");
      mediaRecorder.start(1000);
      console.log("mediaRecorder.start() chamado");
      console.log("Estado apos start:", mediaRecorder.state);

      console.log("STEP 8: Atualizando estado React para isRecording=true");
      setIsRecording(true);

      console.log("STEP 9: Iniciando timer");
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          console.log("Timer tick:", newTime);
          return newTime;
        });
      }, 1000);

      console.log("=== GRAVACAO INICIADA COM SUCESSO ===");
    } catch (err) {
      console.error("=== ERRO AO INICIAR GRAVACAO ===");
      console.error("Tipo do erro:", err.name);
      console.error("Mensagem:", err.message);
      console.error("Stack:", err.stack);

      let userMessage = `Erro: ${err.message}`;

      if (err.name === "NotAllowedError") {
        userMessage = "Permissao negada. Autorize o microfone nas configuracoes do navegador.";
        console.log("Usuario negou permissao de microfone");
      } else if (err.name === "NotFoundError") {
        userMessage = "Nenhum microfone encontrado. Conecte um microfone.";
        console.log("Nenhum dispositivo de audio encontrado");
      } else if (err.name === "NotReadableError") {
        userMessage = "Microfone em uso por outro aplicativo.";
        console.log("Dispositivo de audio esta bloqueado");
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
    console.log("isRecording:", isRecording);
    console.log("mediaRecorderRef.current existe?", !!mediaRecorderRef.current);

    if (mediaRecorderRef.current && isRecording) {
      console.log("Estado do MediaRecorder:", mediaRecorderRef.current.state);

      if (mediaRecorderRef.current.state !== "inactive") {
        console.log("Chamando mediaRecorder.stop()");
        mediaRecorderRef.current.stop();
      } else {
        console.warn("MediaRecorder ja estava inativo");
      }

      setIsRecording(false);
      console.log("Estado atualizado para isRecording=false");
    } else {
      console.warn("Condicoes para parar nao foram atendidas");
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    console.log("Limpando gravacao");
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
