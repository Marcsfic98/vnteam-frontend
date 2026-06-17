import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BoxTraining from "../components/BoxTraining";
import Rest from "../components/Rest"; // Importando o componente Rest
import { AuthContext } from "../contexts/AuthContext";
import type { WorkoutPlan } from "../models/WorkoutPlanModule";
import { search } from "../services/userService";
import LoadingPage from "./LoadingPage";

// 1. Criamos um mapa de pesos para os dias da semana começarem na Segunda e terminarem no Domingo
const orderWeekDays: Record<string, number> = {
  segunda: 1,
  terça: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sábado: 6,
  domingo: 7,
};

function TrainingPlanPage() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [plan, SetPlan] = useState<WorkoutPlan | null>(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const currentPlan = user?.workoutPlans?.[0];

  useEffect(() => {
    async function lookTraining() {
      setIsLoading(true);
      try {
        await search(`/workout_plan/${currentPlan?.id}`, SetPlan, {
          headers: { Authorization: token },
        });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (currentPlan?.id) {
      lookTraining();
    }
  }, [token, currentPlan]);

  // 2. Criamos uma constante que pega os dias, ordena de forma segura e joga no fluxo de renderização
  const sortedWorkoutDays = plan?.workoutDays
    ? [...plan.workoutDays].sort((a, b) => {
        const pesoA = orderWeekDays[a.weekDay.toLowerCase()] || 99;
        const pesoB = orderWeekDays[b.weekDay.toLowerCase()] || 99;
        return pesoA - pesoB;
      })
    : [];

  return (
    <div className="w-full h-full flex-col items-center justify-center mb-20">
      {isLoading && <LoadingPage />}
      <img
        src="/logo/logo.svg"
        alt="logo"
        className="w-20 absolute top-0 left-2"
      />
      <div className="bg-[url('/img/treino.webp')] bg-cover bg-center w-full h-[30vh] flex rounded-b-4xl justify-between shadow">
        <div className="flex flex-col items-center justify-end h-full pb-5">
          <div className="flex items-end justify-end h-full">
            <button className="bg-blue-500 cursor-pointer h-6 hover:bg-blue-700 text-white rounded-full flex px-4">
              {currentPlan?.name}
            </button>
          </div>

          <h1 className="text-2xl text-baseline font-bold text-bold mt-1 mb-4 w-full ml-10 text-white">
            Plano de treino
          </h1>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400 text-center mt-10 animate-pulse">
          Carregando plano de treino...
        </p>
      ) : sortedWorkoutDays.length === 0 ? (
        <p className="text-sm text-slate-400 text-center mt-10">
          Nenhuma rotina cadastrada para este plano.
        </p>
      ) : (
        /* 3. Mapeia agora os dias usando o array já ordenado */
        sortedWorkoutDays.map((day) => (
          <div
            key={day.id}
            className="flex justify-center items-center my-5 mx-5"
            onClick={() => !day.isRest && navigate(`/training_day/${day.id}`)}
          >
            {day.isRest ? (
              <div className="w-full pointer-events-none">
                <Rest date={day.weekDay} />
              </div>
            ) : (
              <div className="w-full cursor-pointer transform transition hover:scale-[1.005]">
                <BoxTraining
                  name={day.name}
                  estimatedDuration={day.estimatedDuration}
                  weekDay={day.weekDay}
                  quantity={day?.WorkoutExercice?.length}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default TrainingPlanPage;
