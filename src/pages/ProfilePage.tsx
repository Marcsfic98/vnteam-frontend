import { useContext } from "react";
import { IoExitOutline } from "react-icons/io5";
import { LiaRulerSolid } from "react-icons/lia";
import { LuBicepsFlexed } from "react-icons/lu";
import { RiWeightLine } from "react-icons/ri";
import { TbUser } from "react-icons/tb";
import { AuthContext } from "../contexts/AuthContext";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  // URL da imagem secundária (caso a principal falhe ou não exista)
  const fallbackImage =
    "https://img.magnific.com/vetores-gratis/circulo-azul-com-usuario-branco_78370-4707.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <div className="relative flex flex-col h-full w-full">
      <img
        src="/logo/logo.svg"
        alt="logo"
        className="w-20 absolute top-0 left-2"
      />

      <div className="flex flex-col justify-center items-center mt-15">
        {user?.image ? (
          <img
            src={user.image}
            alt={`Foto de ${user.name}`}
            className="h-32 w-32 rounded-full object-cover object-center border-2 border-blue-500 shadow-md"
            // 🚀 CORREÇÃO AQUI: Se a imagem do banco falhar ao carregar, coloca a secundária
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        ) : (
          <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user?.name?.charAt(0)}
            </span>
          </div>
        )}

        {/* Exibindo apenas o primeiro nome se desejar manter o padrão da Home */}
        <h2 className="font-bold text-black mt-2">
          {user?.name ? user.name.split(" ")[0] : ""}
        </h2>
        <p className="text-sm text-gray-500">Plano Anual</p>
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

      <button className="text-red-700 font-bold flex justify-center items-center mt-20 gap-2 cursor-pointer mx-auto">
        Sair da conta <IoExitOutline />
      </button>
    </div>
  );
}

export default ProfilePage;
