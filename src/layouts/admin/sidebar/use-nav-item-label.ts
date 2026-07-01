import type { AdminNavItem } from "./types";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useNavItemLabel() {
  const { t } = useTranslation();

  return useCallback(
    (item: Pick<AdminNavItem, "label" | "i18nKey">) =>
      item.i18nKey ? t(item.i18nKey) : item.label,
    [t],
  );
}
