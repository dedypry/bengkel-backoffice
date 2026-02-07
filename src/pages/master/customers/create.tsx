import type { ICustomer } from "@/utils/interfaces/IUser";

import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CarFront,
  ChevronLeft,
  ClipboardList,
  Plus,
  Save,
  Trash2,
  User,
  MapPin,
  Settings2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Card,
  CardBody,
  Divider,
  Tooltip,
} from "@heroui/react";

import { customerSchema } from "./schemas/create-schema";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getCity, getDistrict } from "@/stores/features/region/region-action";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import CustomDatePicker from "@/components/forms/date-picker";

export default function CustomerFormPage({ data }: { data?: ICustomer }) {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { control, reset, handleSubmit } = useForm({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      customer_type: "personal",
      nik_ktp: "",
      credit_limit: "0",
      vehicles: [{ plate_number: "", brand: "", model: "", year: "" }],
      profile: { birth_date: new Date().toISOString() },
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        email: data.email || "",
        nik_ktp: data.nik_ktp || "",
        credit_limit: data.credit_limit.toString(),
        notes: data.notes || "",
        vehicles: data.vehicles || [],
      });

      if (data.profile?.province_id) {
        dispatch(getCity(data.profile.province_id));
        dispatch(getDistrict(data.profile.city_id));
      }
    }
  }, [data, dispatch]);

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "vehicles",
  });

  const onSubmit = (values: any) => {
    setLoading(true);
    http
      .post("/customers", values)
      .then(({ data }) => {
        notify(data.message);
        navigate("/master/customers");
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Sticky Header Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 bg-white/80 backdrop-blur-md py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            className="bg-gray-100"
            variant="flat"
            onPress={() => navigate(-1)}
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-gray-500">
              {data ? "Perbarui Pelanggan" : "Registrasi Pelanggan Baru"}
            </h1>
            <p className="text-tiny font-medium text-gray-400">
              Pastikan data kendaraan dan kontak sudah sesuai.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="font-bold"
            variant="light"
            onPress={() => navigate(-1)}
          >
            Batal
          </Button>
          <Button
            color="primary"
            isLoading={isLoading}
            startContent={!isLoading && <Save size={18} />}
            onPress={() => handleSubmit(onSubmit)()}
          >
            {data ? "UPDATE DATA" : "SIMPAN PELANGGAN"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI: Informasi Utama */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-gray-200" shadow="none">
            <CardBody className="p-6 space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <User className="size-5" />
                  <h2 className="text-sm font-black uppercase italic tracking-tight">
                    Informasi Dasar & Kontak
                  </h2>
                </div>
                <Divider className="opacity-50" />

                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      className="pt-5"
                      errorMessage={fieldState.error?.message as string}
                      isInvalid={!!fieldState.error}
                      label="Nama Lengkap"
                      labelPlacement="outside"
                      placeholder="Masukkan nama sesuai KTP"
                      variant="bordered"
                    />
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        errorMessage={fieldState.error?.message as string}
                        isInvalid={!!fieldState.error}
                        label="WhatsApp / Telepon"
                        labelPlacement="outside"
                        placeholder="0812..."
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        errorMessage={fieldState.error?.message as string}
                        isInvalid={!!fieldState.error}
                        label="Alamat Email"
                        labelPlacement="outside"
                        placeholder="email@bengkel.com"
                        variant="bordered"
                      />
                    )}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="size-5" />
                  <h2 className="text-sm font-black uppercase italic tracking-tight">
                    Domisili Pelanggan
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Controller
                    control={control}
                    name="profile.province_id"
                    render={({ field }) => (
                      <Province value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="profile.city_id"
                    render={({ field }) => (
                      <City value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <Controller
                    control={control}
                    name="profile.district_id"
                    render={({ field }) => (
                      <District value={field.value} onChange={field.onChange} />
                    )}
                  />
                </div>
                <Controller
                  control={control}
                  name="profile.address"
                  render={({ field, fieldState }) => (
                    <Textarea
                      {...field}
                      errorMessage={fieldState.error?.message as string}
                      isInvalid={!!fieldState.error}
                      label="Alamat Lengkap"
                      labelPlacement="outside"
                      placeholder="Nama jalan, nomor rumah, RT/RW..."
                      variant="bordered"
                    />
                  )}
                />
              </section>
            </CardBody>
          </Card>

          {/* DATA KENDARAAN */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <CarFront className="size-5" />
                <h2 className="text-sm font-black uppercase italic tracking-tight text-gray-500">
                  Inventori Kendaraan
                </h2>
              </div>
              <Button
                color="primary"
                size="sm"
                startContent={<Plus size={16} />}
                variant="flat"
                onPress={() =>
                  append({ plate_number: "", brand: "", model: "", year: "" })
                }
              >
                Tambah Unit
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="relative">
                {fields.length > 1 && (
                  <Tooltip color="danger" content="Hapus Unit">
                    <Button
                      isIconOnly
                      className="absolute -top-3 -right-1 rounded-full shadow-md z-50"
                      color="danger"
                      size="sm"
                      onPress={() => remove(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Tooltip>
                )}
                <Card className="border border-gray-200 " shadow="none">
                  <CardBody className="p-6 space-y-6 ">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Controller
                        control={control}
                        name={`vehicles.${index}.plate_number`}
                        render={({ field, fieldState }) => (
                          <Input
                            {...field}
                            errorMessage={fieldState.error?.message as string}
                            isInvalid={!!fieldState.error}
                            label="No. Polisi"
                            placeholder="B 1234 ABC"
                            variant="bordered"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`vehicles.${index}.brand`}
                        render={({ field, fieldState }) => (
                          <Input
                            {...field}
                            errorMessage={fieldState.error?.message as string}
                            isInvalid={!!fieldState.error}
                            label="Merk"
                            placeholder="Honda/Toyota"
                            variant="bordered"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`vehicles.${index}.model`}
                        render={({ field, fieldState }) => (
                          <Input
                            {...field}
                            errorMessage={fieldState.error?.message as string}
                            isInvalid={!!fieldState.error}
                            label="Tipe/Model"
                            placeholder="Civic/Avanza"
                            variant="bordered"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`vehicles.${index}.year`}
                        render={({ field, fieldState }) => (
                          <Input
                            {...field}
                            errorMessage={fieldState.error?.message as string}
                            isInvalid={!!fieldState.error}
                            label="Tahun"
                            placeholder="2022"
                            type="number"
                            variant="bordered"
                          />
                        )}
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <ClipboardList size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Spesifikasi Teknis (Opsional)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Controller
                          control={control}
                          name={`vehicles.${index}.vin_number`}
                          render={({ field, fieldState }) => (
                            <Input
                              {...field}
                              errorMessage={fieldState.error?.message as string}
                              isInvalid={!!fieldState.error}
                              label="No. Rangka"
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name={`vehicles.${index}.engine_number`}
                          render={({ field, fieldState }) => (
                            <Input
                              {...field}
                              errorMessage={fieldState.error?.message as string}
                              isInvalid={!!fieldState.error}
                              label="No. Mesin"
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`vehicles.${index}.transmission_type`}
                          render={({ field }) => (
                            <Select
                              label="Transmisi"
                              selectedKeys={field.value ? [field.value] : []}
                              onSelectionChange={(keys) =>
                                field.onChange(Array.from(keys)[0])
                              }
                            >
                              <SelectItem key="MT">Manual (MT)</SelectItem>
                              <SelectItem key="AT">Automatic (AT)</SelectItem>
                              <SelectItem key="CVT">CVT</SelectItem>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </section>
        </div>

        {/* KOLOM KANAN: Klasifikasi */}
        <div className="space-y-6">
          <Card className="border border-gray-200 bg-gray-50/30" shadow="none">
            <CardBody className="p-6 space-y-6">
              <div className="flex items-center gap-2 text-gray-500">
                <Settings2 className="size-5" />
                <h2 className="text-sm font-black uppercase italic tracking-tight">
                  Klasifikasi Akun
                </h2>
              </div>

              <Controller
                control={control}
                name="customer_type"
                render={({ field, fieldState }) => (
                  <Select
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Tipe Pelanggan"
                    labelPlacement="outside"
                    selectedKeys={[field.value]}
                    variant="bordered"
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0])
                    }
                  >
                    <SelectItem key="personal">Perorangan</SelectItem>
                    <SelectItem key="corporate">Perusahaan / Fleet</SelectItem>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="nik_ktp"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="NIK (KTP)"
                    labelPlacement="outside"
                    placeholder="16 Digit Nomor KTP"
                    variant="bordered"
                  />
                )}
              />
              <Controller
                control={control}
                name="profile.birth_date"
                render={({ field, fieldState }) => (
                  <CustomDatePicker
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Tanggal Lahir"
                    value={field.value as any}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="notes"
                render={({ field, fieldState }) => (
                  <Textarea
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label="Catatan Internal"
                    labelPlacement="outside"
                    placeholder="Pelanggan loyal, prioritas, dll..."
                    variant="bordered"
                  />
                )}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
