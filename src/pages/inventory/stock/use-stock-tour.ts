import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

import {
  INVENTORY_STOCK_TOUR_KEY,
  isTourCompleted,
  markTourCompleted,
  clearTourCompleted,
} from "@/utils/helpers/persistent-storage";

type StockTourOptions = {
  autoStart?: boolean;
  onSelectDemo?: () => void;
  onOpenBulkModal?: () => void;
  onCloseBulkModal?: () => void;
  onTourStart?: () => void;
  onTourCleanup?: () => void;
};

const DEFERRED_TOUR_SELECTORS = new Set(["[data-tour='stock-bulk-modal']"]);

function waitForElement(
  selector: string,
  maxAttempts = 40,
  intervalMs = 100,
): Promise<Element | null> {
  return new Promise((resolve) => {
    let attempts = 0;

    const check = () => {
      const element = document.querySelector(selector);

      if (element) {
        resolve(element);

        return;
      }

      attempts += 1;

      if (attempts >= maxAttempts) {
        resolve(null);

        return;
      }

      window.setTimeout(check, intervalMs);
    };

    check();
  });
}

function getTableSelectElement() {
  return (
    document.querySelector("[data-tour='stock-table'] [role='checkbox']") ??
    document.querySelector("[data-tour='stock-table'] tbody tr:first-child") ??
    document.querySelector("[data-tour='stock-table']")
  );
}

function buildStockTourSteps(
  t: (key: string) => string,
  options?: Pick<
    StockTourOptions,
    "onSelectDemo" | "onOpenBulkModal" | "onCloseBulkModal"
  >,
): DriveStep[] {
  return [
    {
      element: "[data-tour='stock-stats']",
      popover: {
        title: t("inventory.stock.tour.stats_title"),
        description: t("inventory.stock.tour.stats_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='stock-actions']",
      popover: {
        title: t("inventory.stock.tour.actions_title"),
        description: t("inventory.stock.tour.actions_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='stock-category']",
      popover: {
        title: t("inventory.stock.tour.category_title"),
        description: t("inventory.stock.tour.category_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='stock-status']",
      popover: {
        title: t("inventory.stock.tour.status_title"),
        description: t("inventory.stock.tour.status_desc"),
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "[data-tour='stock-search']",
      popover: {
        title: t("inventory.stock.tour.search_title"),
        description: t("inventory.stock.tour.search_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='stock-table']",
      popover: {
        title: t("inventory.stock.tour.table_title"),
        description: t("inventory.stock.tour.table_desc"),
        side: "top",
        align: "start",
      },
    },
    {
      element: getTableSelectElement,
      onHighlightStarted: () => {
        options?.onSelectDemo?.();
      },
      popover: {
        title: t("inventory.stock.tour.select_title"),
        description: t("inventory.stock.tour.select_desc"),
        side: "top",
        align: "start",
      },
    },
    {
      element: "[data-tour='stock-bulk-update']",
      onHighlightStarted: () => {
        options?.onCloseBulkModal?.();
        options?.onSelectDemo?.();
      },
      popover: {
        title: t("inventory.stock.tour.bulk_title"),
        description: t("inventory.stock.tour.bulk_desc"),
        side: "bottom",
        align: "end",
      },
    },
    {
      element: "[data-tour='stock-bulk-modal']",
      waitForElement: 5000,
      onHighlightStarted: () => {
        options?.onSelectDemo?.();
        options?.onOpenBulkModal?.();
      },
      onDeselected: () => {
        options?.onCloseBulkModal?.();
      },
      popover: {
        title: t("inventory.stock.tour.bulk_modal_title"),
        description: t("inventory.stock.tour.bulk_modal_desc"),
        side: "over",
        align: "center",
      },
    },
    {
      element: "[data-tour='stock-pagination']",
      popover: {
        title: t("inventory.stock.tour.pagination_title"),
        description: t("inventory.stock.tour.pagination_desc"),
        side: "top",
        align: "center",
      },
    },
    {
      element: "[data-tour='stock-page-size']",
      popover: {
        title: t("inventory.stock.tour.page_size_title"),
        description: t("inventory.stock.tour.page_size_desc"),
        side: "top",
        align: "end",
      },
    },
    {
      element: "[data-tour='stock-tour-replay']",
      onHighlightStarted: () => {
        options?.onCloseBulkModal?.();
      },
      popover: {
        title: t("inventory.stock.tour.replay_title"),
        description: t("inventory.stock.tour.replay_desc"),
        side: "bottom",
        align: "end",
      },
    },
  ];
}

type StartTourOptions = {
  force?: boolean;
};

export function useStockTour(options: StockTourOptions = {}) {
  const { autoStart = true, onSelectDemo, onTourCleanup } = options;
  const { t } = useTranslation();
  const isRunningRef = useRef(false);
  const tourOptionsRef = useRef(options);

  tourOptionsRef.current = options;

  const startTour = useCallback(
    async (startOptions?: StartTourOptions) => {
      if (isRunningRef.current) {
        return;
      }

      if (startOptions?.force) {
        clearTourCompleted(INVENTORY_STOCK_TOUR_KEY);
      } else if (isTourCompleted(INVENTORY_STOCK_TOUR_KEY)) {
        return;
      }

      const firstTarget = await waitForElement("[data-tour='stock-stats']");

      if (!firstTarget) {
        return;
      }

      const steps = buildStockTourSteps(t, tourOptionsRef.current).filter(
        (step) => {
          if (!step.element) {
            return true;
          }

          if (typeof step.element === "string") {
            if (
              DEFERRED_TOUR_SELECTORS.has(step.element) ||
              step.waitForElement
            ) {
              return true;
            }

            return Boolean(document.querySelector(step.element));
          }

          if (typeof step.element === "function") {
            return Boolean(step.element());
          }

          return true;
        },
      );

      if (steps.length === 0) {
        return;
      }

      isRunningRef.current = true;
      let didHighlight = false;

      const driverObj = driver({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        skipMissingElement: true,
        waitForElement: 3000,
        nextBtnText: t("inventory.stock.tour.next"),
        prevBtnText: t("inventory.stock.tour.prev"),
        doneBtnText: t("inventory.stock.tour.done"),
        steps,
        onHighlighted: () => {
          didHighlight = true;
        },
        onDestroyed: () => {
          isRunningRef.current = false;
          tourOptionsRef.current.onTourCleanup?.();

          if (didHighlight) {
            markTourCompleted(INVENTORY_STOCK_TOUR_KEY);
          }
        },
      });

      tourOptionsRef.current.onTourStart?.();
      driverObj.drive();
    },
    [t],
  );

  const startTourRef = useRef(startTour);

  startTourRef.current = startTour;

  useEffect(() => {
    if (!autoStart || isTourCompleted(INVENTORY_STOCK_TOUR_KEY)) {
      return;
    }

    let cancelled = false;

    void (async () => {
      await waitForElement("[data-tour='stock-stats']");

      if (cancelled || isTourCompleted(INVENTORY_STOCK_TOUR_KEY)) {
        return;
      }

      await startTourRef.current();
    })();

    return () => {
      cancelled = true;
    };
  }, [autoStart]);

  return { startTour };
}
