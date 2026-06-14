import {
  ArrowUpRight,
  Dumbbell,
  Filter,
  Menu,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type User from "../models/userModule";
import { search } from "../services/userService";

type AbaDisponivel = "todos" | "ativos" | "pendentes";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [busca, setBusca] = useState("");
  const [abaAtiva, setAbaAtiva] = useState<AbaDisponivel>("todos");
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    search("/users/all", setUsers);
  }, []);

  // --- REGRAS DE NEGÓCIO E MÉTRICAS ---

  const qtdTotal = users.length;

  // Um usuário é considerado ativo se possuir algum plano de matrícula ativo (isActive === true)
  const qtdAtivos = users.filter(
    (u) =>
      u.workoutPlans &&
      u.workoutPlans.some(
        (plan) => plan.isActive === true || (plan as any).isActive === "true"
      )
  ).length;

  // Regra Atualizada: Só conta como Pendente se o usuário tiver Plano Ativo E nenhuma ficha/treino cadastrado
  const qtdPendentes = users.filter((u) => {
    const temPlanoAtivo =
      u.workoutPlans &&
      u.workoutPlans.some(
        (plan) => plan.isActive === true || (plan as any).isActive === "true"
      );
    const semTreinoCadastrado = !u.workoutPlans || u.workoutPlans.length === 0;

    return temPlanoAtivo && semTreinoCadastrado;
  }).length;

  const percentualAtivos =
    qtdTotal > 0 ? Math.round((qtdAtivos / qtdTotal) * 100) : 0;

  // 1. Filtro por Aba da Sidebar
  const alunosPorAba = users.filter((aluno) => {
    const temPlanoAtivo =
      aluno.workoutPlans &&
      aluno.workoutPlans.some(
        (plan) => plan.isActive === true || (plan as any).isActive === "true"
      );
    const semTreinoCadastrado =
      !aluno.workoutPlans || aluno.workoutPlans.length === 0;

    if (abaAtiva === "ativos") {
      return temPlanoAtivo;
    }

    if (abaAtiva === "pendentes") {
      // Exibe apenas quem está matriculado/ativo mas está sem nenhuma ficha de treino
      return temPlanoAtivo && semTreinoCadastrado;
    }

    return true; // "todos"
  });

  // 2. Filtro por Barra de Busca (Nome ou E-mail)
  const alunosFiltrados = alunosPorAba.filter(
    (aluno) =>
      aluno.name?.toLowerCase().includes(busca.toLowerCase()) ||
      aluno.email?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      {/* BOTÃO HAMBÚRGUER PARA DISPOSITIVOS MÓVEIS */}
      <button
        onClick={() => setSidebarAberta(!sidebarAberta)}
        className="md:hidden fixed bottom-5 right-5 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-colors"
      >
        {sidebarAberta ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* BARRA LATERAL (SIDEBAR) */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between
        transition-transform duration-300 transform md:translate-x-0 md:static md:h-screen
        ${sidebarAberta ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center font-black text-sm">
              <img
                src="/logo/logo.svg"
                alt="Logo VN"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              VN{" "}
              <span className="text-blue-600 font-medium text-xs">Admin</span>
            </span>
          </div>

          {/* Navegação por Abas Reativas */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">
              Abas do Sistema
            </span>

            <button
              onClick={() => {
                setAbaAtiva("todos");
                setSidebarAberta(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                abaAtiva === "todos"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={18} />
                <span>Todos os Alunos</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  abaAtiva === "todos"
                    ? "bg-blue-200/50 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {qtdTotal}
              </span>
            </button>

            <button
              onClick={() => {
                setAbaAtiva("ativos");
                setSidebarAberta(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                abaAtiva === "ativos"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck size={18} />
                <span>Alunos Ativos</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  abaAtiva === "ativos"
                    ? "bg-blue-200/50 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {qtdAtivos}
              </span>
            </button>

            <button
              onClick={() => {
                setAbaAtiva("pendentes");
                setSidebarAberta(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                abaAtiva === "pendentes"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Dumbbell size={18} />
                <span>Treinos Pendentes</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  abaAtiva === "pendentes"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {qtdPendentes}
              </span>
            </button>
          </nav>
        </div>

        {/* Rodapé da Sidebar - Dados fixos do Administrador */}
        <div className="border-t border-slate-100 pt-4 flex items-center gap-3 px-2">
          <div className="h-9 w-9 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 text-xs">
            AD
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Administrador</p>
            <p className="text-[11px] text-slate-400">Painel Geral</p>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 max-h-screen overflow-y-auto w-full">
        {/* HEADER DINÂMICO */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 capitalize">
            {abaAtiva === "todos" && "Todos os Alunos"}
            {abaAtiva === "ativos" && "Alunos Ativos"}
            {abaAtiva === "pendentes" && "Alunos com Treinos Pendentes"}
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Gerenciamento e monitoramento de performance real dos seus alunos.
          </p>
        </div>

        {/* CARTÕES DE MÉTRICAS (SUMMARY BANNER) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              Taxa de Atividade Geral
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {percentualAtivos}%
              </span>
              <span className="text-[11px] text-emerald-600 bg-emerald-50 font-bold px-1.5 py-0.5 rounded flex items-center">
                <TrendingUp size={12} className="mr-0.5" /> Estável
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              Listados Nesta Aba
            </div>
            <span className="text-3xl font-black text-slate-900">
              {alunosFiltrados.length}
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
              Ações Necessárias
            </div>
            <span
              className={`text-3xl font-black ${
                qtdPendentes > 0 ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {qtdPendentes}
            </span>
          </div>
        </div>

        {/* TABELA DE ALUNOS COM CONTEXTO REAL */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header da Tabela com Filtro de Busca */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Filtrar por nome ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl focus:outline-none focus:border-blue-500 transition placeholder-slate-400"
              />
            </div>
            <button className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-1.5 text-xs font-semibold">
              <Filter size={14} /> Filtros Avançados
            </button>
          </div>

          {/* Renderização da Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/75">
                  <th className="p-4">Aluno</th>
                  <th className="p-4">Qtd. de Treinos</th>
                  <th className="p-4">Pendência de Ficha</th>
                  <th className="p-4">Status do Plano</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {alunosFiltrados.map((aluno) => {
                  const possuiPlanos =
                    aluno.workoutPlans && aluno.workoutPlans.length > 0;
                  const planoAtivo =
                    possuiPlanos &&
                    aluno.workoutPlans.some(
                      (p) =>
                        p.isActive === true || (p as any).isActive === "true"
                    );

                  return (
                    <tr
                      key={aluno.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Avatar e Dados Cadastrais */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={
                            aluno.image ||
                            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                          }
                          alt={aluno.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {aluno.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {aluno.email}
                          </p>
                        </div>
                      </td>

                      {/* Quantidade de Fichas Baseado na Relação */}
                      <td className="p-4 text-slate-600 font-medium">
                        {aluno.workoutPlans?.length || 0} ficha(s)
                      </td>

                      {/* Tag de Pendência Dinâmica baseada nas regras de Plano Ativo */}
                      <td className="p-4">
                        {!possuiPlanos ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60 animate-pulse">
                            Sem Treino Cadastrado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                            Ficha Ativa
                          </span>
                        )}
                      </td>

                      {/* Status de Matrícula Computado */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            planoAtivo
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                              planoAtivo ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {planoAtivo ? "Plano Ativo" : "Inativo / Sem Plano"}
                        </span>
                      </td>

                      {/* Botão de Ação contextualizado */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/admin/workoutbuilder/${aluno.id}`, {
                              state: { nomeAluno: aluno.name },
                            })
                          }
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition inline-flex items-center gap-1 text-xs font-bold shadow-sm"
                        >
                          Montar Treino{" "}
                          <ArrowUpRight size={14} className="text-blue-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Fallback de Lista Vazia */}
          {alunosFiltrados.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              Nenhum registro encontrado nesta categoria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
