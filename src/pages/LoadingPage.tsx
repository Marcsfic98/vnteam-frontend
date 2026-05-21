import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);

  // Simulação do carregamento progressivo
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(prevProgress + diff, 100);
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[1000] font-sans">
      <div className="flex flex-col items-center gap-12 w-full max-w-xs">
        {/* LOGO GIRANDO IGUAL MOEDA (Aumentada para w-44 e h-44) */}
        <div className="relative w-44 h-44 [perspective:1000px]">
          <div className="w-full h-full animate-y-spin-slow [transform-style:preserve-3d]">
            {/* Frente da Moeda (Sua Logo Original) */}
            <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center bg-blue-50 border-4 border-blue-100 rounded-full shadow-lg p-4">
              <img src="/logo/logo.svg" alt="logo" className="w-32 h-auto" />
            </div>

            {/* Costas da Moeda (Logo invertida) */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center bg-blue-600 rounded-full p-4 shadow-inner">
              <img
                src="/logo/logo.svg"
                alt="logo reversed"
                className="w-32 h-auto brightness-0 invert opacity-60"
              />
            </div>
          </div>
        </div>

        {/* CONTAINER DE TEXTO E BARRA */}
        <div className="w-full flex flex-col items-center gap-4 px-4 text-center">
          <h2 className="text-xl font-black text-slate-900 tracking-tight animate-pulse">
            Carregando...
          </h2>

          {/* BARRA DE CARREGAMENTO PROGRESSIVA */}
          <div className="w-full h-3 bg-slate-100 rounded-full border border-slate-200/60 shadow-inner overflow-hidden relative">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 rounded-full transition-all duration-300 ease-out shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-xs font-semibold text-slate-400 mt-1">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
