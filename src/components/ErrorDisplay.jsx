import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorDisplay = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-red-400">Erro</p>
        <p className="text-sm text-slate-300">{message}</p>
      </div>
      <button onClick={onDismiss} className="text-slate-400 hover:text-white">
        ✕
      </button>
    </div>
  );
};

export default ErrorDisplay;
