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

  const { date_from: _from, date_to: _to, date, ...rest } = woQuery;

  return {
    ...rest,
    status,
    pageSize: 100,
    ...(date ? { date: dayjs(date).format("YYYY-MM-DD") } : {}),
  };
}
