import type { ICompany } from "@/utils/interfaces/IUser";

import {
  Store,
  Tag,
  Save,
  Percent,
  Settings,
  Trash2,
  Mail,
  MapPin,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Switch,
  Card,
  CardBody,
  Divider,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import {
  companySchema,
  type CompanyFormValues,
} from "./schemas/profile-schema";

import HeaderAction from "@/components/header-action";
import UploadAvatar from "@/components/upload-avatar";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { http } from "@/utils/libs/axios";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getCity, getDistrict } from "@/stores/features/region/region-action";
import { getProfile } from "@/stores/features/auth/auth-action";
import PhoneInput from "@/components/forms/phone-input";
import NpwpInput from "@/components/forms/npwp-input";
import InputNumber from "@/components/input-number";

export default function ProfileSettingsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      logo_url: "",
      email: "",
      phone_number: "",
      fax: "",
      npwp: "",
      is_ppn: false,
      is_discount_birth_day: false,
      type_discount_birth_day: "percentage",
      max_discount_birth_day: 0,
    },
  });

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getCompany();
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, []);

  function getCompany() {
    if (user) {
      http
        .get<ICompany>(`/companies/${user.company_id}`)
        .then(({ data }) => {
          setValue("id", data.id);
          setValue("name", data.name);
          setValue("logo_url", data.logo_url);
          setValue("email", data.email!);
          setValue("phone_number", data.phone_number?.replace(/-/g, "") || "");
          setValue("fax", data.fax || "");
          setValue("npwp", data.npwp!);
          setValue("is_ppn", data.is_ppn!);
          setValue("ppn", Number(data.ppn || 0));
          setValue("is_discount_birth_day", data.is_discount_birth_day!);
          setValue(
            "type_discount_birth_day",
            data.type_discount_birth_day || "percentage",
          );
          setValue(
            "max_discount_birth_day",
            Number(data.max_discount_birth_day || 0),
          );
          setValue(
            "total_discount_birth_day",
            Number(data.total_discount_birth_day || 0),
          );
          if (data.address) {
            setValue("address.title", data.address?.title || "");
            setValue(
              "address.province_id",
              data.address?.province_id || undefined,
            );
            setValue("address.city_id", data.address?.city_id || undefined);
            setValue(
              "address.district_id",
              data.address?.district_id || undefined,
            );
            if (data.address.province_id)
              dispatch(getCity(data.address.province_id));
            if (data.address.city_id)
              dispatch(getDistrict(data.address.city_id));
          }
        })
        .catch(notifyError);
    }
  }

  const onSubmit = async (data: CompanyFormValues) => {
    setLoading(true);
    try {
      if (data.logo_url instanceof File) {
        const logo = await uploadFile(data.logo_url);

        data.logo_url = logo;
      }
      const response = await http.patch("/companies", data);

      notify(response.data.message);
      dispatch(getProfile());
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <HeaderAction
        actionContent={
          <Button
            className="font-black uppercase text-xs"
            color="danger"
            size="sm"
            startContent={<Trash2 size={16} />}
            variant="flat"
            onPress={() => confirmSweat(() => {})}
          >
            Hapus Bengkel
          </Button>
        }
        leadIcon={Settings}
        subtitle="Kelola identitas bengkel dan kebijakan promo."
        title="Pengaturan Bengkel"
      />

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Kolom Kiri: Profil Utama */}
        <div className="lg:col-span-2 space-y-6">
          <Card className=" p-4">
            <CardBody className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-2xl text-gray-500">
                  <Store size={24} />
                </div>
                <div>
                  <h3 className="font-black uppercase text-gray-500">
                    Profil Bengkel
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    Informasi ini akan tercetak pada invoice pelanggan.
                  </p>
                </div>
              </div>

              <Controller
                control={control}
                name="logo_url"
                render={({ field }) => (
                  <UploadAvatar
                    buttonTitle="Ganti Logo Bengkel"
                    field={field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name}
                      label="Nama Cabang / Bengkel"
                      placeholder="Contoh: Bengkel Maju Jaya Jakarta"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <PhoneInput
                      errorMessage={errors.phone_number?.message}
                      isInvalid={!!errors.phone_number}
                      label="Nomor Telepon"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="fax"
                  render={({ field }) => (
                    <PhoneInput
                      errorMessage={errors.fax?.message}
                      isInvalid={!!errors.fax}
                      label="Nomor Fax"
                      placeholder="021xxxxxxx"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Email Operasional"
                      placeholder="admin@bengkel.com"
                      startContent={
                        <Mail className="text-gray-400" size={16} />
                      }
                      type="email"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="npwp"
                  render={({ field }) => (
                    <NpwpInput {...field} label="NPWP Perusahaan" />
                  )}
                />
              </div>

              <Divider className="my-4" />

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-500" size={18} />
                  <span className="text-sm font-black uppercase text-gray-500">
                    Lokasi & Alamat
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Controller
                    control={control}
                    name="address.province_id"
                    render={({ field }) => (
                      <Province
                        value={field.value!}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="address.city_id"
                    render={({ field }) => (
                      <City value={field.value!} onChange={field.onChange} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="address.district_id"
                    render={({ field }) => (
                      <District
                        value={field.value!}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <Controller
                  control={control}
                  name="address.title"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Alamat Lengkap"
                      minRows={3}
                      placeholder="Jl. Raya Otomotif No. 10..."
                    />
                  )}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Kolom Kanan: Kebijakan Keuangan */}
        <div className="space-y-4">
          {/* Card Pajak */}
          <Card>
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 text-primary rounded-sm">
                    <Percent size={20} />
                  </div>
                  <span className="font-black uppercase text-gray-500 text-sm">
                    Pajak (PPN)
                  </span>
                </div>
                <Controller
                  control={control}
                  name="is_ppn"
                  render={({ field }) => (
                    <Switch
                      color="primary"
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Controller
                control={control}
                name="ppn"
                render={({ field }) => (
                  <Input
                    {...(field as any)}
                    disabled={!watch("is_ppn")}
                    endContent={
                      <span className="text-gray-400 text-xs">%</span>
                    }
                    label="Besaran PPN (%)"
                    placeholder="11"
                    type="number"
                  />
                )}
              />
            </CardBody>
          </Card>

          {/* Card Promo */}
          <Card>
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 text-primary rounded-sm">
                    <Tag size={20} />
                  </div>
                  <span className="font-black uppercase text-gray-500 text-sm">
                    Promo Ultah
                  </span>
                </div>
                <Controller
                  control={control}
                  name="is_discount_birth_day"
                  render={({ field }) => (
                    <Switch
                      color="danger"
                      isSelected={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="flex gap-2 items-end">
                <Controller
                  control={control}
                  name="total_discount_birth_day"
                  render={({ field }) => (
                    <InputNumber
                      className="flex-1"
                      label="Nilai Promo"
                      labelPlacement="outside"
                      placeholder="0"
                      value={field.value as any}
                      onInput={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="type_discount_birth_day"
                  render={({ field }) => (
                    <Select
                      {...field}
                      aria-label="Tipe Diskon"
                      className="w-24"
                      selectedKeys={field.value ? [field.value] : []}
                    >
                      <SelectItem key="percentage">%</SelectItem>
                      <SelectItem key="fixed">Rp</SelectItem>
                    </Select>
                  )}
                />
              </div>

              {watch("type_discount_birth_day") === "percentage" && (
                <Controller
                  control={control}
                  name="max_discount_birth_day"
                  render={({ field }) => (
                    <InputNumber
                      label="Maksimal Potongan"
                      placeholder="50.000"
                      startContent={
                        <span className="text-gray-400 text-xs">Rp</span>
                      }
                      value={field.value as any}
                      onInput={field.onChange}
                    />
                  )}
                />
              )}
              <p className="text-[10px] text-rose-400 font-bold italic uppercase tracking-tighter">
                *Otomatis muncul di kasir saat pelanggan berulang tahun.
              </p>
            </CardBody>
          </Card>

          <Button
            fullWidth
            color="primary"
            isLoading={loading}
            startContent={<Save size={20} />}
            type="submit"
          >
            Simpan Konfigurasi
          </Button>
        </div>
      </form>
    </div>
  );
}
