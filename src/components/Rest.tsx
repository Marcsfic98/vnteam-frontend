import { BsLightningChargeFill } from "react-icons/bs";
import { TbCalendar } from "react-icons/tb";

function Rest() {
  return (
    <div className="w-full h-40 bg-gray-100 shadow cursor-pointer rounded-lg flex relative  bg-cover bg-center  items-center px-4">
      <div className="flex items-center gap-1 text-black p-2 font-bold bg-gray-300 rounded-4xl absolute top-4">
        <TbCalendar />
        <p className="text-xs">SEXTA</p>
      </div>

      <div className="flex h-full  justify-center items-center ">
        <h2 className="font-bold text-3xl flex justify-center items-center">
          <BsLightningChargeFill className="text-blue-600" />
          Descanso
        </h2>
      </div>
    </div>
  );
}

export default Rest;
