import React from "react";
import { MessageSquare } from "lucide-react";

const ChatResponse = ({ response }) => {
  return (
    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold">Resposta do ChatGPT</h3>
      </div>
      <div className="bg-slate-900/50 rounded-lg p-4 text-slate-200">
        <p className="leading-relaxed whitespace-pre-wrap">{response}</p>
      </div>
    </div>
  );
};

export default ChatResponse;
