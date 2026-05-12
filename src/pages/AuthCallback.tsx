import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      login(token).then(() => navigate("/home"));
    } else {
      navigate("/");
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="h-screen bg-black flex items-center justify-center text-white font-bold">
      Autenticando...
    </div>
  );
}
