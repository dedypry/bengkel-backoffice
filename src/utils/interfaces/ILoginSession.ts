export type SessionRevokedPayload = {
  all?: boolean;
  revoked_session_ids?: number[];
};

export type LoginSessionItem = {
  id: number;
  device_label: string;
  platform: "desktop" | "mobile" | "tablet" | string;
  browser: string;
  ip_address: string;
  last_used_at: string;
  created_at: string;
  is_current: boolean;
};
