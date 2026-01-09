import React from "react";
import { Mic, Zap, Shield, ArrowRight } from "lucide-react";

const LandingPage = ({ onStart }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-semibold text-blue-700 tracking-wide uppercase">
              IA Ativa 2.0
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Sua voz, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-800">
              Inteligentemente Transcrita.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transforme áudios em insights acionáveis com a precisão do Whisper e o poder da
            Inteligência Artificial.
          </p>
        </div>

        <div>
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-slate-900 rounded-2xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-4 text-sm text-slate-500 font-medium">
            Sem cadastro necessário • Uso imediato
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-left">
          <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <Mic size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Transcrição Precisa</h3>
            <p className="text-slate-600 leading-relaxed">
              Tecnologia Whisper para converter fala em texto com máxima fidelidade.
            </p>
          </div>

          <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Produtividade Real</h3>
            <p className="text-slate-600 leading-relaxed">
              Economize horas de anotações manuais. Fale e deixe a IA organizar.
            </p>
          </div>

          <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Privacidade Total</h3>
            <p className="text-slate-600 leading-relaxed">
              Seus dados são processados de forma segura e transparente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
