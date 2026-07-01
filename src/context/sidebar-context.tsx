import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMediaQuery } from "react-responsive";

import { responsive } from "@/config/responsive";

const SIDEBAR_COLLAPSED_KEY = "bengkel-sidebar-collapsed";

type SidebarContextValue = {
  collapsed: boolean;
  mobileOpen: boolean;
  isMobile: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery(responsive.mobile);
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  const [collapsed, setCollapsedState] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

    return stored ? stored === "true" : isTablet;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(value));
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;

      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));

      return next;
    });
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      collapsed: isMobile ? false : collapsed,
      mobileOpen,
      isMobile,
      toggleCollapsed,
      setCollapsed,
      setMobileOpen,
      toggleMobile,
    }),
    [
      collapsed,
      mobileOpen,
      isMobile,
      toggleCollapsed,
      setCollapsed,
      toggleMobile,
    ],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }

  return context;
}

export { SIDEBAR_COLLAPSED_KEY };
