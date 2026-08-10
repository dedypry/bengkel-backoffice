import { Database, Download } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";
import dayjs from "dayjs";

import { http } from "@/utils/libs/axios";
import { handleDownloadFile } from "@/utils/helpers/global";
import { notify, notifyError } from "@/utils/helpers/notify";

type BackupStatus = "processing" | "ready" | "failed";

interface DatabaseBackup {
  id: number;
  file_name: string;
  file_size?: number | null;
  status: BackupStatus;
  error_message?: string | null;
  completed_at?: string | null;
  created_at: string;
}

interface BackupDataCardProps {
  userType?: string;
  roles?: { slug: string }[];
}

export default function BackupDataCard({
  userType,
  roles = [],
}: BackupDataCardProps) {
  const { t } = useTranslation();
  const [backup, setBackup] = useState<DatabaseBackup | null>(null);
  const [starting, setStarting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const canAccess = useMemo(() => {
    const isOwner = userType === "owner";
    const isSuperAdmin = roles.some((role) => role.slug === "super-admin");

    return isOwner || isSuperAdmin;
  }, [userType, roles]);

  const fetchLatest = useCallback(async () => {
    try {
      const { data } = await http.get<DatabaseBackup | null>("/backups/latest");

      setBackup(data ?? null);
    } catch {
      setBackup(null);
    }
  }, []);

  useEffect(() => {
    if (!canAccess) return;
    void fetchLatest();
  }, [canAccess, fetchLatest]);

  useEffect(() => {
    if (!canAccess || backup?.status !== "processing") return;

    const interval = setInterval(() => {
      void fetchLatest();
    }, 3000);

    return () => clearInterval(interval);
  }, [backup?.status, canAccess, fetchLatest]);

  const handleStartBackup = async () => {
    setStarting(true);
    try {
      const { data } = await http.post<DatabaseBackup>("/backups");

      setBackup(data);
      notify(t("profile.backup_started"));
    } catch (err) {
      notifyError(err);
    } finally {
      setStarting(false);
    }
  };

  const handleDownload = () => {
    if (!backup?.id || !backup.file_name) return;

    const fileName = backup.file_name.replace(/\.sql$/i, "");

    void handleDownloadFile(
      `/backups/${backup.id}/download`,
      fileName,
      "sql",
      "application/sql",
      setDownloading,
    );
  };

  const statusColor = {
    processing: "warning",
    ready: "success",
    failed: "danger",
  } as const;

  const statusLabel = {
    processing: t("profile.backup_status_processing"),
    ready: t("profile.backup_status_ready"),
    failed: t("profile.backup_status_failed"),
  };

  if (!canAccess) return null;

  const lastAt = backup?.completed_at || backup?.created_at;

  return (
    <Card>
      <CardBody className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="text-gray-900" size={18} />
          <h3 className="font-black uppercase text-xs text-gray-500">
            {t("profile.backup_title")}
          </h3>
        </div>
        <Divider />
        <p className="text-[11px] font-medium text-gray-500">
          {t("profile.backup_desc")}
        </p>

        {backup && (
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              color={statusColor[backup.status]}
              radius="md"
              size="sm"
              variant="flat"
            >
              {statusLabel[backup.status]}
            </Chip>
            {lastAt && (
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                {t("profile.backup_last_at")}
                {dayjs(lastAt).format("DD MMM YYYY HH:mm")}
              </span>
            )}
          </div>
        )}

        {backup?.status === "failed" && backup.error_message && (
          <p className="text-[10px] font-medium text-danger">{backup.error_message}</p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            color="primary"
            isDisabled={backup?.status === "processing"}
            isLoading={starting || backup?.status === "processing"}
            size="sm"
            onPress={handleStartBackup}
          >
            {t("profile.backup_start")}
          </Button>

          {backup?.status === "ready" && (
            <Button
              color="success"
              isLoading={downloading}
              size="sm"
              startContent={<Download size={16} />}
              variant="flat"
              onPress={handleDownload}
            >
              {t("profile.backup_download")}
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
