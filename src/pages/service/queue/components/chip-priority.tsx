import type { IWorkOrder } from "@/utils/interfaces/IUser";

import { Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface Props {
  wo: IWorkOrder;
}

export default function ChipPriority({ wo }: Props) {
  const { t } = useTranslation();

  const priorityConfig: Record<
    string,
    { color: "success" | "primary" | "warning" | "danger" }
  > = {
    low: { color: "success" },
    normal: { color: "primary" },
    high: { color: "warning" },
    hight: { color: "warning" },
    urgent: { color: "danger" },
  };

  const priorityKey =
    (wo.priority as string) === "hight" ? "high" : wo.priority || "normal";
  const configP = priorityConfig[wo.priority] || priorityConfig.normal;

  return (
    <Chip
      className="font-bold capitalize px-2 border-none"
      color={configP.color}
      size="sm"
      variant="flat"
    >
      {t(priorityKey)}
    </Chip>
  );
}
