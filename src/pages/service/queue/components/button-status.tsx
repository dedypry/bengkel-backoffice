import type { IWorkOrder } from "@/utils/interfaces/IUser";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Eye, Play, CheckCircle2, ReceiptText } from "lucide-react";

import ResultMechanic from "./result-mechanic";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { hasRoles } from "@/utils/helpers/roles";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { setTabCashier } from "@/stores/features/work-order/wo-slice";

interface Props {
  item: IWorkOrder;
  onSuccess?: () => void;
}

export default function ButtonStatus({ item, onSuccess }: Props) {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  const restriction = hasRoles(["foreman", "super-admin"]);

  return (
    <React.Fragment>
      <ResultMechanic
        id={item.id}
        mechanics={item.mechanics || []}
        open={open}
        setOpen={setOpen}
        onFinish={() => handleUpdateStatus(item.id, "ready")}
      />

      {/* STATUS: QUEUE / PICK UP */}
      {["queue", "pick_up"].includes(item.progress as any) && (
        <Button
          className="font-bold"
          color="primary"
          isDisabled={item.mechanics?.length! < 1 || !restriction}
          isLoading={isLoading}
          size="sm"
          startContent={<Play fill="currentColor" size={16} />}
          onPress={() => handleUpdateStatus(item.id, "on_progress")}
        >
          MULAI KERJA
        </Button>
      )}

      {/* STATUS: ON PROGRESS */}
      {item.progress === "on_progress" && (
        <Button
          className="font-bold"
          color="success"
          isDisabled={!restriction}
          isLoading={isLoading}
          size="sm"
          startContent={<CheckCircle2 size={16} />}
          variant="flat"
          onPress={() => setOpen(true)}
        >
          SELESAIKAN
        </Button>
      )}

      {/* STATUS: READY (MENUNGGU PEMBAYARAN) */}
      {item.progress === "ready" && (
        <Button
          className="font-bold text-white"
          color="secondary"
          isDisabled={!restriction}
          isLoading={isLoading}
          size="sm"
          startContent={<ReceiptText size={16} />}
          onPress={() => {
            dispatch(getWoDetail(item.id));
            dispatch(setTabCashier("customer"));
            navigate("/cashier");
          }}
        >
          KASIR / PULANG
        </Button>
      )}

      {/* STATUS: CANCEL */}
      {item.progress === "cancel" && (
        <Button
          color="default"
          size="sm"
          startContent={<Eye size={16} />}
          variant="flat"
          onPress={() => navigate(`/service/queue/${item.id}`)}
        >
          Detail
        </Button>
      )}
    </React.Fragment>
  );
}
