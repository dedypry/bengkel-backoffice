import type { AdminNavItem } from "./types";

import { useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { SquareTerminal, type LucideIcon } from "lucide-react";

import { useAppSelector } from "@/stores/hooks";

function resolveIcon(name?: string): LucideIcon {
  if (name && name in LucideIcons) {
    return (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  }

  return SquareTerminal;
}

type RawNavItem = {
  title?: string;
  header?: string;
  href?: string;
  icon?: string;
  i18nKey?: string;
  items?: Array<{
    title: string;
    href: string;
    icon?: string;
    i18nKey?: string;
    external?: boolean;
  }>;
};

function toAdminNavItems(
  items: RawNavItem[],
  companyId?: number,
): AdminNavItem[] {
  return items.map((item, index) => {
    const id = item.href ?? item.header ?? item.title ?? String(index);
    const label = item.header ?? item.title ?? id;
    const icon = resolveIcon(item.icon);

    if (item.items?.length) {
      return {
        id,
        label,
        i18nKey: item.i18nKey,
        icon,
        href: item.href,
        children: item.items.map((child, childIndex) => {
          const childHref = child.external
            ? child.href.startsWith("/")
              ? companyId
                ? `${child.href}${child.href.includes("?") ? "&" : "?"}company_id=${companyId}`
                : child.href
              : child.href
            : `${item.href}/${child.href}`;

          return {
            id: `${id}-${child.href}-${childIndex}`,
            label: child.title,
            i18nKey: child.i18nKey,
            icon: resolveIcon(child.icon),
            href: childHref,
            external: child.external,
          };
        }),
      };
    }

    return {
      id,
      label,
      i18nKey: item.i18nKey,
      icon,
      href: item.href,
    };
  });
}

export function useAdminNavigation() {
  const { navigations, company } = useAppSelector((state) => state.auth);

  return useMemo(
    () => toAdminNavItems(navigations as RawNavItem[], company?.id),
    [navigations, company?.id],
  );
}
