import * as z from "zod";

export const notificationDefaults = {
  email_enabled: false,
  smtp_host: "",
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: "",
  smtp_password: "",
  smtp_from_name: "",
  smtp_from_email: "",
  email_notify_wo_ready: true,
  email_notify_payment_complete: true,
  email_notify_invoice: true,
  email_notify_next_service: true,
};

export const notificationSchema = z.object({
  email_enabled: z.boolean(),
  smtp_host: z.string().optional(),
  smtp_port: z.number().min(1).max(65535),
  smtp_secure: z.boolean(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(),
  smtp_from_name: z.string().optional(),
  smtp_from_email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  email_notify_wo_ready: z.boolean(),
  email_notify_payment_complete: z.boolean(),
  email_notify_invoice: z.boolean(),
  email_notify_next_service: z.boolean(),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;

export function isEmailConfigSaved(
  settings?: Record<string, unknown> | null,
) {
  if (!settings) {
    return false;
  }

  const host = String(settings.smtp_host ?? "").trim();
  const user = String(settings.smtp_user ?? "").trim();
  const password = String(settings.smtp_password ?? "").trim();

  return Boolean(host && user && password);
}

export function mapNotificationSettings(
  settings: Record<string, unknown>,
): NotificationFormValues {
  const parseBool = (value: unknown, fallback = false) => {
    if (value === true || value === "true" || value === "1") return true;
    if (value === false || value === "false" || value === "0") return false;

    return fallback;
  };

  return {
    email_enabled: parseBool(settings.email_enabled),
    smtp_host: String(settings.smtp_host ?? ""),
    smtp_port: Number(settings.smtp_port ?? notificationDefaults.smtp_port),
    smtp_secure: parseBool(settings.smtp_secure),
    smtp_user: String(settings.smtp_user ?? ""),
    smtp_password: String(settings.smtp_password ?? ""),
    smtp_from_name: String(settings.smtp_from_name ?? ""),
    smtp_from_email: String(settings.smtp_from_email ?? ""),
    email_notify_wo_ready: parseBool(
      settings.email_notify_wo_ready,
      notificationDefaults.email_notify_wo_ready,
    ),
    email_notify_payment_complete: parseBool(
      settings.email_notify_payment_complete,
      notificationDefaults.email_notify_payment_complete,
    ),
    email_notify_invoice: parseBool(
      settings.email_notify_invoice,
      notificationDefaults.email_notify_invoice,
    ),
    email_notify_next_service: parseBool(
      settings.email_notify_next_service,
      notificationDefaults.email_notify_next_service,
    ),
  };
}
