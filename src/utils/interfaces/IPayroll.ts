import type { IUser } from "./IUser";

export interface IEmployeeSalary {
  id: number;
  company_id: number;
  user_id: number;
  salary_type: "monthly" | "weekly" | "daily" | string;
  base_salary: string | number;
  allowance: string | number;
  deduction: string | number;
  note: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: IUser;
}

export interface IPayrollItem {
  id: number;
  company_id: number;
  payroll_id: number;
  user_id: number;
  salary_type: string;
  base_salary: string | number;
  allowance: string | number;
  overtime_amount: string | number;
  bonus: string | number;
  deduction: string | number;
  gross: string | number;
  net: string | number;
  present_days: number;
  absent_days: number;
  late_count: number;
  note: string | null;
  status: "pending" | "paid" | string;
  user?: IUser;
}

export interface IPayroll {
  id: number;
  company_id: number;
  code: string;
  period_type: "weekly" | "monthly" | string;
  period_start: string;
  period_end: string;
  status: "draft" | "paid" | string;
  total_amount: string | number;
  note: string | null;
  paid_at: string | null;
  total_employee?: string | number;
  created_at: string;
  updated_at: string;
  items?: IPayrollItem[];
}

export interface IPayrollSummary {
  total_run: number;
  paid_amount: number;
}
