import React, { useState } from "react";
import "./index.css";
import "./App.css";
import PermissionManager from "./components/PermissionManager";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionDisplay from "./components/TranscriptionDisplay";
import ChatResponse from "./components/ChatResponse";
import ErrorDisplay from "./components/ErrorDisplay";

function App() {
  const [appState, setAppState] = useState("idle");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transcription, setTranscription] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const handleRequestPermission = async () => {
    setAppState("requesting");
    console.log("Solicitando permissão...");

    // Simulação temporária - será implementado na Phase 3
    setTimeout(() => {
      setPermissionGranted(true);
      setAppState("ready");
    }, 1000);
  };

  const handleStartRecording = () => {
    setAppState("recording");
    console.log("Iniciando gravação...");
  };

  const handleStopRecording = () => {
    setAppState("transcribing");
    console.log("Parando gravação...");

    // Simulação temporária - será implementado na Phase 3
    setTimeout(() => {
      setTranscription("Exemplo de transcrição do áudio gravado...");
      setAppState("completing");

      setTimeout(() => {
        setChatResponse(
          "Esta é uma resposta de exemplo do ChatGPT. Na Phase 3, isso virá da API real."
        );
        setAppState("ready");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">🎙️ Voice AI Assistant</h1>
          <p className="text-slate-300">
            Grave sua voz, transcreva com Whisper e converse com ChatGPT
          </p>
        </header>

        <div className="space-y-6">
          <PermissionManager
            permissionGranted={permissionGranted}
            appState={appState}
            onRequestPermission={handleRequestPermission}
          />

          {permissionGranted && (
            <AudioRecorder
              appState={appState}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
          )}

          {transcription && <TranscriptionDisplay transcription={transcription} />}

          {chatResponse && <ChatResponse response={chatResponse} />}

          {errorMessage && (
            <ErrorDisplay message={errorMessage} onDismiss={() => setErrorMessage("")} />
          )}
        </div>

        <footer className="mt-12 text-center text-sm text-slate-400">
          <p> Sua privacidade é importante. O áudio é processado de forma segura.</p>
          <p className="mt-2">Phase 2: Estrutura Base (Skeleton) - v0.1.0</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
