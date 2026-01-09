import React, { useState, useEffect } from "react";
import { Loader2, ChevronRight, MessageSquare, History, Mic, ArrowLeft } from "lucide-react";
import PermissionManager from "./components/PermissionManager";
import AudioRecorder from "./components/AudioRecorder";
import ChatResponse from "./components/ChatResponse";
import ErrorDisplay from "./components/ErrorDisplay";
import ConfirmationModal from "./components/ConfirmationModal";
import BackgroundDecorations from "./components/BackgroundDecorations";
import LandingPage from "./components/LandingPage";
import HistoryModal from "./components/HistoryModal";
import { usePermissions } from "./hooks/usePermissions";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useOpenAI } from "./hooks/useOpenAI";
import { useRecordings } from "./hooks/useRecordings";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [appState, setAppState] = useState("idle");
  const [draftText, setDraftText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { hasPermission, requestMicrophonePermission } = usePermissions();
  const { startRecording, stopRecording, isRecording, recordingTime } = useAudioRecorder();
  const { transcribe, complete } = useOpenAI();
  const { recordings, saveRecording, deleteRecording, clearAllRecordings } = useRecordings();

  useEffect(() => {
    clearAllRecordings();
  }, [clearAllRecordings]);

  const handleStart = async () => {
    try {
      setErrorMessage("");
      setDraftText("");
      setAiResponse("");
      await startRecording();
      setAppState("recording");
    } catch (err) {
      setErrorMessage("Erro ao iniciar gravação.");
      setAppState("idle");
    }
  };

  const handleStopAndTranscribe = async () => {
    try {
      setAppState("transcribing");
      const audioBlob = await stopRecording();

      if (!audioBlob || audioBlob.size === 0) throw new Error("Áudio vazio.");

      const text = await transcribe(audioBlob);
      if (!text) throw new Error("Transcrição falhou.");

      setDraftText(text);
      setAppState("review");
    } catch (err) {
      setErrorMessage(err.message);
      setAppState("idle");
    }
  };

  const handleProcessAI = async () => {
    try {
      setAppState("processing");

      const response = await complete(draftText);
      setAiResponse(response);

      await saveRecording({
        transcription: draftText,
        aiResponse: response,
        createdAt: new Date().toISOString(),
        duration: recordingTime,
      });

      setAppState("success");
    } catch (err) {
      setErrorMessage(err.message);
      setAppState("review");
    }
  };

  const handleNewSession = () => {
    setDraftText("");
    setAiResponse("");
    setAppState("idle");
  };

  const initiateDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteRecording(itemToDelete);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setAppState("idle");
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500">
      <BackgroundDecorations />

      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        recordings={recordings}
        onDelete={initiateDelete}
      />

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Registro"
        message="Esta ação é permanente e não poderá ser desfeita."
      />

      {showLanding ? (
        <LandingPage onStart={() => setShowLanding(false)} />
      ) : (
        <div className="relative z-10 flex flex-col h-screen overflow-hidden p-4 md:p-6 transition-all duration-700">
          <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white dark:border-slate-800 overflow-hidden transition-all duration-500">
            {/* Header da Aplicação */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100/50 dark:border-slate-800/50">
              <button
                onClick={handleBackToLanding}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-sm font-medium tracking-wide"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Voltar</span>
              </button>

              <div className="flex items-center gap-3">
                {/* Botão de Histórico */}
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-300 bg-white border border-slate-200 rounded-full hover:border-blue-200 hover:text-blue-700 hover:shadow-sm active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:border-blue-500/50"
                >
                  <History size={16} className="opacity-70" />
                  Ver Histórico
                </button>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center custom-scrollbar dark:scrollbar-thumb-slate-700">
              <PermissionManager
                permissionGranted={hasPermission}
                onRequestPermission={requestMicrophonePermission}
                appState={appState === "requesting" ? "requesting" : "idle"}
              />

              {hasPermission && (
                <div className="w-full max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {/* Estado: Gravação ou Espera */}
                  {(appState === "idle" ||
                    appState === "recording" ||
                    appState === "transcribing") && (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-10">
                      <div className="text-center space-y-3">
                        <h2 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-slate-50 tracking-tight transition-colors">
                          {appState === "recording" ? "Ouvindo..." : "Nova Transcrição"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-light text-lg transition-colors">
                          {appState === "recording"
                            ? "Fale com clareza."
                            : "Toque no microfone para começar."}
                        </p>
                      </div>

                      <AudioRecorder
                        appState={appState}
                        onStartRecording={handleStart}
                        onStopRecording={handleStopAndTranscribe}
                        isRecording={isRecording}
                        recordingTime={recordingTime}
                      />
                    </div>
                  )}

                  {/* Estado: Revisão do Texto */}
                  {appState === "review" && (
                    <div className="bg-white dark:bg-slate-900/80 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
                      <div className="flex items-center gap-3 text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">
                        <MessageSquare size={14} />
                        <span>Transcrição Preliminar</span>
                      </div>

                      <textarea
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        className="w-full min-h-[250px] p-5 text-xl leading-relaxed text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl resize-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-300 dark:focus:border-blue-700 focus:bg-white dark:focus:bg-slate-950 transition-all duration-300 font-light"
                        placeholder="Sua transcrição aparecerá aqui..."
                      />

                      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-2">
                        <button
                          onClick={handleNewSession}
                          className="px-6 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-all text-sm"
                        >
                          Descartar
                        </button>
                        <button
                          onClick={handleProcessAI}
                          className="px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                          Analisar com IA <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Estado: Processando */}
                  {appState === "processing" && (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
                      </div>
                      <p className="text-xl font-light text-slate-600 dark:text-slate-300 text-center px-4">
                        Gerando resposta com Inteligência Artificial...
                      </p>
                    </div>
                  )}

                  {/* Estado: Sucesso / Resultado */}
                  {appState === "success" && (
                    <div className="space-y-8 pb-12">
                      <div className="bg-white/40 dark:bg-slate-900/40 p-6 rounded-2xl border border-white dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wide">
                          Original
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-lg font-light leading-relaxed">
                          {draftText}
                        </p>
                      </div>

                      <div className="dark:text-white">
                        <ChatResponse response={aiResponse} />
                      </div>

                      <div className="flex justify-center pt-4">
                        <button
                          onClick={handleNewSession}
                          className="px-8 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-full font-medium shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                        >
                          <Mic size={20} /> Nova Gravação
                        </button>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <ErrorDisplay message={errorMessage} onDismiss={() => setErrorMessage("")} />
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
