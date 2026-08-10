import type { AdminNavItem } from "../sidebar/types";

import {
  Button,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAdminNavigation } from "../sidebar/use-admin-navigation";
import { useNavItemLabel } from "../sidebar/use-nav-item-label";

import { useSidebar } from "@/context/sidebar-context";

type FlatMenuItem = {
  id: string;
  label: string;
  group?: string;
  href: string;
  external?: boolean;
  icon: AdminNavItem["icon"];
};

function flattenMenuItems(
  items: AdminNavItem[],
  getLabel: (item: Pick<AdminNavItem, "label" | "i18nKey">) => string,
): FlatMenuItem[] {
  const result: FlatMenuItem[] = [];

  for (const item of items) {
    const parentLabel = getLabel(item);

    if (item.children?.length) {
      for (const child of item.children) {
        if (!child.href) continue;

        result.push({
          id: child.id,
          label: getLabel(child),
          group: parentLabel,
          href: child.href,
          external: child.external,
          icon: child.icon,
        });
      }
    } else if (item.href) {
      result.push({
        id: item.id,
        label: parentLabel,
        href: item.href,
        external: item.external,
        icon: item.icon,
      });
    }
  }

  return result;
}

const expandTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
};

const ICON_PADDING = 52;

function MenuSearchResults({
  items,
  activeIndex,
  onActiveIndexChange,
  onSelect,
  emptyLabel,
  className = "max-h-72",
}: {
  items: FlatMenuItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (item: FlatMenuItem) => void;
  emptyLabel: string;
  className?: string;
}) {
  return (
    <div className={`scrollbar-modern overflow-y-auto py-1 ${className}`}>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-default-400">
          {emptyLabel}
        </p>
      ) : (
        items.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;

          return (
            <button
              key={item.id}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                isActive ? "bg-primary/10" : "hover:bg-default-100"
              }`}
              type="button"
              onClick={() => onSelect(item)}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => onActiveIndexChange(index)}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-default-100 text-default-600">
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {item.label}
                </span>
                {item.group && (
                  <span className="block truncate text-xs text-default-400">
                    {item.group}
                  </span>
                )}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}

function useMenuSearch() {
  const navigate = useNavigate();
  const navItems = useAdminNavigation();
  const getLabel = useNavItemLabel();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const allItems = useMemo(
    () => flattenMenuItems(navItems, getLabel),
    [navItems, getLabel],
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return allItems;

    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group?.toLowerCase().includes(q),
    );
  }, [allItems, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const reset = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  const navigateTo = useCallback(
    (item: FlatMenuItem) => {
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        navigate(item.href);
      }

      reset();
    },
    [navigate, reset],
  );

  const handleKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLInputElement>,
      options?: { onEscape?: () => void; ensureOpen?: () => void },
    ) => {
      options?.ensureOpen?.();

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) =>
          filteredItems.length ? (prev + 1) % filteredItems.length : 0,
        );

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) =>
          filteredItems.length
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : 0,
        );

        return;
      }

      if (event.key === "Enter" && filteredItems[activeIndex]) {
        event.preventDefault();
        navigateTo(filteredItems[activeIndex]);
        options?.onEscape?.();

        return;
      }

      if (event.key === "Escape") {
        reset();
        options?.onEscape?.();
      }
    },
    [activeIndex, filteredItems, navigateTo, reset],
  );

  return {
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filteredItems,
    reset,
    navigateTo,
    handleKeyDown,
  };
}

function MenuSearchDesktop() {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collapsedWidth, setCollapsedWidth] = useState(132);

  const placeholder = t("common.search_menu");

  const {
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filteredItems,
    navigateTo,
    handleKeyDown,
  } = useMenuSearch();

  const isExpanded = expanded || open || query.length > 0;

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setActiveIndex(0);
  }, [setActiveIndex]);

  const collapse = useCallback(() => {
    closeDropdown();
    if (!query) {
      setExpanded(false);
    }
  }, [closeDropdown, query]);

  const expandAndFocus = useCallback(() => {
    setExpanded(true);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    if (measureRef.current) {
      setCollapsedWidth(measureRef.current.offsetWidth + ICON_PADDING);
    }
  }, [placeholder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        collapse();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapse]);

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        expandAndFocus();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, [expandAndFocus]);

  const handleSelect = (item: FlatMenuItem) => {
    navigateTo(item);
    closeDropdown();
    setExpanded(false);
    inputRef.current?.blur();
  };

  return (
    <motion.div
      ref={wrapperRef}
      animate={{
        width: isExpanded ? "100%" : collapsedWidth,
      }}
      className={`relative ${isExpanded ? "min-w-0 flex-1" : "shrink-0"}`}
      initial={false}
      style={{ maxWidth: isExpanded ? "100%" : collapsedWidth }}
      transition={expandTransition}
    >
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute whitespace-nowrap text-sm"
      >
        {placeholder}
      </span>

      <Input
        ref={inputRef}
        aria-label={t("common.search_menu_aria")}
        classNames={{
          base: "w-full",
          inputWrapper:
            "h-9 cursor-pointer bg-default-100 shadow-none transition-shadow data-[focus=true]:bg-default-100",
          input: "text-sm",
        }}
        endContent={
          isExpanded ? (
            <Kbd className="hidden sm:inline-flex" keys={["command"]}>
              K
            </Kbd>
          ) : null
        }
        placeholder={placeholder}
        readOnly={!isExpanded}
        size="sm"
        startContent={
          <Search
            className={`shrink-0 text-default-400 ${!isExpanded ? "cursor-pointer" : ""}`}
            size={16}
          />
        }
        value={query}
        variant="flat"
        onClick={() => {
          if (!isExpanded) expandAndFocus();
        }}
        onFocus={() => {
          setExpanded(true);
          setOpen(true);
        }}
        onKeyDown={(event) =>
          handleKeyDown(event, {
            ensureOpen: () => setOpen(true),
            onEscape: () => {
              collapse();
              inputRef.current?.blur();
            },
          })
        }
        onValueChange={(value) => {
          setQuery(value);
          setExpanded(true);
          setOpen(true);
        }}
      />

      <AnimatePresence>
        {open && isExpanded && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-default-200 bg-background shadow-lg"
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <MenuSearchResults
              activeIndex={activeIndex}
              emptyLabel={t("common.no_menu_found")}
              items={filteredItems}
              onActiveIndexChange={setActiveIndex}
              onSelect={handleSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MenuSearchMobile() {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filteredItems,
    reset,
    navigateTo,
    handleKeyDown,
  } = useMenuSearch();

  const closeModal = useCallback(() => {
    setModalOpen(false);
    reset();
  }, [reset]);

  const handleSelect = (item: FlatMenuItem) => {
    navigateTo(item);
    closeModal();
  };

  useEffect(() => {
    if (modalOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [modalOpen]);

  return (
    <>
      <Button
        isIconOnly
        aria-label={t("common.search_menu_aria")}
        className="shrink-0 text-default-500"
        radius="full"
        size="sm"
        variant="light"
        onPress={() => setModalOpen(true)}
      >
        <Search size={18} />
      </Button>

      <Modal
        hideCloseButton={false}
        isOpen={modalOpen}
        placement="top"
        scrollBehavior="inside"
        size="full"
        onOpenChange={(open) => {
          if (!open) closeModal();
          else setModalOpen(true);
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="pb-2">
                {t("common.search_menu_aria")}
              </ModalHeader>
              <ModalBody className="gap-3 pb-6">
                <Input
                  ref={inputRef}
                  aria-label={t("common.search_menu_aria")}
                  classNames={{
                    inputWrapper: "h-11 bg-default-100 shadow-none",
                    input: "text-base",
                  }}
                  placeholder={t("common.search_menu")}
                  size="lg"
                  startContent={
                    <Search className="text-default-400" size={18} />
                  }
                  value={query}
                  variant="flat"
                  onKeyDown={(event) =>
                    handleKeyDown(event, {
                      onEscape: closeModal,
                    })
                  }
                  onValueChange={setQuery}
                />
                <MenuSearchResults
                  activeIndex={activeIndex}
                  className="max-h-[calc(100dvh-11rem)]"
                  emptyLabel={t("common.no_menu_found")}
                  items={filteredItems}
                  onActiveIndexChange={setActiveIndex}
                  onSelect={handleSelect}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default function MenuSearch() {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return <MenuSearchMobile />;
  }

  return <MenuSearchDesktop />;
}
