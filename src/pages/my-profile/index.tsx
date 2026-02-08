import {
  Mail,
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
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
  Alert,
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Image,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";
import { getAvatarByName, getInitials } from "@/utils/helpers/global";
import Password from "@/components/password";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { formatNPWP } from "@/components/forms/npwp-input";

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

  const { control, handleSubmit, reset } = useForm<ChangePasswordType>({
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
      <Card>
        <CardBody className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar
              className="w-28 h-28 rounded-md text-xl font-bold"
              color="primary"
              name={getInitials(data?.name!)}
              src={data?.profile?.photo_url || getAvatarByName(data?.name!)}
            />

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <h1 className="text-4xl font-black uppercase  text-gray-500">
                  {data?.name!}
                </h1>
                <Chip
                  classNames={{ content: "font-bold uppercase" }}
                  color="primary"
                  radius="md"
                  variant="flat"
                >
                  {data?.type}
                </Chip>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-[11px] uppercase ">
                  <Phone className="text-gray-400" size={14} />{" "}
                  {data?.profile?.phone_number || "NO PHONE"}
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-bold text-[11px] uppercase ">
                  <Mail className="text-gray-400" size={14} /> {data?.email}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[180px]">
              <Button
                className="text-white"
                color="warning"
                startContent={<Edit size={16} />}
                onPress={() => navigate("/my-profile/edit")}
              >
                Ubah Profil
              </Button>
              <Chip color="success" radius="md" variant="dot">
                Status: {data?.work_status}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SECURITY & ROLES */}
        <div className="lg:col-span-4 space-y-6">
          {/* Security Card */}
          <Card>
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <Lock className="text-gray-900" size={18} />
                <h3 className="font-black uppercase text-xs text-gray-500">
                  Keamanan Akun
                </h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="old_password"
                  render={({ field, fieldState }) => (
                    <Password
                      label="Password Lama"
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="new_password"
                  render={({ field, fieldState }) => (
                    <Password
                      label="Password Baru"
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="confirm_password"
                  render={({ field, fieldState }) => (
                    <Password
                      label="Konfirmasi"
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
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
          <Card>
            <CardBody className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-gray-900" size={18} />
                <h3 className="font-black uppercase text-xs text-gray-500">
                  Privilese Sistem
                </h3>
              </div>
              <Divider />
              {data?.roles.map((role: any) => (
                <div
                  key={role.id}
                  className="p-4 bg-gray-50 border-l-4 border-primary rounded-sm"
                >
                  <p className="font-black uppercase text-xs text-gray-500 mb-1">
                    {role.name}
                  </p>
                  <p className="text-[10px] font-medium text-gray-500">
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
            <Building2 className="text-gray-500" size={20} />
            <h3 className="font-black uppercase text-sm text-gray-500">
              Unit Bisnis Terdaftar
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data?.companies.map((company: any) => (
              <Card key={company.id}>
                <CardBody className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-40 h-40 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                      {company.logo_url ? (
                        <Image
                          alt={company.name}
                          className="object-contain w-24 h-24"
                          src={company.logo_url}
                        />
                      ) : (
                        <Building2 className="text-gray-200" size={40} />
                      )}
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-lg font-black uppercase  text-gray-500">
                            {company.name}
                          </h4>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">
                            {company.slug}
                          </p>
                        </div>
                        {data.company_id === company.id && (
                          <Chip
                            className="text-white uppercase"
                            classNames={{
                              content: "font-bold",
                            }}
                            color="success"
                            radius="md"
                            size="sm"
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
                        <Alert
                          classNames={{
                            title:
                              "text-[10px] font-black text-gray-500 uppercase",
                            description: "text-[11px] font-bold text-gray-600",
                            iconWrapper: "text-primary rounded-md",
                          }}
                          description={formatNPWP(company.npwp)}
                          title="Nomor Pokok Wajib Pajak"
                        />
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
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-[9px] font-black uppercase">{label}</span>
      </div>
      <p className="text-[11px] font-bold uppercase text-gray-700">
        {value || "-"}
      </p>
    </div>
  );
}
