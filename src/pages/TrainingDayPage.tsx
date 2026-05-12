import { IoIosArrowBack } from "react-icons/io";
import BoxTraining from "../components/BoxTraining";
import ExerciceBox from "../components/ExerciceBox";

function TrainingDayPage() {
  return (
    <div className="w-full h-[94vh] flex-col items-center justify-center">
      <div className="flex mx-4 py-5">
        <button className="cursor-pointer">
          <IoIosArrowBack />
        </button>
        <h3 className="w-full flex justify-center items-center font-bold text-xl">
          Sexta
        </h3>
      </div>
      <div className="flex justify-center items-center mx-5">
        <BoxTraining />
      </div>

      <div className="my-5 mx-5">
        <ExerciceBox />
      </div>

      <div className="my-5 mx-5">
        <ExerciceBox />
      </div>

      <div className="my-5 mx-5">
        <ExerciceBox />
      </div>

      <div className="my-5 mx-5">
        <ExerciceBox />
      </div>
    </div>
  );
}

export default TrainingDayPage;
