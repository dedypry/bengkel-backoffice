export interface IRevenueGraphic {
  label: string;
  percentage: number;
  value: number;
  color: string;
}

export interface IRevenueTrendPoint {
  name: string;
  date: string;
  total: number;
}

export interface IMonthlyReport {
  current_revenue: number;
  target_amount: number;
  is_target_set: boolean;
  progress_value: number;
  progress_display: number;
  remaining_amount: number;
  month_name: string;
  last_month_name: string;
  last_month_revenue: number;
  increase_amount: number;
  growth_formatted: string;
  growth_value: number;
}

export interface IReport {
  revenue: number;
  growth: string;
  growthType: "decrement" | "increment";
  avg: number;
  wo: number;
  grafik: IRevenueGraphic[];
  reportMonthly: IMonthlyReport;
  trend: IRevenueTrendPoint[];
}
