import type {
  LoginSessionItem,
  SessionRevokedPayload,
} from "@/utils/interfaces/ILoginSession";

import { useEffect } from "react";
import Cookies from "js-cookie";

import config from "@/config/api";
import {
  forceLogout,
  getAuthSessionId,
  getUserIdFromToken,
  saveAuthSession,
  subscribeAuthBroadcast,
} from "@/utils/helpers/auth-session";
import { http } from "@/utils/libs/axios";
import { subscribeSessionRevoke } from "@/utils/libs/pusher";

async function syncCurrentSessionId() {
  try {
    const { data } = await http.get<LoginSessionItem[]>("/user/sessions");
    const current = (data || []).find((session) => session.is_current);

    if (current?.id) {
      saveAuthSession(current.id);
    }
  } catch {
    // Ignore — invalid token handled by axios interceptor.
  }
}

async function verifySessionStillActive() {
  const token = Cookies.get("token");

  if (!token) {
    forceLogout();

    return;
  }

  try {
    const response = await fetch(`${config.api}/user/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      forceLogout();

      return;
    }

    if (!response.ok) {
      return;
    }

    const sessions = (await response.json()) as LoginSessionItem[];
    const hasCurrentSession = sessions.some((session) => session.is_current);

    if (!hasCurrentSession) {
      forceLogout();
    }
  } catch {
    // Network error — keep current session until next request.
  }
}

function handleSessionRevoked(payload: SessionRevokedPayload) {
  if (payload.all) {
    forceLogout();

    return;
  }

  const sessionId = getAuthSessionId();
  const revokedIds = payload.revoked_session_ids ?? [];

  if (sessionId && revokedIds.includes(sessionId)) {
    forceLogout();

    return;
  }

  void verifySessionStillActive();
}

export function useUserRealtime() {
  useEffect(() => {
    const token = Cookies.get("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      return;
    }

    let cancelled = false;
    let unsubscribePusher: (() => void) | null = null;

    void (async () => {
      await syncCurrentSessionId();

      if (cancelled) {
        return;
      }

      unsubscribePusher = subscribeSessionRevoke(userId, handleSessionRevoked);
    })();

    const unsubscribeBroadcast = subscribeAuthBroadcast(() => {
      forceLogout({ skipBroadcast: true });
    });

    return () => {
      cancelled = true;
      unsubscribePusher?.();
      unsubscribeBroadcast?.();
    };
  }, []);
}
