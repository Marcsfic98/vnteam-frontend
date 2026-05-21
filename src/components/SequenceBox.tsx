import { FaFire } from "react-icons/fa"; // Usando o ícone de fogo para ficar idêntico à imagem

interface SequenceProps {
  count: number;
}

export default function SequenceBox({ count }: SequenceProps) {
  // Função que define as classes de gradiente e sombra com base na quantidade de dias
  const getGradientStyles = (days: number) => {
    if (days >= 15) {
      // Degradê Laranja/Vermelho Escuro (Idêntico ao da foto)
      return "from-amber-500 via-orange-600 to-amber-950 text-white shadow-orange-500/20";
    }
    if (days >= 10) {
      // Degradê Azul Premium
      return "from-blue-400 via-blue-600 to-indigo-950 text-white shadow-blue-500/20";
    }
    if (days >= 5) {
      // Degradê Verde Limão/Florestal
      return "from-emerald-400 via-green-600 to-emerald-950 text-white shadow-emerald-500/20";
    }
    if (days > 0) {
      // Degradê Amarelo/Dourado Energético
      return "from-yellow-400 via-amber-500 to-amber-900 text-white shadow-amber-500/20";
    }

    // Estado Padrão (0 dias ou menor): Cinza Suave Clean (Tema Claro)
    return "from-slate-100 to-slate-200 text-slate-700 shadow-sm border border-slate-200/60";
  };

  const isActive = count > 0;

  return (
    <div
      className={`w-full min-h-[160px] bg-gradient-to-br ${getGradientStyles(
        count
      )} 
        rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl 
        transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden`}
    >
      {/* Detalhe sutil de luz de fundo para enfatizar o degradê premium */}
      {isActive && (
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Ícone de Fogo Centralizado dentro do círculo translúcido */}
      <div
        className={`p-3.5 rounded-full flex items-center justify-center mb-2 transition-all duration-300
          ${
            isActive
              ? "bg-white/15 backdrop-blur-md"
              : "bg-slate-300/50 text-slate-500"
          }`}
      >
        <FaFire
          size={24}
          className={
            count >= 15
              ? "text-orange-500 animate-pulse"
              : isActive
              ? "text-white"
              : "text-slate-400"
          }
        />
      </div>

      {/* Contador de Dias Principal */}
      <h4
        className={`text-3xl font-black tracking-tight leading-none ${
          isActive ? "text-white" : "text-slate-800"
        }`}
      >
        {count} {count === 1 ? "dia" : "dias"}
      </h4>

      {/* Subtítulo / Legenda inferior */}
      <span
        className={`text-[11px] font-medium tracking-wide mt-1.5 opacity-80 uppercase tracking-widest
          ${isActive ? "text-white" : "text-slate-500"}`}
      >
        Sequência Atual
      </span>
    </div>
  );
}
