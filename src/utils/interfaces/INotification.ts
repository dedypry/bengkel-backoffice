export type NotificationType =
  | "service_done"
  | "low_stock"
  | "booking"
  | "info";

export interface INotification {
  id: number;
  company_id: number;
  user_id: number;
  type: NotificationType | string;
  title: string;
  body?: string | null;
  data?: Record<string, unknown> | null;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationListResponse {
  message: string;
  data: INotification[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    lastPage: number;
    from: number;
    to: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}
