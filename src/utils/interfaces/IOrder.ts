import type { IProduct } from "./IProduct";

export interface IOrder {
  id: number;
  trx_no?: string;
  ppn?: number;
  grand_total?: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  items: IOrderItem[];
}

export interface IOrderItem {
  id: number;
  order_id?: number;
  data?: IProduct;
  product_id?: number;
  qty?: number;
  price?: number;
  total_price?: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
}
