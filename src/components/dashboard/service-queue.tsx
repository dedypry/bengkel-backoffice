import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { getAvatarByName } from "@/utils/helpers/global";

export function ServiceQueue() {
  const { dashboard } = useAppSelector((state) => state.dashboard);

  return (
    <Table aria-label="Tabel Antrean Service" className="mt-6" shadow="sm">
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
                <span className="text-small font-bold text-gray-500">
                  {item.vehicle.brand}
                </span>
                <span className="text-tiny text-gray-400">
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
                classNames={{
                  name: "text-gray-500 uppercase font-semibold text-xs",
                  description: "text-gray-400 text-[10px]",
                }}
                description={`+62 ${item.customer.phone}`}
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
                    <Chip key={mech.id}>{mech.name}</Chip>
                  ))
                ) : (
                  <span className="text-tiny text-gray-500 italic">
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
