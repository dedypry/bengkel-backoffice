export interface IPagination<T> {
  message: string;
  data: T[];
  meta: IMeta;
}

export interface IMeta {
  total: number;
  page: number;
  pageSize: number;
  lastPage: number;
  from: number;
  to: number;
}
