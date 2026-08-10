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
import { useTranslation } from "react-i18next";

import DetailField from "./detail-field";

import { ICustomer } from "@/utils/interfaces/IUser";

interface Props {
  data: ICustomer;
}
export default function DetailCustomerTab({ data }: Props) {
  const { t } = useTranslation();

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
                {t("master.customers.identity_section")}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              <DetailField
                label={t("master.customers.nik_ktp")}
                value={data?.nik_ktp}
              />
              <DetailField
                label={t("master.customers.birth_date")}
                value={
                  data?.profile?.birth_date
                    ? dayjs(data?.profile?.birth_date).format("DD MMMM YYYY")
                    : "-"
                }
              />
              <DetailField
                label={t("master.customers.customer_type")}
                value={data?.customer_type}
              />
              <DetailField
                isFullWidth
                label={t("master.customers.full_address")}
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
                {t("master.customers.vehicle_garage", {
                  count: data.vehicles?.length,
                })}
              </h4>
            </div>
            <Table aria-label="Daftar Kendaraan">
              <TableHeader>
                <TableColumn>
                  {t("master.customers.vehicle_table.plate")}
                </TableColumn>
                <TableColumn>
                  {t("master.customers.vehicle_table.brand_model")}
                </TableColumn>
                <TableColumn>
                  {t("master.customers.vehicle_table.year")}
                </TableColumn>
                <TableColumn>
                  {t("master.customers.vehicle_table.transmission")}
                </TableColumn>
                <TableColumn>
                  {t("master.customers.vehicle_table.fuel")}
                </TableColumn>
                <TableColumn>
                  {t("master.customers.vehicle_table.tire_size")}
                </TableColumn>
                <TableColumn>
                  {t("master.customers.vehicle_table.color")}
                </TableColumn>
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
