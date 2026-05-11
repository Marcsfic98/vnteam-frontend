import { FcGoogle } from "react-icons/fc";

function HomePage() {
  return (
    <div className="w-full flex-col items-center justify-center h-[94vh] text-gray-800 bg-black  relative bg-[url('/img/bn_home.png')] bg-image bg-cover bg-bottom">
      <img
        src="/logo/logo.svg"
        alt="Logo"
        className="w-35 pt-1 items-center justify-center mx-auto absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <div className="bg-blue-600 rounded-t-xl absolute bottom-0 w-full h-1/3 flex-col text-cyan-50 items-center justify-center flex">
        <h1 className="text-xl text-center text-bold mt-1 w-80">
          Venha fazer parte do time dos campeões!
        </h1>

        <button className="bg-cyan-50 text-black px-4 flex py-2 rounded-4xl mt-8 cursor-pointer hover:bg-cyan-100 transition duration-300 mx-auto justify-center items-center gap-2.5">
          <FcGoogle />
          Fazer login com Google
        </button>
      </div>
    </div>
  );
}

export default HomePage;
