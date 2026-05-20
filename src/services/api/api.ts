import axios from "axios";

const api = axios.create({
  baseURL: "https://192.168.15.37:7147/api",
  withCredentials: true,
});

export default api;
