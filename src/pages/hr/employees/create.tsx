import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UserPlus, Heart, MapPin, Briefcase } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  Select,
  SelectItem,
  Textarea,
  Divider,
} from "@heroui/react";
import { useTranslation } from "react-i18next";

import AddRole from "../../settings/roles/components/add-role";

import {
  createFormSchema,
  type EmployeeFormValues,
} from "./schemas/create-schema";

import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import UploadAvatar from "@/components/upload-avatar";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getRole } from "@/stores/features/role/role-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { uploadFile } from "@/utils/helpers/upload-file";
import CustomDatePicker from "@/components/forms/date-picker";
import PhoneInput from "@/components/forms/phone-input";
import HeaderAction from "@/components/header-action";

interface Props {
  id?: string;
  userForm?: EmployeeFormValues;
}

export default function CreateEmployeePage({ id, userForm }: Props) {
  const { t } = useTranslation();
  const { roles } = useAppSelector((state) => state.role);
  const [isLoading, setLoading] = useState(false);
  const [openAddRole, setOpenAddRole] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const formSchema = useMemo(() => createFormSchema(t), [t]);

  const departments = useMemo(
    () => [
      { key: "Workshop", label: t("hr.employees.dept_workshop") },
      { key: "Front Office", label: t("hr.employees.dept_front_office") },
      { key: "Finance", label: t("hr.employees.dept_finance") },
      { key: "HR", label: t("hr.employees.dept_hr") },
    ],
    [t],
  );

  const workStatuses = useMemo(
    () => [
      { key: "permanent", label: t("hr.common.status_permanent") },
      { key: "contract", label: t("hr.common.status_contract") },
    ],
    [t],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getRole());
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      status: "permanent",
      join_date: new Date().toISOString(),
      birth_date: new Date().toISOString(),
      emergency_name: "",
      emergency_contact: "",
      ...userForm,
    },
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    setLoading(true);
    try {
      if (values.photo instanceof File) {
        const photo = await uploadFile(values.photo);

        values.photo = photo;
      }

      const response = await http.post("/employees", { id, ...values });

      notify(response.data.message);
      navigate("/hr/employees");
    } catch (err: any) {
      if (err.response.status === 402) {
        const errors = err.response.data.data;

        Object.keys(errors).forEach((key) => {
          setError(key as any, {
            message: errors[key][0],
          });
        });
      }
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <AddRole open={openAddRole} setOpen={setOpenAddRole} />

      <HeaderAction
        subtitle={
          id
            ? t("hr.employees.create_subtitle_edit", { id })
            : t("hr.employees.create_subtitle_new")
        }
        title={
          id
            ? t("hr.employees.create_title_edit")
            : t("hr.employees.create_title_new")
        }
        onBack={() => navigate(id ? `/hr/employees/${id}` : "/hr/employees")}
      />

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
          <CardBody className="p-8 space-y-12">
            {/* SECTION 1: PROFIL UTAMA */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-400 rounded-sm text-white">
                  <Briefcase size={18} />
                </div>
                <h4 className="text-sm font-black uppercase text-gray-500">
                  {t("hr.employees.section_job")}
                </h4>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-1/3 flex flex-col items-center p-6">
                  <Controller
                    control={control}
                    name="photo"
                    render={({ field }) => (
                      <UploadAvatar
                        buttonTitle={t("hr.employees.upload_photo")}
                        field={field}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-4 italic">
                    {t("hr.employees.upload_hint")}
                  </p>
                </div>

                <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.name?.message}
                        isInvalid={!!errors.name}
                        label={t("hr.employees.form_name")}
                        placeholder={t("hr.employees.form_name_placeholder")}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="mesin_id"
                    render={({ field }) => (
                      <Input
                        {...(field as any)}
                        description={t("hr.employees.form_attendance_id_desc")}
                        errorMessage={errors.mesin_id?.message}
                        isInvalid={!!errors.mesin_id}
                        label={t("hr.employees.form_attendance_id")}
                        placeholder={t(
                          "hr.employees.form_attendance_id_placeholder",
                        )}
                        value={field.value ?? ""}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.email?.message}
                        isInvalid={!!errors.email}
                        label={t("hr.employees.form_email")}
                        placeholder={t("hr.employees.form_email_placeholder")}
                        type="email"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneInput
                        {...(field as any)}
                        errorMessage={errors.phone?.message}
                        isInvalid={!!errors.phone}
                        label={t("hr.employees.form_phone")}
                        placeholder={t("hr.employees.form_phone_placeholder")}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="department"
                    render={({ field, fieldState }) => (
                      <Select
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                        label={t("hr.employees.form_department")}
                        placeholder={t(
                          "hr.employees.form_department_placeholder",
                        )}
                        selectedKeys={[field.value]}
                        onSelectionChange={(key) => {
                          const val = Array.from(key)[0];

                          field.onChange(val);
                        }}
                      >
                        {departments.map((dept) => (
                          <SelectItem key={dept.key}>{dept.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="status"
                    render={({ field, fieldState }) => (
                      <Select
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                        label={t("hr.employees.form_work_status")}
                        placeholder={t(
                          "hr.employees.form_work_status_placeholder",
                        )}
                        selectedKeys={[field.value]}
                        onSelectionChange={(key) => {
                          const val = Array.from(key)[0];

                          field.onChange(val);
                        }}
                      >
                        {workStatuses.map((st) => (
                          <SelectItem key={st.key}>{st.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="join_date"
                    render={({ field, fieldState }) => (
                      <CustomDatePicker
                        errorMessage={fieldState.error?.message}
                        isInvalid={!!fieldState.error}
                        label={t("hr.employees.form_join_date")}
                        value={field.value as any}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <div className="flex gap-2 items-center md:col-span-2">
                    <Controller
                      control={control}
                      name="role_ids"
                      render={({ field, fieldState }) => (
                        <Select
                          aria-label={t("hr.employees.form_role_aria")}
                          errorMessage={fieldState.error?.message}
                          isInvalid={!!fieldState.error}
                          label={t("hr.employees.form_role")}
                          placeholder={t("hr.employees.form_role_placeholder")}
                          selectedKeys={(field.value || []).map(String) || []}
                          selectionMode="multiple"
                          onSelectionChange={(keys) =>
                            field.onChange(Array.from(keys).map(Number))
                          }
                        >
                          {roles.map((role) => (
                            <SelectItem key={role.id} textValue={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                    <Button
                      isIconOnly
                      className="mb-0.5"
                      variant="flat"
                      onPress={() => setOpenAddRole(true)}
                    >
                      <UserPlus size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            {/* SECTION 2: BIODATA & LOKASI */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-500 rounded-sm text-white">
                  <MapPin size={18} />
                </div>
                <h4 className="text-sm font-black uppercase  text-gray-500">
                  {t("hr.employees.section_bio")}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Controller
                  control={control}
                  name="place_birth"
                  render={({ field, fieldState }) => (
                    <Input
                      {...(field as any)}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label={t("hr.employees.form_birth_place")}
                      placeholder={t(
                        "hr.employees.form_birth_place_placeholder",
                      )}
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
                      label={t("hr.employees.form_birth_date")}
                      value={field.value as any}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="gender"
                  render={({ field, fieldState }) => (
                    <Select
                      {...(field as any)}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label={t("hr.employees.form_gender")}
                      placeholder={t("hr.employees.form_gender_placeholder")}
                    >
                      <SelectItem key="male">
                        {t("hr.common.gender_male")}
                      </SelectItem>
                      <SelectItem key="female">
                        {t("hr.common.gender_female")}
                      </SelectItem>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Controller
                  control={control}
                  name="province_id"
                  render={({ field, fieldState }) => (
                    <Province
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      value={field.value}
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
                      value={field.value}
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
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <Textarea
                    {...(field as any)}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("hr.employees.form_address")}
                    minRows={3}
                  />
                )}
              />
            </section>

            <Divider />

            {/* SECTION 3: KONTAK DARURAT */}
            <section className="space-y-8 p-6 rounded-sm border border-rose-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500 rounded-sm text-white">
                  <Heart size={18} />
                </div>
                <h4 className="text-sm font-black uppercase text-rose-600">
                  {t("hr.employees.section_emergency")}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="emergency_name"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      label={t("hr.employees.form_emergency_name")}
                      placeholder={t(
                        "hr.employees.form_emergency_name_placeholder",
                      )}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <PhoneInput
                      label={t("hr.employees.form_emergency_phone")}
                      placeholder={t(
                        "hr.employees.form_emergency_phone_placeholder",
                      )}
                      value={field.value as any}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </div>
            </section>
          </CardBody>
        </Card>

        {/* Action Footer */}
        <div className="flex gap-4 justify-end">
          <Button variant="flat" onPress={() => navigate("/hr/employees")}>
            {t("hr.employees.cancel")}
          </Button>
          <Button color="primary" isLoading={isLoading} type="submit">
            {id ? t("hr.employees.save_update") : t("hr.employees.save_new")}
          </Button>
        </div>
      </form>
    </div>
  );
}
