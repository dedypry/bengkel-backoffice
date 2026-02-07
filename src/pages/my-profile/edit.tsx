import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MapPin,
  Save,
  User2,
  Phone,
  Mail,
  ChevronRight,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  Divider,
  BreadcrumbItem,
  Breadcrumbs,
} from "@heroui/react";

import { formSchema } from "./schemas/create-schema";

import UploadAvatar from "@/components/upload-avatar";
import Province from "@/components/regions/province";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getProfile } from "@/stores/features/auth/auth-action";
import District from "@/components/regions/district";
import City from "@/components/regions/city";
import CustomDatePicker from "@/components/forms/date-picker";
import PhoneInput from "@/components/forms/phone-input";

export default function EditProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      place_birth: "",
      birth_date: "",
      address: "",
      province_id: 0,
      city_id: 0,
      district_id: 0,
      emergency_name: "",
      emergency_contact: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.profile?.phone_number || "");
      setValue("gender", user.profile?.gender || "");
      setValue("place_birth", user.profile?.place_birth || "");
      setValue("birth_date", user.profile?.birth_date || "");
      setValue("province_id", user.profile?.province_id!);
      setValue("city_id", user.profile?.city_id!);
      setValue("district_id", user.profile?.district_id!);
      setValue("address", user.profile?.address!);
      setValue("emergency_name", user.profile?.emergency_name!);
      setValue("emergency_contact", user.profile?.emergency_contact!);
      setValue("photo", user.profile?.photo_url!);
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (data.photo && data.photo instanceof File) {
        const photo = await uploadFile(data.photo);

        data.photo = photo;
      }
      const response = await http.post("/user/profile", data);

      notify(response.data.message);
      dispatch(getProfile());
      navigate("/my-profile/");
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumbs
        className="pb-5"
        itemClasses={{ item: "text-gray-500 font-medium" }}
        separator={<ChevronRight size={14} />}
      >
        <BreadcrumbItem href="/" startContent={<Home size={16} />}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/my-profile">My Profile</BreadcrumbItem>
        <BreadcrumbItem>Edit Profile</BreadcrumbItem>
      </Breadcrumbs>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* SECTION 1: PERSONAL INFO */}
        <Card
          className="rounded-sm shadow-sm  border border-gray-200"
          radius="sm"
        >
          <CardBody className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-500 rounded-sm text-white">
                <User2 size={18} />
              </div>
              <h2 className="text-sm font-black uppercase  text-gray-500">
                Informasi Personal
              </h2>
            </div>

            <Divider className="mb-8" />

            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center space-y-4">
                <Controller
                  control={control}
                  name="photo"
                  render={({ field }) => (
                    <UploadAvatar
                      value={field.value}
                      onChange={field.onChange}
                      // Pastikan UploadAvatar juga menggunakan radius-sm secara internal
                    />
                  )}
                />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  Format: JPG, PNG. <br />
                  Maks 2MB.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.name?.message as string}
                      isInvalid={!!errors.name}
                      label="NAMA LENGKAP"
                      placeholder="Sesuai identitas resmi"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.email?.message as string}
                      isInvalid={!!errors.email}
                      label="ALAMAT EMAIL"
                      placeholder="user@bengkel.com"
                      startContent={
                        <Mail className="text-gray-400" size={16} />
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      errorMessage={errors.phone?.message as string}
                      isInvalid={!!errors.phone}
                      label="NOMOR TELEPON"
                      labelPlacement="inside"
                      placeholder="0812..."
                      startContent={
                        <Phone className="text-gray-400" size={16} />
                      }
                      variant="faded"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select
                      errorMessage={errors.gender?.message as string}
                      isInvalid={!!errors.gender}
                      label="JENIS KELAMIN"
                      placeholder="Pilih"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0])
                      }
                    >
                      <SelectItem key="male" textValue="Laki-laki">
                        Laki-laki
                      </SelectItem>
                      <SelectItem key="female" textValue="Perempuan">
                        Perempuan
                      </SelectItem>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="place_birth"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="TEMPAT LAHIR"
                      placeholder="Contoh: Jakarta"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="birth_date"
                  render={({ field }) => (
                    <CustomDatePicker
                      label="Tanggal Lahir"
                      labelPlacement="inside"
                      value={
                        (field.value ? new Date(field.value) : undefined) as any
                      }
                      variant="faded"
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* SECTION 2: ADDRESS & EMERGENCY */}
        <Card
          className="rounded-sm  shadow-sm border border-gray-200"
          radius="sm"
        >
          <CardBody className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-500 rounded-sm text-white">
                <MapPin size={18} />
              </div>
              <h2 className="text-sm font-black uppercase text-gray-500">
                Domisili & Kontak Darurat
              </h2>
            </div>

            <Divider className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Controller
                control={control}
                name="province_id"
                render={({ field }) => (
                  <Province
                    labelPlacement="inside"
                    value={field.value}
                    variant="faded"
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="city_id"
                render={({ field }) => (
                  <City
                    labelPlacement="inside"
                    value={field.value}
                    variant="faded"
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="district_id"
                render={({ field }) => (
                  <District
                    labelPlacement="inside"
                    value={field.value}
                    variant="faded"
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="space-y-6">
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="ALAMAT LENGKAP"
                    minRows={3}
                    placeholder="Nama jalan, nomor rumah, RT/RW..."
                  />
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="emergency_name"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      label="NAMA KONTAK DARURAT"
                      placeholder="Nama kerabat"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      label="NOMOR KONTAK DARURAT"
                      placeholder="08..."
                    />
                  )}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ACTIONS */}
        <div className="flex justify-end items-center gap-4 pb-10">
          <Button
            color="danger"
            variant="light"
            onPress={() => navigate("/my-profile/")}
          >
            Batalkan
          </Button>
          <Button
            color="primary"
            isLoading={loading}
            startContent={!loading && <Save size={18} />}
            type="submit"
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
