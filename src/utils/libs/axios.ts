import axios from "axios";
import Cookies from "js-cookie";

import config from "@/configs/api";

const http = axios.create({
  baseURL: config.api,
});

http.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { http };
