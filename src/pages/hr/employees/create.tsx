import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Heart, MapPin, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
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

import AddRole from "../../settings/roles/components/add-role";

import { formSchema } from "./schemas/create-schema";

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

interface Props {
  id?: string;
  userForm?: z.infer<typeof formSchema>;
}

export default function CreateEmployeePage({ id, userForm }: Props) {
  const { roles } = useAppSelector((state) => state.role);
  const [isLoading, setLoading] = useState(false);
  const [openAddRole, setOpenAddRole] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRole());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Permanent",
      join_date: new Date().toISOString(),
      birth_date: new Date().toISOString(),
      emergency_name: "",
      emergency_contact: "",
      ...userForm,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (values.photo instanceof File) {
        const photo = await uploadFile(values.photo);

        values.photo = photo;
      }

      const response = await http.post("/employees", { id, ...values });

      notify(response.data.message);
      navigate("/hr/employees");
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 px-4 max-w-5xl mx-auto">
      <AddRole open={openAddRole} setOpen={setOpenAddRole} />

      {/* Top Navigation */}
      <div className="flex items-center gap-6">
        <Button
          isIconOnly
          className="rounded-full bg-white shadow-sm"
          variant="flat"
          onPress={() => navigate("/hr/employees")}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-500">
            {id ? "Update Personil" : "Registrasi Karyawan"}
          </h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {id ? "ID KARYAWAN: #" + id : "PENDAFTARAN TIM BARU"}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
          <CardBody className="p-8 space-y-12">
            {/* SECTION 1: PROFIL UTAMA */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-400 rounded-xl text-white">
                  <Briefcase size={18} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">
                  Informasi Pekerjaan
                </h4>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="w-full md:w-1/3 flex flex-col items-center p-6">
                  <Controller
                    control={control}
                    name="photo"
                    render={({ field }) => (
                      <UploadAvatar
                        buttonTitle="Upload Foto"
                        field={field}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-4 italic">
                    Format: JPG, PNG (Maks 2MB)
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
                        label="Nama Lengkap"
                        labelPlacement="outside"
                        placeholder="Sesuai KTP"
                        variant="bordered"
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
                        label="Email Kantor"
                        labelPlacement="outside"
                        placeholder="name@company.com"
                        type="email"
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.phone?.message}
                        isInvalid={!!errors.phone}
                        label="Nomor Telepon"
                        labelPlacement="outside"
                        placeholder="08xx-xxxx-xxxx"
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="department"
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Departemen"
                        labelPlacement="outside"
                        placeholder="Pilih Divisi"
                        variant="bordered"
                      >
                        {["Workshop", "Front Office", "Finance", "HR"].map(
                          (dept) => (
                            <SelectItem key={dept}>{dept}</SelectItem>
                          ),
                        )}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Status Kerja"
                        labelPlacement="outside"
                        placeholder="Status Pekerjaan"
                        variant="bordered"
                      >
                        {["Permanent", "Contract"].map((st) => (
                          <SelectItem key={st}>{st}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name="join_date"
                    render={({ field }) => (
                      <CustomDatePicker
                        label="Tanggal Bergabung"
                        value={field.value as any}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <div className="flex gap-2 items-end md:col-span-2">
                    <Controller
                      control={control}
                      name="role_ids"
                      render={({ field }) => (
                        <Select
                          {...(field as any)}
                          label="Jabatan/Role"
                          labelPlacement="outside"
                          placeholder="Pilih Role"
                          selectionMode="multiple"
                          variant="bordered"
                          onSelectionChange={(keys) =>
                            field.onChange(Array.from(keys))
                          }
                        >
                          {roles
                            .filter((r) => ![1, 2].includes(r.id))
                            .map((role) => (
                              <SelectItem key={role.id}>{role.name}</SelectItem>
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
                <div className="p-2 bg-gray-500 rounded-xl text-white">
                  <MapPin size={18} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">
                  Biodata & Alamat Tinggal
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Controller
                  control={control}
                  name="place_birth"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Tempat Lahir"
                      labelPlacement="outside"
                      placeholder="Serang..."
                      variant="bordered"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="birth_date"
                  render={({ field }) => (
                    <CustomDatePicker
                      label="Tanggal Lahir"
                      value={field.value as any}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Jenis Kelamin"
                      labelPlacement="outside"
                      placeholder="Masukan Jenis Kelamin"
                      variant="bordered"
                    >
                      <SelectItem key="male">Laki-laki</SelectItem>
                      <SelectItem key="female">Perempuan</SelectItem>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Controller
                  control={control}
                  name="province_id"
                  render={({ field }) => (
                    <Province value={field.value} onChange={field.onChange} />
                  )}
                />
                <Controller
                  control={control}
                  name="city_id"
                  render={({ field }) => (
                    <City value={field.value} onChange={field.onChange} />
                  )}
                />
                <Controller
                  control={control}
                  name="district_id"
                  render={({ field }) => (
                    <District value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Alamat Lengkap (KTP)"
                    labelPlacement="outside"
                    minRows={3}
                    variant="bordered"
                  />
                )}
              />
            </section>

            <Divider />

            {/* SECTION 3: KONTAK DARURAT */}
            <section className="space-y-8 p-6 bg-rose-50/50 rounded-sm border border-rose-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500 rounded-xl text-white">
                  <Heart size={18} />
                </div>
                <h4 className="text-sm font-black uppercase italic tracking-widest text-rose-600">
                  Kontak Darurat (Emergency)
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name="emergency_name"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      label="Nama Kerabat"
                      labelPlacement="outside"
                      placeholder="Nama Lengkap"
                      variant="bordered"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <PhoneInput
                      label="No. Telepon Kerabat"
                      labelPlacement="outside"
                      placeholder="08xx-xxxx-xxxx"
                      value={field.value as any}
                      variant="bordered"
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
            Batalkan
          </Button>
          <Button color="primary" isLoading={isLoading} type="submit">
            {id ? "Update Data Karyawan" : "Simpan Karyawan Baru"}
          </Button>
        </div>
      </form>
    </div>
  );
}
