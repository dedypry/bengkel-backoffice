"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { NavMain } from "@/components/layouts/admin/sidebar/nav-main";
import { NavUser } from "@/components/layouts/admin/sidebar/nav-user";
import { BrandSwitcher } from "@/components/layouts/admin/sidebar/brand-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigation } from "@/utils/navigation/sidebar-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      // Menghilangkan border default agar gradient terlihat menyatu
      className="border-none"
    >
      <div className="flex h-full flex-col bg-linear-to-b from-slate-50 via-blue-50/50 to-indigo-50/30 relative overflow-hidden">
        {/* Dekorasi Aksen Cahaya (Mesh effect) */}

        <SidebarHeader className="z-10 pt-4">
          <motion.div
            // 'layout' akan menganimasi perubahan ukuran secara otomatis
            layout
            animate={{
              backgroundColor: open
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(255, 255, 255, 0)",
              backdropFilter: open ? "blur(12px)" : "blur(0px)",
              borderColor: open ? "var(--primary)" : "transparent",
              boxShadow: open
                ? "0 10px 15px -3px rgba(var(--primary-rgb), 0.2)"
                : "none",
            }}
            className={`
      rounded-xl border flex items-center
      ${open ? "shadow-lg" : "p-0"}
    `}
            initial={false}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 1,
            }}
          >
            <BrandSwitcher />
          </motion.div>
        </SidebarHeader>

        <SidebarContent className="z-10 scroll-smooth scrollbar-modern">
          <NavMain items={navigation} />
        </SidebarContent>

        <SidebarFooter className="z-10 pb-4">
          <div
            className={
              open ? "rounded-md bg-white/40 backdrop-blur-md shadow-sm" : ""
            }
          >
            <NavUser />
          </div>
        </SidebarFooter>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
