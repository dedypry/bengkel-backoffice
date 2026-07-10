import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { IWorkOrder } from "@/utils/interfaces/IUser";
import { getWo } from "@/stores/features/work-order/wo-action";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { PROGRESS_CONFIG } from "@/utils/interfaces/global";

const STATUS_OPTIONS = [
  "queue",
  "on_progress",
  "ready",
  "finish",
  "cancel",
] as const;

type StatusOption = (typeof STATUS_OPTIONS)[number];

interface Props {
  item: IWorkOrder;
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function ManualStatusModal({ item, open, setOpen }: Props) {
  const { woQuery } = useAppSelector((state) => state.wo);
  const [status, setStatus] = useState<StatusOption>(
    (item.progress as StatusOption) || "queue",
  );
  const [cancelNote, setCancelNote] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setStatus((item.progress as StatusOption) || "queue");
      setCancelNote("");
    }
  }, [open, item.progress]);

  function handleSave() {
    if (!status || status === item.progress) {
      setOpen(false);

      return;
    }

    if (status === "cancel" && !cancelNote.trim()) {
      notify("Alasan pembatalan wajib diisi", "warning");

      return;
    }

    setLoading(true);

    const request =
      status === "cancel"
        ? http.patch(`/work-order/cancel/${item.id}`, { cancelNote })
        : http.patch(`/work-order/${item.id}`, { progress: status });

    request
      .then(({ data }) => {
        notify(data.message);
        dispatch(getWo(woQuery));
        setOpen(false);
        setCancelNote("");
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <Modal isOpen={open} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader>Ubah Status Manual</ModalHeader>
        <ModalBody>
          <p className="text-sm text-gray-500 mb-3">
            {item.vehicle.plate_number} — {item.customer.name}
          </p>
          <RadioGroup
            label="Pilih status baru"
            value={status}
            onValueChange={(value) => setStatus(value as StatusOption)}
          >
            {STATUS_OPTIONS.map((key) => {
              const config = PROGRESS_CONFIG[key];
              const Icon = config.icon;

              return (
                <Radio
                  key={key}
                  classNames={{
                    base: `w-full max-w-full m-0 p-2 rounded-lg border border-default-200 data-[selected=true]:border-primary ${key === "cancel" ? "data-[selected=true]:border-danger" : ""}`,
                  }}
                  value={key}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={config.color} size={16} />
                    <span className="font-medium">{t(key)}</span>
                  </div>
                </Radio>
              );
            })}
          </RadioGroup>
          {status === "cancel" && (
            <Textarea
              className="mt-3"
              label="Alasan pembatalan"
              placeholder="Tuliskan alasan membatalkan service ini"
              value={cancelNote}
              onValueChange={setCancelNote}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button size="sm" variant="bordered" onPress={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            color={status === "cancel" ? "danger" : "primary"}
            isDisabled={
              status === item.progress ||
              (status === "cancel" && !cancelNote.trim())
            }
            isLoading={loading}
            size="sm"
            onPress={handleSave}
          >
            {status === "cancel" ? "Batalkan Service" : "Simpan"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
