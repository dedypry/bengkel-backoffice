import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  Briefcase,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Map as MapIcon,
  BadgeInfo,
  Edit,
  Mail,
  Heart,
  UserCircle,
} from "lucide-react";
import dayjs from "dayjs";
import { Button, Card, CardBody, Chip, Divider, Avatar } from "@heroui/react";

import DetailSkeleton from "./components/detail-skeleton";
import Detail404 from "./components/detail-404";

import { getEmployeDetail } from "@/stores/features/employe/employe-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getInitials } from "@/utils/helpers/global";

export default function EmployeesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { detail, detailLoading: loading } = useAppSelector(
    (state) => state.employe,
  );

  useEffect(() => {
    if (id) {
      dispatch(getEmployeDetail(id));
    }
  }, [id, dispatch]);

  if (loading) return <DetailSkeleton />;
  if (!detail) return <Detail404 id={id} />;

  return (
    <div className="space-y-8 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            className="rounded-full bg-white shadow-sm"
            variant="flat"
            onPress={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter text-gray-800">
              Profil Personil
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              ID: {detail.nik || "EMP-" + id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Chip
            className="font-black uppercase italic text-[10px] border-none bg-white shadow-sm"
            color={detail.is_active ? "success" : "danger"}
            variant="dot"
          >
            {detail.is_active ? "Active Duty" : "Off Duty"}
          </Chip>
          <Chip
            className="font-black uppercase italic text-[10px]"
            color="primary"
            variant="flat"
          >
            {detail.status}
          </Chip>
          <Button
            className="bg-gray-900 text-white font-black uppercase italic text-xs px-6 rounded-2xl shadow-xl shadow-gray-200"
            startContent={<Edit size={16} />}
            onPress={() => navigate(`/hr/employees/${id}/edit`)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: IDENTITAS (Sticky) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <CardBody className="p-0">
              <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-950 w-full" />
              <div className="px-6 pb-8 -mt-16 flex flex-col items-center">
                <Avatar
                  className="w-32 h-32 text-large rounded-[2.5rem] border-8 border-white shadow-lg bg-gray-100 font-black italic text-gray-400"
                  fallback={getInitials(
                    detail.profile?.full_name || detail.name,
                  )}
                  src={detail.profile?.photo_url}
                />
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-black uppercase italic tracking-tight text-gray-800">
                    {detail.profile?.full_name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-1 text-blue-500">
                    <Mail size={14} />
                    <span className="text-xs font-bold">{detail.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {detail.roles?.map((role) => (
                    <Chip
                      key={role.id}
                      className="font-bold uppercase text-[9px] border-gray-200"
                      size="sm"
                      variant="bordered"
                    >
                      {role.name}
                    </Chip>
                  ))}
                </div>

                <Divider className="my-8 bg-gray-50" />

                <div className="w-full space-y-5 px-2">
                  <SidebarInfoItem
                    icon={<Briefcase size={18} />}
                    label="Departemen"
                    value={detail.department}
                  />
                  <SidebarInfoItem
                    icon={<Phone size={18} />}
                    label="Kontak Utama"
                    value={detail.profile?.phone_number}
                  />
                  <SidebarInfoItem
                    isBalance
                    icon={<MapPin size={18} />}
                    label="Domisili"
                    value={detail.profile?.address}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Access Control Card */}
          <Card className="rounded-[2rem] border-none bg-gray-900 text-white p-2">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <ShieldCheck className="text-emerald-400" size={18} />
                </div>
                <h4 className="text-xs font-black uppercase italic tracking-widest">
                  System Privileges
                </h4>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1">
                  Account Type
                </p>
                <p className="text-sm font-bold italic text-emerald-400">
                  {detail.type}
                </p>
              </div>
              {detail.roles?.[0] && (
                <p className="text-[11px] text-gray-400 italic leading-relaxed px-2">
                  &quot;{detail.roles[0].description}&quot;
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN: DATA MATRIKS */}
        <div className="lg:col-span-8 space-y-8">
          {/* PERSONAL INFO */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-4">
            <CardBody className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <BadgeInfo className="text-gray-400" size={20} />
                </div>
                <h4 className="text-sm font-black uppercase italic tracking-widest text-gray-800">
                  Informasi Personil
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 px-4">
                <DataField
                  icon={<Calendar />}
                  label="Tempat, Tanggal Lahir"
                  value={`${detail.profile?.place_birth}, ${dayjs(detail.profile?.birth_date).format("DD MMMM YYYY")}`}
                />
                <DataField
                  icon={<UserCircle />}
                  label="Jenis Kelamin"
                  value={
                    detail.profile?.gender === "male"
                      ? "Laki-laki"
                      : "Perempuan"
                  }
                />
                <DataField
                  icon={<Clock />}
                  label="Tanggal Bergabung"
                  value={dayjs(detail.profile?.join_date).format(
                    "DD MMMM YYYY",
                  )}
                />
                <DataField
                  icon={<User />}
                  label="Status Pernikahan"
                  value="-"
                />
              </div>
            </CardBody>
          </Card>

          {/* REGIONAL INFO */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-4">
            <CardBody className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <MapIcon className="text-gray-400" size={20} />
                </div>
                <h4 className="text-sm font-black uppercase italic tracking-widest text-gray-800">
                  Geo-Lokasi & Wilayah
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
                <DataField
                  label="Provinsi"
                  value={detail.profile?.province?.name}
                />
                <DataField
                  label="Kota/Kabupaten"
                  value={detail.profile?.city?.name}
                />
                <DataField
                  label="Kecamatan"
                  value={detail.profile?.district?.name}
                />
              </div>
            </CardBody>
          </Card>

          {/* EMERGENCY CONTACT */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-rose-50/50 border border-rose-100/50 p-4">
            <CardBody className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500 rounded-xl">
                  <Heart className="text-white" size={20} />
                </div>
                <h4 className="text-sm font-black uppercase italic tracking-widest text-rose-600">
                  Kontak Darurat (S.O.S)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 px-4">
                <DataField
                  highlight
                  label="Nama Kontak"
                  value={detail.profile?.emergency_name}
                />
                <DataField
                  highlight
                  label="Nomor Telepon"
                  value={detail.profile?.emergency_contact}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** Helper Components **/

function SidebarInfoItem({
  icon,
  label,
  value,
  isBalance = false,
}: {
  icon: any;
  label: string;
  value?: string;
  isBalance?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="text-gray-300 group-hover:text-gray-900 transition-colors mt-1">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
          {label}
        </span>
        <span
          className={`text-xs font-bold text-gray-700 ${isBalance ? "text-balance leading-relaxed" : ""}`}
        >
          {value || "-"}
        </span>
      </div>
    </div>
  );
}

function DataField({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value?: string | null;
  icon?: any;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-2 group">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] leading-none">
        {label}
      </p>
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-gray-300 group-hover:text-blue-500 transition-colors">
            {icon}
          </span>
        )}
        <p
          className={`text-sm font-black italic uppercase tracking-tight ${highlight ? "text-rose-600" : "text-gray-800"}`}
        >
          {value || "Not Set"}
        </p>
      </div>
    </div>
  );
}
