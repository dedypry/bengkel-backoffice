import type { AdminNavItem } from "./types";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "@heroui/react";

import { useSidebar } from "@/context/sidebar-context";

import { CollapsedMenuFlyout } from "./collapsed-menu-flyout";
import { sidebarItemRowClass } from "./sidebar-item-styles";
import { submenuTransition } from "./sidebar.constants";
import { SidebarLabel } from "./sidebar-label";
import { useAdminNavigation } from "./use-admin-navigation";
import { useNavItemLabel } from "./use-nav-item-label";

type SidebarItemProps = {
  item: AdminNavItem;
  collapsed: boolean;
  onNavigate?: () => void;
};

function SidebarLeafItem({
  item,
  collapsed,
  onNavigate,
}: {
  item: AdminNavItem;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const getLabel = useNavItemLabel();
  const label = getLabel(item);

  if (item.external) {
    const link = (
      <a
        className={sidebarItemRowClass()}
        href={item.href}
        rel="noreferrer"
        target="_blank"
        onClick={onNavigate}
      >
        <span className="flex size-[18px] shrink-0 items-center justify-center">
          <item.icon className="size-[18px]" />
        </span>
        <SidebarLabel className="min-w-0 flex-1" collapsed={collapsed}>
          <span className="block truncate pl-3">{label}</span>
        </SidebarLabel>
      </a>
    );

    if (!collapsed) return link;

    return (
      <Tooltip closeDelay={80} content={label} delay={150}>
        {link}
      </Tooltip>
    );
  }

  const inner = (
    <NavLink
      className={({ isActive }) => sidebarItemRowClass(isActive)}
      end={item.href === "/"}
      to={item.href ?? "#"}
      onClick={onNavigate}
    >
      {() => (
        <>
          <span className="flex size-[18px] shrink-0 items-center justify-center">
            <item.icon className="size-[18px]" />
          </span>
          <SidebarLabel className="min-w-0 flex-1" collapsed={collapsed}>
            <span className="block truncate pl-3">{label}</span>
          </SidebarLabel>
          {!collapsed && item.badge !== undefined && (
            <span className="bg-danger flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return inner;

  return (
    <Tooltip closeDelay={80} content={label} delay={150}>
      {inner}
    </Tooltip>
  );
}

function SidebarItem({ item, collapsed, onNavigate }: SidebarItemProps) {
  const location = useLocation();
  const getLabel = useNavItemLabel();
  const label = getLabel(item);
  const hasChildren = !!item.children?.length;
  const isChildActive = item.children?.some(
    (child) =>
      child.href &&
      !child.external &&
      location.pathname.startsWith(child.href),
  );
  const [open, setOpen] = useState(isChildActive ?? false);

  useEffect(() => {
    if (collapsed) setOpen(false);
  }, [collapsed]);

  if (hasChildren) {
    if (collapsed) {
      return <CollapsedMenuFlyout item={item} onNavigate={onNavigate} />;
    }

    return (
      <div>
        <button
          className={sidebarItemRowClass(isChildActive)}
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex size-[18px] shrink-0 items-center justify-center">
            <item.icon className="size-[18px]" />
          </span>
          <SidebarLabel className="min-w-0 flex-1" collapsed={collapsed}>
            <span className="block truncate pl-3 text-left">{label}</span>
          </SidebarLabel>
          {item.badge !== undefined && (
            <span className="bg-danger flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white">
              {item.badge}
            </span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="shrink-0"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="submenu"
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              initial={{ height: 0, opacity: 0 }}
              transition={submenuTransition}
            >
              <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-white/30 pl-3">
                {item.children!.map((child) => (
                  <SidebarItem
                    key={child.id}
                    collapsed={collapsed}
                    item={child}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <SidebarLeafItem
      collapsed={collapsed}
      item={item}
      onNavigate={onNavigate}
    />
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { collapsed } = useSidebar();
  const items = useAdminNavigation();

  return (
    <nav className="scrollbar-modern flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden py-3">
      {items.map((item) => (
        <SidebarItem
          key={item.id}
          collapsed={collapsed}
          item={item}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
