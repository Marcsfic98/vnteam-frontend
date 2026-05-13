import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BoxTraining from "../components/BoxTraining";
import ConstancyBar from "../components/ConstancyBar";
import Sequence from "../components/Sequence";
import { type WorkoutDay } from "../models/workoutDaysModule";
import { search } from "../services/userService";

function HomePage() {
  const [todayTraining, setTodayTraining] = useState<WorkoutDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTodayWorkout() {
      try {
        setIsLoading(true);

        const todayName = daysOfWeek[new Date().getDay()];

        await search("/workout_day", (data: WorkoutDay[]) => {
          const found = data.find((d) => d.weekDay === todayName);
          setTodayTraining(found || null);
        });
      } catch (err) {
        console.error("Erro ao carregar treino do dia:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodayWorkout();
  }, []);

  return (
    <div className="w-full h-[94vh] flex-col items-center justify-center">
      <div className="bg-[url('/img/bn_home_2.png')] bg-cover bg-center w-full h-1/3 flex rounded-b-4xl justify-between shadow">
        <div className="flex flex-col items-center justify-end h-full pb-5">
          <h1 className="text-2xl font-bold mt-1 w-full ml-10 text-white">
            Olá, Marcos
          </h1>
          <p className="text-gray-300 w-full ml-10">
            {todayTraining ? "Bora treinar hoje?" : "Dia de descanso?"}
          </p>
        </div>
        <div className="flex items-end justify-end h-full">
          <button className="bg-blue-500 cursor-pointer h-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6">
            Bora!
          </button>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center mx-5">
          <h2 className="text-xl font-bold text-gray-800 mt-4 mb-5">
            Consistência
          </h2>
          <a href="#" className="text-blue-500 hover:text-blue-700">
            ver histórico
          </a>
        </div>
        <div className="flex items-center justify-between mx-5 gap-2">
          <ConstancyBar />
          <Sequence />
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center mx-5">
          <h2 className="text-xl font-bold text-gray-800 mt-4 mb-5">
            Treino de hoje
          </h2>
          <a
            href="/training_plan"
            className="text-blue-500 hover:text-blue-700"
          >
            ver treinos
          </a>
        </div>
      </div>

      <div className="flex justify-center items-center mx-5">
        {isLoading ? (
          <p className="text-gray-500">Carregando treino...</p>
        ) : todayTraining ? (
          <div
            className="w-full"
            onClick={() => navigate(`/training_day/${todayTraining.id}`)}
          >
            <BoxTraining
              name={todayTraining.name}
              quantity={todayTraining.WorkoutExercice?.length}
              weekDay={todayTraining.weekDay}
              estimatedDuration={todayTraining.estimatedDuration}
            />
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-2xl w-full text-center">
            <p className="text-gray-600 font-medium">
              Nenhum treino agendado para hoje.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
