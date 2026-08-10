import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { flyoutTransition } from "./sidebar.constants";

const TOOLTIP_GAP = 8;

type SidebarCollapsedTooltipProps = {
  label: string;
  children: ReactNode;
};

export function SidebarCollapsedTooltip({
  label,
  children,
}: SidebarCollapsedTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    closeTimer.current = setTimeout(() => setOpen(false), 80);
  };

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const asideRect = triggerRef
        .current!.closest("aside")
        ?.getBoundingClientRect();
      const anchorRight = asideRect?.right ?? rect.right;

      setPosition({
        top: rect.top + rect.height / 2,
        left: anchorRight + TOOLTIP_GAP,
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
      <span
        ref={triggerRef}
        className="flex w-full"
        onBlur={handleLeave}
        onFocus={handleEnter}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {children}
      </span>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="pointer-events-none fixed z-[100] -translate-y-1/2 rounded-md border border-default-200 bg-background px-3 py-1.5 text-sm font-medium text-default-900 shadow-md"
              exit={{ opacity: 0, x: -4 }}
              initial={{ opacity: 0, x: -4 }}
              style={{ top: position.top, left: position.left }}
              transition={flyoutTransition}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
