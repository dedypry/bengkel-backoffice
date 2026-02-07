import { useEffect, useState } from "react";
import { PhoneCallIcon, UserPlus2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
} from "@heroui/react";

import { getMechanic } from "@/stores/features/mechanic/mechanic-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";
import { MECHANIC_STATUS_CONFIG } from "@/utils/interfaces/global";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getWo } from "@/stores/features/work-order/wo-action";

interface Props {
  open: boolean;
  id: number;
  setOpen: (val: boolean) => void;
  onRefresh?: () => void;
}

export default function AddMechanich({ open, setOpen, id, onRefresh }: Props) {
  const { mechanics, mechanicIds, mechanicQuery } = useAppSelector(
    (state) => state.mechanic,
  );
  const { company } = useAppSelector((state) => state.auth);
  const { woQuery } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (company && open) {
      dispatch(getMechanic(mechanicQuery));
    }
  }, [company, open, dispatch, mechanicQuery]);

  const handleSubmit = () => {
    setLoading(true);
    http
      .patch(`/work-order/mechanic/${id}`, {
        ids: mechanicIds,
      })
      .then(({ data }) => {
        notify(data.message);
        dispatch(setMechanic([]));

        if (onRefresh) {
          onRefresh();
        } else {
          dispatch(getWo(woQuery));
        }
        setOpen(false);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={open}
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2 items-center">
              <UserPlus2 className="text-primary" />
              <div className="flex flex-col">
                <span>Tambah Mekanik</span>
                <span className="text-tiny font-normal text-gray-400">
                  Pilih personil mekanik untuk menangani Work Order ini
                </span>
              </div>
            </ModalHeader>
            <ModalBody className="pb-6">
              <Table
                removeWrapper
                aria-label="Daftar Mekanik"
                classNames={{
                  th: "bg-default-50 text-gray-600 font-bold",
                  td: "py-3 border-b border-default-100 last:border-none",
                }}
                selectedKeys={new Set(mechanicIds.map(String))}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  // Jika "all", kita ambil semua ID mekanik
                  if (keys === "all") {
                    dispatch(setMechanic(mechanics.map((m) => m.id)));
                  } else {
                    // Jika parsial, konversi Set ke array of numbers
                    const selectedArray = Array.from(keys).map(Number);

                    dispatch(setMechanic(selectedArray));
                  }
                }}
              >
                <TableHeader>
                  <TableColumn>MEKANIK</TableColumn>
                  <TableColumn>KONTAK</TableColumn>
                  <TableColumn align="center">STATUS</TableColumn>
                </TableHeader>
                <TableBody emptyContent={t("common.no_data")} items={mechanics}>
                  {(item) => {
                    const status =
                      item.work_status as keyof typeof MECHANIC_STATUS_CONFIG;
                    const config =
                      MECHANIC_STATUS_CONFIG[status] ||
                      MECHANIC_STATUS_CONFIG.leave;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar
                              isBordered
                              className="size-10"
                              name={item.name}
                              src={
                                item?.profile?.photo_url ||
                                getAvatarByName(item.name)
                              }
                            />
                            <div className="flex flex-col">
                              <span className="text-small font-semibold">
                                {item.name}
                              </span>
                              <span className="text-tiny text-gray-400 font-mono">
                                {item.nik}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center text-gray-500">
                            <PhoneCallIcon size={14} />
                            <span className="text-small">
                              {item?.profile?.phone_number || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip
                            classNames={{
                              base: config.bg,
                              content: `${config.text} font-bold`,
                            }}
                            size="sm"
                            startContent={
                              <span
                                className={`h-1.5 w-1.5 rounded-full ml-1 ${config.dot}`}
                              />
                            }
                            variant="flat"
                          >
                            {t(`mechanic.status.${status}`)}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    );
                  }}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter className="border-t border-default-100">
              <Button color="danger" variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button
                className="font-bold"
                color="primary"
                isLoading={loading}
                onPress={handleSubmit}
              >
                Simpan Mekanik
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
