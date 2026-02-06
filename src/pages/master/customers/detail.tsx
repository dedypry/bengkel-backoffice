import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Edit,
  Trash2,
  Phone,
  Mail,
  CreditCard,
  Car,
  History,
  Info,
  User as UserIcon,
} from "lucide-react";
import dayjs from "dayjs";
import {
  Button,
  Card,
  CardBody,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getDetailCustomer } from "@/stores/features/customer/customer-action";
import { getInitials } from "@/utils/helpers/global";
import Detail404 from "@/pages/hr/employees/components/detail-404";
import DetailSkeleton from "@/pages/hr/employees/components/detail-skeleton";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail: data, detailLoading } = useAppSelector(
    (state) => state.customer,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) dispatch(getDetailCustomer(id));
  }, [id, dispatch]);

  if (detailLoading) return <DetailSkeleton />;
  if (!data) return <Detail404 id={id} />;

  return (
    <div className="space-y-8 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header Profile Industrial */}
      <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar
              className="w-32 h-32 rounded-[2.5rem] border-4 border-gray-50 shadow-md font-black italic text-gray-400 text-2xl"
              fallback={getInitials(data.name)}
              src={
                data?.profile?.photo_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`
              }
            />

            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-gray-800 leading-none">
                  {data.name}
                </h1>
                <Chip
                  className="font-black uppercase italic text-[10px] rounded-lg"
                  color={data.status === "active" ? "success" : "danger"}
                  variant="flat"
                >
                  {data.status}
                </Chip>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest italic">
                  <Phone className="text-blue-500" size={14} /> {data.phone}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest italic">
                  <Mail className="text-blue-500" size={14} /> {data.email}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="font-black uppercase italic text-xs h-12 px-6 rounded-2xl"
                color="danger"
                startContent={<Trash2 size={18} />}
                variant="flat"
              >
                Hapus
              </Button>
              <Button
                className="bg-gray-900 text-white font-black uppercase italic text-xs h-12 px-8 rounded-2xl shadow-xl shadow-gray-200"
                startContent={<Edit size={18} />}
                onPress={() => navigate(`/master/customers/${id}/edit`)}
              >
                Edit Pelanggan
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs Navigation */}
      <Tabs
        aria-label="Customer Tabs"
        classNames={{
          base: "w-full",
          tabList:
            "gap-8 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-gray-900 h-1",
          tab: "max-w-fit px-0 h-12 font-black uppercase italic text-xs tracking-[0.2em]",
          tabContent: "group-data-[selected=true]:text-gray-900",
        }}
        variant="underlined"
      >
        <Tab
          key="info"
          title={
            <div className="flex items-center gap-2">
              <Info size={16} />
              <span>Detail Informasi</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Kolom Kiri */}
            <div className="lg:col-span-8 space-y-8">
              <Card className="rounded-[2.5rem] border-none shadow-sm p-4">
                <CardBody className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-900 rounded-xl text-white">
                      <UserIcon size={18} />
                    </div>
                    <h4 className="text-sm font-black uppercase italic tracking-widest text-gray-800">
                      Identitas & Wilayah
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    <DetailField label="NIK KTP" value={data.nik_ktp} />
                    <DetailField
                      label="Tanggal Lahir"
                      value={
                        data?.profile.birth_date
                          ? dayjs(data?.profile.birth_date).format(
                              "DD MMMM YYYY",
                            )
                          : "-"
                      }
                    />
                    <DetailField
                      label="Tipe Pelanggan"
                      value={data.customer_type}
                    />
                    <DetailField
                      isFullWidth
                      label="Alamat Lengkap"
                      value={`${data.profile?.address}, ${data.profile?.district?.name}, ${data.profile?.city?.name}, ${data.profile?.province?.name}`}
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Kendaraan Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4">
                  <div className="p-2 bg-gray-900 rounded-xl text-white">
                    <Car size={18} />
                  </div>
                  <h4 className="text-sm font-black uppercase italic tracking-widest text-gray-800">
                    Gudang Kendaraan ({data.vehicles?.length})
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(data?.vehicles || []).map((v) => (
                    <Card
                      key={v.id}
                      className="rounded-3xl border-2 border-gray-50 hover:border-blue-500 transition-all shadow-none"
                    >
                      <CardBody className="p-5 flex flex-row items-center justify-between">
                        <div>
                          <p className="text-lg font-black italic text-gray-800 tracking-tighter uppercase leading-none mb-1">
                            {v.plate_number}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            {v.brand} {v.model} • {v.year}
                          </p>
                        </div>
                        <div className="text-right">
                          <Chip
                            className="font-black text-[9px] uppercase tracking-tighter"
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
              </div>
            </div>

            {/* Kolom Kanan: Finansial */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="rounded-[2.5rem] bg-gray-900 text-white shadow-xl shadow-gray-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <CreditCard size={100} />
                </div>
                <CardBody className="p-8 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">
                    Credit Limit Pelanggan
                  </p>
                  <h3 className="text-4xl font-black italic tracking-tighter text-emerald-400 leading-none">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      Number(data.credit_limit),
                    )}
                  </h3>
                  <Divider className="my-6 bg-white/10" />
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                      Internal Notes
                    </h4>
                    <p className="text-xs font-medium italic text-gray-400 leading-relaxed">
                      &quot;
                      {data.notes ||
                        "Tidak ada catatan khusus untuk pelanggan ini."}
                      &quot;
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>

        <Tab
          key="history"
          title={
            <div className="flex items-center gap-2">
              <History size={16} />
              <span>Log Aktivitas</span>
            </div>
          }
        >
          <div className="pt-6">
            <Table
              aria-label="History Table"
              classNames={{
                base: "rounded-[2.5rem] border border-gray-50 bg-white overflow-hidden",
                th: "bg-gray-50/50 text-gray-400 font-black uppercase text-[10px] tracking-widest py-6 italic",
                td: "py-4 border-b border-gray-50/50",
              }}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>WAKTU</TableColumn>
                <TableColumn>AKSI</TableColumn>
                <TableColumn>MODUL</TableColumn>
                <TableColumn>DETAIL PERUBAHAN</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs font-bold text-gray-600">
                    01 Jan 2026 09:15
                  </TableCell>
                  <TableCell>
                    <Chip
                      className="font-black italic uppercase text-[9px]"
                      color="warning"
                      size="sm"
                      variant="flat"
                    >
                      Update
                    </Chip>
                  </TableCell>
                  <TableCell className="text-xs font-black italic uppercase text-gray-400">
                    Profile
                  </TableCell>
                  <TableCell className="text-xs font-medium italic text-gray-500">
                    Merubah alamat domisili pelanggan
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

function DetailField({
  label,
  value,
  isFullWidth = false,
}: {
  label: string;
  value?: string | null | undefined;
  isFullWidth?: boolean;
}) {
  return (
    <div className={`space-y-1 ${isFullWidth ? "md:col-span-2" : ""}`}>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-sm font-black italic uppercase text-gray-800 tracking-tight">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}
