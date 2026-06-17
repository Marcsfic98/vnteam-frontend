import {
  ArrowLeft,
  Clock,
  Dumbbell,
  FolderPlus,
  Moon,
  MoveDown,
  MoveUp,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Importando os métodos criados na sua service
import type User from "../models/userModule.ts";
import { search, workoutService } from "../services/userService.ts";

// Enum mapeado exatamente igual ao seu backend NestJS
export enum WeekDay {
  SEGUNDA = "Segunda",
  TERCA = "Terça",
  QUARTA = "Quarta",
  QUINTA = "Quinta",
  SEXTA = "Sexta",
  SABADO = "Sábado",
  DOMINGO = "Domingo",
}

interface LocalExercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  order: number;
}

interface LocalWorkoutDay {
  name: string;
  isRest: boolean;
  weekDay: WeekDay;
  estimatedDuration: number;
  exercises: LocalExercise[];
}

interface LocationState {
  nomeAluno?: string;
  alunoReal?: {
    id: number;
    name: string;
    workoutPlans?: Array<{
      id: number;
      name: string;
      isActive: boolean;
    }>;
  };
}

export default function WorkoutBuilder() {
  const navigate = useNavigate();

  // 1. Captura o :alunoId dinâmico da URL da rota
  const { alunoId } = useParams<{ alunoId: string }>();
  const [userData, setUserData] = useState<User>();

  // 2. Captura os dados do aluno enviados via state de navegação da tabela
  const location = useLocation();
  const stateData = location.state as LocationState;
  const alunoName = stateData?.nomeAluno || "Aluno";
  const alunoCompleto = stateData?.alunoReal;

  useEffect(() => {
    search(`/users/${alunoId}`, setUserData);
    console.log("Dados do aluno carregados:", userData);
  }, []);

  // Estado inicial da semana limpo
  const [semana, setSemana] = useState<Record<WeekDay, LocalWorkoutDay>>({
    [WeekDay.SEGUNDA]: {
      name: "",
      isRest: false,
      weekDay: WeekDay.SEGUNDA,
      estimatedDuration: 0,
      exercises: [],
    },
    [WeekDay.TERCA]: {
      name: "",
      isRest: false,
      weekDay: WeekDay.TERCA,
      estimatedDuration: 0,
      exercises: [],
    },
    [WeekDay.QUARTA]: {
      name: "",
      isRest: false,
      weekDay: WeekDay.QUARTA,
      estimatedDuration: 0,
      exercises: [],
    },
    [WeekDay.QUINTA]: {
      name: "",
      isRest: false,
      weekDay: WeekDay.QUINTA,
      estimatedDuration: 0,
      exercises: [],
    },
    [WeekDay.SEXTA]: {
      name: "",
      isRest: false,
      weekDay: WeekDay.SEXTA,
      estimatedDuration: 0,
      exercises: [],
    },
    [WeekDay.SABADO]: {
      name: "",
      isRest: false,
      weekDay: WeekDay.SABADO,
      estimatedDuration: 0,
      exercises: [],
    },
    [WeekDay.DOMINGO]: {
      name: "",
      isRest: false,
      weekDay: WeekDay.DOMINGO,
      estimatedDuration: 0,
      exercises: [],
    },
  });

  const [diaSelecionado, setDiaSelecionado] = useState<WeekDay>(
    WeekDay.SEGUNDA
  );
  const dadosDiaAtual = semana[diaSelecionado];

  // Atualiza propriedades do dia atual
  const handleUpdateDayProp = (prop: keyof LocalWorkoutDay, valor: any) => {
    setSemana((prev) => ({
      ...prev,
      [diaSelecionado]: {
        ...prev[diaSelecionado],
        [prop]: valor,
        estimatedDuration:
          prop === "isRest" && valor === true
            ? 0
            : prop === "estimatedDuration"
            ? valor
            : prev[diaSelecionado].estimatedDuration,
      },
    }));
  };

  // Adiciona um exercício zerado na lista do dia selecionado
  const adicionarExercicio = () => {
    const novosExercicios = [...dadosDiaAtual.exercises];
    novosExercicios.push({
      name: "",
      sets: 0,
      reps: 0,
      restTime: 0,
      order: novosExercicios.length + 1,
    });
    handleUpdateDayProp("exercises", novosExercicios);
  };

  // Atualiza os inputs dinâmicos de um exercício específico
  const handleUpdateExercise = (
    index: number,
    field: keyof LocalExercise,
    valor: any
  ) => {
    const novosExercicios = [...dadosDiaAtual.exercises];
    novosExercicios[index] = {
      ...novosExercicios[index],
      [field]: valor,
    };
    handleUpdateDayProp("exercises", novosExercicios);
  };

  // Remove o exercício e reordena sequencialmente a propriedade 'order'
  const removerExercicio = (index: number) => {
    const filtrados = dadosDiaAtual.exercises.filter((_, i) => i !== index);
    const reordenados = filtrados.map((ex, i) => ({ ...ex, order: i + 1 }));
    handleUpdateDayProp("exercises", reordenados);
  };

  // Move o exercício alterando a ordem visual e numérica do order
  const moverExercicio = (index: number, direcao: "cima" | "baixo") => {
    if (direcao === "cima" && index === 0) return;
    if (direcao === "baixo" && index === dadosDiaAtual.exercises.length - 1)
      return;

    const lista = [...dadosDiaAtual.exercises];
    const alvo = direcao === "cima" ? index - 1 : index + 1;

    const temp = lista[index];
    lista[index] = lista[alvo];
    lista[alvo] = temp;

    const atualizada = lista.map((ex, i) => ({ ...ex, order: i + 1 }));
    handleUpdateDayProp("exercises", atualizada);
  };

  // Envia a estrutura de dias para o banco APENAS se o plano existir previamente
  const salvarFichaCompleta = async () => {
    const workoutPlanId = userData?.workoutPlans?.[0]?.id;

    // Regra Rígida: Se o aluno não tiver plano, barra a operação imediatamente no front-end
    if (!workoutPlanId) {
      alert(
        `Não é possível criar treinos: O aluno ${alunoName} não possui nenhum Plano de Treino cadastrado. Atribua um plano a ele antes de montar os treinos semanais.`
      );
      console.warn("Operação abortada: Aluno sem workoutPlanId.");
      return;
    }

    // Garante o tratamento correto de valores numéricos impedindo strings vazias ou NaNs
    const garantizarNumero = (valor: any): number => {
      const num = Number(valor);
      return isNaN(num) ? 0 : num;
    };

    try {
      console.log(
        `Plano ativo encontrado (ID: ${workoutPlanId}). Vinculando rotinas semanais...`
      );

      const promises = Object.values(semana).map((dia) => {
        const payloadDia = {
          name: dia.name.trim() || `Treino de ${dia.weekDay}`,
          isRest: dia.isRest,
          weekDay: dia.weekDay,
          estimatedDuration: garantizarNumero(dia.estimatedDuration),
          workoutPlanId: workoutPlanId,
          WorkoutExercice: dia.isRest
            ? []
            : dia.exercises.map((ex) => ({
                name: ex.name.trim() || "Exercício sem nome",
                sets: garantizarNumero(ex.sets),
                reps: garantizarNumero(ex.reps),
                restTime: garantizarNumero(ex.restTime),
                order: garantizarNumero(ex.order),
              })),
        };

        // Salva o dia e os exercícios em cascata simples de 1 nível (Day -> Exercise)
        return workoutService.createWorkoutDay(payloadDia);
      });

      await Promise.all(promises);

      alert(`Rotina de treinos de ${alunoName} salva com sucesso!`);
      navigate("/admin");
    } catch (error: any) {
      console.error("Erro detalhado retornado pelo NestJS:", error);

      const mensagemDoBackend = error.response?.data?.message;
      if (mensagemDoBackend) {
        const txtErro = Array.isArray(mensagemDoBackend)
          ? mensagemDoBackend.join(" | ")
          : mensagemDoBackend;
        alert(`Erro de Validação do Servidor: ${txtErro}`);
      } else {
        alert(
          "Houve um erro técnico ao salvar os dias de treino. Certifique-se de que os campos numéricos estão corretos."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* TOP BAR / CABEÇALHO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                Gestor de Treinos
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Criando Treino para{" "}
                <span className="text-blue-600">{alunoName}</span>
              </h1>
            </div>
          </div>

          <button
            onClick={salvarFichaCompleta}
            className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-200"
          >
            <Save size={16} /> Salvar Ficha de Treino
          </button>
        </div>

        {/* COMPONENTE DE ABAS DA SEMANA */}
        <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex flex-wrap gap-1 mb-6">
          {Object.values(WeekDay).map((dia) => {
            const isActive = diaSelecionado === dia;
            const ehDescanso = semana[dia].isRest;
            const possuiConfig =
              semana[dia].name.trim().length > 0 ||
              semana[dia].exercises.length > 0;

            return (
              <button
                key={dia}
                onClick={() => setDiaSelecionado(dia)}
                className={`flex-1 min-w-[90px] py-3 px-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{dia}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive
                      ? "bg-white"
                      : ehDescanso
                      ? "bg-amber-400"
                      : possuiConfig
                      ? "bg-blue-500"
                      : "bg-slate-200"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* CONTAINER DO DIA ATUAL */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 mb-6">
          {/* Configurações do Dia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100 items-end">
            <div className="md:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Nome do Treino deste Dia
              </label>
              <input
                type="text"
                placeholder="Ex: Treino A - Peito e Tríceps"
                value={dadosDiaAtual.name}
                onChange={(e) => handleUpdateDayProp("name", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition font-semibold placeholder:font-normal"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Duração Estimada (Minutos)
              </label>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="number"
                  disabled={dadosDiaAtual.isRest}
                  placeholder="Ex: 50"
                  value={dadosDiaAtual.estimatedDuration || ""}
                  onChange={(e) =>
                    handleUpdateDayProp(
                      "estimatedDuration",
                      Number(e.target.value)
                    )
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition font-semibold disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Regime do Dia
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleUpdateDayProp("isRest", false)}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    !dadosDiaAtual.isRest
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Dumbbell size={14} /> Treinar
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateDayProp("isRest", true)}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    dadosDiaAtual.isRest
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Moon size={14} /> Descanso
                </button>
              </div>
            </div>
          </div>

          {/* SESSÃO DINÂMICA DE EXERCÍCIOS */}
          <div className="pt-6">
            {dadosDiaAtual.isRest ? (
              <div className="text-center py-16 px-4 bg-amber-50/40 rounded-2xl border border-dashed border-amber-200 flex flex-col items-center">
                <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
                  <Moon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Dia Marcado como Descanso
                </h3>
                <p className="text-slate-500 text-xs max-w-sm mt-1">
                  Nenhum exercício será cadastrado. O aluno verá um card de
                  pausa no app mobile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    Exercícios do Dia{" "}
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-black">
                      {dadosDiaAtual.exercises.length}
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={adicionarExercicio}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs transition flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar Exercício
                  </button>
                </div>

                {dadosDiaAtual.exercises.length > 0 && (
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div className="col-span-5">Nome do Exercício</div>
                    <div className="col-span-2">Séries</div>
                    <div className="col-span-2">Repetições</div>
                    <div className="col-span-2">Descanso (Segundos)</div>
                    <div className="col-span-1 text-center">Ações</div>
                  </div>
                )}

                {dadosDiaAtual.exercises.map((exercicio, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 relative items-center hover:bg-slate-50 transition"
                  >
                    <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                      <span className="h-6 w-6 rounded-md bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                        {exercicio.order}
                      </span>
                      <input
                        type="text"
                        placeholder="Nome do exercício..."
                        value={exercicio.name}
                        onChange={(e) =>
                          handleUpdateExercise(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition placeholder:font-normal"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <span className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Séries
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={exercicio.sets || ""}
                        onChange={(e) =>
                          handleUpdateExercise(
                            index,
                            "sets",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition placeholder:font-normal"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <span className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Repetições
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={exercicio.reps || ""}
                        onChange={(e) =>
                          handleUpdateExercise(
                            index,
                            "reps",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition placeholder:font-normal"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <span className="block md:hidden text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Descanso (seg)
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={exercicio.restTime || ""}
                        onChange={(e) =>
                          handleUpdateExercise(
                            index,
                            "restTime",
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-sm font-semibold text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition placeholder:font-normal"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-1 flex items-center justify-center gap-1 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                      <button
                        type="button"
                        onClick={() => moverExercicio(index, "cima")}
                        disabled={index === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <MoveUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moverExercicio(index, "baixo")}
                        disabled={index === dadosDiaAtual.exercises.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <MoveDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removerExercicio(index)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {dadosDiaAtual.exercises.length === 0 && (
                  <div className="text-center py-16 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
                    <FolderPlus className="text-slate-300 mb-2" size={32} />
                    <h4 className="font-bold text-slate-700 text-sm">
                      Monte o treino para esta {diaSelecionado.toLowerCase()}
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Adicione os exercícios clicando no botão acima.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="text-blue-600 shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            <strong>Modo Direto Ativo:</strong> Os treinos e exercícios
            configurados serão injetados de forma segura e direta no plano ativo
            de ID{" "}
            <code>
              {alunoCompleto?.workoutPlans?.[0]?.id || "Não Identificado"}
            </code>{" "}
            associado ao aluno.
          </p>
        </div>
      </div>
    </div>
  );
}
