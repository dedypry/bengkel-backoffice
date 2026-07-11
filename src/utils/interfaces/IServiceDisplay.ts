export interface IServiceDisplayOrder {
  id: number;
  queue_no?: string | null;
  trx_no?: string | null;
  plate_number?: string;
  vehicle_name?: string;
  progress: string;
  start_at?: string | null;
  end_at?: string | null;
  updated_at?: string;
}

export interface IServiceDisplay {
  date: string;
  company_name: string;
  stats: {
    waiting: number;
    processing: number;
    ready: number;
    total: number;
  };
  featured: IServiceDisplayOrder | null;
  orders: IServiceDisplayOrder[];
}
