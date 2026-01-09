import React from "react";

const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-gradient-to-br from-blue-100/40 to-slate-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-60"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tl from-blue-50/50 to-white/0 rounded-full blur-[100px] opacity-70"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-blue-200/10 rounded-full blur-[80px]"></div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
    </div>
  );
};

export default BackgroundDecorations;
