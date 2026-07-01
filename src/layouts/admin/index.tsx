import { ReactNode } from "react";
import { Button, Navbar, NavbarContent } from "@heroui/react";
import { Fullscreen, MenuIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

import { MobileDrawer } from "./sidebar/mobile-drawer";
import { Sidebar } from "./sidebar/sidebar";
import LanguageSwitch from "./partials/language-switch";
import NotificationDropdown from "./partials/notification";
import UserMenu from "./partials/user-dropdown";

import { useSidebar } from "@/context/sidebar-context";
import AuthGuard from "@/utils/guard/auth-guard";
import { useAppSelector } from "@/stores/hooks";

interface Props {
  children?: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { company } = useAppSelector((state) => state.auth);
  const { isMobile, toggleCollapsed, toggleMobile } = useSidebar();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error gagal masuk mode fullscreen: ${err.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-svh overflow-hidden bg-default-50">
        <Sidebar />
        <MobileDrawer />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Navbar
            isBordered
            className="sticky top-0 z-30 h-14 rounded-none border-b border-default-200 bg-background shadow-sm"
            isBlurred={false}
            maxWidth="full"
          >
            <NavbarContent>
              <Button
                isIconOnly
                className="text-primary"
                radius="full"
                size="sm"
                variant="light"
                onPress={() =>
                  isMobile ? toggleMobile() : toggleCollapsed()
                }
              >
                <MenuIcon />
              </Button>
              <p className="truncate font-semibold text-primary">
                {company?.name}
              </p>
            </NavbarContent>
            <NavbarContent justify="end">
              <Button isIconOnly variant="ghost" onPress={toggleFullScreen}>
                <Fullscreen />
              </Button>
              <LanguageSwitch />
              <NotificationDropdown />
              <UserMenu />
            </NavbarContent>
          </Navbar>

          <main className="scrollbar-modern flex-1 overflow-y-auto px-4 py-5 lg:px-6">
            <Outlet />
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
