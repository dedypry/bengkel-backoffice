"use client";

import * as React from "react";

import { NavMain } from "@/components/layouts/admin/sidebar/nav-main";
import { NavUser } from "@/components/layouts/admin/sidebar/nav-user";
import { BrandSwitcher } from "@/components/layouts/admin/sidebar/brand-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navigation } from "@/utils/navigation/sidebar-nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
          <div className="mx-2 p-1 rounded-2xl bg-white/40 backdrop-blur-md border border-primary shadow-lg shadow-primary/20">
            <BrandSwitcher />
          </div>
        </SidebarHeader>

        <SidebarContent className="z-10 scroll-smooth scrollbar-modern">
          <NavMain items={navigation} />
        </SidebarContent>

        <SidebarFooter className="z-10 pb-4">
          <div className="mx-2 p-1 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-sm">
            <NavUser />
          </div>
        </SidebarFooter>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
