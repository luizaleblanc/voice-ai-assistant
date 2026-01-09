import React from "react";
import { Mic, Square, Loader2 } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center w-full relative z-20">
      <div
        className={`mb-8 transition-all duration-300 transform ${
          isRecording ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-2 bg-red-50 text-red-600 rounded-full font-mono font-bold text-xl border border-red-100 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          {formatTime(recordingTime)}
        </div>
      </div>

      <div className="relative group">
        {isRecording && (
          <>
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute inset-[-12px] bg-red-500 rounded-full opacity-10 animate-pulse"></div>
          </>
        )}

        {!isRecording ? (
          <button
            onClick={onStartRecording}
            disabled={isProcessing}
            className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-slate-900 rounded-full shadow-2xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 group-disabled:opacity-50 group-disabled:cursor-not-allowed border-4 border-slate-100"
            title="Iniciar gravação"
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <Mic className="w-10 h-10 md:w-12 md:h-12 text-white" />
            )}
          </button>
        ) : (
          <button
            onClick={onStopRecording}
            className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-white rounded-full shadow-2xl hover:bg-red-50 border-4 border-red-100 hover:border-red-200 hover:scale-105 active:scale-95 transition-all duration-300"
            title="Parar gravação"
          >
            <Square className="w-10 h-10 md:w-12 md:h-12 text-red-500 fill-current rounded-sm" />
          </button>
        )}
      </div>

      <p className="mt-8 text-slate-400 font-medium text-sm tracking-wide uppercase">
        {isRecording
          ? "Toque para finalizar"
          : isProcessing
          ? "Processando áudio..."
          : "Toque para gravar"}
      </p>
    </div>
  );
};

export default AudioRecorder;
