import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7147/api", //"https://api.pldprojects.com.br/api",
  withCredentials: true,
});

export default api;
