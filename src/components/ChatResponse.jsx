import React from "react";
import { MessageSquare } from "lucide-react";

const ChatResponse = ({ response }) => {
  return (
    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-purple-100">Resposta da IA</h3>
      </div>
      <div className="bg-slate-900/60 rounded-xl p-4 md:p-5 text-slate-100 shadow-inner overflow-y-auto max-h-96 pr-2">
        <p className="leading-relaxed whitespace-pre-wrap text-base md:text-lg break-words">
          {response}
        </p>
      </div>
    </div>
  );
};

export default ChatResponse;
