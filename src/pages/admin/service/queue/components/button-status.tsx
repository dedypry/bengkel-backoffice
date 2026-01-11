import type { IWorkOrder } from "@/utils/interfaces/IUser";

import React, { useState } from "react";
import { Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

import ResultMechanic from "./result-mechanic";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { setWo } from "@/stores/features/work-order/wo-slice";
import { useAppDispatch } from "@/stores/hooks";
import { hasRoles } from "@/utils/helpers/roles";

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
      {["queue", "pick_up"].includes(item.progress as any) && (
        <Button
          disabled={isLoading || item.mechanics?.length! < 1 || !restriction}
          size="sm"
          onClick={() => handleUpdateStatus(item.id, "on_progress")}
        >
          {isLoading ? "Menyimpan..." : "MULAI KERJA"}
        </Button>
      )}
      {item.progress === "on_progress" && (
        <Button
          color="success"
          disabled={isLoading || !restriction}
          size="sm"
          variant="outlined"
          onClick={() => setOpen(true)}
        >
          {isLoading ? "Menyimpan..." : "SELESAIKAN"}
        </Button>
      )}
      {item.progress === "ready" && (
        <Button
          disabled={isLoading || !restriction}
          size="sm"
          onClick={() => {
            dispatch(setWo(item));
            navigate("/cashier");
          }}
        >
          {isLoading ? "Menyimpan..." : "KASIR / PULANG"}
        </Button>
      )}
    </React.Fragment>
  );
}
