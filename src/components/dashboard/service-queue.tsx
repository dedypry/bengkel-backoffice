import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";

export function ServiceQueue() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  return (
    <Table
      aria-label="Tabel Antrean Service"
      className="mt-6"
      classNames={{
        wrapper: "border border-default-100 shadow-sm",
        th: "bg-default-50 text-default-600 font-semibold",
      }}
      shadow="sm"
    >
      <TableHeader>
        <TableColumn>KENDARAAN</TableColumn>
        <TableColumn>CUSTOMER</TableColumn>
        <TableColumn>MEKANIK</TableColumn>
        <TableColumn align="center">STATUS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"Tidak ada antrean saat ini."}>
        {(dashboard?.wo || []).map((item, i) => (
          <TableRow
            key={i}
            className="border-b border-default-50 last:border-none"
          >
            {/* Kolom Kendaraan */}
            <TableCell>
              <div className="flex flex-col">
                <span className="text-small font-bold text-default-700">
                  {item.vehicle.brand}
                </span>
                <span className="text-tiny text-default-400">
                  {item.vehicle.plate_number}
                </span>
              </div>
            </TableCell>

            {/* Kolom Customer menggunakan komponen User HeroUI */}
            <TableCell>
              <User
                avatarProps={{
                  radius: "full",
                  size: "sm",
                  src:
                    item.customer?.profile?.photo_url ||
                    getAvatarByName(item.customer.name),
                }}
                description={item.customer.phone}
                name={item.customer.name}
              >
                {item.customer.name}
              </User>
            </TableCell>

            {/* Kolom Mekanik */}
            <TableCell>
              <div className="flex flex-col gap-1">
                {item.mechanics?.length ? (
                  item.mechanics.map((mech) => (
                    <span
                      key={mech.id}
                      className="text-tiny text-default-600 bg-default-100 px-2 py-0.5 rounded-full w-fit"
                    >
                      {mech.name}
                    </span>
                  ))
                ) : (
                  <span className="text-tiny text-default-300 italic">
                    Belum ditentukan
                  </span>
                )}
              </div>
            </TableCell>

            {/* Kolom Status */}
            <TableCell>
              <div className="flex justify-center">
                {/* <StatusQueue wo={item} /> */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
