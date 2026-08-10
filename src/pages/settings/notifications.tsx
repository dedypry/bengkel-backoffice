import {
  Bell,
  Mail,
  Save,
  Send,
  Server,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Switch,
} from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  isEmailConfigSaved,
  createNotificationSchema,
  mapNotificationSettings,
  notificationDefaults,
  type NotificationFormValues,
} from "./schemas/notification-schema";

import HeaderAction from "@/components/header-action";
import InputNumber from "@/components/input-number";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSettings } from "@/stores/features/setting/setting-slice";

const MASKED_PASSWORD = "********";

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-default-200 shadow-sm" radius="lg">
      <CardBody className="gap-5 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-default-900">{title}</h3>
            <p className="text-sm text-default-500">{description}</p>
          </div>
        </div>
        {children}
      </CardBody>
    </Card>
  );
}

export default function NotificationSettingsPage() {
  const { t } = useTranslation();
  const { settings } = useAppSelector((state) => state.setting);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const notificationSchema = useMemo(() => createNotificationSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: notificationDefaults,
  });

  const emailEnabled = watch("email_enabled");
  const isConfigSaved = isEmailConfigSaved(
    settings as unknown as Record<string, unknown>,
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getSettings());
    }
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      reset(mapNotificationSettings(settings as unknown as Record<string, unknown>));
    }
  }, [reset, settings]);

  const onSubmit = async (values: NotificationFormValues) => {
    setLoading(true);

    try {
      const payload = { ...values };

      if (!payload.smtp_password || payload.smtp_password === MASKED_PASSWORD) {
        delete payload.smtp_password;
      }

      await http.post("/settings", payload);
      notify(t("settings.notifications.saved"));
      dispatch(getSettings());
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      notifyError(t("settings.notifications.test_email_required"));

      return;
    }

    setTesting(true);

    try {
      const { data } = await http.post("/settings/email/test", {
        email: testEmail.trim(),
      });

      notify(data.message || t("settings.notifications.test_email_sent"));
    } catch (error) {
      notifyError(error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <HeaderAction
        subtitle={t("settings.notifications.subtitle")}
        title={t("settings.notifications.title")}
      />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <SectionCard
          description={t("settings.notifications.status_desc")}
          icon={Bell}
          title={t("settings.notifications.status_title")}
        >
          <Controller
            control={control}
            name="email_enabled"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                <div>
                  <p className="font-semibold text-default-900">
                    {t("settings.notifications.enable_email")}
                  </p>
                  <p className="text-sm text-default-500">
                    {t("settings.notifications.enable_email_hint")}
                  </p>
                </div>
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                />
              </div>
            )}
          />
        </SectionCard>

        <SectionCard
          description={t("settings.notifications.smtp_desc")}
          icon={Server}
          title={t("settings.notifications.smtp_title")}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="smtp_host"
              render={({ field }) => (
                <Input
                  {...field}
                  isDisabled={!emailEnabled}
                  label={t("settings.notifications.smtp_host")}
                  placeholder="smtp.gmail.com"
                  value={field.value || ""}
                  variant="bordered"
                />
              )}
            />
            <Controller
              control={control}
              name="smtp_port"
              render={({ field }) => (
                <InputNumber
                  isDisabled={!emailEnabled}
                  label={t("settings.notifications.smtp_port")}
                  placeholder="587"
                  value={
                    field.value != null ? String(field.value) : undefined
                  }
                  onInput={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="smtp_user"
              render={({ field }) => (
                <Input
                  {...field}
                  isDisabled={!emailEnabled}
                  label={t("settings.notifications.smtp_username")}
                  placeholder="user@domain.com"
                  value={field.value || ""}
                  variant="bordered"
                />
              )}
            />
            <Controller
              control={control}
              name="smtp_password"
              render={({ field }) => (
                <Input
                  {...field}
                  isDisabled={!emailEnabled}
                  label={t("settings.notifications.smtp_password")}
                  placeholder={
                    field.value === MASKED_PASSWORD
                      ? t("settings.notifications.password_saved")
                      : "••••••••"
                  }
                  type="password"
                  value={field.value || ""}
                  variant="bordered"
                />
              )}
            />
            <Controller
              control={control}
              name="smtp_from_name"
              render={({ field }) => (
                <Input
                  {...field}
                  isDisabled={!emailEnabled}
                  label={t("settings.notifications.sender_name")}
                  placeholder="Clinic Pradana Workshop"
                  value={field.value || ""}
                  variant="bordered"
                />
              )}
            />
            <Controller
              control={control}
              name="smtp_from_email"
              render={({ field }) => (
                <Input
                  {...field}
                  isDisabled={!emailEnabled}
                  label={t("settings.notifications.sender_email")}
                  placeholder="no-reply@domain.com"
                  type="email"
                  value={field.value || ""}
                  variant="bordered"
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="smtp_secure"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                <div>
                  <p className="font-semibold text-default-900">
                    {t("settings.notifications.ssl_tls")}
                  </p>
                  <p className="text-sm text-default-500">
                    {t("settings.notifications.ssl_tls_hint")}
                  </p>
                </div>
                <Switch
                  isDisabled={!emailEnabled}
                  isSelected={field.value}
                  onValueChange={field.onChange}
                />
              </div>
            )}
          />

          {isConfigSaved ? (
            <>
              <Divider />

              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <Input
                  className="md:flex-1"
                  isDisabled={!emailEnabled}
                  label={t("settings.notifications.test_email_label")}
                  placeholder="customer@email.com"
                  type="email"
                  value={testEmail}
                  variant="bordered"
                  onValueChange={setTestEmail}
                />
                <Button
                  color="primary"
                  isDisabled={!emailEnabled}
                  isLoading={testing}
                  startContent={!testing ? <Send size={16} /> : undefined}
                  onPress={handleTestEmail}
                >
                  {t("settings.notifications.send_test")}
                </Button>
              </div>
            </>
          ) : null}
        </SectionCard>

        <SectionCard
          description={t("settings.notifications.triggers_desc")}
          icon={ShieldCheck}
          title={t("settings.notifications.triggers_title")}
        >
          <div className="space-y-3">
            <Controller
              control={control}
              name="email_notify_wo_ready"
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-default-900">
                      {t("settings.notifications.trigger_service_done")}
                    </p>
                    <p className="text-sm text-default-500">
                      {t("settings.notifications.trigger_service_done_hint")}
                    </p>
                  </div>
                  <Switch
                    isDisabled={!emailEnabled}
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="email_notify_payment_complete"
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-default-900">
                      {t("settings.notifications.trigger_payment_done")}
                    </p>
                    <p className="text-sm text-default-500">
                      {t("settings.notifications.trigger_payment_done_hint")}
                    </p>
                  </div>
                  <Switch
                    isDisabled={!emailEnabled}
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="email_notify_invoice"
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-default-900">
                      {t("settings.notifications.trigger_invoice_sent")}
                    </p>
                    <p className="text-sm text-default-500">
                      {t("settings.notifications.trigger_invoice_sent_hint")}
                    </p>
                  </div>
                  <Switch
                    isDisabled={!emailEnabled}
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="email_notify_next_service"
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-default-900">
                      {t("settings.notifications.trigger_service_reminder")}
                    </p>
                    <p className="text-sm text-default-500">
                      {t("settings.notifications.trigger_service_reminder_hint")}
                    </p>
                  </div>
                  <Switch
                    isDisabled={!emailEnabled}
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>

          <Chip
            className="text-xs"
            color="warning"
            startContent={<Wrench size={14} />}
            variant="flat"
          >
            {t("settings.notifications.skip_no_email")}
          </Chip>
        </SectionCard>

        <div className="flex justify-end">
          <Button
            color="primary"
            isDisabled={!isDirty}
            isLoading={loading}
            startContent={!loading ? <Save size={16} /> : undefined}
            type="submit"
          >
            {t("settings.notifications.save_settings")}
          </Button>
        </div>
      </form>
    </div>
  );
}
