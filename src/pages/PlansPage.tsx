import { useContext, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { AuthContext } from "../contexts/AuthContext";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
}

function PlansPage() {
  const { user } = useContext(AuthContext); // Resgatando os dados do usuário autenticado
  const [selectedPlan, setSelectedPlan] = useState<string>("annual");
  const [loading, setLoading] = useState<boolean>(false);

  const plans: Plan[] = [
    {
      id: "monthly",
      name: "Plano Mensal",
      price: "149,90",
      period: "/mês",
      description: "Ideal para quem quer testar e manter a flexibilidade.",
      features: [
        "Acesso completo a todos os treinos",
        "Acompanhamento de consistência diária",
        "Visualização de planos de dieta",
        "Suporte básico do time",
      ],
    },
    {
      id: "quadrimonthly",
      name: "Plano 4 Meses",
      price: "249,90",
      period: "/total",
      description:
        "Perfeito para criar consistência e ver os primeiros resultados.",
      features: [
        "Acesso completo a todos os treinos",
        "Acompanhamento de consistência diária",
        "Visualização de planos de dieta",
        "Histórico completo de evolução",
        "Suporte prioritário",
      ],
    },
    {
      id: "annual",
      name: "Plano Anual",
      price: "399,90",
      period: "/total",
      description:
        "O passaporte definitivo para a sua maior transformação física.",
      features: [
        "Acesso completo a todos os treinos",
        "Acompanhamento de consistência diária",
        "Visualização de planos de dieta",
        "Histórico completo de evolução",
        "Acesso antecipado a novos recursos",
        "Suporte VIP via WhatsApp",
      ],
      badge: "Melhor Custo-Benefício",
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      alert("Você precisa estar logado para realizar uma assinatura.");
      return;
    }

    // ⚠️ ATENÇÃO: Troque estes IDs pelos IDs reais gerados no seu painel do Stripe
    const priceIds: Record<string, string> = {
      monthly: "price_1TZzchBeGnwfkMwwWoTe336S",
      quadrimonthly: "price_1TZzdZBeGnwfkMww6zYazlma",
      annual: "price_1TZzeIBeGnwfkMwwDsCgENDI",
    };

    try {
      setLoading(true);

      // Chamada para a rota que criamos na sua Controller do NestJS
      const response = await fetch(
        "http://localhost:3000/payments/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
            priceId: priceIds[planId],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro de comunicação com o servidor de pagamentos.");
      }

      const data = await response.json();

      // Redireciona o usuário para a página de checkout seguro do Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout inválida retornada pelo servidor.");
      }
    } catch (error: any) {
      console.error("Erro na assinatura:", error);
      alert(
        error.message || "Não foi possível iniciar o processo de pagamento."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans selection:bg-blue-200">
      {/* Banner Superior Identificado com o Layout */}
      <div className="bg-[url('/img/team.png')] bg-cover bg-center w-full h-[35vh] flex rounded-b-4xl justify-between shadow relative">
        <img
          src="/logo/logo.svg"
          alt="logo"
          className="w-20 absolute top-0 left-2 z-10"
        />

        <div className="flex flex-col items-start justify-end h-full pb-5 pl-6 w-full bg-gradient-to-t from-black/60 to-transparent rounded-b-4xl">
          <h1 className="text-2xl font-bold text-white">
            Ainda não faz parte do VNTEAM?
          </h1>
        </div>
      </div>

      {/* Grid de Planos */}
      <div className="flex flex-col gap-6 mx-5 mt-8 max-w-md md:mx-auto">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => !loading && setSelectedPlan(plan.id)}
              className={`w-full p-6 bg-white rounded-3xl border-2 transition-all duration-300 transform cursor-pointer relative ${
                isSelected
                  ? "border-blue-600 shadow-xl shadow-blue-500/10 scale-[1.01]"
                  : "border-slate-200/80 hover:border-slate-300 shadow-sm"
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {/* Badge de Destaque */}
              {plan.badge && (
                <span className="absolute -top-3 right-6 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </span>
              )}

              {/* Header do Card */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 pr-4">
                    {plan.description}
                  </p>
                </div>

                {/* Checkbox Visual Customizado */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>

              {/* Preço */}
              <div className="mt-4 flex items-baseline">
                <span className="text-sm font-semibold text-slate-990 mr-1">
                  R$
                </span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {plan.price}
                </span>
                <span className="text-slate-400 text-xs font-semibold ml-1">
                  {plan.period}
                </span>
              </div>

              {/* Divisor */}
              <hr className="my-4 border-slate-100" />

              {/* Benefícios */}
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-slate-600 text-sm"
                  >
                    <IoCheckmarkCircle className="text-blue-500 text-base mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Botão de Ação Fixo/Destaque Inferior */}
      <div className="mx-5 mt-8 max-w-md md:mx-auto">
        <button
          onClick={() => handleSubscribe(selectedPlan)}
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition transform text-center cursor-pointer flex justify-center items-center ${
            loading ? "bg-blue-400 cursor-not-allowed opacity-80" : ""
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Assinar Agora"
          )}
        </button>
      </div>
    </div>
  );
}

export default PlansPage;
