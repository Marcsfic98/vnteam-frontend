import { useContext, useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiPercent,
} from "react-icons/fi";
import SequenceBox from "../components/SequenceBox";
import { AuthContext } from "../contexts/AuthContext";
import LoadingPage from "./LoadingPage";

interface ConsistencyData {
  [dateString: string]: "started" | "completed" | "not_started";
}

export default function MonthlyConsistency() {
  // 1. Estados do Componente
  const [sessionsData, setSessionsData] = useState<ConsistencyData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);

  // 2. Pegando o usuário logado do seu Contexto de Autenticação
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  // 3. Estado que controla qual mês/ano o usuário está visualizando na tela
  const today = new Date();
  const todayStr = today.toLocaleDateString("sv-SE");
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const monthsNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // LÓGICA DE STREAK
  const calculateStreak = (data: ConsistencyData) => {
    let currentStreak = 0;
    const checkDate = new Date();

    const hjStr = checkDate.toLocaleDateString("sv-SE");
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const ontemStr = ontem.toLocaleDateString("sv-SE");

    const treinouHoje =
      data[hjStr] === "completed" || data[hjStr] === "started";
    const treinouOntem =
      data[ontemStr] === "completed" || data[ontemStr] === "started";

    // Se passou ontem e hoje em branco, zera a sequência
    if (!treinouHoje && !treinouOntem) {
      setStreakCount(0);
      return;
    }

    // Se não treinou hoje mas treinou ontem, inicia a regressiva a partir de ontem
    if (!treinouHoje && treinouOntem) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toLocaleDateString("sv-SE");
      const dayStatus = data[dateStr];

      if (dayStatus === "completed" || dayStatus === "started") {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    setStreakCount(currentStreak);
  };

  // 4. useEffect para buscar os dados da API
  useEffect(() => {
    async function fetchConsistency() {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3000/user_workout_session/consistency/${userId}`
        );

        if (!response.ok) {
          throw new Error("Falha ao buscar os dados de consistência");
        }

        const data = await response.json();
        setSessionsData(data);
        calculateStreak(data);
      } catch (err: any) {
        console.error(err);
        setError("Erro ao carregar o calendário.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchConsistency();
  }, [userId]);

  // 5. Funções de navegação do calendário
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // 6. Matriz de cálculo dos dias do mês atual corrigida
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const daysArray = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month, day);
      dateObj.setHours(0, 0, 0, 0); // Evita deslocamento por fuso na mutação de data
      const dateString = dateObj.toLocaleDateString("sv-SE");

      const status = sessionsData[dateString] || "not_started";
      const isToday = dateString === todayStr;

      daysArray.push({ day, dateString, status, isToday });
    }

    return daysArray;
  }, [currentDate, sessionsData, todayStr]);

  // 7. CÁLCULO DAS MÉTRICAS DINÂMICAS
  const metrics = useMemo(() => {
    const dates = Object.keys(sessionsData).sort();

    if (dates.length === 0) {
      return { totalWorkouts: 0, completionRate: 0, totalTimeStr: "0h00m" };
    }

    let completedCount = 0;
    let startedCount = 0;

    dates.forEach((dateStr) => {
      if (sessionsData[dateStr] === "completed") completedCount++;
      if (sessionsData[dateStr] === "started") startedCount++;
    });

    const totalWorkouts = completedCount + startedCount;

    const firstDate = new Date(dates[0]);
    const nowDate = new Date(todayStr);

    const diffTime = Math.abs(nowDate.getTime() - firstDate.getTime());
    const totalDaysElapsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const completionRate = Math.min(
      Math.round((completedCount / totalDaysElapsed) * 100),
      100
    );

    const totalMinutes = completedCount * 50;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalTimeStr = `${hours}h${minutes.toString().padStart(2, "0")}m`;

    return { totalWorkouts, completionRate, totalTimeStr };
  }, [sessionsData, todayStr]);

  const getStatusColor = (status: "started" | "completed" | "not_started") => {
    switch (status) {
      case "completed":
        return "bg-blue-600 border-blue-700/10 text-white";
      case "started":
        return "bg-blue-200 border-blue-300/20 text-slate-700";
      case "not_started":
      default:
        return "bg-slate-100 border-slate-200/60 text-slate-700";
    }
  };

  if (!userId) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white border border-slate-100 rounded-3xl p-8 text-center text-slate-400 text-sm">
        Usuário não identificado. Faça login.
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-50/40 p-2 flex flex-col gap-5 min-h-screen pb-10 mb-15">
      <div className="w-full relative bg-white border border-slate-100 rounded-3xl p-5 shadow-sm min-h-[320px] flex flex-col justify-between">
        {isLoading && <LoadingPage />}

        <img
          src="/logo/logo.svg"
          alt="logo"
          className="w-20 absolute top-0 left-2 z-10"
        />

        <div className="mt-16 mb-8">
          <SequenceBox count={streakCount} sessionsData={sessionsData} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
                Consistência
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {monthsNames[currentDate.getMonth()]}{" "}
                {currentDate.getFullYear()}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition active:scale-95"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition active:scale-95"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {error ? (
            <div className="text-center py-8 text-xs text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-7 gap-2 justify-items-center">
              {monthDays.map((item, index) => {
                if (!item)
                  return <div key={`empty-${index}`} className="w-9 h-9" />;
                return (
                  <div
                    key={item.dateString}
                    title={`${item.dateString}: ${item.status}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold relative transition-all border
                      ${getStatusColor(item.status)}
                      ${
                        item.isToday
                          ? "ring-2 ring-blue-500 ring-offset-2 border-blue-500 scale-105 z-10"
                          : ""
                      }
                    `}
                  >
                    {item.day}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50/50 border border-blue-100/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="p-2 bg-blue-100/60 text-blue-600 rounded-full mb-3">
              <FiCheckCircle size={20} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {metrics.totalWorkouts}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Treinos Feitos
            </p>
          </div>

          <div className="bg-blue-50/50 border border-blue-100/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="p-2 bg-blue-100/60 text-blue-600 rounded-full mb-3">
              <FiPercent size={20} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {metrics.completionRate}%
            </span>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Taxa de conclusão
            </p>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100/40 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-sm w-full">
          <div className="p-2 bg-blue-100/60 text-blue-600 rounded-full mb-2">
            <FiClock size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.totalTimeStr}
          </span>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Tempo Total
          </p>
        </div>
      </div>
    </div>
  );
}
