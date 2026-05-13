import { BsLightningChargeFill } from "react-icons/bs";

interface ExerciceBoxProps {
  name: string;
  reps: number;
  sets: number;
  restTime: number;
}

function ExerciceBox({ name, reps, sets, restTime }: ExerciceBoxProps) {
  return (
    <div className="flex flex-col w-full rounded bg-white shadow gap-2 py-4 px-4">
      <h2 className="text-black font-bold">{name}</h2>

      <div className="flex justify-baseline items-center font-bold text-xs gap-2 ">
        <p className="px-2 py-1 rounded-4xl bg-gray-200">{sets} SÉRIES</p>
        <p className="px-2 py-1 rounded-4xl bg-gray-200">{reps} REPS</p>
        <p className="px-2 py-1 rounded-4xl bg-gray-200 flex justify-center items-center">
          <BsLightningChargeFill /> {restTime}S
        </p>
      </div>
    </div>
  );
}

export default ExerciceBox;
