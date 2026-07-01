import type { AdminNavItem } from "./types";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import { flyoutTransition } from "./sidebar.constants";
import { sidebarItemRowClass } from "./sidebar-item-styles";
import { useNavItemLabel } from "./use-nav-item-label";

const FLYOUT_GAP = 4;

type FlyoutPosition = {
  top: number;
  left: number;
  arrowTop: number;
};

type CollapsedMenuFlyoutProps = {
  item: AdminNavItem;
  onNavigate?: () => void;
};

export function CollapsedMenuFlyout({
  item,
  onNavigate,
}: CollapsedMenuFlyoutProps) {
  const location = useLocation();
  const getLabel = useNavItemLabel();
  const label = getLabel(item);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<FlyoutPosition>({
    top: 0,
    left: 0,
    arrowTop: 0,
  });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isChildActive = item.children?.some(
    (child) =>
      child.href &&
      !child.external &&
      location.pathname.startsWith(child.href),
  );

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleEnter = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const handleLeave = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const buttonRect = triggerRef.current!.getBoundingClientRect();
      const asideRect = triggerRef
        .current!.closest("aside")
        ?.getBoundingClientRect();
      const anchorRight = asideRect?.right ?? buttonRect.right;

      setPosition({
        top: buttonRect.top,
        left: anchorRight + FLYOUT_GAP,
        arrowTop: buttonRect.height / 2,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-label={label}
        className={sidebarItemRowClass(isChildActive)}
        type="button"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <span className="flex size-[18px] shrink-0 items-center justify-center">
          <item.icon className="size-[18px]" />
        </span>
        {item.badge !== undefined && (
          <span className="bg-danger absolute top-1.5 right-1.5 size-2 rounded-full" />
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="fixed z-[100] min-w-[220px] rounded-md border border-default-200 bg-background p-2 shadow-lg"
              exit={{ opacity: 0, x: -4, scale: 0.98 }}
              initial={{ opacity: 0, x: -4, scale: 0.98 }}
              style={{ top: position.top, left: position.left }}
              transition={flyoutTransition}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-[-5px] size-2.5 -translate-y-1/2 rotate-45 border-b border-l border-default-200 bg-background"
                style={{ top: position.arrowTop }}
              />
              <p className="px-2.5 py-2 text-sm font-semibold text-default-900">
                {label}
              </p>
              <div className="flex flex-col gap-0.5">
                {item.children?.map((child) => {
                  const childLabel = getLabel(child);
                  const isActive =
                    child.href &&
                    !child.external &&
                    location.pathname.startsWith(child.href);

                  const className = cn(
                    "flex items-center gap-2.5 rounded px-2.5 py-2 text-sm font-medium transition-colors duration-150",
                    "text-default-800 hover:bg-default-100 hover:text-default-950",
                    isActive && "bg-primary/10 font-semibold text-primary",
                  );

                  if (child.external) {
                    return (
                      <a
                        key={child.id}
                        className={className}
                        href={child.href}
                        rel="noreferrer"
                        target="_blank"
                        onClick={() => {
                          setOpen(false);
                          onNavigate?.();
                        }}
                      >
                        <child.icon className="size-4 shrink-0" />
                        <span>{childLabel}</span>
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={child.id}
                      className={className}
                      to={child.href ?? "#"}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                    >
                      <child.icon className="size-4 shrink-0" />
                      <span>{childLabel}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
