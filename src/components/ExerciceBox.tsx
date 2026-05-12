import { BsLightningChargeFill } from "react-icons/bs";

function ExerciceBox() {
  return (
    <div className="flex flex-col w-full rounded bg-white shadow gap-2 py-4 px-4">
      <h2 className="text-black font-bold">Supino Inclinado</h2>

      <div className="flex justify-baseline items-center font-bold text-xs gap-2 ">
        <p className="px-2 py-1 rounded-4xl bg-gray-200">3 SÉRIES</p>
        <p className="px-2 py-1 rounded-4xl bg-gray-200">12 REPS</p>
        <p className="px-2 py-1 rounded-4xl bg-gray-200 flex justify-center items-center">
          <BsLightningChargeFill /> 60S
        </p>
      </div>
    </div>
  );
}

export default ExerciceBox;
