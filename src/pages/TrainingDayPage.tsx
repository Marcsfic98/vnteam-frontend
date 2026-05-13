import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BoxTraining from "../components/BoxTraining";
import ExerciceBox from "../components/ExerciceBox";
import { AuthContext } from "../contexts/AuthContext";
import { type WorkoutDay } from "../models/workoutDaysModule";
import { search } from "../services/userService";

function TrainingDayPage() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [day, Setday] = useState<WorkoutDay | null>(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function lookTraining() {
      try {
        setIsLoading(true);
        await search(`/workout_day/${id}`, Setday, {
          headers: { Authorization: token },
        });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
        console.log(day);
      }
    }
    lookTraining();
  }, [token]);

  return (
    <div className="w-full h-[94vh] flex-col items-center justify-center">
      <div className="flex mx-4 py-5">
        <button
          onClick={() => navigate("/training_plan")}
          className="cursor-pointer"
        >
          <IoIosArrowBack />
        </button>
        <h3 className="w-full flex justify-center items-center font-bold text-xl">
          {day?.weekDay}
        </h3>
      </div>
      <div className="flex justify-center items-center mx-5">
        <BoxTraining
          name={day?.name}
          quantity={day?.WorkoutExercice?.length}
          weekDay={day?.weekDay}
          estimatedDuration={day?.estimatedDuration}
        />
      </div>

      {day?.WorkoutExercice?.map((exercice) => (
        <div key={exercice.id} className="my-5 mx-5">
          <ExerciceBox
            name={exercice.name}
            sets={exercice.sets}
            reps={exercice.reps}
            restTime={exercice.restTime}
          />
        </div>
      ))}
    </div>
  );
}

export default TrainingDayPage;
