import React from "react";
import { AlertCircle, CheckCircle, Mic, Loader2 } from "lucide-react";

const PermissionManager = ({ permissionGranted, appState, onRequestPermission }) => {
  if (permissionGranted) {
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-400" />
        <div>
          <p className="font-semibold">Microfone autorizado!</p>
          <p className="text-sm text-slate-300">Você está pronto para gravar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <AlertCircle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">Permissão de Microfone Necessária</h3>
          <p className="text-slate-300 mb-4">
            Para usar esta aplicação, você precisa permitir acesso ao microfone. Seu áudio será
            usado apenas para transcrição e não será armazenado.
          </p>

          <button
            onClick={onRequestPermission}
            disabled={appState === "requesting"}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            {appState === "requesting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Solicitando...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Permitir Acesso ao Microfone
              </>
            )}
          </button>

          <details className="mt-4 text-sm text-slate-400">
            <summary className="cursor-pointer hover:text-slate-300">
              Como permitir o microfone no meu navegador?
            </summary>
            <div className="mt-2 space-y-2 pl-4">
              <p>
                <strong>Chrome/Edge:</strong> Clique no ícone de cadeado na barra de endereço →
                Configurações do site → Microfone → Permitir
              </p>
              <p>
                <strong>Firefox:</strong> Clique no ícone de microfone na barra de endereço →
                Permitir
              </p>
              <p>
                <strong>Safari:</strong> Safari → Configurações → Sites → Microfone → Permitir
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default PermissionManager;
