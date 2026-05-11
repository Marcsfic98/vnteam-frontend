function HomePage() {
  return (
    <div className="w-full h-[94vh] flex-col items-center justify-center">
      <img
        src="/logo/logo.svg"
        alt="logo"
        className="w-20 absolute top-0 left-2"
      />
      <div className="bg-[url('/img/bn_home_2.png')] bg-cover bg-center w-full h-1/3 flex rounded-b-4xl justify-between shadow">
        <div className="flex flex-col  items-center justify-end h-full pb-5">
          <h1 className="text-2xl text-baseline font-bold text-bold mt-1  w-full ml-10  text-white">
            Olá, Marcos
          </h1>
          <p className="text-gray-300 text-baseline w-full ml-10">
            Bora treinar hoje?
          </p>
        </div>

        <div className="flex items-end justify-end h-full">
          <button className="bg-blue-500 cursor-pointer h-10 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6">
            Bora!
          </button>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center mx-5">
          <h2 className="text-xl font-bold text-gray-800 mt-4 mb-5">
            Concistência
          </h2>

          <a href="#" className="text-blue-500 hover:text-blue-700">
            ver histórico
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
