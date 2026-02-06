import type { IWorkOrder } from "@/utils/interfaces/IUser";

import { Chip } from "@heroui/react";

interface Props {
  wo: IWorkOrder;
}

export default function ChipPriority({ wo }: Props) {
  // Mapping konfigurasi warna dan label berdasarkan prioritas
  const priorityConfig: Record<
    string,
    { color: "success" | "primary" | "warning" | "danger"; label: string }
  > = {
    low: { color: "success", label: "Low" },
    normal: { color: "primary", label: "Normal" },
    high: { color: "warning", label: "High" },
    urgent: { color: "danger", label: "Urgent" }, // Menambahkan case urgent jika ada
  };

  // Fallback ke normal jika priority tidak ditemukan atau typo (seperti 'hight')
  const configP = priorityConfig[wo.priority] || priorityConfig.normal;

  return (
    <Chip
      className="font-bold capitalize px-2 border-none"
      color={configP.color}
      size="sm"
      variant="flat"
    >
      {configP.label}
    </Chip>
  );
}
