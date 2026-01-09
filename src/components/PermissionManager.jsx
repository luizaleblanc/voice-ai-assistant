import React from "react";
import { Mic } from "lucide-react";

const PermissionManager = ({ permissionGranted, appState, onRequestPermission }) => {
  if (permissionGranted) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-in zoom-in-95 duration-300">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left shadow-sm">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600">
          <Mic size={24} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Habilitar Acesso ao Microfone</h3>
          <p className="text-slate-600 text-sm">
            Para transcrever sua voz, precisamos de acesso temporário ao seu microfone.
          </p>
        </div>

        <button
          onClick={onRequestPermission}
          disabled={appState === "requesting"}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/10 whitespace-nowrap"
        >
          {appState === "requesting" ? "Conectando..." : "Permitir Acesso"}
        </button>
      </div>
    </div>
  );
};

export default PermissionManager;
