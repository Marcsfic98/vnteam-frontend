import { FaFire } from "react-icons/fa";

interface ConsistencyData {
  [dateString: string]: "started" | "completed" | "not_started";
}

interface SequenceProps {
  count: number;
  sessionsData: ConsistencyData; // Adicionado para sincronizar com a virada de dia
}

export default function SequenceBox({ count, sessionsData }: SequenceProps) {
  // Validação para manter a cor viva caso ele tenha treinado ontem e o dia acabou de virar
  const currentTodayStr = new Date().toLocaleDateString("sv-SE");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("sv-SE");

  const treinouHoje =
    sessionsData[currentTodayStr] === "completed" ||
    sessionsData[currentTodayStr] === "started";
  const treinouOntem =
    sessionsData[yesterdayStr] === "completed" ||
    sessionsData[yesterdayStr] === "started";

  // Se o banco retornou 0, mas ele treinou ontem e ainda é hoje, segura visualmente o tom ativo
  const effectiveCount =
    count === 0 && (treinouHoje || treinouOntem) ? 1 : count;

  const getGradientStyles = (days: number) => {
    if (days >= 15) {
      return "from-amber-500 via-orange-600 to-amber-950 text-white shadow-orange-500/20";
    }
    if (days >= 10) {
      return "from-blue-400 via-blue-600 to-indigo-950 text-white shadow-blue-500/20";
    }
    if (days >= 5) {
      return "from-emerald-400 via-green-600 to-emerald-950 text-white shadow-emerald-500/20";
    }
    if (days > 0) {
      return "from-yellow-400 via-amber-500 to-amber-900 text-white shadow-amber-500/20";
    }

    return "from-slate-100 to-slate-200 text-slate-700 shadow-sm border border-slate-200/60";
  };

  const isActive = effectiveCount > 0;

  return (
    <div
      className={`w-full min-h-[160px] bg-gradient-to-br ${getGradientStyles(
        effectiveCount
      )} 
        rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl 
        transition-all duration-500 transform hover:scale-[1.02] relative overflow-hidden`}
    >
      {isActive && (
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      )}

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
            effectiveCount >= 15
              ? "text-orange-500 animate-pulse"
              : isActive
              ? "text-white"
              : "text-slate-400"
          }
        />
      </div>

      <h4
        className={`text-3xl font-black tracking-tight leading-none ${
          isActive ? "text-white" : "text-slate-800"
        }`}
      >
        {count} {count === 1 ? "dia" : "dias"}
      </h4>

      <span
        className={`text-[11px] font-medium mt-1.5 opacity-80 uppercase tracking-widest
          ${isActive ? "text-white" : "text-slate-500"}`}
      >
        Sequência Atual
      </span>
    </div>
  );
}
