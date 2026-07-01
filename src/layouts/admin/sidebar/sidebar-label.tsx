import { motion } from "framer-motion";

import { sidebarLabelTransition } from "./sidebar.constants";

import { cn } from "@/lib/utils";

type SidebarLabelProps = {
  collapsed: boolean;
  children: React.ReactNode;
  className?: string;
};

export function SidebarLabel({
  collapsed,
  children,
  className,
}: SidebarLabelProps) {
  return (
    <motion.span
      animate={{ opacity: collapsed ? 0 : 1 }}
      aria-hidden={collapsed}
      className={cn(
        "block min-w-0 overflow-hidden whitespace-nowrap",
        collapsed && "pointer-events-none",
        className,
      )}
      initial={false}
      transition={sidebarLabelTransition}
    >
      {children}
    </motion.span>
  );
}
