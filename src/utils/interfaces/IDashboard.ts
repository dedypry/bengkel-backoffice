import type { IProduct } from "./IProduct";
import type { IWorkOrder } from "./IUser";

export interface IDashboard {
  countToday: number;
  countWork: number;
  countFinish: number;
  revenueToday: number;
  trends: ITrend[];
  revenueComparison: IRevenueComparison;
  product: IProduct[];
  wo: IWorkOrder[];
}

export interface ITrend {
  date: string; // Format: "YYYY-MM-DD"
  day: string; // Nama hari (misal: "Jum", "Sab")
  total: number;
}

export interface IRevenueComparison {
  currentTotal: number;
  lastTotal: number;
  percentageChange: number;
  status: "increase" | "decrease";
}
