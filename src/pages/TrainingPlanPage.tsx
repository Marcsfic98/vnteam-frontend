import BoxTraining from "../components/BoxTraining";
import Rest from "../components/Rest";

function TrainingPlanPage() {
  return (
    <div className="w-full h-[94vh] flex-col items-center justify-center">
      <img
        src="/logo/logo.svg"
        alt="logo"
        className="w-20 absolute top-0 left-2"
      />
      <div className="bg-[url('/img/treino.png')] bg-cover bg-center w-full h-1/3 flex rounded-b-4xl justify-between shadow">
        <div className="flex flex-col  items-center justify-end h-full pb-5">
          <div className="flex items-end justify-end h-full">
            <button className="bg-blue-500 cursor-pointer h-6  hover:bg-blue-700 text-white  rounded-full  flex px-4">
              Hipertrofia & Força
            </button>
          </div>

          <h1 className="text-2xl text-baseline font-bold text-bold mt-1 mb-4  w-full ml-10  text-white">
            Plano de treino
          </h1>
        </div>
      </div>

      <div className="flex justify-center items-center my-5 mx-5">
        <BoxTraining />
      </div>

      <div className="flex justify-center items-center my-5 mx-5">
        <BoxTraining />
      </div>

      <div className="flex justify-center items-center my-5 mx-5">
        <Rest />
      </div>

      <div className="flex justify-center items-center my-5 mx-5">
        <BoxTraining />
      </div>

      <div className="flex justify-center items-center my-5 mx-5">
        <BoxTraining />
      </div>

      <div className="flex justify-center items-center my-5 mx-5">
        <Rest />
      </div>

      <div className="flex justify-center items-center my-5 mx-5">
        <Rest />
      </div>
    </div>
  );
}

export default TrainingPlanPage;
