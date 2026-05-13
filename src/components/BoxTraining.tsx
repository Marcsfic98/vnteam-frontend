import { IoMdFitness } from "react-icons/io";
import { TbCalendar, TbClockBolt } from "react-icons/tb";

interface boxTrainingProps {
  name?: string;
  estimatedDuration?: number;
  weekDay?: string;
  quantity?: number;
}

export default function BoxTraining({
  name,
  estimatedDuration,
  weekDay,
  quantity,
}: boxTrainingProps) {
  return (
    <div className="w-full h-50 bg-gray-100 shadow cursor-pointer rounded-lg flex relative bg-[url('/img/superior.png')] bg-cover bg-center  items-center px-4">
      <div className="flex items-center gap-1 text-white  p-2 bg-gray-600 rounded-4xl absolute top-4">
        <TbCalendar />
        <p className="text-xs">{weekDay}</p>
      </div>

      <div className="flex flex-col h-full mb-7  justify-end ">
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <div className="flex gap-5">
          <p className="text-gray-300 flex text-xs items-center gap-1">
            <TbClockBolt />
            {estimatedDuration}min
          </p>
          <p className="text-gray-300 text-xs flex items-center gap-1">
            <IoMdFitness />
            {quantity} exercícios
          </p>
        </div>
      </div>
    </div>
  );
}
