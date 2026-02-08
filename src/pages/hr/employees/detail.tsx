import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  Briefcase,
  ShieldCheck,
  Clock,
  Map as MapIcon,
  BadgeInfo,
  Edit,
  Mail,
  Heart,
  UserCircle,
  UserCheck2,
} from "lucide-react";
import dayjs from "dayjs";
import { Card, CardBody, Chip, Avatar } from "@heroui/react";

import DetailSkeleton from "./components/detail-skeleton";
import Detail404 from "./components/detail-404";

import { getEmployeDetail } from "@/stores/features/employe/employe-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getInitials } from "@/utils/helpers/global";
import HeaderAction from "@/components/header-action";

export default function EmployeesDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { detail, detailLoading: loading } = useAppSelector(
    (state) => state.employe,
  );
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(getEmployeDetail(id));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [id, dispatch]);

  if (loading) return <DetailSkeleton />;
  if (!detail) return <Detail404 id={id} />;

  return (
    <div className="space-y-8">
      <HeaderAction
        actionIcon={Edit}
        actionTitle="Edit Profile"
        leadIcon={User}
        subtitle={`ID: ${detail.nik || "EMP-" + id}`}
        title="Profil Personil"
        onAction={() => navigate(`/hr/employees/${id}/edit`)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: IDENTITAS (Sticky) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-gray-200 shadow-sm  overflow-hidden">
            <CardBody className="p-0">
              <div className="h-32 bg-gradient-to-br from-primary to-primary-900 w-full" />
              <div className="px-6 pb-8 -mt-16 flex flex-col items-center">
                <Avatar
                  isBordered
                  className="w-32 h-32"
                  color="primary"
                  fallback={getInitials(
                    detail.profile?.full_name || detail.name,
                  )}
                  radius="md"
                  src={detail.profile?.photo_url}
                />
                <div className="mt-4 text-center">
                  <h2 className="text-lg font-black uppercase text-gray-500">
                    {detail.profile?.full_name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-1 text-primary">
                    <Mail size={14} />
                    <span className="text-xs font-bold">{detail.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {detail.roles?.map((role) => (
                    <Chip
                      key={role.id}
                      color="primary"
                      size="sm"
                      variant="bordered"
                    >
                      {role.name}
                    </Chip>
                  ))}
                  <Chip
                    color={detail.is_active ? "success" : "danger"}
                    size="sm"
                    variant="dot"
                  >
                    {detail.is_active ? "Active Duty" : "Off Duty"}
                  </Chip>
                </div>

                <div className="w-full space-y-5 px-2 mt-5">
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
                  <SidebarInfoItem
                    isBalance
                    icon={<UserCheck2 size={18} />}
                    label="Status"
                    value={detail.status}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Access Control Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-sm">
                  <ShieldCheck className="text-primary" size={18} />
                </div>
                <h4 className="text-xs font-black uppercase text-gray-500">
                  System Privileges
                </h4>
              </div>
              <div className="bg-gray-200 rounded-md p-4 border border-gray-200">
                <p className="text-[9px] font-black uppercase text-gray-500 mb-1">
                  Account Type
                </p>
                <p className="text-sm font-bold text-primary">{detail.type}</p>
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
          <Card className="border border-gray-200 shadow-sm bg-white p-4">
            <CardBody className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-sm">
                  <BadgeInfo className="text-gray-500" size={20} />
                </div>
                <h4 className="text-sm font-black uppercase text-gray-500">
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
          <Card className="border border-gray-200 shadow-sm bg-white p-4">
            <CardBody className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-sm">
                  <MapIcon className="text-gray-500" size={20} />
                </div>
                <h4 className="text-sm font-black uppercase text-gray-500">
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
          <Card className="shadow-sm bg-rose-50/50 border border-rose-100/50 p-4">
            <CardBody className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-danger rounded-sm">
                  <Heart className="text-white" size={20} />
                </div>
                <h4 className="text-sm font-black uppercase text-danger">
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
                  value={`+62 ${detail.profile?.emergency_contact}`}
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
      <div className="text-gray-500 group-hover:text-gray-900 transition-colors mt-1">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase text-gray-400">
          {label}
        </span>
        <span
          className={`text-xs font-bold text-gray-500 ${isBalance ? "text-balance leading-relaxed" : ""}`}
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
      <p className="text-[10px] font-black text-gray-400 uppercase">{label}</p>
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-gray-500 group-hover:text-primary transition-colors">
            {icon}
          </span>
        )}
        <p
          className={`text-xs font-semibold uppercase  ${highlight ? "text-rose-600" : "text-gray-500"}`}
        >
          {value || "Not Set"}
        </p>
      </div>
    </div>
  );
}
