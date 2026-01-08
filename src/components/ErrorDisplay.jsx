import React from "react";
import { AlertCircle, X } from "lucide-react";

const ErrorDisplay = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 flex items-center justify-between gap-4 max-w-xl mx-auto mt-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-200">{message}</p>
      </div>
      <button onClick={onDismiss} className="text-red-400 hover:text-red-300 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ErrorDisplay;
