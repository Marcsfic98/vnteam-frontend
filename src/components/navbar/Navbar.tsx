import { BiBowlRice } from "react-icons/bi";
import { CgLoadbarSound } from "react-icons/cg";
import { TbCalendar, TbHome, TbUser } from "react-icons/tb";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <nav className="w-full bg-gray-100 text-white justify-center items-center h-[6vh] flex fixed bottom-0">
        <Link
          to="/home"
          className="px-4 py-2 text-gray-800 hover:text-gray-600"
        >
          <TbHome className="inline-block mr-1 text-2xl hover:text-3xl hover:transition duration-500" />
        </Link>
        <Link
          to="/consistency"
          className="px-4 py-2 text-gray-800  hover:text-gray-600"
        >
          <TbCalendar className="inline-block mr-1 text-2xl hover:text-3xl hover:transition duration-500" />
        </Link>
        <Link
          to="/training_plan"
          className="px-4 py-2 text-gray-800 hover:text-gray-600"
        >
          <CgLoadbarSound className="inline-block mr-1 text-2xl hover:text-3xl hover:transition duration-500" />
        </Link>

        <Link
          to="/diet"
          className="px-4 py-2 text-gray-800 hover:text-gray-600"
        >
          <BiBowlRice className="inline-block w-8 mr-1 text-2xl hover:text-3xl hover:transition duration-500" />
        </Link>

        <Link
          to="/profile"
          className="px-4 py-2 text-gray-800 hover:text-gray-600"
        >
          <TbUser className="inline-block w-8 mr-1 text-2xl hover:text-3xl hover:transition duration-500" />
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
