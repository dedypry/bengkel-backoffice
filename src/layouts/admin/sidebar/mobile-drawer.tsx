import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useSidebar } from "@/context/sidebar-context";

import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SIDEBAR_SURFACE_CLASS } from "./sidebar.constants";

export function MobileDrawer() {
  const { mobileOpen, setMobileOpen, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
          <motion.aside
            animate={{ x: 0 }}
            className={`fixed top-0 left-0 z-50 flex h-full w-[280px] flex-col ${SIDEBAR_SURFACE_CLASS}`}
            exit={{ x: "-100%" }}
            initial={{ x: "-100%" }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex h-full flex-col px-3">
              <div className="flex h-12 shrink-0 items-center justify-end border-b border-white/20">
                <button
                  aria-label="Tutup menu"
                  className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  type="button"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>
              <SidebarHeader />
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
