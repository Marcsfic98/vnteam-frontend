import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
 
})

export const authService = {
  iniciarLoginGoogle: () => {
    // Chama o seu NestJS
    window.location.href = "http://localhost:3000/users/auth/google";
  }



};

  export const search = async (
  url: string,
  setDados: Function,
  header?: object,
) => {
  const res = await api.get(url, header)
  setDados(res.data)
  console.log(res.data)
  return(res.data)
}