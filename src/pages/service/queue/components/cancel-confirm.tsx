import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { useState } from "react";

import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { IWorkOrder } from "@/utils/interfaces/IUser";
import { getWo } from "@/stores/features/work-order/wo-action";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";

interface Props {
  item: IWorkOrder;
  open: boolean;
  setOpen: (val: boolean) => void;
}
export default function CancelConfirm({ item, open, setOpen }: Props) {
  const { woQuery } = useAppSelector((state) => state.wo);
  const [cancelNote, setCancelNote] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  function handleCancel() {
    setLoading(true);
    http
      .patch(`/work-order/cancel/${item.id}`, { cancelNote })
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
    <>
      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Alasan dibatalkan</ModalHeader>
          <ModalBody>
            <Textarea
              placeholder="Tuliskan alasan anda membatalkan order ini"
              value={cancelNote}
              onValueChange={setCancelNote}
            />
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="bordered">
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={loading}
              size="sm"
              onPress={handleCancel}
            >
              Batalkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
