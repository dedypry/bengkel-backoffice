import axios from "axios";
import Cookies from "js-cookie";

const base_url =
  import.meta.env.VITE_BASE_URL || "https://api-bengkel.90home.id/";
const http = axios.create({
  baseURL: base_url,
});

http.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { http };
