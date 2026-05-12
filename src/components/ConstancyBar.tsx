function ConstancyBar() {
  return (
    <div className="w-full h-20 bg-white shadow rounded-md flex items-center justify-between px-4">
      <div className="flex flex-col justify-center h-full items-center">
        <div className="w-4.5 h-4.5 bg-blue-500 rounded-md"></div>
        <p className="text-gray-500">S</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="w-4.5 h-4.5 bg-blue-300 rounded-md"></div>
        <p className="text-gray-500">T</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="w-4.5 h-4.5 bg-blue-500 rounded-md"></div>
        <p className="text-gray-500">Q</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="w-4.5 h-4.5  bg-white border-2 border-blue-500 rounded-md"></div>
        <p className="text-gray-500">Q</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="w-4.5 h-4.5  bg-white border-2 border-gray-300 rounded-md"></div>
        <p className="text-gray-500">S</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="w-4.5 h-4.5  bg-white border-2 border-gray-300 rounded-md"></div>
        <p className="text-gray-500">S</p>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="w-4.5 h-4.5 bg-white border-2 border-gray-300 rounded-md"></div>
        <p className="text-gray-500">D</p>
      </div>
    </div>
  );
}

export default ConstancyBar;
