import type { IActivityLogItem } from "@/utils/interfaces/ILogs";

import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@heroui/react";
import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

import { notify } from "@/utils/helpers/notify";

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

function CopyButton({
  ariaLabel,
  value,
}: {
  ariaLabel: string;
  value: string;
}) {
  const { t } = useTranslation();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      notify(t("logs.activity.copied"));
    } catch {
      notify(t("logs.activity.copy_failed"), "error");
    }
  }

  return (
    <Tooltip content={t("logs.activity.copy")}>
      <Button
        isIconOnly
        aria-label={ariaLabel}
        size="sm"
        variant="light"
        onPress={handleCopy}
      >
        <Copy size={14} />
      </Button>
    </Tooltip>
  );
}

function SectionLabel({
  copyValue,
  label,
}: {
  copyValue?: string;
  label: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="text-[10px] font-bold uppercase text-secondary-400">
        {label}
      </p>
      {copyValue ? (
        <CopyButton
          ariaLabel={`${t("logs.activity.copy")} ${label}`}
          value={copyValue}
        />
      ) : null}
    </div>
  );
}

export default function ActivityBodyModal({ open, item, onOpenChange }: Props) {
  const { t } = useTranslation();

  if (!item) {
    return null;
  }

  const statusColor = item.status === "success" ? "success" : "danger";
  const requestBody = formatPrettyJson(item.body);
  const responseMessage = formatPrettyJson(item.response_message);

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
            <SectionLabel copyValue={item.url || undefined} label="URL" />
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
            <SectionLabel
              copyValue={requestBody}
              label={t("logs.activity.request_body")}
            />
            <pre className="max-h-[240px] overflow-auto rounded-lg border border-secondary-200 bg-secondary-900 p-4 text-xs leading-relaxed text-secondary-100">
              {requestBody}
            </pre>
          </div>

          <div>
            <SectionLabel
              copyValue={responseMessage}
              label={t("logs.activity.response_message")}
            />
            <pre className="max-h-[240px] overflow-auto rounded-lg border border-secondary-200 bg-secondary-900 p-4 text-xs leading-relaxed text-secondary-100">
              {responseMessage}
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
