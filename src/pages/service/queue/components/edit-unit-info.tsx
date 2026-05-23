import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { usePermission } from "@/components/use-permission";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import AutoCompleteVehilce from "@/components/auto-complete-vehicle";
import { IMasterVehicle } from "@/utils/interfaces/IMaster";
import InputNumber from "@/components/input-number";

const schema = z.object({
  id: z.number().optional(),
  plate_number: z
    .string({ message: "Nopol wajib diisi" })
    .min(4, "Nopol tidak valid"),
  brand: z.string({ message: "Merk wajib diisi" }).min(1, "Merk wajib diisi"),
  model: z.string({ message: "Tipe wajib diisi" }).min(1, "Tipe wajib diisi"),
  year: z.string(),
  color: z.string(),
  engine_capacity: z.string(),
  transmission_type: z.string(),
  fuel_type: z.string(),
  vin_number: z.string(),
  engine_number: z.string(),
  tire_size: z.string(),
  current_km: z.number().min(0, "KM tidak boleh negatif"),
  next_km: z.number().min(0, "KM tidak boleh negatif"),
});

type TEditUnitInfo = z.output<typeof schema>;

export default function EditUnitInfo() {
  const { master: vehilces } = useAppSelector((state) => state.vehicle);
  const { settings } = useAppSelector((state) => state.setting);
  const { detail: data } = useAppSelector((state) => state.wo);
  const [vehicle, setVehilce] = useState<IMasterVehicle>();
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermission();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canUpdate = hasPermission("wo.update");

  console.log("DATA", data);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TEditUnitInfo>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: undefined,
      plate_number: "",
      brand: "",
      model: "",
      year: "",
      color: "",
      engine_capacity: "",
      transmission_type: "",
      fuel_type: "",
      vin_number: "",
      engine_number: "",
      tire_size: "",
      current_km: 0,
      next_km: 0,
    },
  });

  useEffect(() => {
    if (!open || !data) return;

    reset({
      id: data.vehicle?.id,
      plate_number: data.vehicle?.plate_number || "",
      brand: data.vehicle?.brand || "",
      model: data.vehicle?.model || "",
      year: data.vehicle?.year || "",
      color: data.vehicle?.color || "",
      engine_capacity: data.vehicle?.engine_capacity || "",
      transmission_type: data.vehicle?.transmission_type || "",
      fuel_type: data.vehicle?.fuel_type || "",
      vin_number: data.vehicle?.vin_number || "",
      engine_number: data.vehicle?.engine_number || "",
      tire_size: data.vehicle?.tire_size || "",
      current_km: Number(data.current_km || 0),
      next_km: Number(data.next_km || 0),
    });
  }, [open, data, reset]);

  if (!canUpdate || ["cancel", "closed"].includes(data?.status || "")) {
    return null;
  }

  function normalizeNullable(value?: string) {
    const cleaned = value?.trim();

    return cleaned ? cleaned : null;
  }

  const onSubmit = (values: TEditUnitInfo) => {
    if (!data?.id) return;

    setIsLoading(true);
    const payload = {
      wo: {
        id: data.id,
        current_km: values.current_km,
        next_km: values.next_km,
      },
      vehicle: {
        id: data.vehicle?.id,
        plate_number: values.plate_number.trim().toUpperCase(),
        brand: values.brand.trim().toUpperCase(),
        model: values.model.trim().toUpperCase(),
        year: normalizeNullable(values.year),
        color: normalizeNullable(values.color),
        engine_capacity: normalizeNullable(values.engine_capacity),
        transmission_type: normalizeNullable(values.transmission_type),
        fuel_type: normalizeNullable(values.fuel_type),
        vin_number: normalizeNullable(values.vin_number),
        engine_number: normalizeNullable(values.engine_number),
        tire_size: normalizeNullable(values.tire_size),
      },
    };

    http
      .post("/vehicles", payload)
      .then(({ data: response }) => {
        notify(response.message);
        dispatch(getWoDetail(data.id));
        setOpen(false);
      })
      .catch((error) => notifyError(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Modal
        isOpen={open}
        scrollBehavior="outside"
        size="5xl"
        onOpenChange={setOpen}
      >
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <div className="flex items-center gap-2 text-primary font-bold">
                <Car className="size-5" />
                <h5 className="font-bold">Edit Unit Kendaraan</h5>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  control={control}
                  name="plate_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.plate_number?.message}
                      isInvalid={!!errors.plate_number}
                      label="Nomor Polisi"
                      labelPlacement="outside"
                      placeholder="Contoh: B1234XYZ"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="brand"
                  render={({ field, fieldState }) => (
                    <AutoCompleteVehilce
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.invalid}
                      items={(vehilces || []).map((e) => e.type)}
                      label="Merk"
                      labelPlacement="outside"
                      value={field.value}
                      onValueChange={(val) => {
                        const find = vehilces.find((e) => e.type === val);

                        field.onChange(val?.toUpperCase());
                        if (find) {
                          setVehilce(find);
                          setValue("model", "");
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="model"
                  render={({ field, fieldState }) => (
                    <AutoCompleteVehilce
                      key="merk"
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                      items={(vehicle?.children || []).map((e) => e.merk)}
                      label="Tipe / Model"
                      labelPlacement="outside"
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val?.toUpperCase());
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="year"
                  render={({ field }) => (
                    <InputNumber
                      errorMessage={errors.year?.message}
                      isInvalid={!!errors.year}
                      label="Tahun"
                      labelPlacement="outside"
                      placeholder="Contoh: 2024"
                      value={(field.value || 0) as any}
                      onInput={(val) => field.onChange(String(val))}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="color"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.color?.message}
                      isInvalid={!!errors.color}
                      label="Warna"
                      labelPlacement="outside"
                      placeholder="Contoh: Hitam"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="vin_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.vin_number?.message}
                      isInvalid={!!errors.vin_number}
                      label="Nomor Rangka (VIN)"
                      labelPlacement="outside"
                      placeholder="Masukkan No. Rangka"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="engine_number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.engine_number?.message}
                      isInvalid={!!errors.engine_number}
                      label="Nomor Mesin"
                      labelPlacement="outside"
                      placeholder="Masukkan No. Mesin"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="engine_capacity"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.engine_capacity?.message}
                      isInvalid={!!errors.engine_capacity}
                      label="Kapasitas Mesin (CC)"
                      labelPlacement="outside"
                      placeholder="Contoh: 1500"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="fuel_type"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.fuel_type?.message}
                      isInvalid={!!errors.fuel_type}
                      label="Bahan Bakar"
                      labelPlacement="outside"
                      placeholder="Contoh: Bensin"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="transmission_type"
                  render={({ field }) => (
                    <Select
                      errorMessage={errors.transmission_type?.message}
                      isInvalid={!!errors.transmission_type}
                      label="Tipe Transmisi"
                      labelPlacement="outside"
                      placeholder="Pilih transmisi"
                      selectedKeys={field.value ? [field.value] : []}
                      onSelectionChange={(keys) => {
                        field.onChange(Array.from(keys)[0] || "");
                      }}
                    >
                      <SelectItem key="MT">Manual (MT)</SelectItem>
                      <SelectItem key="AT">Automatic (AT)</SelectItem>
                      <SelectItem key="CVT">CVT</SelectItem>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="tire_size"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.tire_size?.message}
                      isInvalid={!!errors.tire_size}
                      label="Ukuran Ban & Velg"
                      labelPlacement="outside"
                      placeholder="Contoh: 185/65 R15"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="current_km"
                  render={({ field }) => (
                    <InputNumber
                      errorMessage={errors.current_km?.message}
                      isInvalid={!!errors.current_km}
                      label="KM Sekarang"
                      labelPlacement="outside"
                      placeholder="Masukkan KM sekarang"
                      value={(field.value || 0) as any}
                      onInput={(val: any) => {
                        field.onChange(Number(val));
                        if (Number(val) > 0) {
                          setValue(
                            "next_km",
                            Number(val) +
                              Number(settings?.default_km_increment || 10000),
                          );
                        }
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="next_km"
                  render={({ field }) => (
                    <InputNumber
                      errorMessage={errors.next_km?.message}
                      isInvalid={!!errors.next_km}
                      label="KM Berikutnya"
                      labelPlacement="outside"
                      placeholder="Masukkan KM berikutnya"
                      value={(field.value || 0) as any}
                      onInput={field.onChange}
                    />
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={() => setOpen(false)}>
                Batal
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                startContent={!isLoading ? <Save size={16} /> : undefined}
                type="submit"
              >
                Simpan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Button
        isIconOnly
        color="warning"
        size="sm"
        variant="light"
        onPress={() => setOpen(true)}
      >
        <Edit size={18} />
      </Button>
    </>
  );
}
