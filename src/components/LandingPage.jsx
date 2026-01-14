import React from "react";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const LandingPage = ({ onStart, isDark, toggleTheme }) => {
  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 font-sans ${
        isDark ? "bg-[#020617] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[120px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          </>
        ) : (
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]" />
        )}
      </div>

      <header className="relative z-50 p-8 flex justify-end items-center container mx-auto">
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 text-center container mx-auto -mt-20">
        <div className="space-y-10 max-w-4xl flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-thin tracking-tighter leading-none">
            Voice AI
            <br />
            <span
              className={`font-medium bg-clip-text text-transparent bg-gradient-to-r ${
                isDark
                  ? "from-blue-500 via-blue-200 to-white"
                  : "from-blue-700 via-blue-500 to-blue-300"
              }`}
            >
              Assistant
            </span>
          </h1>

          <p
            className={`text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Transcrição de alta fidelidade e inteligência artificial.
            <br className="hidden md:block" /> Simples, direto e profissional.
          </p>

          <div className="pt-4 flex flex-col items-center gap-8">
            <button
              onClick={onStart}
              className={`group relative inline-flex items-center gap-3 px-10 py-4 text-base font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-xl text-white ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              Iniciar Gravação
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p
              className={`text-[10px] font-medium tracking-[0.2em] uppercase opacity-50 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Powered by OpenAI Whisper & GPT-3.5
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
