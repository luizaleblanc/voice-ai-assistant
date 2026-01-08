import React, { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import PermissionManager from "./components/PermissionManager";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionDisplay from "./components/TranscriptionDisplay";
import ChatResponse from "./components/ChatResponse";
import ErrorDisplay from "./components/ErrorDisplay";
import { usePermissions } from "./hooks/usePermissions";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useOpenAI } from "./hooks/useOpenAI";

function App() {
  const [appState, setAppState] = useState("idle");
  const [transcription, setTranscription] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { hasPermission, requestMicrophonePermission, error: permissionError } = usePermissions();
  const {
    startRecording,
    stopRecording,
    audioBlob,
    isRecording,
    recordingTime,
    error: recordingError,
  } = useAudioRecorder();
  const { transcribe, complete, isLoading, error: apiError } = useOpenAI();

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Seu navegador não suporta gravação de áudio. Use Chrome, Firefox ou Edge.");
    }
  }, []);

  useEffect(() => {
    if (hasPermission) {
      setAppState("ready");
    }
  }, [hasPermission]);

  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleTranscription();
    }
  }, [audioBlob, isRecording]);

  useEffect(() => {
    if (permissionError || recordingError || apiError) {
      setErrorMessage(permissionError || recordingError || apiError);
    }
  }, [permissionError, recordingError, apiError]);

  const handleRequestPermission = async () => {
    setAppState("requesting");
    setErrorMessage("");

    const granted = await requestMicrophonePermission();

    if (granted) {
      setAppState("ready");
    } else {
      setAppState("idle");
    }
  };

  const handleStartRecording = async () => {
    try {
      setErrorMessage("");
      setTranscription("");
      setChatResponse("");

      await startRecording();
      setAppState("recording");
    } catch (err) {
      setErrorMessage(`Erro ao iniciar gravação: ${err.message}`);
      setAppState("ready");
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setAppState("processing");
  };

  const handleTranscription = async () => {
    try {
      setAppState("transcribing");
      setErrorMessage("");

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error("Áudio vazio. Grave novamente.");
      }

      if (audioBlob.size > 25000000) {
        throw new Error("Áudio muito grande. Máximo: 25MB");
      }

      const text = await transcribe(audioBlob);

      if (!text || text.trim() === "") {
        throw new Error("Nenhum texto foi detectado no áudio. Tente falar mais alto.");
      }

      setTranscription(text);

      await handleCompletion(text);
    } catch (err) {
      console.error("Erro na transcrição:", err);
      setErrorMessage(err.message);
      setAppState("ready");
    }
  };

  const handleCompletion = async (text) => {
    try {
      setAppState("completing");
      setErrorMessage("");

      const response = await complete(text);
      setChatResponse(response);

      setAppState("ready");
    } catch (err) {
      console.error("Erro na completion:", err);
      setErrorMessage(err.message);
      setAppState("ready");
    }
  };

  const handleNewRecording = () => {
    setTranscription("");
    setChatResponse("");
    setAppState("ready");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Voice AI Assistant</h1>
          <p className="text-slate-300">
            Grave sua voz, transcreva com Whisper e converse com ChatGPT
          </p>
        </header>

        <div className="space-y-6">
          <PermissionManager
            permissionGranted={hasPermission}
            appState={appState}
            onRequestPermission={handleRequestPermission}
          />

          {hasPermission && (
            <AudioRecorder
              appState={appState}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              isRecording={isRecording}
              recordingTime={recordingTime}
            />
          )}

          {transcription && <TranscriptionDisplay transcription={transcription} />}

          {chatResponse && <ChatResponse response={chatResponse} />}

          {chatResponse && appState === "ready" && (
            <div className="text-center">
              <button
                onClick={handleNewRecording}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Nova Gravação
              </button>
            </div>
          )}

          {errorMessage && (
            <ErrorDisplay message={errorMessage} onDismiss={() => setErrorMessage("")} />
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>Sua privacidade é importante. O áudio é processado de forma segura.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
