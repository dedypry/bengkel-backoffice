import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@heroui/react";
import { Wrench } from "lucide-react";

import StatusQueue from "@/components/status-queue";
import { useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";

export function ServiceQueue() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table
        aria-label="Tabel Antrean Service"
        classNames={{
          th: "bg-slate-50 text-slate-600 font-bold text-xs uppercase",
          td: "py-4",
        }}
        removeWrapper
      >
        <TableHeader>
          <TableColumn>KENDARAAN</TableColumn>
          <TableColumn>CUSTOMER</TableColumn>
          <TableColumn>MEKANIK</TableColumn>
          <TableColumn align="center">STATUS</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Tidak ada antrean saat ini.">
          {(dashboard?.wo || []).map((item) => (
            <TableRow key={item.id} className="border-b border-slate-100">
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700">
                    {item.vehicle.brand}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {item.vehicle.plate_number}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <User
                  avatarProps={{
                    radius: "full",
                    size: "sm",
                    src:
                      item.customer?.profile?.photo_url ||
                      getAvatarByName(item.customer.name),
                  }}
                  classNames={{
                    name: "text-xs font-semibold text-slate-700",
                    description: "text-[10px] text-slate-400",
                  }}
                  description={`+62 ${item.customer.phone}`}
                  name={item.customer.name}
                />
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.mechanics?.length ? (
                    item.mechanics.map((mech) => (
                      <Chip
                        key={mech.id}
                        color="primary"
                        size="sm"
                        variant="flat"
                      >
                        {mech.name}
                      </Chip>
                    ))
                  ) : (
                    <span className="flex items-center gap-1 text-xs italic text-slate-400">
                      <Wrench className="size-3.5" />
                      Belum ditentukan
                    </span>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col items-center">
                  <StatusQueue wo={item} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
