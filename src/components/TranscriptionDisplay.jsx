import React from "react";
import { FileText } from "lucide-react";

const TranscriptionDisplay = ({ transcription }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden animate-fadeIn shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
        <FileText className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Transcrição Original
        </h3>
      </div>
      <div className="p-5">
        <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">
          {transcription}
        </p>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
