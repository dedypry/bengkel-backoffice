import type { IProduct } from "./IProduct";
import type { IProfile, IWorkOrder } from "./IUser";

export interface IDashboard {
  countToday: number;
  countWork: number;
  countFinish: number;
  revenueToday: number;
  trends: ITrend[];
  revenueComparison: IRevenueComparison;
  product: IProduct[];
  wo: IWorkOrder[];
  bestEmployees: IBestEmployee[];
}

export interface IBestEmployee {
  id: number;
  name: string;
  work_status: string;
  rating: number;
  review_count: number;
  profile?: IProfile;
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
