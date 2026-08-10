import type { IActivityLogItem } from "@/utils/interfaces/ILogs";

import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  item: IActivityLogItem | null;
  onOpenChange: (open: boolean) => void;
};

export function formatPrettyJson(value: unknown) {
  if (value == null) {
    return "{}";
  }

  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function ActivityBodyModal({ open, item, onOpenChange }: Props) {
  const { t } = useTranslation();

  if (!item) {
    return null;
  }

  const statusColor = item.status === "success" ? "success" : "danger";

  return (
    <Modal
      isOpen={open}
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="text-secondary-600">
        <ModalHeader className="flex flex-col gap-1 text-secondary-700">
          <div className="flex items-center gap-2">
            <span>{t("logs.activity.detail_title")}</span>
            {item.status ? (
              <Chip color={statusColor} size="sm" variant="flat">
                {t(`logs.activity.status.${item.status}`)}
              </Chip>
            ) : null}
          </div>
          <span className="text-xs font-normal normal-case text-secondary-500">
            {item.action || "-"}
          </span>
        </ModalHeader>
        <ModalBody className="gap-4">
          <div className="rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-secondary-400">
              URL
            </p>
            <p className="break-all font-mono text-xs text-secondary-700">
              {item.url || "-"}
            </p>
          </div>

          {item.session ? (
            <div className="rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase text-secondary-400">
                {t("logs.activity.session")}
              </p>
              <p className="text-sm text-secondary-700">
                {item.session.device_label}
              </p>
              <p className="text-xs text-secondary-500">
                {item.session.platform} · {item.session.browser} ·{" "}
                {item.session.ip_address}
              </p>
            </div>
          ) : null}

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase text-secondary-400">
              {t("logs.activity.request_body")}
            </p>
            <pre className="max-h-[240px] overflow-auto rounded-lg border border-secondary-200 bg-secondary-900 p-4 text-xs leading-relaxed text-secondary-100">
              {formatPrettyJson(item.body)}
            </pre>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase text-secondary-400">
              {t("logs.activity.response_message")}
            </p>
            <pre className="max-h-[240px] overflow-auto rounded-lg border border-secondary-200 bg-secondary-900 p-4 text-xs leading-relaxed text-secondary-100">
              {formatPrettyJson(item.response_message)}
            </pre>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
