import type { IWorkOrder } from "@/utils/interfaces/IUser";

import dayjs from "dayjs";
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

  return (
    <div>
      <div className={`flex items-center gap-2 ${config.color}`}>
        <IconComponent size={16} />

        <span className="text-xs font-bold italic">{t(wo.progress!)}</span>
      </div>
      <span className="text-[12px] text-gray-400 italic">
        {wo.start_at && dayjs(wo.start_at).format("HH:mm")}{" "}
        {wo.end_at ? "-" : ""} {wo.end_at && dayjs(wo.end_at).format("HH:mm")}{" "}
        {wo.start_at ? "WIB" : ""}
      </span>
    </div>
  );
}
