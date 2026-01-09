import React from "react";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const LandingPage = ({ onStart }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-1000 dark:text-white transition-colors duration-500">
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">
        <div className="space-y-6 mt-8">
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 dark:text-slate-50 leading-[1.1] tracking-tighter transition-colors duration-500">
            Voice AI <br />
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-800 dark:from-blue-400 dark:to-slate-200">
              Assistant
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed max-w-lg mx-auto transition-colors duration-500">
            Transcrição de alta fidelidade com Whisper e Inteligência Artificial. Simples, direto e
            profissional.
          </p>
        </div>

        <div>
          <button
            onClick={onStart}
            className="group relative flex items-center justify-center gap-3 px-10 py-5 text-base font-medium text-white transition-all duration-300 bg-slate-900 dark:bg-blue-600 rounded-full hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-0.5 active:scale-95 min-w-[220px]"
          >
            Iniciar Gravação
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-12 text-xs text-slate-400 dark:text-slate-500 font-light tracking-wide uppercase transition-colors duration-500">
          Powered by OpenAI Whisper & GPT-4
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
