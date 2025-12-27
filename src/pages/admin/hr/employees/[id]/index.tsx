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
} from "lucide-react";
import dayjs from "dayjs";

import DetailSkeleton from "../components/detail-skeleton";
import Detail404 from "../components/detail-404";

import { getEmployeDetail } from "@/stores/features/employe/employe-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Detail() {
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
    <div className="flex flex-col gap-6 p-6 pb-12">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Karyawan</h1>
          <p className="text-muted-foreground">NIK: {detail.nik}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Badge variant={detail.is_active ? "default" : "destructive"}>
            {detail.is_active ? "Aktif" : "Non-Aktif"}
          </Badge>
          <Badge
            className="bg-blue-50 text-blue-700 border-blue-200"
            variant="outline"
          >
            {detail.status}
          </Badge>
          <Button
            className="bg-amber-500 ml-5 rounded-full shadow-amber-100"
            size="sm"
            onClick={() => navigate(`/hr/employees/${id}/edit`)}
          >
            <Edit />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Kiri: Profil Singkat */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-2 border-primary/10">
                  <User className="h-12 w-12 text-primary/40" />
                </div>
                <h2 className="text-xl font-bold">
                  {detail.profile?.full_name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {detail.email}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {detail.roles?.map((role) => (
                    <Badge key={role.id} variant="secondary">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{detail.department}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{detail.profile?.phone_number}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-balance">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{detail.profile?.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Akses Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-2">
                <p className="font-medium text-slate-500 uppercase">
                  Tipe Akun
                </p>
                <p className="text-sm bg-slate-50 p-2 rounded border">
                  {detail.type}
                </p>
                {detail.roles?.map((role) => (
                  <p
                    key={role.id}
                    className="text-muted-foreground italic leading-relaxed"
                  >
                    &quot;{role.description}&quot;
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Detail Informasi */}
        <div className="md:col-span-2 space-y-6">
          {/* Informasi Pribadi */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BadgeInfo className="h-5 w-5 text-primary" />
                Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="Tempat, Tanggal Lahir"
                value={`${detail.profile?.place_birth}, ${dayjs(detail.profile?.birth_date).format("DD MMMM YYYY")}`}
              />
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Jenis Kelamin"
                value={
                  detail.profile?.gender === "male" ? "Laki-laki" : "Perempuan"
                }
              />
              <InfoItem
                icon={<Clock className="h-4 w-4" />}
                label="Tanggal Bergabung"
                value={dayjs(detail.profile?.join_date).format("DD MMMM YYYY")}
              />
            </CardContent>
          </Card>

          {/* Alamat & Wilayah */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-primary" />
                Wilayah & Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <InfoItem
                label="Provinsi"
                value={detail.profile?.province?.name}
              />
              <InfoItem
                label="Kota/Kabupaten"
                value={detail.profile?.city?.name}
              />
              <InfoItem
                label="Kecamatan"
                value={detail.profile?.district?.name}
              />
            </CardContent>
          </Card>

          {/* Kontak Darurat */}
          <Card className="border-orange-100 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="text-lg text-orange-800">
                Kontak Darurat
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem
                label="Nama Kontak"
                value={detail.profile?.emergency_name}
              />
              <InfoItem
                label="Nomor Telepon"
                value={detail.profile?.emergency_contact}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/** Komponen Helper untuk Baris Informasi **/
function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        <p className="text-sm font-semibold">{value || "-"}</p>
      </div>
    </div>
  );
}
