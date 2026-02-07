/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Mail,
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  BadgeCheck,
  Globe,
  Lock,
  Edit,
  ChevronRight,
  Home,
} from "lucide-react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { getInitials } from "@/utils/helpers/global";
import Password from "@/components/password";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, { message: "Password lama wajib diisi." }),
    new_password: z
      .string()
      .min(8, { message: "Password baru minimal 8 karakter." })
      .regex(/[A-Z]/, {
        message: "Harus mengandung minimal satu huruf kapital.",
      })
      .regex(/[0-9]/, { message: "Harus mengandung minimal satu angka." }),
    confirm_password: z
      .string()
      .min(1, { message: "Konfirmasi password wajib diisi." }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirm_password"],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { user: data } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_password: "" },
  });

  const onSubmit = async (formData: ChangePasswordType) => {
    setLoading(true);
    http
      .post("/user/password", formData)
      .then(({ data }) => {
        notify(data.message);
        reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        className="pt-5"
        itemClasses={{ item: "text-gray-500 font-medium" }}
        separator={<ChevronRight size={14} />}
      >
        <BreadcrumbItem href="/" startContent={<Home size={16} />}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem>My Profile</BreadcrumbItem>
      </Breadcrumbs>
      {/* HEADER SECTION */}
      <Card className="rounded-sm border border-gray-200 shadow-sm" radius="sm">
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar
              className="w-28 h-28 rounded-md text-2xl font-bold bg-gray-500 text-white border-4 border-gray-50"
              name={getInitials(data?.name!)}
              src={data?.profile?.photo_url}
            />

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-500 leading-none">
                  {data?.name!}
                </h1>
                <Chip
                  className="font-bold uppercase text-[10px] tracking-widest px-3"
                  color="primary"
                  radius="sm"
                  variant="flat"
                >
                  {data?.type}
                </Chip>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                  <Phone className="text-gray-400" size={14} />{" "}
                  {data?.profile?.phone_number || "NO PHONE"}
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                  <Mail className="text-gray-400" size={14} /> {data?.email}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[180px]">
              <Button
                color="warning"
                startContent={<Edit size={16} />}
                onPress={() => navigate("/my-profile/edit")}
              >
                Ubah Profil
              </Button>
              <div className="flex items-center justify-center gap-2 py-2 border border-gray-100 bg-gray-50 rounded-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-[10px] uppercase text-gray-600 tracking-widest">
                  Status: {data?.work_status}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SECURITY & ROLES */}
        <div className="lg:col-span-4 space-y-6">
          {/* Security Card */}
          <Card className="rounded-sm border-none shadow-sm" radius="sm">
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Lock className="text-gray-900" size={18} />
                <h3 className="font-black uppercase text-xs tracking-[0.2em] text-gray-800">
                  Keamanan Akun
                </h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="old_password"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                        Password Lama
                      </label>
                      <Password {...field} className="rounded-sm" radius="sm" />
                      {errors.old_password && (
                        <p className="text-[9px] font-bold text-red-500 uppercase">
                          {errors.old_password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="new_password"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                        Password Baru
                      </label>
                      <Password {...field} className="rounded-sm" radius="sm" />
                      {errors.new_password && (
                        <p className="text-[9px] font-bold text-red-500 uppercase">
                          {errors.new_password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="confirm_password"
                  render={({ field }) => (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                        Konfirmasi
                      </label>
                      <Password {...field} className="rounded-sm" radius="sm" />
                      {errors.confirm_password && (
                        <p className="text-[9px] font-bold text-red-500 uppercase">
                          {errors.confirm_password.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Button
                  fullWidth
                  color="primary"
                  isLoading={loading}
                  type="submit"
                >
                  Update Password
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Role Card */}
          <Card className="rounded-sm border-none shadow-sm" radius="sm">
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-gray-900" size={18} />
                <h3 className="font-black uppercase text-xs tracking-[0.2em] text-gray-800">
                  Privilese Sistem
                </h3>
              </div>
              <Divider />
              {data?.roles.map((role: any) => (
                <div
                  key={role.id}
                  className="p-4 bg-gray-50 border-l-4 border-gray-900 rounded-sm"
                >
                  <p className="font-black uppercase text-[10px] text-gray-900 mb-1">
                    {role.name}
                  </p>
                  <p className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase">
                    {role.description}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN: COMPANIES */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3 px-2 mb-2">
            <Building2 className="text-gray-900" size={20} />
            <h3 className="font-black uppercase text-sm tracking-[0.3em] text-gray-800">
              Unit Bisnis Terdaftar
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data?.companies.map((company: any) => (
              <Card
                key={company.id}
                className="rounded-sm border border-gray-200 shadow-sm overflow-hidden"
                radius="sm"
              >
                <CardBody className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-40 h-40 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                      {company.logo_url ? (
                        <img
                          alt={company.name}
                          className="object-contain w-24 h-24 grayscale"
                          src={company.logo_url}
                        />
                      ) : (
                        <Building2 className="text-gray-200" size={40} />
                      )}
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-xl font-black uppercase tracking-tighter text-gray-900">
                            {company.name}
                          </h4>
                          <p className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            {company.slug}
                          </p>
                        </div>
                        {data.company_id === company.id && (
                          <Chip
                            className="bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest"
                            radius="sm"
                          >
                            Sesi Aktif
                          </Chip>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <InfoItem
                          icon={<Phone size={12} />}
                          label="Kontak"
                          value={company.phone_number}
                        />
                        <InfoItem
                          icon={<Globe size={12} />}
                          label="Email"
                          value={company.email}
                        />
                        <InfoItem
                          fullWidth
                          icon={<MapPin size={12} />}
                          label="Alamat"
                          value={`${company.address?.title} ${company.address?.district || ""}, ${company.address?.city || ""}`}
                        />
                      </div>

                      {company.npwp && (
                        <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-sm group transition-colors hover:bg-gray-50">
                          <div className="flex items-center justify-center size-6 bg-white border border-gray-200 rounded-sm shadow-sm">
                            <BadgeCheck
                              className="text-gray-400 group-hover:text-[#168BAB] transition-colors"
                              size={14}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">
                              Nomor Pokok Wajib Pajak
                            </span>
                            <span className="font-mono text-[11px] font-bold text-gray-600 tracking-wider">
                              {company.npwp}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component Helper
function InfoItem({
  icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: any;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${fullWidth ? "md:col-span-2" : ""} space-y-1`}>
      <div className="flex items-center gap-2 opacity-40">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <p className="text-[11px] font-bold uppercase text-gray-700">
        {value || "-"}
      </p>
    </div>
  );
}
