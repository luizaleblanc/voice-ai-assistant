import React, { useState, useEffect } from "react";
import {
  Loader2,
  Trash2,
  ChevronRight,
  MessageSquare,
  History,
  Mic,
  ArrowLeft,
} from "lucide-react";
import PermissionManager from "./components/PermissionManager";
import AudioRecorder from "./components/AudioRecorder";
import ChatResponse from "./components/ChatResponse";
import ErrorDisplay from "./components/ErrorDisplay";
import ConfirmationModal from "./components/ConfirmationModal";
import BackgroundDecorations from "./components/BackgroundDecorations";
import LandingPage from "./components/LandingPage";
import { usePermissions } from "./hooks/usePermissions";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useOpenAI } from "./hooks/useOpenAI";
import { useRecordings } from "./hooks/useRecordings";

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [appState, setAppState] = useState("idle");
  const [draftText, setDraftText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [expandedIds, setExpandedIds] = useState({});

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

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setAppState("idle");
  };

  return (
    <div className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen selection:bg-blue-200 selection:text-blue-900">
      <BackgroundDecorations />

      {showLanding ? (
        <LandingPage onStart={() => setShowLanding(false)} />
      ) : (
        <div className="relative z-10 flex flex-col lg:flex-row h-screen overflow-hidden p-4 gap-6">
          <main className="flex-1 flex flex-col bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden transition-all duration-500">
            <div className="flex items-center justify-between p-6 border-b border-slate-100/50">
              <button
                onClick={handleBackToLanding}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} /> Voltar
              </button>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isRecording ? "bg-red-500 animate-pulse" : "bg-blue-500"
                  }`}
                ></div>
                {appState === "idle"
                  ? "Pronto"
                  : appState === "recording"
                  ? "Gravando"
                  : appState === "review"
                  ? "Revisão"
                  : "Processando"}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-12 flex flex-col items-center">
              <PermissionManager
                permissionGranted={hasPermission}
                onRequestPermission={requestMicrophonePermission}
                appState={appState === "requesting" ? "requesting" : "idle"}
              />

              {hasPermission && (
                <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {(appState === "idle" ||
                    appState === "recording" ||
                    appState === "transcribing") && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-slate-900">
                          {appState === "recording" ? "Ouvindo você..." : "Nova Transcrição"}
                        </h2>
                        <p className="text-slate-500 text-lg">
                          {appState === "recording"
                            ? "Fale claramente para melhor resultado."
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

                  {appState === "review" && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
                      <div className="flex items-center gap-3 text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">
                        <MessageSquare size={14} />
                        <span>Editor de Texto</span>
                      </div>
                      <textarea
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        className="w-full min-h-[200px] p-0 text-xl leading-relaxed text-slate-700 placeholder-slate-300 border-none resize-none focus:ring-0 bg-transparent font-medium"
                        placeholder="Sua transcrição aparecerá aqui..."
                      />
                      <div className="h-px w-full bg-slate-100"></div>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={handleNewSession}
                          className="px-6 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-semibold transition-all"
                        >
                          Descartar
                        </button>
                        <button
                          onClick={handleProcessAI}
                          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-900/20 flex items-center gap-2"
                        >
                          Analisar com IA <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {appState === "processing" && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
                      </div>
                      <p className="text-xl font-medium text-slate-600">Gerando inteligência...</p>
                    </div>
                  )}

                  {appState === "success" && (
                    <div className="space-y-8 pb-12">
                      <div className="bg-white/50 p-6 rounded-2xl border border-slate-200/60">
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">
                          Original
                        </h3>
                        <p className="text-slate-600 text-lg leading-relaxed">{draftText}</p>
                      </div>

                      <ChatResponse response={aiResponse} />

                      <div className="flex justify-center pt-8">
                        <button
                          onClick={handleNewSession}
                          className="px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3"
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

          <aside className="hidden lg:flex flex-col w-[380px] bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden">
            <div className="p-8 border-b border-slate-100/50 bg-white/40">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <History className="text-blue-600" size={24} />
                Histórico
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {recordings.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl">
                  <History size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">Nenhum registro</p>
                  <p className="text-sm opacity-70 mt-1">Suas gravações aparecerão aqui</p>
                </div>
              ) : (
                recordings.map((rec) => (
                  <div
                    key={rec.id}
                    className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => initiateDelete(rec.id)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-slate-600 line-clamp-2 font-medium">
                        "{rec.transcription}"
                      </p>
                      <div
                        className={`relative bg-blue-50/50 rounded-xl p-3 text-xs text-slate-600 leading-relaxed border border-blue-100/50 ${
                          !expandedIds[rec.id] && "line-clamp-3"
                        }`}
                      >
                        {rec.aiResponse}
                        {rec.aiResponse.length > 100 && !expandedIds[rec.id] && (
                          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-blue-50 to-transparent"></div>
                        )}
                      </div>
                      {rec.aiResponse.length > 100 && (
                        <button
                          onClick={() => toggleExpand(rec.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide"
                        >
                          {expandedIds[rec.id] ? "Recolher" : "Ler completo"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <ConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Excluir Registro"
            message="Esta ação é permanente e não poderá ser desfeita."
          />
        </div>
      )}
    </div>
  );
}

export default App;
