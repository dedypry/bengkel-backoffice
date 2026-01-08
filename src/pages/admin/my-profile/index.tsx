/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Mail,
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  BadgeCheck,
  Globe,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/stores/hooks";
import { getInitials } from "@/utils/helpers/global";

export default function ProfilePage() {
  const { user: data } = useAppSelector((state) => state.auth);

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* 1. Header Profile & Status */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-card p-8 rounded-2xl border shadow-sm">
        <Avatar className="h-24 w-24 border-4 border-primary/10">
          {/* Karena data.profile null, kita pakai fallback name */}
          <AvatarImage src="" />
          <AvatarFallback className="text-2xl font-bold bg-[#168BAB] text-white">
            {getInitials(data?.name!)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {data?.name!}
            </h1>
            <Badge
              className="bg-emerald-50 text-emerald-700 border-emerald-200 capitalize"
              variant="outline"
            >
              {data?.type}
            </Badge>
            {data?.is_active && (
              <Badge className="bg-[#168BAB]">Active Account</Badge>
            )}
          </div>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" /> {data?.email}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium capitalize">
              Status: {data?.work_status}
            </span>
          </div>
          <p className="text-muted-foreground italic text-[10px]">
            Terakhir diupdate:{" "}
            {new Date(data?.updated_at!).toLocaleDateString("id-ID")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Detil Pekerjaan & Role */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#168BAB]" /> Role &
                Department
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Department
                </label>
                <p className="text-sm font-medium">{data?.department}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Status Kepegawaian
                </label>
                <p className="text-sm font-medium">{data?.status}</p>
              </div>
              <Separator />
              <div>
                {data?.roles.map((role: any) => (
                  <div key={role.id} className="space-y-1">
                    <Badge
                      className="mb-2 uppercase text-[10px] tracking-widest"
                      variant="secondary"
                    >
                      {role.name}
                    </Badge>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Daftar Perusahaan / Cabang */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 px-2">
            <Building2 className="w-5 h-5 text-[#168BAB]" /> Perusahaan
            Terdaftar
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {data?.companies.map((company: any) => (
              <Card
                key={company.id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 h-32 bg-muted flex items-center justify-center border-r">
                    {company.logo_url ? (
                      <img
                        alt={company.name}
                        className="object-cover w-full h-full"
                        src={company.logo_url}
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <CardContent className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-lg">
                          {company.name}
                        </CardTitle>
                        <CardDescription className="font-mono text-[10px]">
                          {company.slug}
                        </CardDescription>
                      </div>
                      {data.company_id === company.id && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
                          Current Login
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3 h-3" /> {company.phone_number}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="w-3 h-3" /> {company.email}
                      </div>
                      {company.address && (
                        <div className="col-span-1 sm:col-span-2 flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>
                            {company.address.title}: {company.address.district},{" "}
                            {company.address.city}, {company.address.province}{" "}
                            {company.address.zip_code}
                          </span>
                        </div>
                      )}
                      {company.npwp && (
                        <div className="col-span-1 sm:col-span-2 flex items-center gap-2 p-2 bg-slate-50 rounded border border-dashed font-mono text-[10px]">
                          <BadgeCheck className="w-3 h-3 text-[#168BAB]" />{" "}
                          NPWP: {company.npwp}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
