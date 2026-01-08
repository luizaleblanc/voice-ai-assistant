import React from "react";
import { MessageSquare } from "lucide-react";

const TranscriptionDisplay = ({ transcription }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold">Transcrição</h3>
      </div>
      <div className="bg-slate-900 rounded-lg p-4 text-slate-200">
        <p className="leading-relaxed">{transcription}</p>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
