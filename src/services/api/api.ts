import axios from "axios";

const api = axios.create({
  baseURL: "https://api.pldprojects.com.br/api",
  withCredentials: true,
});

export default api;
