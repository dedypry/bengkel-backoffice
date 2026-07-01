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
import { useEffect, useRef, useState } from "react";

import {
  isEmailConfigSaved,
  mapNotificationSettings,
  notificationDefaults,
  notificationSchema,
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
  const { settings } = useAppSelector((state) => state.setting);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");

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
      notify("Pengaturan notifikasi berhasil disimpan");
      dispatch(getSettings());
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      notifyError("Masukkan alamat email tujuan tes");

      return;
    }

    setTesting(true);

    try {
      const { data } = await http.post("/settings/email/test", {
        email: testEmail.trim(),
      });

      notify(data.message || "Email tes berhasil dikirim");
    } catch (error) {
      notifyError(error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <HeaderAction
        subtitle="Atur SMTP dan notifikasi email otomatis ke pelanggan."
        title="Notifikasi Email"
      />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <SectionCard
          description="Aktifkan pengiriman email ke pelanggan yang memiliki alamat email."
          icon={Bell}
          title="Status Notifikasi"
        >
          <Controller
            control={control}
            name="email_enabled"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                <div>
                  <p className="font-semibold text-default-900">
                    Aktifkan Email Notifikasi
                  </p>
                  <p className="text-sm text-default-500">
                    Email hanya dikirim jika pelanggan memiliki alamat email.
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
          description="Konfigurasi server SMTP untuk mengirim email ke pelanggan."
          icon={Server}
          title="Konfigurasi SMTP"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="smtp_host"
              render={({ field }) => (
                <Input
                  {...field}
                  isDisabled={!emailEnabled}
                  label="SMTP Host"
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
                  label="SMTP Port"
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
                  label="SMTP Username"
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
                  label="SMTP Password"
                  placeholder={
                    field.value === MASKED_PASSWORD
                      ? "Password tersimpan"
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
                  label="Nama Pengirim"
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
                  label="Email Pengirim"
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
                  <p className="font-semibold text-default-900">SSL / TLS</p>
                  <p className="text-sm text-default-500">
                    Aktifkan untuk port 465 (secure). Nonaktifkan untuk STARTTLS
                    (port 587).
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
                  label="Email Tujuan Tes"
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
                  Kirim Email Tes
                </Button>
              </div>
            </>
          ) : null}
        </SectionCard>

        <SectionCard
          description="Pilih kapan email otomatis dikirim ke pelanggan."
          icon={ShieldCheck}
          title="Trigger Notifikasi"
        >
          <div className="space-y-3">
            <Controller
              control={control}
              name="email_notify_wo_ready"
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-default-900">
                      Servis Selesai Dikerjakan
                    </p>
                    <p className="text-sm text-default-500">
                      Saat progress work order berubah menjadi siap diambil
                      (ready).
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
                      Pembayaran Selesai
                    </p>
                    <p className="text-sm text-default-500">
                      Saat kasir menyelesaikan pembayaran work order.
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
                      Invoice Dikirim
                    </p>
                    <p className="text-sm text-default-500">
                      Otomatis setelah pembayaran selesai, atau saat invoice
                      dikirim manual.
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
            Pelanggan tanpa email akan dilewati secara otomatis.
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
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
