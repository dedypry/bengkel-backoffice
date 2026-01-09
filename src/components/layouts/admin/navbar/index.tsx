import { ChevronsLeft, Menu, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

import UserMenu from "./user-menu";
import NotificationDropdown from "./notification";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setSidebar } from "@/stores/features/layout/layout-slice";

export default function Navbar() {
  const { sidebarOpen } = useAppSelector((state) => state.layout);
  const { open, isMobile, openMobile, setOpen } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  const dispatch = useAppDispatch();

  function handleOpen() {
    dispatch(setSidebar(!sidebarOpen));
  }

  useEffect(() => {
    setOpen(sidebarOpen);
  }, [sidebarOpen]);

  return (
    <nav className="sticky z-50 top-4 shadow-lg shadow-blue-50 border rounded-lg border-blue-100">
      <div className="h-16 px-4 flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
        {/* Left Section: Sidebar Toggle & Breadcrumb/Search */}
        <div className="flex items-center gap-4">
          <Button
            className="rounded-xl hover:bg-violet-50 hover:text-violet-600 transition-colors"
            size="icon"
            variant="ghost"
            onClick={handleOpen}
          >
            <AnimatePresence initial={false} mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronsLeft className="size-5 stroke-[2.5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="size-5 stroke-[2.5]" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Quick Search - Hidden on Mobile */}
          <div className="hidden md:flex relative items-center group">
            <Search className="absolute left-3 size-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
            <Input
              className="w-64 h-10 pl-10 rounded-xl border-none bg-slate-100/50 focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:bg-white transition-all font-medium text-sm"
              placeholder="Cari fitur..."
            />
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className="flex gap-2 md:gap-3 items-center">
          <div className="flex items-center bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
            <NotificationDropdown />
            <div className="w-px h-4 bg-slate-200 mx-1" />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
