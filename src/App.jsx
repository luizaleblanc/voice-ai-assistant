import React, { useState, useEffect } from "react";
import { Loader2, Trash2, ChevronRight, MessageSquare } from "lucide-react";
import PermissionManager from "./components/PermissionManager";
import AudioRecorder from "./components/AudioRecorder";
import ChatResponse from "./components/ChatResponse";
import ErrorDisplay from "./components/ErrorDisplay";
import ConfirmationModal from "./components/ConfirmationModal";
import { usePermissions } from "./hooks/usePermissions";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useOpenAI } from "./hooks/useOpenAI";
import { useRecordings } from "./hooks/useRecordings";

function App() {
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

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] lg:h-screen bg-slate-100 font-sans overflow-y-auto lg:overflow-hidden p-2 md:p-4 gap-4">
      <main className="flex-1 flex flex-col items-center justify-start md:justify-center bg-white rounded-3xl shadow-sm border border-slate-200 relative overflow-y-auto min-h-[500px] lg:min-h-0">
        <PermissionManager
          permissionGranted={hasPermission}
          onRequestPermission={requestMicrophonePermission}
          appState={appState === "requesting" ? "requesting" : "idle"}
        />

        {hasPermission && (
          <div className="w-full max-w-3xl space-y-6 md:space-y-8 p-4 md:p-8">
            {appState === "idle" && (
              <div className="text-center space-y-3 mb-8 animate-in fade-in duration-500 pt-8 lg:pt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  Voice AI Assistant
                </h1>
                <p className="text-base md:text-lg text-slate-500">
                  Ferramenta de transcrição e{" "}
                  <span className="text-purple-700 font-bold">inteligência artificial</span>.
                  <br className="hidden md:block" /> Grave sua solicitação para receber uma análise
                  automática.
                </p>
              </div>
            )}

            {appState === "idle" || appState === "recording" || appState === "transcribing" ? (
              <div className="flex flex-col items-center gap-6 md:gap-8">
                <AudioRecorder
                  appState={appState}
                  onStartRecording={handleStart}
                  onStopRecording={handleStopAndTranscribe}
                  isRecording={isRecording}
                  recordingTime={recordingTime}
                />
                {appState === "transcribing" && (
                  <p className="text-slate-500 animate-pulse font-medium">Transcrevendo áudio...</p>
                )}
              </div>
            ) : null}

            {appState === "review" && (
              <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center justify-center gap-2">
                  <MessageSquare size={16} /> Revisar Transcrição
                </h3>
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="w-full h-32 md:h-40 p-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none resize-none mb-6 text-base md:text-lg leading-relaxed"
                />
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-end">
                  <button
                    onClick={handleNewSession}
                    className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors w-full sm:w-auto"
                  >
                    Descartar
                  </button>
                  <button
                    onClick={handleProcessAI}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20 w-full sm:w-auto"
                  >
                    Gerar Resposta <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {appState === "processing" && (
              <div className="flex flex-col items-center gap-4 py-12 md:py-16">
                <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-purple-600 animate-spin" />
                <p className="text-slate-600 font-medium text-base md:text-lg text-center">
                  A IA está analisando sua mensagem...
                </p>
              </div>
            )}

            {appState === "success" && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200">
                  {/* AJUSTE AQUI: text-left para alinhar ao início */}
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 text-left">
                    Sua Mensagem
                  </h3>
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed">{draftText}</p>
                </div>

                <ChatResponse response={aiResponse} />

                <div className="flex justify-center pt-4 md:pt-8 pb-4">
                  <button
                    onClick={handleNewSession}
                    className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-transform active:scale-95"
                  >
                    Iniciar Nova Gravação
                  </button>
                </div>
              </div>
            )}

            {errorMessage && (
              <ErrorDisplay message={errorMessage} onDismiss={() => setErrorMessage("")} />
            )}
          </div>
        )}
      </main>

      <aside className="w-full lg:w-[420px] bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col lg:h-full min-h-[400px] overflow-hidden order-last">
        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 flex items-center gap-3 text-lg">
            Histórico da Sessão
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {recordings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3 py-10 lg:py-0">
              <p className="text-sm">Sessão iniciada. Histórico vazio.</p>
            </div>
          ) : (
            recordings.map((rec) => (
              <div
                key={rec.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 hover:border-purple-200 hover:shadow-md transition-all group relative"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {new Date(rec.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <button
                    onClick={() => initiateDelete(rec.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    title="Excluir do histórico"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Você</p>
                    <p className="text-sm font-medium text-slate-700 line-clamp-2 leading-relaxed">
                      "{rec.transcription}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-50">
                    <p className="text-xs font-bold text-purple-600 uppercase mb-1">IA</p>
                    <div className="text-xs text-slate-500 bg-purple-50/50 p-3 rounded-xl line-clamp-3 leading-relaxed border border-purple-100/50">
                      {rec.aiResponse}
                    </div>
                  </div>
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
        title="Excluir Gravação"
        message="Tem certeza que deseja excluir esta gravação do histórico? Esta ação não pode ser desfeita."
      />
    </div>
  );
}

export default App;
