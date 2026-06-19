import {
  Apple,
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clipboard,
  Dumbbell,
  Layers,
  Mail,
  Scale,
  User as UserIcon,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type Meal from "../models/MealModule";
import type { WorkoutPlan } from "../models/WorkoutPlanModule";
import type MealItem from "../models/mealItemModule";
import type { WorkoutDay } from "../models/workoutDaysModule";
import type { WorkoutExercice } from "../models/workoutExercice";
import { search } from "../services/userService";

// Mapa de ordenação para os dias da semana
const WEEK_DAYS_ORDER: { [key: string]: number } = {
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
  Domingo: 7,
};

export default function UserProfileDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function loadFullUserData() {
      if (!id || id === "0") return;
      try {
        setIsLoading(true);
        await search(`/users/${id}`, (data: any) => {
          setUserData(data);
        });
      } catch (error) {
        console.error("Erro ao carregar dados consolidados do aluno:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFullUserData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium text-sm">
            Carregando dossiê completo...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <p className="text-slate-600 font-bold mb-4">Usuário não encontrado.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-200 rounded-xl text-sm font-semibold"
        >
          Voltar
        </button>
      </div>
    );
  }

  // Pega a última dieta e ordena as refeições por 'order'
  const activeDiet =
    Array.isArray(userData.diet) && userData.diet.length > 0
      ? userData.diet[userData.diet.length - 1]
      : null;

  const sortedMeals = activeDiet?.meals
    ? [...activeDiet.meals].sort(
        (a: any, b: any) => (a.order || 0) - (b.order || 0)
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
              Visão Administrativa Geral
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Ficha Completa: {userData.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PAINEL ESQUERDO: INFOS CADASTRAIS */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-emerald-500 overflow-hidden flex items-center justify-center mb-4">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={40} className="text-slate-400" />
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                {userData.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1 break-all">
                <Mail size={12} className="shrink-0" /> {userData.email}
              </p>

              <div className="w-full border-t border-slate-100 my-4 pt-4 grid grid-cols-2 gap-2 text-left">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Criado em
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {new Date(userData.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Matrícula
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    #{userData.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Scale size={14} /> Frequência & Métricas
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl text-xs font-semibold">
                  <span className="text-slate-500">Histórico de Presença</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                    {userData.userWorkoutSessions?.length || 0} check-ins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PAINEL DIREITO: DIETA & TREINO DETALHADOS */}
          <div className="lg:col-span-2 space-y-6">
            {/* SEÇÃO DA DIETA ORDENADA */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Apple className="text-emerald-500" size={20} /> Estrutura
                  Dietética Ativa
                </h3>
                {activeDiet && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">
                    {activeDiet.name}
                  </span>
                )}
              </div>

              {activeDiet ? (
                <div className="space-y-4">
                  {activeDiet.description && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-medium">
                      <strong>Meta/Observações:</strong>{" "}
                      {activeDiet.description}
                    </div>
                  )}

                  <div className="space-y-3">
                    {sortedMeals.length > 0 ? (
                      sortedMeals.map((meal: Meal) => (
                        <div
                          key={meal.id}
                          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
                        >
                          <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Utensils
                                size={13}
                                className="text-emerald-600"
                              />
                              Refeição {meal.order}: {meal.name || "Sem Nome"}
                            </span>
                          </div>

                          <div className="p-3 divide-y divide-slate-100">
                            {meal.items && meal.items.length > 0 ? (
                              meal.items.map((item: MealItem) => (
                                <div
                                  key={item.id}
                                  className="py-2 flex justify-between items-center text-xs first:pt-0 last:pb-0"
                                >
                                  <span className="font-semibold text-slate-700">
                                    {item.name}
                                  </span>
                                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                    {item.weightInGrams} g
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-400 p-1 italic">
                                Nenhum alimento inserido.
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Estrutura de refeições vazia.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-xs text-slate-400">
                  Nenhuma dieta ativa vinculada a este aluno.
                </div>
              )}
            </div>

            {/* SEÇÃO DE TREINAMENTO (ORDENADO DE SEGUNDA A DOMINGO E CORRIGIDO) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Dumbbell className="text-amber-500" size={20} /> Prescrição
                  Completa de Treinos
                </h3>
              </div>

              {userData.workoutPlans && userData.workoutPlans.length > 0 ? (
                <div className="space-y-6">
                  {userData.workoutPlans.map((plan: WorkoutPlan) => {
                    // Ordena os dias cronologicamente de Segunda a Domingo
                    const sortedDays = plan.workoutDays
                      ? [...plan.workoutDays].sort((a: any, b: any) => {
                          const orderA = WEEK_DAYS_ORDER[a.weekDay] || 99;
                          const orderB = WEEK_DAYS_ORDER[b.weekDay] || 99;
                          return orderA - orderB;
                        })
                      : [];

                    return (
                      <div key={plan.id} className="space-y-3">
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between shadow-xs">
                          <div>
                            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest block">
                              Ficha Ativa
                            </span>
                            <h4 className="text-xs font-black tracking-tight">
                              {plan.name || "Plano Geral"}
                            </h4>
                          </div>
                          <Layers size={16} className="text-slate-400" />
                        </div>

                        {sortedDays.length > 0 ? (
                          <div className="space-y-3">
                            {sortedDays.map((day: WorkoutDay) => {
                              // CORREÇÃO CRÍTICA: Ajustado para mapear de 'WorkoutExercice' vindo do seu backend
                              const exercisesList = day.WorkoutExercice || [];

                              return (
                                <div
                                  key={day.id}
                                  className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs"
                                >
                                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Calendar
                                        size={13}
                                        className="text-amber-500"
                                      />
                                      <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                        {day.weekDay} - {day.name}
                                      </span>
                                    </div>
                                    {day.isRest && (
                                      <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase">
                                        Descanso
                                      </span>
                                    )}
                                  </div>

                                  <div className="p-3 space-y-2">
                                    {exercisesList.length > 0 ? (
                                      exercisesList.map(
                                        (exercise: WorkoutExercice) => (
                                          <div
                                            key={exercise.id}
                                            className="bg-slate-50/60 border border-slate-100 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                                          >
                                            <div className="space-y-0.5">
                                              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                <ChevronRight
                                                  size={12}
                                                  className="text-amber-500 shrink-0"
                                                />
                                                {exercise.name}
                                              </div>
                                              {exercise.observations && (
                                                <div className="text-[10px] text-slate-400 font-medium pl-4 flex items-center gap-1">
                                                  <Clipboard
                                                    size={10}
                                                    className="shrink-0"
                                                  />
                                                  Obs: {exercise.observations}
                                                </div>
                                              )}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-[11px] self-end sm:self-center">
                                              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-black text-slate-600">
                                                {exercise.sets} séries
                                              </span>
                                              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-black text-slate-600">
                                                {exercise.reps} reps
                                              </span>
                                              {exercise.weight && (
                                                <span className="bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-black">
                                                  {exercise.weight} kg
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p className="text-xs text-slate-400 italic pl-1">
                                        {day.isRest
                                          ? "Dia reservado para recuperação muscular."
                                          : "Nenhum exercício atribuído a este dia."}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Nenhum dia de treino encontrado.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-xs text-slate-400">
                  Nenhum plano de treinamento montado para este aluno.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
