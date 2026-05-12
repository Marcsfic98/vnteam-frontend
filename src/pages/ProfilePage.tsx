import { IoExitOutline } from "react-icons/io5";
import { LiaRulerSolid } from "react-icons/lia";
import { LuBicepsFlexed } from "react-icons/lu";
import { RiWeightLine } from "react-icons/ri";
import { TbUser } from "react-icons/tb";

function ProfilePage() {
  return (
    <div className="relative flex flex-col h-full w-full">
      <img
        src="/logo/logo.svg"
        alt="logo"
        className="w-20 absolute top-0 left-2"
      />

      <div className="flex flex-col justify-center items-center mt-15">
        <img
          src="/img/bn_home.png"
          alt="foto do usuario"
          className="h-32 w-32 rounded-full object-cover object-center "
        />

        <h2 className="font-bold text-black">Marcos Alexandre</h2>
        <p>Plano Anual</p>
      </div>

      <div className="w-full flex flex-wrap gap-4 h-60 justify-center mt-8 mx-auto ">
        <div className="bg-blue-100 rounded-2xl h-1/2 w-1/3 text-center flex flex-col items-center justify-center">
          <div className="bg-blue-200 rounded-full flex justify-center items-center h-8 w-8 ">
            <RiWeightLine className="flex text-blue-700 " />
          </div>
          <p className="font-bold text-2xl text-black">78.5</p>
          <p className="text-gray-500">KG</p>
        </div>

        <div className="bg-blue-100 rounded-2xl h-1/2 w-1/3 text-center flex flex-col items-center justify-center">
          <div className="bg-blue-200 rounded-full flex justify-center items-center h-8 w-8 ">
            <LiaRulerSolid className="flex text-blue-700 " />
          </div>
          <p className="font-bold text-2xl text-black">175</p>
          <p className="text-gray-500">CM</p>
        </div>

        <div className="bg-blue-100 rounded-2xl h-1/2 w-1/3 text-center flex flex-col items-center justify-center">
          <div className="bg-blue-200 rounded-full flex justify-center items-center h-8 w-8 ">
            <LuBicepsFlexed className="flex text-blue-700 " />
          </div>
          <p className="font-bold text-2xl text-black">12-15%</p>
          <p className="text-gray-500">CG</p>
        </div>

        <div className="bg-blue-100 rounded-2xl h-1/2 w-1/3 text-center flex flex-col items-center justify-center">
          <div className="bg-blue-200 rounded-full flex justify-center items-center h-8 w-8 ">
            <TbUser className="flex text-blue-700 " />
          </div>
          <p className="font-bold text-2xl text-black">26</p>
          <p className="text-gray-500">Anos</p>
        </div>
      </div>

      <button className="text-red-700 font-bold flex justify-center items-center mt-20 gap-2 cursor-pointer">
        Sair da conta <IoExitOutline />
      </button>
    </div>
  );
}

export default ProfilePage;
