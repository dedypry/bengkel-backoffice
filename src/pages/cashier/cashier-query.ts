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

export function buildCashierWoQuery(tab: CashierTab, woQuery: CashierWoQuery) {
  const status = getCashierWoStatus(tab, woQuery);

  if (!status) return null;

  const { date_from: _from, date_to: _to, date, ...rest } = woQuery;

  return {
    ...rest,
    status,
    pageSize: 100,
    ...(date ? { date: dayjs(date).format("YYYY-MM-DD") } : {}),
  };
}
