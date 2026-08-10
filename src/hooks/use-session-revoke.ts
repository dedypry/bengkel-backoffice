import type { SessionRevokedPayload } from "@/utils/interfaces/ILoginSession";

import { useEffect } from "react";

import { useAppSelector } from "@/stores/hooks";
import { forceLogout, getAuthSessionId } from "@/utils/helpers/auth-session";
import { subscribeSessionRevoke } from "@/utils/libs/pusher";

export function useSessionRevoke() {
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const unsubscribe = subscribeSessionRevoke(
      user.id,
      (payload: SessionRevokedPayload) => {
        const sessionId = getAuthSessionId();

        if (payload.all) {
          forceLogout();

          return;
        }

        if (sessionId && payload.revoked_session_ids?.includes(sessionId)) {
          forceLogout();
        }
      },
    );

    return () => {
      unsubscribe?.();
    };
  }, [user?.id]);
}
