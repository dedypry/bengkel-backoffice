import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
  SIDEBAR_SURFACE_CLASS,
  sidebarWidthTransition,
} from "./sidebar.constants";
import { SidebarHeader } from "./sidebar-header";
import { SidebarLabel } from "./sidebar-label";
import { SidebarNav } from "./sidebar-nav";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";

export function Sidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const { t } = useTranslation();

  return (
    <motion.aside
      animate={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
      }}
      className={cn(
        "hidden h-full shrink-0 flex-col overflow-hidden md:flex",
        SIDEBAR_SURFACE_CLASS,
      )}
      initial={false}
      transition={sidebarWidthTransition}
    >
      <div
        className="flex h-full w-full flex-col px-3"
        style={{ width: SIDEBAR_EXPANDED_WIDTH }}
      >
        <SidebarHeader />
        <SidebarNav />

        <div className="shrink-0 border-t border-white/20 py-3">
          <button
            aria-label={
              collapsed
                ? t("common.expand_sidebar", "Perluas sidebar")
                : t("common.collapse_sidebar", "Ciutkan sidebar")
            }
            className="flex w-full items-center gap-2.5 rounded-sm py-2.5 pl-2.5 pr-3 text-sm text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            type="button"
            onClick={toggleCollapsed}
          >
            <span className="flex size-[18px] shrink-0 items-center justify-center">
              {collapsed ? (
                <PanelLeftOpen className="size-[18px]" />
              ) : (
                <PanelLeftClose className="size-[18px]" />
              )}
            </span>
            <SidebarLabel collapsed={collapsed}>
              <span className="pl-3">{t("common.collapse", "Ciutkan")}</span>
            </SidebarLabel>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
