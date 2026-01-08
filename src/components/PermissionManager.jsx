import React from "react";
import { MicOff, CheckCircle2 } from "lucide-react";

const PermissionManager = ({ permissionGranted, appState, onRequestPermission }) => {
  if (permissionGranted) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
      <div className="bg-amber-100 p-3 rounded-full">
        <MicOff className="w-6 h-6 text-amber-600" />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-amber-900 mb-1">
          Permissão de Microfone Necessária
        </h3>
        <p className="text-amber-700 text-sm leading-relaxed">
          Para realizar a transcrição, o sistema precisa capturar o áudio do seu dispositivo. Nenhum
          áudio é gravado sem sua ação explícita no botão de gravação.
        </p>
      </div>

      <button
        onClick={onRequestPermission}
        disabled={appState === "requesting"}
        className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors whitespace-nowrap shadow-sm"
      >
        {appState === "requesting" ? "Solicitando..." : "Habilitar Microfone"}
      </button>
    </div>
  );
};

export default PermissionManager;
