import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BoxTraining from "../components/BoxTraining";
import { AuthContext } from "../contexts/AuthContext";
import type { WorkoutPlan } from "../models/WorkoutPlanModule";
import { search } from "../services/userService";

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
      try {
        setIsLoading(true);
        await search(`/workout_plan/${currentPlan?.id}`, SetPlan, {
          headers: { Authorization: token },
        });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
        console.log(plan);
      }
    }
    lookTraining();
  }, [token, currentPlan]);

  return (
    <div className="w-full h-full flex-col items-center justify-center mb-20">
      <img
        src="/logo/logo.svg"
        alt="logo"
        className="w-20 absolute top-0 left-2"
      />
      <div className="bg-[url('/img/treino.png')] bg-cover bg-center w-full h-[30vh] flex rounded-b-4xl justify-between shadow">
        <div className="flex flex-col  items-center justify-end h-full pb-5">
          <div className="flex items-end justify-end h-full">
            <button className="bg-blue-500 cursor-pointer h-6  hover:bg-blue-700 text-white  rounded-full  flex px-4">
              {currentPlan?.name}
            </button>
          </div>

          <h1 className="text-2xl text-baseline font-bold text-bold mt-1 mb-4  w-full ml-10  text-white">
            Plano de treino
          </h1>
        </div>
      </div>

      {plan?.workoutDays?.map((day) => (
        <div
          key={day.id}
          className="flex justify-center items-center my-5 mx-5"
          onClick={() => navigate(`/training_day/${day.id}`)}
        >
          <BoxTraining
            name={day.name}
            estimatedDuration={day.estimatedDuration}
            weekDay={day.weekDay}
            quantity={day?.WorkoutExercice?.length}
          />
        </div>
      ))}
    </div>
  );
}

export default TrainingPlanPage;
