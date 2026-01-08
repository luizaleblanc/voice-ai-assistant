import React from "react";
import { Mic, Square, Loader2, Radio } from "lucide-react";

const AudioRecorder = ({
  appState,
  onStartRecording,
  onStopRecording,
  isRecording,
  recordingTime = 0,
}) => {
  const isProcessing = appState === "transcribing" || appState === "completing";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 w-full">
      <div className="h-8 flex items-center justify-center min-w-[120px]">
        {isRecording ? (
          <div className="flex items-center gap-2 text-slate-700 animate-pulse bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <Radio className="w-4 h-4" />
            <span className="font-mono font-medium">{formatTime(recordingTime)}</span>
          </div>
        ) : isProcessing ? (
          <span className="text-slate-500 flex items-center gap-2 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processando...
          </span>
        ) : null}
      </div>

      <div className="relative">
        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={isProcessing}
            className="group relative flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Iniciar gravação"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-700 hover:bg-slate-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-slate-300 transition-all transform group-active:scale-95">
              <Mic className="w-8 h-8 md:w-8 md:h-8 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">
              Iniciar Gravação
            </span>
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="group relative flex flex-col items-center justify-center gap-2 transition-all"
            title="Finalizar"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-slate-600 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all transform group-active:scale-95 shadow-lg">
              <Square className="w-8 h-8 md:w-8 md:h-8 text-slate-700 fill-current" />
            </div>
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">
              Parar
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
