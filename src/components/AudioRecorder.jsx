import React from "react";
import { Mic, Square, Loader2 } from "lucide-react";

const AudioRecorder = ({ appState, onStartRecording, onStopRecording }) => {
  const isRecording = appState === "recording";
  const isProcessing = appState === "transcribing" || appState === "completing";

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Controle de Gravação</h3>

        <div className="mb-6">
          {isRecording && (
            <div className="flex items-center justify-center gap-2 text-red-400">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Gravando...</span>
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-semibold">
                {appState === "transcribing" ? "Transcrevendo áudio..." : "Gerando resposta..."}
              </span>
            </div>
          )}
          {appState === "ready" && <span className="text-slate-400">Pronto para gravar</span>}
        </div>

        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={onStartRecording}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
            >
              <Mic className="w-10 h-10" />
            </button>
          ) : (
            <button
              onClick={onStopRecording}
              className="bg-slate-600 hover:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
            >
              <Square className="w-8 h-8" />
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-400">
          {!isRecording
            ? "Clique no microfone para começar a gravar"
            : "Clique no quadrado para parar"}
        </p>
      </div>
    </div>
  );
};

export default AudioRecorder;
