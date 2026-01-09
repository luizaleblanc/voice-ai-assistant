import React from "react";
import { Sparkles, Copy } from "lucide-react";

const ChatResponse = ({ response }) => {
  return (
    <div className="relative group rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="relative p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">Inteligência Artificial</h3>
          </div>

          <div className="flex gap-2">
            <button
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              title="Copiar"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        <div className="text-slate-100 text-lg leading-relaxed whitespace-pre-wrap font-light tracking-wide opacity-90">
          {response}
        </div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 opacity-30"></div>
    </div>
  );
};

export default ChatResponse;
