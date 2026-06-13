import { useContext, useMemo, useState, type FormEvent } from "react";
import {
  FiActivity,
  FiArrowLeft,
  FiCheckCircle,
  FiSave,
  FiTarget,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LoadingPage from "./LoadingPage";

type FitnessGoal = "emagrecimento" | "hipertrofia" | "misto";

export default function BodyComposition() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  // Estados do formulário
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<"masculino" | "feminino">("masculino");
  const [goal, setGoal] = useState<FitnessGoal>("hipertrofia");

  // Estados de controle da requisição
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Cálculo em tempo real do IMC e Estimativa de % de Gordura
  const metrics = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // Convertendo cm para metros
    const a = parseInt(age);

    if (!w || !h || !a || h <= 0) return { imc: 0, bodyFat: 0 };

    const imc = w / (h * h);

    // Fórmula do IMC acoplada à idade/gênero para estimativa de Gordura Corporal
    const genderFactor = gender === "masculino" ? 1 : 0;
    const bodyFat = 1.2 * imc + 0.23 * a - 10.8 * genderFactor - 5.4;

    return {
      imc: Math.max(0, parseFloat(imc.toFixed(1))),
      bodyFat: Math.max(0, parseFloat(bodyFat.toFixed(1))),
    };
  }, [weight, height, age, gender]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!weight || !height || !age) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/user_health_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          weight: parseFloat(weight),
          height: parseFloat(height),
          age: parseInt(age),
          gender,
          bodyFat: metrics.bodyFat,
          goal,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao salvar seus dados antropométricos.");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className="w-full max-w-sm mx-auto bg-white border border-slate-100 rounded-3xl p-8 text-center text-slate-400 text-sm mt-10">
        Usuário não identificado. Faça login para continuar.
      </div>
    );
  }

  // Tela de Sucesso Isolada
  if (success) {
    return (
      <div className="w-full max-w-sm mx-auto bg-slate-50/40 p-4 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-5 transform animate-fade-in">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm">
            <FiCheckCircle size={32} />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Seu treino está em preparo...
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed px-2">
              Em até <span className="text-blue-600 font-bold">5 dias</span> ele
              será finalizado pela nossa equipe.
            </p>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition active:scale-95"
          >
            Voltar para a Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-50/40 p-3 flex flex-col gap-5 min-h-screen pb-10">
      {isSubmitting && <LoadingPage />}

      {/* Cabeçalho superior de Navegação */}
      <div className="flex items-center gap-3 mt-4 px-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-600 bg-white border border-slate-100 shadow-sm rounded-xl hover:bg-slate-50 transition active:scale-95"
        >
          <FiArrowLeft size={18} />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Perfil de Evolução
          </span>
          <h2 className="text-base font-black text-slate-900">
            Dados Corporais
          </h2>
        </div>
      </div>

      {/* 📊 Bloco de Pré-visualização de Resultados Dinâmicos */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="p-2 bg-white/10 text-white rounded-full mb-2">
            <FiActivity size={18} />
          </div>
          <span className="text-2xl font-black tracking-tight">
            {metrics.bodyFat > 0 ? `${metrics.bodyFat}%` : "--"}
          </span>
          <p className="text-[11px] text-blue-100 font-medium mt-0.5 uppercase tracking-wider">
            Gordura Estimada
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-2 bg-slate-50 text-blue-600 rounded-full mb-2 border border-slate-100">
            <FiTarget size={18} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.imc > 0 ? metrics.imc : "--"}
          </span>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
            IMC Atual
          </p>
        </div>
      </div>

      {/* Formulário Principal */}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4"
      >
        {error && (
          <div className="text-center bg-red-50 text-red-500 text-xs py-2 px-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* Seletor de Gênero Biológico */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Sexo Biológico
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button
              type="button"
              onClick={() => setGender("masculino")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                gender === "masculino"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Masculino
            </button>
            <button
              type="button"
              onClick={() => setGender("feminino")}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                gender === "feminino"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Feminino
            </button>
          </div>
        </div>

        {/* Campo: Peso */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Peso Atual (kg)
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="Ex: 78.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
            required
          />
        </div>

        {/* Campo: Altura */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Altura (cm)
          </label>
          <input
            type="number"
            placeholder="Ex: 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
            required
          />
        </div>

        {/* Campo: Idade */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Idade
          </label>
          <input
            type="number"
            placeholder="Ex: 27"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition"
            required
          />
        </div>

        {/* Campo: Propósito / Objetivo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Propósito do Plano
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as FitnessGoal)}
            className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 transition appearance-none cursor-pointer"
          >
            <option value="emagrecimento">Emagrecimento</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="misto">Hipertrofia e Emagrecimento</option>
          </select>
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
        >
          <FiSave size={16} />
          {isSubmitting ? "Salvando..." : "Salvar Dados"}
        </button>
      </form>
    </div>
  );
}
