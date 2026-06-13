import { BiBowlRice } from "react-icons/bi";
import { CgLoadbarSound } from "react-icons/cg";
import { TbCalendar, TbHome, TbUser } from "react-icons/tb";
import { NavLink } from "react-router-dom"; // Substituído Link por NavLink

function Navbar() {
  // Classe base comum para manter o alinhamento dos itens idêntico
  const linkBaseClass =
    "w-12 h-12 flex justify-center items-center transition-all duration-300 relative mx-2";

  return (
    <div>
      <nav className="w-full bg-gray-100 text-white justify-center items-center h-[7vh] flex fixed bottom-0 border-t border-gray-200 z-50">
        {/* HOME */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${linkBaseClass} ${
              isActive
                ? "bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/30 scale-110"
                : "text-gray-800 hover:text-blue-600"
            }`
          }
        >
          <TbHome className="text-2xl" />
        </NavLink>

        {/* CONSISTÊNCIA */}
        <NavLink
          to="/consistency"
          className={({ isActive }) =>
            `${linkBaseClass} ${
              isActive
                ? "bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/30 scale-110"
                : "text-gray-800 hover:text-blue-600"
            }`
          }
        >
          <TbCalendar className="text-2xl" />
        </NavLink>

        {/* TREINO */}
        <NavLink
          to="/training_plan"
          className={({ isActive }) =>
            `${linkBaseClass} ${
              isActive
                ? "bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/30 scale-110"
                : "text-gray-800 hover:text-blue-600"
            }`
          }
        >
          <CgLoadbarSound className="text-2xl" />
        </NavLink>

        {/* DIETA */}
        <NavLink
          to="/diet"
          className={({ isActive }) =>
            `${linkBaseClass} ${
              isActive
                ? "bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/30 scale-110"
                : "text-gray-800 hover:text-blue-600"
            }`
          }
        >
          <BiBowlRice className="text-2xl" />
        </NavLink>

        {/* PERFIL */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkBaseClass} ${
              isActive
                ? "bg-blue-600 text-white rounded-full shadow-md shadow-blue-500/30 scale-110"
                : "text-gray-800 hover:text-blue-600"
            }`
          }
        >
          <TbUser className="text-2xl" />
        </NavLink>
      </nav>
    </div>
  );
}

export default Navbar;
