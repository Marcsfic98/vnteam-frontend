import { useContext, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiClock } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import type Diet from "../models/dietModule";
import { search } from "../services/userService";
import LoadingPage from "./LoadingPage";

export default function DietPage() {
  const [diet, setDiet] = useState<Diet | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useContext(AuthContext);
  const currentDiet = user?.diet?.[0];

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    async function fetchDiet() {
      setIsLoading(true);
      try {
        await search(`/diet/${currentDiet?.id}`, setDiet, {
          headers: { Authorization: token },
        });
      } catch (error) {
        console.error("Erro ao buscar dieta:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (currentDiet?.id) {
      fetchDiet();
    }
  }, [currentDiet, token]);

  const toggleMeal = (id: number) => {
    setExpandedMeal(expandedMeal === id ? null : id);
  };

  if (isLoading || !diet) {
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center text-slate-800">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 w-full font-sans selection:bg-blue-200 selection:text-blue-900">
      {isLoading && <LoadingPage />}
      {/* Header da Dieta com Imagem de Fundo */}
      <div className="relative w-full">
        <img
          src="/logo/logo.svg"
          alt="logo"
          className="w-20 absolute top-4 left-4 z-10"
        />
        <div className="bg-[url('/img/bn_diet.webp')] bg-cover bg-center w-full h-[30vh] flex rounded-b-4xl justify-between shadow relative">
          {/* Degradê escuro apenas sobre a imagem para garantir que o título branco se mantenha legível */}
          <div className="flex flex-col items-start justify-end h-full pb-4 pl-6 w-full bg-gradient-to-t from-black/70 to-transparent rounded-b-4xl">
            <button className="bg-blue-600 font-medium  h-6 text-white rounded-full flex items-center px-4 mb-2 shadow-sm">
              {currentDiet?.name || diet.name}
            </button>
            <h1 className="text-2xl font-bold text-white">Dieta</h1>
          </div>
        </div>
      </div>

      {/* Título da Seção */}
      <div className="flex items-center justify-between my-8 px-4">
        <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500">
          Refeições Diárias
        </h2>
        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold border border-blue-100">
          {diet.meals.length}{" "}
          {diet.meals.length === 1 ? "refeição" : "refeições"}
        </span>
      </div>

      {/* Lista de Refeições */}
      <div className="space-y-3 px-3">
        {diet.meals.map((meal) => {
          const isExpanded = expandedMeal === meal.id;

          return (
            <div
              key={meal.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 shadow-sm hover:shadow"
            >
              {/* Header do Card da Refeição */}
              <div
                onClick={() => toggleMeal(meal.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3.5">
                  {/* Indicador de Ordem */}
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center text-blue-600">
                    <span className="text-xs font-bold">#{meal.order}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm tracking-wide text-slate-800">
                      {meal.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                      <FiClock size={12} className="text-blue-500" />
                      <span>Ver macroingredientes</span>
                    </div>
                  </div>
                </div>

                {/* Ícone de Expandir */}
                <div className="text-slate-500 p-1.5 bg-slate-100 rounded-lg border border-slate-200">
                  {isExpanded ? (
                    <FiChevronUp size={16} />
                  ) : (
                    <FiChevronDown size={16} />
                  )}
                </div>
              </div>

              {/* Sub-lista expandida de itens com fundo suave */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-600 space-y-2 animate-fadeIn">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/60 flex flex-col gap-3 shadow-inner">
                    {meal.items && meal.items.length > 0 ? (
                      meal.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-0.5 border-b border-slate-100 last:border-0 pb-2 last:pb-0"
                        >
                          <p className="font-semibold text-slate-700 w-full">
                            {item.name}
                          </p>
                          <p className="text-slate-400 text-[11px] w-full">
                            {item.weightInGrams}g
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">
                        Nenhum item nesta refeição.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Caso a dieta esteja vazia */}
      {diet.meals.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 mx-4 p-6 shadow-sm">
          <p className="text-slate-400 text-sm">
            Nenhuma refeição cadastrada neste plano.
          </p>
        </div>
      )}
    </div>
  );
}
