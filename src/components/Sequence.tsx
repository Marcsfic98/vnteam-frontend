import { calculateVisualStreak } from "./ConstancyBar"; // 🚀 Ajuste o caminho do import se necessário

interface WeekSessionsData {
  [dateString: string]: "started" | "completed" | "not_started";
}

interface SequenceProps {
  count: number; // Valor bruto vindo do banco/fetch do backend
  sessionsData: WeekSessionsData; // 🚀 Adicionado para validar a virada do dia
}

export default function Sequence({ count, sessionsData }: SequenceProps) {
  // 🚀 Calcula a sequência visual adaptada para não zerar na virada da noite
  const visualCount = calculateVisualStreak(sessionsData, count);

  return (
    <div className="w-full h-20 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center px-4">
      <div className="flex flex-col justify-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          Sequência
        </span>
        <h4 className="text-lg font-black text-slate-800 mt-0.5">
          {visualCount} {visualCount === 1 ? "Dia" : "Dias"}
        </h4>
      </div>
    </div>
  );
}
