import React, { useState } from "react";
import { X, Calendar, Trash2, ChevronRight, MessageSquare, History } from "lucide-react";

const HistoryModal = ({ isOpen, onClose, recordings, onDelete }) => {
  const [expandedIds, setExpandedIds] = useState({});

  if (!isOpen) return null;

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-3xl h-[80vh] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl">
              <History size={20} />
            </div>
            <h2 className="text-xl font-medium text-slate-800 dark:text-white tracking-tight">
              Histórico de Gravações
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar dark:scrollbar-thumb-slate-700">
          {recordings.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <History size={32} className="opacity-20" />
              </div>
              <p className="font-light text-lg">Nenhum registro encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recordings.map((rec) => (
                <div
                  key={rec.id}
                  className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Calendar size={12} />
                      {new Date(rec.createdAt).toLocaleDateString()} •{" "}
                      {new Date(rec.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <button
                      onClick={() => onDelete(rec.id)}
                      className="self-end sm:self-auto flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} /> Excluir
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                      <p className="text-slate-900 dark:text-slate-200 font-medium italic mb-1">
                        "{rec.transcription}"
                      </p>
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                        Original
                      </span>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100/50 dark:border-blue-900/30">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                        <MessageSquare size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Análise IA
                        </span>
                      </div>
                      <div
                        className={`text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-light ${
                          !expandedIds[rec.id] && "line-clamp-2"
                        }`}
                      >
                        {rec.aiResponse}
                      </div>
                      {rec.aiResponse.length > 100 && (
                        <button
                          onClick={() => toggleExpand(rec.id)}
                          className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 uppercase tracking-wide flex items-center gap-1"
                        >
                          {expandedIds[rec.id] ? "Ler menos" : "Ler análise completa"}
                          <ChevronRight
                            size={12}
                            className={`transition-transform ${
                              expandedIds[rec.id] ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
