import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "@/stores/hooks";
import { http } from "@/utils/libs/axios";

export type AuthBranding = {
  logoUrl: string | null;
  name: string | null;
};

const emptyBranding: AuthBranding = { logoUrl: null, name: null };

function pickCompanyBranding(
  company:
    | { id: number; name: string; logo_url: string | null }
    | null
    | undefined,
  companies:
    | { id: number; name: string; logo_url: string | null }[]
    | undefined,
  activeCompanyId?: number,
): AuthBranding | null {
  const active =
    company ?? companies?.find((item) => item.id === activeCompanyId) ?? null;

  if (active?.logo_url) {
    return { logoUrl: active.logo_url, name: active.name };
  }

  const withLogo = companies?.find((item) => item.logo_url);

  if (withLogo) {
    return { logoUrl: withLogo.logo_url, name: withLogo.name };
  }

  if (active) {
    return { logoUrl: null, name: active.name };
  }

  return null;
}

export function useAuthBranding(): AuthBranding {
  const { company, user } = useAppSelector((state) => state.auth);
  const [remote, setRemote] = useState<AuthBranding | null>(null);

  const fromStore = useMemo(
    () => pickCompanyBranding(company, user?.companies, user?.company_id),
    [company, user?.companies, user?.company_id],
  );

  useEffect(() => {
    if (fromStore) {
      return;
    }

    let cancelled = false;

    http
      .get<{ name: string | null; logo_url: string | null }>("/auth/branding")
      .then(({ data }) => {
        if (cancelled) {
          return;
        }

        setRemote({
          logoUrl: data.logo_url,
          name: data.name,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setRemote(emptyBranding);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fromStore]);

  return fromStore ?? remote ?? emptyBranding;
}
