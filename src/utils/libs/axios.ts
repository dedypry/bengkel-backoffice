import axios from "axios";
import Cookies from "js-cookie";

import config from "@/config/api";
import { forceLogout } from "@/utils/helpers/auth-session";

const http = axios.create({
  baseURL: config.api,
});

let isHandlingUnauthorized = false;

http.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;
      forceLogout();
    }

    return Promise.reject(error);
  },
);

export { http };
