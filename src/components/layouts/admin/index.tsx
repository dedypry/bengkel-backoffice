import { Outlet } from "react-router-dom";

import { AppSidebar } from "./sidebar/app-sidebar";
import Navbar from "./navbar";

import AuthGuard from "@/utils/guard/auth-guard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <main className="relative w-full px-5">
          <Navbar />
          <div className="pt-8">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </AuthGuard>
  );
}
