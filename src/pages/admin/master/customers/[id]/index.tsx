import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDetailCustomer } from "@/stores/features/customer/customer-action";
import DetailSkeleton from "@/pages/admin/hr/employees/components/detail-skeleton";
import Detail404 from "@/pages/admin/hr/employees/components/detail-404";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers/global";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail: data, detailLoading } = useAppSelector(
    (state) => state.customer,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getDetailCustomer(id));
    }
  }, [id]);

  if (detailLoading) return <DetailSkeleton />;
  if (!data) return <Detail404 id={id} />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Profile */}
      <Item className="bg-white mb-5" variant="outline">
        <ItemMedia>
          <Avatar className="size-10">
            <AvatarImage
              src={
                data?.profile?.photo_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
              }
            />
            <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-xl font-semibold">{data.name}</ItemTitle>
          <ItemDescription>
            {data.phone} • {data.email}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            className={
              data.status === "active"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "opacity-50"
            }
            variant={data.status === "active" ? "default" : "secondary"}
          >
            {data.status.toUpperCase()}
          </Button>
          <Button className="bg-rose-500">
            <Edit /> Hapus
          </Button>
          <Button
            className="bg-amber-500"
            onClick={() => navigate(`/master/customers/${id}/edit`)}
          >
            <Edit /> Edit
          </Button>
        </ItemActions>
      </Item>

      {/* Tabs Navigation */}
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolom Kiri: Detail Profil */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                  Data Alamat & Identitas
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">NIK KTP</p>
                    <p className="font-medium">{data.nik_ktp || "-"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal Lahir</p>
                    <p className="font-medium">
                      {data?.profile.birth_date
                        ? dayjs(data?.profile.birth_date).format("DD MMMM YYYY")
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tipe Pelanggan</p>
                    <p className="font-medium capitalize">
                      {data.customer_type}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Alamat Lengkap</p>
                    <p className="font-medium">
                      {data.profile.address}, {data.profile.district.name},{" "}
                      {data.profile.city.name}, {data.profile.province.name}
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                  Kendaraan Terdaftar ({data.vehicles?.length})
                </h2>
                <div className="space-y-4">
                  {(data?.vehicles || []).map((v) => (
                    <div
                      key={v.id}
                      className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-primary font-bold">
                          {v.plate_number}
                        </p>
                        <p className="text-sm text-gray-600 uppercase">
                          {v.brand} {v.model} ({v.year})
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>Trans: {v.transmission_type}</p>
                        <p>CC: {v.engine_capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Kolom Kanan: Finansial & Notes */}
            <div className="space-y-6">
              <div className="bg-primary p-6 rounded-xl shadow-md text-white">
                <p className="text-sm opacity-80">Credit Limit</p>
                <h3 className="text-3xl font-bold">
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    Number(data.credit_limit),
                  )}
                </h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="font-semibold mb-2 text-gray-700">
                  Catatan Internal
                </h2>
                <p className="text-sm text-gray-500 italic">
                  {data.notes || "Tidak ada catatan."}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Aksi</th>
                  <th className="px-6 py-4">Modul</th>
                  <th className="px-6 py-4">Detail Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Data ini diambil dari API user_histories */}
                <tr>
                  <td className="px-6 py-4 text-sm">01 Jan 2026 09:15</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs uppercase font-bold">
                      Update
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">Profile</td>
                  <td className="px-6 py-4 text-xs text-gray-500 italic">
                    Merubah alamat
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
