import {
  Card,
  CardBody,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import dayjs from "dayjs";
import { UserIcon, Car } from "lucide-react";

import DetailField from "./detail-field";

import { ICustomer } from "@/utils/interfaces/IUser";

interface Props {
  data: ICustomer;
}
export default function DetailCustomerTab({ data }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {/* Kolom Kiri */}
      <div className="lg:col-span-8 space-y-4">
        <Card className="border border-gray-200 shadow-sm p-4">
          <CardBody className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-400 rounded-sm text-white">
                <UserIcon size={18} />
              </div>
              <h4 className="text-sm font-black uppercase  text-gray-500">
                Identitas & Wilayah
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              <DetailField label="NIK KTP" value={data?.nik_ktp} />
              <DetailField
                label="Tanggal Lahir"
                value={
                  data?.profile?.birth_date
                    ? dayjs(data?.profile?.birth_date).format("DD MMMM YYYY")
                    : "-"
                }
              />
              <DetailField label="Tipe Pelanggan" value={data?.customer_type} />
              <DetailField
                isFullWidth
                label="Alamat Lengkap"
                value={`${data.profile?.address ? data.profile?.address + ", " : ""}${data.profile?.district?.name ? data.profile?.district?.name + ", " : ""}${data.profile?.city?.name ? data.profile?.city?.name + ", " : ""}${data.profile?.province?.name ? data.profile?.province?.name + ", " : ""}`}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Kolom Kanan: Finansial */}
      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm p-3">
          <CardBody className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-400 rounded-sm text-white">
                <Car size={18} />
              </div>
              <h4 className="text-sm font-black uppercase text-gray-500">
                Gudang Kendaraan ({data.vehicles?.length})
              </h4>
            </div>
            <Table aria-label="Daftar Kendaraan">
              <TableHeader>
                <TableColumn>PLAT NOMOR</TableColumn>
                <TableColumn>BRAND & MODEL</TableColumn>
                <TableColumn>TAHUN</TableColumn>
                <TableColumn>TRANSMISI</TableColumn>
                <TableColumn>BAHAN BAKAR</TableColumn>
                <TableColumn>UKURAN BAN</TableColumn>
                <TableColumn>WARNA</TableColumn>
              </TableHeader>
              <TableBody>
                {(data?.vehicles || []).map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <span className="font-bold text-primary">
                        {car.plate_number}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                          {car.brand}
                        </p>
                        <p className="text-bold text-tiny capitalize text-gray-500">
                          {car.model}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>
                      <Chip
                        color={
                          car.transmission_type === "AT"
                            ? "secondary"
                            : "warning"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {car.transmission_type}
                      </Chip>
                    </TableCell>
                    <TableCell className="capitalize">
                      {car.fuel_type}
                    </TableCell>
                    <TableCell className="uppercase">{car.tire_size}</TableCell>
                    <TableCell className="capitalize">{car.color}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
