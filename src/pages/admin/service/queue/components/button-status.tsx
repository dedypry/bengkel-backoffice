import type { IWorkOrder } from "@/utils/interfaces/IUser";

import { useState } from "react";

import { Button } from "@/components/ui/button";
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
          className="text-xs"
          disabled={isLoading || item.mechanics?.length! < 1}
          size="sm"
          onClick={() => handleUpdateStatus(item.id, "on_progress")}
        >
          {isLoading ? "Menyimpan..." : "MULAI KERJA"}
        </Button>
      )}
      {item.progress === "on_progress" && (
        <Button
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-[10px] h-8 font-bold"
          disabled={isLoading}
          size="sm"
          variant="outline"
          onClick={() => handleUpdateStatus(item.id, "ready")}
        >
          {isLoading ? "Menyimpan..." : "SELESAIKAN"}
        </Button>
      )}
      {item.progress === "ready" && (
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-[10px] h-8 font-bold"
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? "Menyimpan..." : "KASIR / PULANG"}
        </Button>
      )}
    </>
  );
}
