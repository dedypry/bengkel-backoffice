export interface IRevenueGraphic {
  label: string;
  percentage: number;
  value: number;
  color: string;
}

export interface IMonthlyReport {
  current_revenue: number;
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
}
