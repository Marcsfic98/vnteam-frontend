import { FcGoogle } from "react-icons/fc";
import { authService } from "../services/userService";

function LoginPage() {
  return (
    <div className="pt-20 bg-black h-screen w-full flex flex-col items-center justify-center">
      <div className="w-full h-[94vh] relative bg-[url('/img/bn_home.png')] bg-cover bg-bottom flex flex-col items-center justify-center">
        {/* Sua UI aqui... */}

        <div className="bg-blue-600 rounded-t-xl absolute bottom-0 w-full h-1/3 flex flex-col items-center justify-center">
          <button
            onClick={() => authService.iniciarLoginGoogle()}
            className="bg-white text-black font-bold px-6 py-3 rounded-full flex items-center gap-3 hover:bg-gray-200 transition"
          >
            <FcGoogle size={24} />
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
