export interface IPagination<T> {
  message: string;
  data: T[];
  meta: IMeta;
  stats?: any;
}

export interface IMeta {
  total: number;
  page: number;
  pageSize: number;
  lastPage: number;
  from: number;
  to: number;
}

export interface IStats {
  this_month: number;
  last_month: number;
  growth: number;
  label: string;
}
