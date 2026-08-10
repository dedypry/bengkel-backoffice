import Cookies from "js-cookie";

import { disconnectPusher } from "@/utils/libs/pusher";

export function forceLogout() {
  localStorage.removeItem("session_id");
  localStorage.clear();
  Cookies.remove("token");
  disconnectPusher();
  window.location.href = "/login";
}

export function saveAuthSession(sessionId?: number) {
  if (sessionId) {
    localStorage.setItem("session_id", String(sessionId));
  }
}

export function getAuthSessionId() {
  const value = localStorage.getItem("session_id");

  return value ? Number(value) : null;
}
