import React from "react";
import { X, Trash2, Calendar, MessageSquare, Clock } from "lucide-react";

const HistoryItem = ({ rec, onDelete, isDark }) => (
  <div
    className={`p-5 rounded-xl border transition-all ${
      isDark
        ? "bg-[#1e293b] border-slate-700 hover:border-blue-500/50"
        : "bg-white border-gray-200 hover:border-blue-400"
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${
          isDark ? "text-slate-400" : "text-gray-500"
        }`}
      >
        <Calendar size={12} />
        {new Date(rec.timestamp).toLocaleString()}
      </div>
      <button
        onClick={() => onDelete(rec.id)}
        className={`p-1.5 rounded-lg transition-colors ${
          isDark
            ? "text-slate-500 hover:text-red-400 hover:bg-red-900/20"
            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
        }`}
      >
        <Trash2 size={14} />
      </button>
    </div>

    <div className="space-y-4">
      <div className={`pl-3 border-l-2 ${isDark ? "border-slate-600" : "border-gray-200"}`}>
        <p className={`text-lg font-medium italic ${isDark ? "text-white" : "text-gray-900"}`}>
          "{rec.transcription}"
        </p>
        <span
          className={`text-[10px] font-bold mt-1 block ${
            isDark ? "text-slate-500" : "text-gray-400"
          }`}
        >
          ORIGINAL
        </span>
      </div>

      {rec.aiResponse && (
        <div
          className={`p-4 rounded-lg ${
            isDark
              ? "bg-blue-900/20 border border-blue-900/50"
              : "bg-blue-50 border border-blue-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-blue-500 uppercase">Análise IA</span>
          </div>
          <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            {rec.aiResponse}
          </p>
        </div>
      )}
    </div>
  </div>
);

const HistoryModal = ({ isOpen, onClose, recordings, onDelete, onClearAll, isDark }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl border ${
          isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-gray-200"
        }`}
      >
        <div
          className={`px-6 py-5 border-b flex justify-between items-center ${
            isDark ? "border-slate-800 bg-[#1e293b]/50" : "border-gray-100 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isDark ? "bg-slate-800 text-blue-400" : "bg-white text-blue-600 shadow-sm"
              }`}
            >
              <Clock size={20} />
            </div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Histórico de Gravações
            </h2>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {recordings.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              <p>Nenhuma gravação encontrada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recordings.map((rec) => (
                <HistoryItem key={rec.id} rec={rec} onDelete={onDelete} isDark={isDark} />
              ))}
            </div>
          )}
        </div>

        {recordings.length > 0 && (
          <div
            className={`p-4 border-t ${
              isDark ? "border-slate-800" : "border-gray-100"
            } flex justify-end`}
          >
            <button
              onClick={onClearAll}
              className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider px-4 py-2"
            >
              Limpar Todo o Histórico
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;
