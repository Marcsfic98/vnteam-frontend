import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const authService = {
  iniciarLoginGoogle: () => {
    window.location.href = "http://localhost:3000/users/auth/google";
  }
};

// Funções para gerenciamento de treinos em inglês
export const workoutService = {
  /**
   * Cenário B: Cria o plano macro e os dias em efeito cascata (Cascade)
   */
  createWorkoutPlan: async (payload: object) => {
    const res = await api.post("/workout_plan", payload);
    return res.data;
  },

  /**
   * Cenário A: Cria/vincula um dia de treino individual a um plano já existente
   */
  createWorkoutDay: async (payload: object) => {
    const res = await api.post("/workout_day", payload);
    return res.data;
  }
};

export const search = async (
  url: string,
  setDados: Function,
  header?: object,
) => {
  const res = await api.get(url, header);
  setDados(res.data);
  console.log(res.data);
  return res.data;
};