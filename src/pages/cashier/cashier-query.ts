import dayjs from "dayjs";

export type CashierTab = "customer" | "product";

export type CashierCustomerStatus = "ready" | "finish";

type CashierWoQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  date?: string;
  date_from?: string;
  date_to?: string;
};

export function normalizeCashierCustomerStatus(
  status?: string,
): CashierCustomerStatus {
  return status === "finish" ? "finish" : "ready";
}

export function getCashierWoStatus(
  tab: CashierTab,
  woQuery: CashierWoQuery,
): CashierCustomerStatus | undefined {
  if (tab === "product") return undefined;

  return normalizeCashierCustomerStatus(woQuery.status);
}

export function getTodayDateRange() {
  const today = dayjs().format("YYYY-MM-DD");

  return { date_from: today, date_to: today };
}

export function buildCashierWoQuery(tab: CashierTab, woQuery: CashierWoQuery) {
  const status = getCashierWoStatus(tab, woQuery);

  if (!status) return null;

  const { date: _date, ...rest } = woQuery;

  return {
    ...rest,
    status,
    pageSize: 100,
    ...(woQuery.date_from
      ? { date_from: dayjs(woQuery.date_from).format("YYYY-MM-DD") }
      : {}),
    ...(woQuery.date_to
      ? { date_to: dayjs(woQuery.date_to).format("YYYY-MM-DD") }
      : {}),
  };
}
