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
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Controle de Gravação</h3>

        <div className="mb-6 min-h-[28px]">
          {isRecording && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Gravando...</span>
              </div>
              <span className="text-xl font-mono text-slate-300">{formatTime(recordingTime)}</span>
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
          {appState === "ready" && !isRecording && (
            <span className="text-slate-400">Pronto para gravar</span>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={() => {
                console.log("*** BOTAO DE GRAVACAO CLICADO ***");
                onStartRecording();
              }}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              title="Iniciar gravação"
            >
              <Mic className="w-10 h-10" />
            </button>
          ) : (
            <button
              onClick={onStopRecording}
              className="bg-slate-600 hover:bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              title="Parar gravação"
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

        {appState === "ready" && !isRecording && (
          <div className="mt-6 text-xs text-slate-500 space-y-1">
            <p>Dica: Fale claramente e evite ruídos de fundo</p>
            <p>Duração recomendada: 3-30 segundos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
