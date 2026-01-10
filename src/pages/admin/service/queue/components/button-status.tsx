import type { IWorkOrder } from "@/utils/interfaces/IUser";

import { useState } from "react";
import { Button } from "@mui/joy";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

interface Props {
  item: IWorkOrder;
  onSuccess?: () => void;
}
export default function ButtonStatus({ item, onSuccess }: Props) {
  const [isLoading, setLoading] = useState(false);
  const handleUpdateStatus = (id: number, status: string) => {
    setLoading(true);
    http
      .patch(`/work-order/${id}`, {
        progress: status,
      })
      .then(({ data }) => {
        notify(data.message);
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      {item.progress === "queue" && (
        <Button
          disabled={isLoading || item.mechanics?.length! < 1}
          size="sm"
          onClick={() => handleUpdateStatus(item.id, "on_progress")}
        >
          {isLoading ? "Menyimpan..." : "MULAI KERJA"}
        </Button>
      )}
      {item.progress === "on_progress" && (
        <Button
          color="success"
          disabled={isLoading}
          size="sm"
          variant="outlined"
          onClick={() => handleUpdateStatus(item.id, "ready")}
        >
          {isLoading ? "Menyimpan..." : "SELESAIKAN"}
        </Button>
      )}
      {item.progress === "ready" && (
        <Button disabled={isLoading} size="sm">
          {isLoading ? "Menyimpan..." : "KASIR / PULANG"}
        </Button>
      )}
    </>
  );
}
