import React from "react";
import { Sparkles } from "lucide-react";

const ChatResponse = ({ response }) => {
  return (
    <div className="bg-purple-50/50 border border-purple-100 rounded-lg overflow-hidden animate-fadeIn shadow-sm">
      <div className="bg-purple-100/50 px-4 py-3 border-b border-purple-100 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wide">
          Análise da IA
        </h3>
      </div>
      <div className="p-5">
        <div className="prose prose-slate prose-sm max-w-none text-slate-800 leading-relaxed">
          {response}
        </div>
      </div>
    </div>
  );
};

export default ChatResponse;
