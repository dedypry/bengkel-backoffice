export type LoginLogStatus = "active" | "revoked" | "expired";

export interface ILogUser {
  id: number;
  name: string | null;
  email: string | null;
}

export interface ILoginLogItem {
  id: number;
  user: ILogUser;
  device_label: string;
  platform: string;
  browser: string;
  ip_address: string;
  created_at: string;
  last_used_at: string;
  deleted_at: string | null;
  exp_at: string;
  status: LoginLogStatus;
}

export type AuditLogStatus = "success" | "error";

export interface IActivityLogSession {
  id: number;
  device_label: string;
  platform: string;
  browser: string;
  ip_address: string;
}

export interface IActivityLogItem {
  id: number;
  user: ILogUser;
  url: string | null;
  action: string | null;
  body: Record<string, unknown> | string | null;
  status: AuditLogStatus | null;
  response_message: Record<string, unknown> | string | null;
  session: IActivityLogSession | null;
  created_at: string;
}

export interface ILogsQuery {
  start_at?: string;
  end_at?: string;
  search?: string;
  action?: string;
  url?: string;
  status?: AuditLogStatus | "";
  page: number;
  pageSize: number;
}

export interface IActivityLogFilterOptions {
  actions: string[];
  urls: string[];
  statuses: AuditLogStatus[];
}
