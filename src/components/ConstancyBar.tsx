import { useMemo } from "react";

interface WeekSessionsData {
  [dateString: string]: "started" | "completed" | "not_started";
}

interface ConstancyBarProps {
  sessionsData: WeekSessionsData; // Dados vindos do fetch da HomePage
}

export default function ConstancyBar({ sessionsData }: ConstancyBarProps) {
  // 1. Dias da semana fixos para as legendas abaixo dos quadradinhos
  const weekDayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];

  // 2. Data de hoje em formato string para a validação da borda
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // 3. Lógica para descobrir as datas exatas da semana atual (de Domingo a Sábado)
  const currentWeekDays = useMemo(() => {
    const days = [];
    const currentDayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, etc.

    // Encontra o Domingo da semana atual
    const sundayDate = new Date(today);
    sundayDate.setDate(today.getDate() - currentDayOfWeek);

    // Gera os 7 dias a partir do Domingo encontrado
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(sundayDate);
      targetDate.setDate(sundayDate.getDate() + i);

      const dateString = targetDate.toLocaleDateString("sv-SE"); // 'YYYY-MM-DD'
      const status = sessionsData[dateString] || "not_started";
      const isToday = dateString === todayStr;

      days.push({
        dateString,
        status,
        isToday,
        label: weekDayLabels[i],
      });
    }

    return days;
  }, [sessionsData, todayStr]);

  // 4. Retorna as classes de estilização com base no status do treino
  const getStatusClasses = (
    status: "started" | "completed" | "not_started",
    isToday: boolean
  ) => {
    // Base do seu layout: w-5 h-5 rounded-md (levemente aumentado para encaixar a borda sem espremer)
    const baseClasses = "w-5 h-5 rounded-md transition-all duration-200 border";

    // Borda azul destacada se for o dia de hoje
    const todayRing = isToday
      ? "ring-2 ring-blue-500 ring-offset-2 border-blue-500 scale-105"
      : "";

    switch (status) {
      case "completed":
        return `${baseClasses} bg-blue-600 border-blue-700 ${todayRing}`; // Azul Escuro
      case "started":
        return `${baseClasses} bg-blue-300 border-blue-400 ${todayRing}`; // Azul Claro
      case "not_started":
      default:
        // Se for hoje e não treinou, ele fica branco com borda cinza (ou a borda azul do hoje)
        return `${baseClasses} bg-white border-slate-300 ${todayRing}`;
    }
  };

  return (
    <div className="w-full h-20 bg-white border border-slate-100 shadow-sm rounded-3xl flex items-center justify-between px-5">
      {currentWeekDays.map((day, idx) => (
        <div
          key={day.dateString || idx}
          className="flex flex-col justify-center items-center gap-1.5"
        >
          {/* Quadradinho do dia da semana */}
          <div
            title={`${day.dateString}: ${day.status}`}
            className={getStatusClasses(day.status, day.isToday)}
          />
          {/* Legenda do dia da semana (S, T, Q...) */}
          <p
            className={`text-[11px] font-bold ${
              day.isToday ? "text-blue-600 font-black" : "text-slate-400"
            }`}
          >
            {day.label}
          </p>
        </div>
      ))}
    </div>
  );
}
