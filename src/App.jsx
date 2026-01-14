import React, { useReducer, useEffect, useCallback } from "react";
import { Clock, ArrowLeft } from "lucide-react";
import LandingPage from "./components/LandingPage";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionDisplay from "./components/TranscriptionDisplay";
import ChatResponse from "./components/ChatResponse";
import HistoryModal from "./components/HistoryModal";
import ConfirmationModal from "./components/ConfirmationModal";
import ErrorDisplay from "./components/ErrorDisplay";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { usePermissions } from "./hooks/usePermissions";
import { storageService } from "./services/storageService";
import { useTheme } from "./hooks/useTheme";
import { transcribeAudio, analyzeText } from "./services/apiService";

const initialState = {
  status: "IDLE",
  view: "LANDING",
  data: {
    transcription: "",
    response: "",
    timestamp: null,
  },
  error: null,
  isHistoryOpen: false,
  historyItems: [],
  itemToDelete: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "ENTER_APP":
      return { ...state, view: "MAIN", status: "IDLE" };
    case "GO_BACK":
      return {
        ...state,
        view: "LANDING",
        status: "IDLE",
        data: { transcription: "", response: "" },
      };
    case "START_RECORDING":
      return {
        ...state,
        status: "RECORDING",
        error: null,
        data: { ...state.data, transcription: "", response: "" },
      };
    case "STOP_RECORDING":
      return { ...state, status: "PROCESSING_AUDIO" };
    case "TRANSCRIPTION_READY":
      return {
        ...state,
        status: "TRANSCRIBED",
        data: { ...state.data, transcription: action.payload },
      };
    case "UPDATE_TRANSCRIPTION":
      return { ...state, data: { ...state.data, transcription: action.payload } };
    case "START_AI_ANALYSIS":
      return { ...state, status: "PROCESSING_AI" };
    case "PROCESS_SUCCESS":
      return {
        ...state,
        status: "SUCCESS",
        data: { ...state.data, response: action.payload, timestamp: new Date().toISOString() },
      };
    case "PROCESS_ERROR":
      return { ...state, status: "ERROR", error: action.payload };
    case "RESET":
      return { ...state, status: "IDLE", error: null };
    case "TOGGLE_HISTORY":
      return { ...state, isHistoryOpen: !state.isHistoryOpen };
    case "SET_HISTORY":
      return { ...state, historyItems: action.payload };
    case "REQUEST_DELETE":
      return { ...state, itemToDelete: action.payload };
    case "CANCEL_DELETE":
      return { ...state, itemToDelete: null };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isDark, toggleTheme } = useTheme();
  const { hasPermission, requestMicrophonePermission } = usePermissions();

  const {
    startRecording,
    stopRecording,
    isRecording: recorderIsRecording,
    recordingTime,
  } = useAudioRecorder();

  const loadHistory = useCallback(async () => {
    try {
      const items = await storageService.getAllRecordings();
      dispatch({ type: "SET_HISTORY", payload: items.reverse() });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (state.isHistoryOpen) loadHistory();
  }, [state.isHistoryOpen, loadHistory]);

  const handleStartApp = async () => {
    const granted = await requestMicrophonePermission();
    if (granted) dispatch({ type: "ENTER_APP" });
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      dispatch({ type: "START_RECORDING" });
    } catch (err) {
      dispatch({ type: "PROCESS_ERROR", payload: "Erro ao iniciar gravação." });
    }
  };

  const handleStopRecording = async () => {
    if (recordingTime < 2) {
      await stopRecording();
      dispatch({
        type: "PROCESS_ERROR",
        payload: "Áudio muito curto. Fale por pelo menos 2 segundos.",
      });
      return;
    }

    try {
      dispatch({ type: "STOP_RECORDING" });
      const audioBlob = await stopRecording();
      if (!audioBlob) throw new Error("Áudio não capturado.");
      const text = await transcribeAudio(audioBlob);
      dispatch({ type: "TRANSCRIPTION_READY", payload: text });
    } catch (err) {
      console.error(err);
      dispatch({ type: "PROCESS_ERROR", payload: err.message || "Erro na transcrição." });
    }
  };

  const handleAnalyze = async () => {
    try {
      dispatch({ type: "START_AI_ANALYSIS" });
      const aiResponse = await analyzeText(state.data.transcription);
      const newRecord = {
        transcription: state.data.transcription,
        aiResponse: aiResponse,
      };
      await storageService.saveRecording(newRecord);
      dispatch({ type: "PROCESS_SUCCESS", payload: aiResponse });
    } catch (err) {
      console.error(err);
      dispatch({ type: "PROCESS_ERROR", payload: err.message || "Erro na análise da IA." });
    }
  };

  const handleDeleteConfirm = async () => {
    if (state.itemToDelete === "ALL") {
      await storageService.clearStore();
    } else {
      await storageService.deleteRecording(state.itemToDelete);
    }
    dispatch({ type: "CANCEL_DELETE" });
    loadHistory();
  };

  if (state.view === "LANDING") {
    return <LandingPage onStart={handleStartApp} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans relative ${
        isDark ? "bg-[#020617] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        {isDark && (
          <>
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[100px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </>
        )}
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10 max-w-5xl flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-20 pt-4">
          <button
            onClick={() => dispatch({ type: "GO_BACK" })}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isDark ? "text-slate-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span className="tracking-wide">Voltar</span>
          </button>

          <button
            onClick={() => dispatch({ type: "TOGGLE_HISTORY" })}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 ${
              isDark
                ? "bg-slate-900/50 border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-400"
                : "bg-white border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 shadow-sm"
            }`}
          >
            <Clock size={16} strokeWidth={1.5} />
            <span className="text-xs font-medium tracking-wider uppercase">Histórico</span>
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-10 -mt-24">
          {(state.status === "IDLE" || state.status === "RECORDING") && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="space-y-3">
                <h2
                  className={`text-4xl font-light tracking-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Nova Transcrição
                </h2>
                <p className={`text-lg font-light ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  Toque no microfone para começar.
                </p>
              </div>

              <div className="py-4">
                <AudioRecorder
                  isRecording={state.status === "RECORDING"}
                  onStartRecording={handleStartRecording}
                  onStopRecording={handleStopRecording}
                  recordingTime={recordingTime}
                  hasPermission={hasPermission}
                  isDark={isDark}
                />
              </div>
            </div>
          )}

          <div className="w-full max-w-2xl space-y-6">
            {state.status === "ERROR" && (
              <ErrorDisplay
                message={state.error}
                onRetry={() => dispatch({ type: "RESET" })}
                isDark={isDark}
              />
            )}

            {state.status === "PROCESSING_AUDIO" && (
              <div className="flex flex-col items-center justify-center p-12 space-y-6">
                <div
                  className={`w-12 h-12 border-2 border-t-transparent rounded-full animate-spin ${
                    isDark ? "border-blue-500" : "border-blue-600"
                  }`}
                ></div>
                <p
                  className={`font-light tracking-wide ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Processando áudio...
                </p>
              </div>
            )}

            {state.status === "TRANSCRIBED" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div
                  className={`p-8 rounded-2xl border ${
                    isDark
                      ? "bg-[#0B1120] border-slate-800"
                      : "bg-white border-gray-200 shadow-xl shadow-gray-200/50"
                  }`}
                >
                  <label
                    className={`block text-[10px] font-bold mb-6 tracking-[0.2em] uppercase ${
                      isDark ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    Transcrição Original
                  </label>
                  <textarea
                    value={state.data.transcription}
                    onChange={(e) =>
                      dispatch({ type: "UPDATE_TRANSCRIPTION", payload: e.target.value })
                    }
                    className={`w-full h-40 bg-transparent resize-none outline-none text-xl font-light leading-relaxed ${
                      isDark
                        ? "text-slate-200 placeholder-slate-700"
                        : "text-gray-800 placeholder-gray-300"
                    }`}
                    placeholder="Sua transcrição aparecerá aqui..."
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => dispatch({ type: "RESET" })}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAnalyze}
                    className={`px-8 py-3 text-sm font-medium rounded-lg shadow-lg transition-all hover:scale-[1.02] ${
                      isDark
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                    }`}
                  >
                    Analisar com IA
                  </button>
                </div>
              </div>
            )}

            {state.status === "PROCESSING_AI" && (
              <div className="flex flex-col items-center justify-center p-12 space-y-6">
                <div
                  className={`w-12 h-12 border-2 border-t-transparent rounded-full animate-spin ${
                    isDark ? "border-indigo-500" : "border-indigo-600"
                  }`}
                ></div>
                <p
                  className={`font-light tracking-wide ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Gerando resposta inteligente...
                </p>
              </div>
            )}

            {state.status === "SUCCESS" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <TranscriptionDisplay
                  transcription={state.data.transcription}
                  isDark={isDark}
                  isLoading={false}
                />
                {state.data.response && (
                  <ChatResponse response={state.data.response} isDark={isDark} />
                )}

                <div className="flex justify-center pt-10">
                  <button
                    onClick={() => dispatch({ type: "RESET" })}
                    className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                      isDark
                        ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                        : "bg-white hover:bg-gray-50 text-gray-900 shadow-sm border border-gray-200"
                    }`}
                  >
                    Nova Transcrição
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {state.isHistoryOpen && (
        <HistoryModal
          isOpen={state.isHistoryOpen}
          onClose={() => dispatch({ type: "TOGGLE_HISTORY" })}
          recordings={state.historyItems}
          onDelete={(id) => dispatch({ type: "REQUEST_DELETE", payload: id })}
          onClearAll={() => dispatch({ type: "REQUEST_DELETE", payload: "ALL" })}
          isDark={isDark}
        />
      )}

      {state.itemToDelete && (
        <ConfirmationModal
          isOpen={!!state.itemToDelete}
          onClose={() => dispatch({ type: "CANCEL_DELETE" })}
          onConfirm={handleDeleteConfirm}
          title="Excluir"
          message="Tem certeza?"
          isDark={isDark}
        />
      )}
    </div>
  );
}

export default App;
