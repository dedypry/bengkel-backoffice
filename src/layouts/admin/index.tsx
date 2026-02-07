import { useState, useEffect, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Button,
  Drawer,
  DrawerContent,
  Navbar,
  NavbarContent,
} from "@heroui/react";
import { Fullscreen, MenuIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

import SidebarMenu from "./partials/sidebar-menu";
import UserMenu from "./partials/user-dropdown";
import NotificationDropdown from "./partials/notification";

import { responsive } from "@/config/responsive";
import AuthGuard from "@/utils/guard/auth-guard";
import { useAppSelector } from "@/stores/hooks";

interface Props {
  children?: ReactNode;
}
export default function AdminLayout({ children }: Props) {
  const { company } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useMediaQuery(responsive.mobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Jika belum fullscreen, aktifkan
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error gagal masuk mode fullscreen: ${err.message}`);
      });
    } else {
      // Jika sedang fullscreen, keluar
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <AuthGuard>
      {isMobile ? (
        <Drawer
          className="bg-primary pl-4"
          isOpen={isOpen}
          placement="left"
          size="xs"
          onClose={() => setIsOpen(false)}
        >
          <DrawerContent>{() => <SidebarMenu />}</DrawerContent>
        </Drawer>
      ) : (
        <aside
          className={`translation-all fixed h-screen w-[266px] transform bg-gradient-to-tr from-primary-900 to-primary-600 pl-3 shadow-lg shadow-primary-200 duration-300 ease-in-out ${
            !isOpen ? "-translate-x-full" : "translate-x-0"
          } ${isMobile && "-translate-x-full"} `}
        >
          <SidebarMenu />
        </aside>
      )}
      <div
        className={`${!isOpen ? "pl-0" : "lg:pl-[266px]"} translation-all duration-300 ease-in-out`}
      >
        <main className="px-5 pt-1 relative">
          <Navbar
            isBordered
            className="sticky top-1 h-[50px] rounded-md border shadow-md"
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
                onPress={() => setIsOpen(!isOpen)}
              >
                <MenuIcon />
              </Button>
              <p className="font-bold text-primary">{company?.name}</p>
            </NavbarContent>
            <NavbarContent justify="end">
              <Button isIconOnly variant="ghost" onPress={toggleFullScreen}>
                <Fullscreen />
              </Button>
              <NotificationDropdown />
              <UserMenu />
            </NavbarContent>
          </Navbar>
          <div className="py-5">
            <Outlet />
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
