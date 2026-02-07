import { Card, CardBody, Chip } from "@heroui/react";
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
              <DetailField label="NIK KTP" value={data.nik_ktp} />
              <DetailField
                label="Tanggal Lahir"
                value={
                  data?.profile.birth_date
                    ? dayjs(data?.profile.birth_date).format("DD MMMM YYYY")
                    : "-"
                }
              />
              <DetailField label="Tipe Pelanggan" value={data.customer_type} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data?.vehicles || []).map((v) => (
                <Card
                  key={v.id}
                  className="border border-gray-200 hover:border-primary transition-all shadow-none"
                >
                  <CardBody className="p-5 flex flex-row items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-gray-500 uppercase leading-none mb-1">
                        {v.plate_number}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        {v.brand} {v.model} • {v.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <Chip
                        className="font-black text-[10px] uppercase tracking-tighter rounded-sm"
                        size="sm"
                        variant="flat"
                      >
                        {v.transmission_type} • {v.engine_capacity}CC
                      </Chip>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
