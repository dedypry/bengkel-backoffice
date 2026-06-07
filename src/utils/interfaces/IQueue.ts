import type { IUser } from "./IUser";

export type QueueStatus =
  | "WAITING"
  | "CALLING"
  | "PROCESSING"
  | "SKIP"
  | "DONE";

export interface IQueueCategory {
  id: number;
  company_id: number;
  code: string;
  name: string;
  prefix_code: string;
  current_number: number;
  last_reset_date: string | null;
  estimated_minutes: number;
  is_active: boolean;
  sort_order: number;
}

export interface IQueue {
  id: number;
  company_id: number;
  queue_number: string;
  category_id: number;
  queue_date: string;
  sequence: number;
  status: QueueStatus;
  counter_number: string | null;
  attendant_id: number | null;
  work_order_id: number | null;
  called_at: string | null;
  started_at: string | null;
  done_at: string | null;
  created_at: string;
  updated_at: string;
  category?: IQueueCategory;
  attendant?: IUser;
}

export interface IQueueDisplay {
  date: string;
  calling: IQueue[];
  waiting: IQueue[];
  total_waiting: number;
}

export interface IQueueGenerateResponse {
  queue: IQueue;
  category: IQueueCategory;
  ticket_text: string;
}
