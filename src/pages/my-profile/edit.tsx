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
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

import { createFormSchema } from "./schemas/create-schema";

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
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formSchema = useMemo(() => createFormSchema(t), [t]);

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
    <div className="space-y-6">
      <Breadcrumbs
        className="pb-5"
        itemClasses={{ item: "text-gray-500 font-medium" }}
        separator={<ChevronRight size={14} />}
      >
        <BreadcrumbItem href="/" startContent={<Home size={16} />}>
          {t("profile.home")}
        </BreadcrumbItem>
        <BreadcrumbItem href="/my-profile">
          {t("common.my_profile")}
        </BreadcrumbItem>
        <BreadcrumbItem>{t("profile.edit_breadcrumb")}</BreadcrumbItem>
      </Breadcrumbs>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardBody className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-500 rounded-sm text-white">
                <User2 size={18} />
              </div>
              <h2 className="text-sm font-black uppercase  text-gray-500">
                {t("profile.section_personal")}
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
                    />
                  )}
                />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                  {t("profile.photo_hint_format")} <br />
                  {t("profile.photo_hint_size")}
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
                      label={t("profile.form_name")}
                      placeholder={t("profile.form_name_placeholder")}
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
                      label={t("profile.form_email")}
                      placeholder={t("profile.form_email_placeholder")}
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
                      label={t("profile.form_phone")}
                      labelPlacement="inside"
                      placeholder={t("profile.form_phone_placeholder")}
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
                      label={t("profile.form_gender")}
                      placeholder={t("common.select")}
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) =>
                        field.onChange(Array.from(keys)[0])
                      }
                    >
                      <SelectItem
                        key="male"
                        textValue={t("hr.common.gender_male")}
                      >
                        {t("hr.common.gender_male")}
                      </SelectItem>
                      <SelectItem
                        key="female"
                        textValue={t("hr.common.gender_female")}
                      >
                        {t("hr.common.gender_female")}
                      </SelectItem>
                    </Select>
                  )}
                />

                <Controller
                  control={control}
                  name="place_birth"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label={t("profile.form_birth_place")}
                      placeholder={t("profile.form_birth_place_placeholder")}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="birth_date"
                  render={({ field, fieldState }) => (
                    <CustomDatePicker
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label={t("profile.form_birth_date")}
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

        <Card>
          <CardBody className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-500 rounded-sm text-white">
                <MapPin size={18} />
              </div>
              <h2 className="text-sm font-black uppercase text-gray-500">
                {t("profile.section_domicile")}
              </h2>
            </div>

            <Divider className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Controller
                control={control}
                name="province_id"
                render={({ field, fieldState }) => (
                  <Province
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
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
                render={({ field, fieldState }) => (
                  <City
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
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
                render={({ field, fieldState }) => (
                  <District
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
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
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("profile.form_address")}
                    minRows={3}
                    placeholder={t("profile.form_address_placeholder")}
                  />
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-danger/60 p-5 rounded-md">
                <Controller
                  control={control}
                  name="emergency_name"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      label={t("profile.form_emergency_name")}
                      placeholder={t("profile.form_emergency_name_placeholder")}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      label={t("profile.form_emergency_phone")}
                      placeholder={t(
                        "profile.form_emergency_phone_placeholder",
                      )}
                    />
                  )}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end items-center gap-4 pb-10">
          <Button
            color="danger"
            variant="light"
            onPress={() => navigate("/my-profile/")}
          >
            {t("common.cancel")}
          </Button>
          <Button
            color="primary"
            isLoading={loading}
            startContent={!loading && <Save size={18} />}
            type="submit"
          >
            {t("profile.save_changes")}
          </Button>
        </div>
      </form>
    </div>
  );
}
