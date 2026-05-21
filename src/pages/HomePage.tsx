import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoxTraining from "../components/BoxTraining";
import ConstancyBar from "../components/ConstancyBar";
import Rest from "../components/Rest";
import Sequence from "../components/Sequence";
import { AuthContext } from "../contexts/AuthContext";
import { type WorkoutDay } from "../models/workoutDaysModule";
import { search } from "../services/userService";
import LoadingPage from "./LoadingPage";

interface WeekData {
  [dateString: string]: "started" | "completed" | "not_started";
}

interface UserWorkoutSession {
  id?: number;
  startedAt: string;
  completedAt?: string | null;
  workoutDay: { id: number };
  user: { id: number };
}

function HomePage() {
  const [todayTraining, setTodayTraining] = useState<WorkoutDay | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weekSessions, setWeekSessions] = useState<WeekData>({});
  const [streakCount, setStreakCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSession, setCurrentSession] =
    useState<UserWorkoutSession | null>(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const todayStr = new Date().toLocaleDateString("sv-SE");
  const todayStatus = weekSessions[todayStr] || "not_started";

  const daysOfWeek = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  async function fetchHomeData() {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // 1. Busca treino correspondente ao dia de hoje
      const todayName = daysOfWeek[new Date().getDay()];
      let currentTodayTraining: WorkoutDay | null = null;

      await search("/workout_day", (data: WorkoutDay[]) => {
        const found = data.find((d) => d.weekDay === todayName);
        currentTodayTraining = found || null;
        setTodayTraining(found || null);
      });

      // 2. Busca o mapa de consistência
      const response = await fetch(
        `http://localhost:3000/user_workout_session/consistency/${user.id}`
      );

      let currentWeekSessions: WeekData = {};
      if (response.ok) {
        const data = await response.json();
        currentWeekSessions = data;
        setWeekSessions(data);
        calculateStreak(data);
      }

      // 3. Se iniciado, busca a sessão ativa no banco
      const sessionStatus = currentWeekSessions[todayStr] || "not_started";
      if (sessionStatus === "started") {
        const allSessionsResponse = await fetch(
          `http://localhost:3000/user_workout_session`
        );
        if (allSessionsResponse.ok) {
          const sessions: UserWorkoutSession[] =
            await allSessionsResponse.json();
          const foundSession = sessions.find(
            (s) =>
              s.user?.id === user.id &&
              s.startedAt.startsWith(todayStr) &&
              !s.completedAt
          );
          if (foundSession) {
            setCurrentSession(foundSession);
          }
        }
      }

      // 🚀 AUTOMAÇÃO PARA DIA DE DESCANSO (isRest === true)
      // Se for dia de descanso e ainda não foi iniciado/computado, executa o ciclo completo
      if (
        currentTodayTraining &&
        (currentTodayTraining as WorkoutDay).isRest === true &&
        sessionStatus === "not_started"
      ) {
        await handleAutoRestSession((currentTodayTraining as WorkoutDay).id);
      }
    } catch (err) {
      console.error("Erro ao carregar dados da Home:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Função auxiliar isolada para disparar o ciclo de Post + Put do descanso sem travar o estado principal
  async function handleAutoRestSession(workoutDayId: number) {
    if (!user?.id) return;
    try {
      // 1. Cria a sessão de descanso (Inicia)
      const startResponse = await fetch(
        `http://localhost:3000/user_workout_session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startedAt: new Date().toISOString(),
            workoutDay: { id: workoutDayId },
            user: { id: user.id },
          }),
        }
      );

      if (startResponse.ok) {
        const createdSession: UserWorkoutSession = await startResponse.json();

        // 2. Conclui imediatamente na sequência usando o ID retornado
        if (createdSession.id) {
          await fetch(`http://localhost:3000/user_workout_session`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: createdSession.id,
              startedAt: createdSession.startedAt,
              completedAt: new Date().toISOString(),
              workoutDay: { id: workoutDayId },
              user: { id: user.id },
            }),
          });
        }

        // 3. Atualiza os quadradinhos e o streak na tela com a nova realidade
        const refreshResponse = await fetch(
          `http://localhost:3000/user_workout_session/consistency/${user.id}`
        );
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setWeekSessions(data);
          calculateStreak(data);
        }
      }
    } catch (error) {
      console.error("Erro ao computar descanso automático:", error);
    }
  }

  useEffect(() => {
    fetchHomeData();
  }, [user?.id]);

  const calculateStreak = (data: WeekData) => {
    let currentStreak = 0;
    const checkDate = new Date();

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

  const handleWorkoutAction = async () => {
    if (!user?.id || !todayTraining || isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (todayStatus === "not_started") {
        const response = await fetch(
          `http://localhost:3000/user_workout_session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              startedAt: new Date().toISOString(),
              workoutDay: { id: todayTraining.id },
              user: { id: user.id },
            }),
          }
        );

        if (!response.ok) throw new Error("Erro ao salvar o início do treino");
        const createdSession = await response.json();
        setCurrentSession(createdSession);
      } else if (todayStatus === "started") {
        let sessionToUpdate = currentSession;

        if (!sessionToUpdate?.id) {
          const res = await fetch(`http://localhost:3000/user_workout_session`);
          const sessions: UserWorkoutSession[] = await res.json();
          sessionToUpdate =
            sessions.find(
              (s) =>
                s.user?.id === user.id &&
                s.startedAt.startsWith(todayStr) &&
                !s.completedAt
            ) || null;
        }

        if (!sessionToUpdate?.id)
          throw new Error("ID da sessão não localizado.");

        const response = await fetch(
          `http://localhost:3000/user_workout_session`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: sessionToUpdate.id,
              startedAt: sessionToUpdate.startedAt,
              completedAt: new Date().toISOString(),
              workoutDay: { id: todayTraining.id },
              user: { id: user.id },
            }),
          }
        );

        if (!response.ok)
          throw new Error("Erro ao atualizar a conclusão do treino");
        setCurrentSession(null);
      }

      await fetchHomeData();
    } catch (error) {
      console.error("Erro na ação do treino:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonConfig = () => {
    if (todayStatus === "completed") {
      return {
        text: "Concluído!",
        className: "bg-emerald-600 text-white opacity-80 cursor-not-allowed",
        disabled: true,
      };
    }
    if (todayStatus === "started") {
      return {
        text: "Concluir",
        className:
          "bg-amber-500 hover:bg-amber-600 text-white cursor-pointer active:scale-95",
        disabled: false,
      };
    }
    return {
      text: "Bora!",
      className:
        "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95",
      disabled: false,
    };
  };

  const btnConfig = getButtonConfig();

  const showWorkoutCard = todayTraining && todayTraining.isRest === false;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans selection:bg-blue-200">
      {/* Banner Superior */}
      {isLoading && <LoadingPage />}
      <div className="bg-[url('/img/bn_home_2.png')] bg-cover bg-center w-full h-[30vh] flex rounded-b-4xl justify-between shadow relative">
        <img
          src="/logo/logo.svg"
          alt="logo"
          className="w-20 absolute top-0 left-2 z-10"
        />

        <div className="flex flex-col items-start justify-end h-full pb-5 pl-6 w-full bg-gradient-to-t from-black/60 to-transparent rounded-b-4xl">
          <h1 className="text-2xl font-bold text-white">
            Olá, {user?.name ? user.name.split(" ")[0] : "usuário"}
          </h1>
          <p className="text-gray-200 text-sm mt-1">
            {todayStatus === "completed"
              ? "Treino pago por hoje! ."
              : showWorkoutCard
              ? "Bora treinar hoje?"
              : "Dia de descanso?"}
          </p>
        </div>

        {(isLoading || showWorkoutCard) && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleWorkoutAction}
              disabled={isLoading || btnConfig.disabled || isSubmitting}
              className={`text-sm font-semibold py-2 px-5 rounded-full shadow-md transition transform ${btnConfig.className}`}
            >
              {isLoading || isSubmitting ? "Carregando..." : btnConfig.text}
            </button>
          </div>
        )}
      </div>

      {/* Grid de Consistência e Sequência */}
      <div className="mt-6">
        <div className="flex justify-between items-center mx-5 mb-3">
          <h2 className="text-lg font-bold text-slate-800">Consistência</h2>
          <span
            onClick={() => navigate("/consistency")}
            className="text-xs font-semibold text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            ver histórico
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mx-5 items-center">
          <div className="col-span-2">
            <ConstancyBar sessionsData={weekSessions} />
          </div>
          <div className="col-span-1">
            <Sequence count={streakCount} />
          </div>
        </div>
      </div>

      {/* Seção Dinâmica: Treino de Hoje ou Rest */}
      <div className="mt-6">
        <div className="flex justify-between items-center mx-5 mb-4">
          <h2 className="text-lg font-bold text-slate-800">Treino de hoje</h2>
          <span
            onClick={() => navigate("/training_plan")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 cursor-pointer"
          >
            ver treinos
          </span>
        </div>

        <div className="flex justify-center items-center mx-5">
          {isLoading ? (
            <p className="text-sm text-slate-400 animate-pulse">
              Carregando treino...
            </p>
          ) : showWorkoutCard ? (
            <div
              className="w-full cursor-pointer transform transition hover:scale-[1.005]"
              onClick={() => navigate(`/training_day/${todayTraining!.id}`)}
            >
              <BoxTraining
                name={todayTraining!.name}
                quantity={todayTraining!.WorkoutExercice?.length || 0}
                weekDay={todayTraining!.weekDay}
                estimatedDuration={todayTraining!.estimatedDuration}
              />
            </div>
          ) : (
            <div className="w-full">
              <Rest date={todayTraining?.weekDay} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
