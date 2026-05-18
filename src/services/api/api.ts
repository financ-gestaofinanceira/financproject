import axios from "axios";

// Instância base do axios — sem lógica de token aqui.
// Os interceptors são registrados pelo AuthProvider (AuthContext.tsx),
// pois só ele tem acesso ao estado de autenticação do React.
const api = axios.create({
  baseURL: "https://api.pldprojects.com.br/api",
  withCredentials: true, // envia o cookie de refresh token automaticamente
});

export default api;
