import type { IWorkOrder } from "@/utils/interfaces/IUser";

import dayjs from "dayjs";
import { Tooltip } from "@heroui/react";
import { useTranslation } from "react-i18next";

import { PROGRESS_CONFIG } from "@/utils/interfaces/global";

interface Props {
  wo: IWorkOrder;
}
export default function StatusQueue({ wo }: Props) {
  const config =
    PROGRESS_CONFIG[wo.progress as keyof typeof PROGRESS_CONFIG] ||
    PROGRESS_CONFIG.queue;
  const IconComponent = config.icon;

  const { t } = useTranslation();
  const isCancel = wo.progress === "cancel";
  const hasCancelNote = Boolean(wo.cancel_note?.trim());

  const statusLabel = (
    <div
      className={`flex items-center gap-2 ${config.color} ${isCancel && hasCancelNote ? "cursor-default underline decoration-dotted underline-offset-2" : ""}`}
    >
      <IconComponent size={16} />
      <span className="text-xs font-bold italic">{t(wo.progress!)}</span>
    </div>
  );

  const timeLabel = (
    <span className="text-[11px] text-gray-400 italic">
      {wo.start_at && dayjs(wo.start_at).format("HH:mm")}{" "}
      {wo.end_at ? "-" : ""} {wo.end_at && dayjs(wo.end_at).format("HH:mm")}{" "}
      {wo.start_at ? "WIB" : ""}
    </span>
  );

  return (
    <>
      {isCancel && hasCancelNote ? (
        <Tooltip
          closeDelay={100}
          content={
            <div className="max-w-xs px-1 py-1">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                Alasan Pembatalan
              </p>
              <p className="text-sm whitespace-pre-wrap">{wo.cancel_note}</p>
            </div>
          }
          delay={200}
          placement="top"
          showArrow
        >
          {statusLabel}
        </Tooltip>
      ) : (
        statusLabel
      )}
      {timeLabel}
    </>
  );
}
