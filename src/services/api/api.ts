import axios from "axios";

const api = axios.create({
  baseURL: "https://api.pldprojects.com.br/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const tokenData = localStorage.getItem("tokenData");

  if (tokenData) {
    const parsedToken = JSON.parse(tokenData);

    if (parsedToken?.token) {
      config.headers.Authorization = `Bearer ${parsedToken.token}`;
    }
  }

  return config;
});

export default api;
