import type { IWorkOrder } from "@/utils/interfaces/IUser";

import { Chip } from "@mui/joy";

interface Props {
  wo: IWorkOrder;
}
export default function ChipPriority({ wo }: Props) {
  const priorityConfig = {
    low: { color: "success", label: "Low" },
    normal: { color: "primary", label: "Normal" },
    high: { color: "danger", label: "High" },
  } as const;

  const configP = priorityConfig[wo.priority] || priorityConfig.normal;

  return (
    <Chip
      color={configP.color}
      size="sm"
      sx={{ fontWeight: "bold", textTransform: "capitalize" }}
      variant="outlined"
    >
      {configP.label}
    </Chip>
  );
}
