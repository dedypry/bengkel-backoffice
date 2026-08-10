import dayjs from "dayjs";

export type CashierTab = "customer" | "finish" | "product";

type CashierWoQuery = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
  date?: string;
  date_from?: string;
  date_to?: string;
};

export function getCashierWoStatus(tab: CashierTab) {
  if (tab === "finish") return "finish";
  if (tab === "customer") return "ready";

  return undefined;
}

export function buildCashierWoQuery(tab: CashierTab, woQuery: CashierWoQuery) {
  const status = getCashierWoStatus(tab);

  if (!status) return null;

  return {
    ...woQuery,
    status,
    pageSize: 100,
    date: woQuery.date ? dayjs(woQuery.date).format("YYYY-MM-DD") : "",
  };
}
