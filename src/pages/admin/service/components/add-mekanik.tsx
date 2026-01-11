import { useEffect, useState } from "react";
import { PhoneCallIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMechanic } from "@/stores/features/mechanic/mechanic-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatarByName } from "@/utils/helpers/global";
import { MECHANIC_STATUS_CONFIG } from "@/utils/interfaces/global";
import { setMechanic } from "@/stores/features/mechanic/mechanic-slice";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getWo } from "@/stores/features/work-order/wo-action";
import Modal from "@/components/modal";

interface Props {
  open: boolean;
  id: number;
  setOpen: (val: boolean) => void;
}
export default function AddMechanich({ open, setOpen, id }: Props) {
  const { mechanics, mechanicIds } = useAppSelector((state) => state.mechanic);
  const { company } = useAppSelector((state) => state.auth);
  const { woQuery } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (company) {
      dispatch(getMechanic());
    }
  }, [company]);

  function handleSubmit() {
    setLoading(true);
    http
      .patch(`/work-order/mechanic/${id}`, {
        ids: mechanicIds,
      })
      .then(({ data }) => {
        notify(data.message);
        dispatch(setMechanic([]));
        dispatch(getWo(woQuery));
        setOpen(false);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Modal
        isLoading={loading}
        open={open}
        size="xl"
        title="Tambah Mekanik"
        onOpenChange={setOpen}
        onSave={handleSubmit}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pilih</TableHead>
              <TableHead>Mekanik</TableHead>
              <TableHead>Telp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mechanics.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={mechanicIds.includes(item.id)}
                    onCheckedChange={(val) => {
                      if (val) {
                        dispatch(setMechanic([...mechanicIds, item.id]));
                      } else {
                        const filter = mechanicIds.filter((e) => e != item.id);

                        dispatch(setMechanic(filter));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={
                          item?.profile?.photo_url || getAvatarByName(item.name)
                        }
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-gray-400 text-xs">{item.nik}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <PhoneCallIcon className="size-4" />
                    <span>{item?.profile?.phone_number}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {(() => {
                    const status =
                      item.work_status as keyof typeof MECHANIC_STATUS_CONFIG;
                    const config =
                      MECHANIC_STATUS_CONFIG[status] ||
                      MECHANIC_STATUS_CONFIG.leave;

                    return (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                      >
                        {/* Titik Indikator Samping */}
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                        />

                        {/* Teks Terjemahan */}
                        {t(`mechanic.status.${status}`)}
                      </div>
                    );
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Modal>
    </>
  );
}
