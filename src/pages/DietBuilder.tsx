import {
  Apple,
  ArrowLeft,
  MoveDown,
  MoveUp,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type User from "../models/userModule.ts";
import { dietService, search } from "../services/userService.ts";

interface LocalDiet {
  id?: number;
  name: string;
  description: string;
  isActive: boolean;
  meals: LocalMeal[];
}

interface LocalMeal {
  id?: number;
  name: string;
  order: number;
  items: LocalMealItem[];
}

interface LocalMealItem {
  id?: number;
  name: string;
  weightInGrams: number;
}

interface LocationState {
  nomeAluno?: string;
}

export default function DietBuilder() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const location = useLocation();
  const stateData = location.state as LocationState;
  const alunoName = stateData?.nomeAluno || "Aluno";

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>();

  // Guardamos a lista de IDs de dietas antigas para garantir a limpeza completa
  const [dietasAntigasIds, setDietasAntigasIds] = useState<number[]>([]);

  const [dieta, setDieta] = useState<LocalDiet>({
    name: "Plano Alimentar Padrão",
    description: "Dieta calculada para ganho de massa/definição",
    isActive: true,
    meals: [],
  });

  // CICLO DE VIDA UNIFICADO: Apenas uma chamada busca tudo e distribui os estados de forma sincronizada
  useEffect(() => {
    async function carregarDadosDoAluno() {
      if (!id || id === "0") {
        console.warn("Aviso: ID do aluno inválido ou não carregado na URL.");
        return;
      }

      try {
        setIsLoading(true);

        await search(`/users/${id}`, (usuario: any) => {
          // 1. Atualiza o estado do usuário
          setUser(usuario);

          // 2. Trata o retorno de 'diet' como Array vindo do backend
          if (
            usuario &&
            usuario.diet &&
            Array.isArray(usuario.diet) &&
            usuario.diet.length > 0
          ) {
            // Guarda o ID de todas as dietas encontradas para fazer o overwrite completo
            const idsParaDeletar = usuario.diet.map((d: any) => d.id);
            setDietasAntigasIds(idsParaDeletar);

            // Carrega em tela a última dieta cadastrada (a mais recente)
            const dietaBanco = usuario.diet[usuario.diet.length - 1];

            setDieta({
              id: dietaBanco.id,
              name: dietaBanco.name || "Plano Alimentar Padrão",
              description: dietaBanco.description || "",
              isActive: dietaBanco.isActive ?? true,
              meals: (dietaBanco.meals || [])
                .map((m: any) => ({
                  id: m.id,
                  name: m.name,
                  order: m.order,
                  items: (m.items || []).map((i: any) => ({
                    id: i.id,
                    name: i.name,
                    weightInGrams: i.weightInGrams,
                  })),
                }))
                .sort((a: any, b: any) => a.order - b.order),
            });
          }
        });
      } catch (error) {
        console.error("Erro no carregamento sequencial dos dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    carregarDadosDoAluno();
  }, [id]);

  const adicionarRefeicao = () => {
    setDieta((prev) => {
      const novasRefeicoes = [...prev.meals];
      novasRefeicoes.push({
        name: "",
        order: novasRefeicoes.length + 1,
        items: [],
      });
      return { ...prev, meals: novasRefeicoes };
    });
  };

  const removerRefeicao = (mealIndex: number) => {
    setDieta((prev) => {
      const filtradas = prev.meals.filter((_, i) => i !== mealIndex);
      const reordenadas = filtradas.map((m, i) => ({ ...m, order: i + 1 }));
      return { ...prev, meals: reordenadas };
    });
  };

  const moverRefeicao = (index: number, direcao: "cima" | "baixo") => {
    if (direcao === "cima" && index === 0) return;
    if (direcao === "baixo" && index === dieta.meals.length - 1) return;

    const lista = [...dieta.meals];
    const alvo = direcao === "cima" ? index - 1 : index + 1;

    const temp = lista[index];
    lista[index] = lista[alvo];
    lista[alvo] = temp;

    const atualizada = lista.map((m, i) => ({ ...m, order: i + 1 }));
    setDieta((prev) => ({ ...prev, meals: atualizada }));
  };

  const handleUpdateMealName = (mealIndex: number, nome: string) => {
    setDieta((prev) => {
      const novas = [...prev.meals];
      novas[mealIndex].name = nome;
      return { ...prev, meals: novas };
    });
  };

  // Correção do clique: Altera estritamente o array interno sem duplicar referências na renderização
  const adicionarAlimento = (mealIndex: number) => {
    setDieta((prev) => {
      const novasRefeicoes = prev.meals.map((meal, index) => {
        if (index === mealIndex) {
          return {
            ...meal,
            items: [...meal.items, { name: "", weightInGrams: 0 }],
          };
        }
        return meal;
      });
      return { ...prev, meals: novasRefeicoes };
    });
  };

  const handleUpdateMealItem = (
    mealIndex: number,
    itemIndex: number,
    field: keyof LocalMealItem,
    valor: any
  ) => {
    setDieta((prev) => {
      const novas = [...prev.meals];
      novas[mealIndex].items[itemIndex] = {
        ...novas[mealIndex].items[itemIndex],
        [field]: valor,
      };
      return { ...prev, meals: novas };
    });
  };

  const removerAlimento = (mealIndex: number, itemIndex: number) => {
    setDieta((prev) => {
      const novas = [...prev.meals];
      novas[mealIndex].items = novas[mealIndex].items.filter(
        (_, i) => i !== itemIndex
      );
      return { ...prev, meals: novas };
    });
  };

  const salvarPlanoAlimentar = async () => {
    if (!id || id === "0") {
      alert("Não é possível salvar a dieta para um ID de usuário inválido.");
      return;
    }

    try {
      setIsLoading(true);

      // PASSO 1: Deleta TODAS as dietas antigas encontradas no histórico do usuário para limpar o banco
      if (dietasAntigasIds.length > 0) {
        console.log(
          `Removendo histórico de dietas antigas (IDs: ${dietasAntigasIds.join(
            ", "
          )})`
        );
        for (const dietId of dietasAntigasIds) {
          try {
            await dietService.deleteDiet(dietId);
          } catch (err) {
            console.warn(
              `Aviso: Falha ao remover sub-dieta antiga ID ${dietId}`,
              err
            );
          }
        }
      }

      // PASSO 2: Estrutura o Payload limpo sem chaves antigas
      const payloadDiet = {
        name: dieta.name.trim() || "Plano Alimentar",
        description: dieta.description.trim(),
        isActive: true,
        user: { id: Number(id) },
        meals: dieta.meals.map((meal) => ({
          name: meal.name.trim() || `Refeição ${meal.order}`,
          order: Number(meal.order),
          items: meal.items.map((item) => ({
            name: item.name.trim() || "Alimento",
            weightInGrams: Number(item.weightInGrams) || 0,
          })),
        })),
      };

      console.log("Postando nova dieta via service:", payloadDiet);

      await dietService.createDiet(payloadDiet);

      alert(
        `Dieta limpa! Novo plano de ${
          user?.name || alunoName
        } salvo com sucesso.`
      );
      navigate("/admin");
    } catch (error) {
      console.error("Erro no fluxo de salvamento:", error);
      alert("Houve um problema técnico ao processar a substituição da dieta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER DA TELA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition shadow-sm"
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">
                Gestor de Nutrição
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Montando Dieta de{" "}
                <span className="text-emerald-600">
                  {user?.name || alunoName}
                </span>
              </h1>
            </div>
          </div>

          <button
            onClick={salvarPlanoAlimentar}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-200 disabled:opacity-50"
          >
            <Save size={16} />{" "}
            {isLoading ? "Processando..." : "Substituir e Salvar Dieta"}
          </button>
        </div>

        {/* METADADOS PRINCIPAIS DA DIETA */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Título do Plano
            </label>
            <input
              type="text"
              value={dieta.name}
              onChange={(e) =>
                setDieta((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 transition font-semibold"
              disabled={isLoading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Observações Gerais / Descrição da Meta
            </label>
            <input
              type="text"
              placeholder="Ex: Beber 4L de água ao dia. Evitar açúcar após às 18h."
              value={dieta.description}
              onChange={(e) =>
                setDieta((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 transition font-semibold"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* LISTAGEM DE REFEIÇÕES DINÂMICAS */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              Refeições Estruturadas{" "}
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-black">
                {dieta.meals.length}
              </span>
            </h2>
            <button
              type="button"
              onClick={adicionarRefeicao}
              disabled={isLoading}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold rounded-xl text-xs transition flex items-center gap-1 disabled:opacity-50"
            >
              <Plus size={14} /> Adicionar Refeição
            </button>
          </div>

          {dieta.meals.map((refeicao, mealIndex) => (
            <div
              key={mealIndex}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="bg-slate-50/60 px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                    {refeicao.order}
                  </span>
                  <input
                    type="text"
                    placeholder="Ex: Café da Manhã, Almoço..."
                    value={refeicao.name}
                    onChange={(e) =>
                      handleUpdateMealName(mealIndex, e.target.value)
                    }
                    className="w-full max-w-sm px-3 py-1.5 bg-white border border-slate-200 text-sm font-bold text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center gap-1.5 justify-end">
                  <button
                    type="button"
                    onClick={() => moverRefeicao(mealIndex, "cima")}
                    disabled={mealIndex === 0 || isLoading}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moverRefeicao(mealIndex, "baixo")}
                    disabled={mealIndex === dieta.meals.length - 1 || isLoading}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  >
                    <MoveDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removerRefeicao(mealIndex)}
                    disabled={isLoading}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition ml-2 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Utensils size={12} /> Alimentos & Pesos
                  </span>
                  <button
                    type="button"
                    onClick={() => adicionarAlimento(mealIndex)}
                    disabled={isLoading}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition flex items-center gap-0.5 disabled:opacity-50"
                  >
                    <Plus size={12} /> Incluir Alimento
                  </button>
                </div>

                {refeicao.items.map((alimento, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 p-2.5 border border-slate-100 rounded-xl"
                  >
                    <div className="col-span-7">
                      <input
                        type="text"
                        placeholder="Nome do alimento (Ex: Cuscuz, Whey, Frango)"
                        value={alimento.name}
                        onChange={(e) =>
                          handleUpdateMealItem(
                            mealIndex,
                            itemIndex,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-span-4 relative">
                      <input
                        type="number"
                        placeholder="Peso"
                        value={alimento.weightInGrams || ""}
                        onChange={(e) =>
                          handleUpdateMealItem(
                            mealIndex,
                            itemIndex,
                            "weightInGrams",
                            Number(e.target.value)
                          )
                        }
                        className="w-full pl-3 pr-7 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-900 rounded-xl focus:outline-none focus:border-emerald-500 transition text-right"
                        disabled={isLoading}
                      />
                      <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[10px] font-bold text-slate-400">
                        g
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removerAlimento(mealIndex, itemIndex)}
                        disabled={isLoading}
                        className="p-1 text-slate-400 hover:text-rose-500 transition rounded-lg disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {refeicao.items.length === 0 && (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                    Nenhum alimento cadastrado nesta refeição. Clique em
                    "Incluir Alimento".
                  </div>
                )}
              </div>
            </div>
          ))}

          {dieta.meals.length === 0 && (
            <div className="text-center py-16 px-4 bg-white border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-sm">
              <Apple className="text-slate-200 mb-2" size={36} />
              <h4 className="font-bold text-slate-700 text-sm">
                Monte o plano alimentar do aluno
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Clique em "Adicionar Refeição" para começar a estruturar o
                cronograma.
              </p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mt-6">
          <Sparkles className="text-amber-600 shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            <strong>Regra de Overwrite Ativa:</strong> A service executa o fluxo
            combinado limpando instâncias antigas por meio do objeto modular
            customizado <code>dietService</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
