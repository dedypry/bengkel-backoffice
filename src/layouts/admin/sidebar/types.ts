import type { LucideIcon } from "lucide-react";

export type AdminNavItem = {
  id: string;
  label: string;
  i18nKey?: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
  badge?: number;
  children?: AdminNavItem[];
};
