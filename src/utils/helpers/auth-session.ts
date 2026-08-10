import Cookies from "js-cookie";

import config from "@/config/api";
import { disconnectPusher } from "@/utils/libs/pusher";

const AUTH_BROADCAST_CHANNEL = "bengkel-auth";
let isLoggingOut = false;

export function getUserIdFromToken(): number | null {
  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  try {
    const base64 = token.split(".")[1];

    if (!base64) {
      return null;
    }

    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(normalized)) as { id?: number | string };

    if (payload.id == null) {
      return null;
    }

    const userId = Number(payload.id);

    return Number.isFinite(userId) ? userId : null;
  } catch {
    return null;
  }
}

export function forceLogout(options?: { skipBroadcast?: boolean }) {
  if (isLoggingOut) {
    return;
  }

  isLoggingOut = true;

  if (!options?.skipBroadcast) {
    try {
      const channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);

      channel.postMessage({ type: "force-logout" });
      channel.close();
    } catch {
      // BroadcastChannel unavailable — ignore.
    }
  }

  localStorage.removeItem("session_id");
  localStorage.clear();
  Cookies.remove("token");
  disconnectPusher();
  window.location.replace("/login");
}

export async function logoutSession() {
  const token = Cookies.get("token");

  if (token) {
    try {
      await fetch(`${config.api}/user/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Tetap logout lokal meski request gagal.
    }
  }

  forceLogout();
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

export function subscribeAuthBroadcast(onLogout: () => void) {
  try {
    const channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);

    channel.onmessage = (event) => {
      if (event.data?.type === "force-logout") {
        onLogout();
      }
    };

    return () => {
      channel.close();
    };
  } catch {
    return null;
  }
}
