import type z from "zod";
import type { AxiosError } from "axios";
import type { IVehicle } from "@/utils/interfaces/IUser";
import type { IBooking } from "@/utils/interfaces/IBooking";

import {
  Car,
  User,
  Wrench,
  ClipboardCheck,
  Save,
  ClipboardList,
  Edit,
  Plus,
  CloudBackup,
  PhoneCall,
  Mail,
  Trash2,
  FilePlus2,
  ChevronLeft,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Divider,
  Form,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@heroui/react";

import { ServiceRegistrationSchema } from "./schemas/create-schema";
import ModalAddService from "./components/modal-add-service";
import VehicleOption from "./components/vehicle-option";

import CustomerSearch from "@/components/customer-search";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
import {
  formWoClear,
  removeSparepartService,
  removeWoService,
  setCustomer,
  setWoService,
  setWoSparepart,
} from "@/stores/features/work-order/wo-slice";
import { calculateTotalEstimation } from "@/utils/helpers/global";
import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import InputNumber from "@/components/input-number";
import CustomDatePicker from "@/components/forms/date-picker";
import HeaderAction from "@/components/header-action";

export default function ServiceAddPage() {
  const { company } = useAppSelector((state) => state.auth);
  const { query } = useAppSelector((state) => state.service);
  const { services, sparepart, customer } = useAppSelector((state) => state.wo);
  const [isEdit, setEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isNew, setNew] = useState(false);
  const [isErrorService, setErrorService] = useState(false);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking");
  const dispatch = useAppDispatch();
  const hasFetchedService = useRef(false);
  const hasFetchedBooking = useRef(false);

  const servicePrice = services.reduce(
    (sum, e) => sum + Number(e.price || 0) * Number(e.qty || 0),
    0,
  );
  const sparepartPrice = sparepart.reduce(
    (sum, e) => sum + Number(e.price || 0) * Number(e.qty || 0),
    0,
  );

  useEffect(() => {
    if (company && !hasFetchedService.current) {
      hasFetchedService.current = true;
      dispatch(getService(query));

      setTimeout(() => {
        hasFetchedService.current = false;
      }, 1000);
    }
  }, [company]);

  const {
    control,
    setValue,
    watch,
    reset,
    clearErrors,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(ServiceRegistrationSchema),
    mode: "onChange",
    defaultValues: {
      priority: "normal",
      customer: {
        birth_date: "",
      },
    },
  });

  useEffect(() => {
    if (bookingId && !hasFetchedBooking.current) {
      hasFetchedBooking.current = true;
      getDetailBooking();

      setTimeout(() => {
        hasFetchedBooking.current = false;
      }, 1000);
    }
  }, [bookingId]);

  function getDetailBooking() {
    http
      .get<IBooking>(`/bookings/${bookingId}`)
      .then(({ data }) => {
        setValue("booking_id", data.id);
        setValue("customer.name", data.customer.name);
        setValue("customer.phone", data.customer.phone);
        setValue("customer.email", data.customer.email || "");
        setValue("customer.birth_date", data.customer.profile.birth_date || "");
        setValue("vehicle", data.vehicle);
      })
      .catch((err) => console.error(err));
  }

  const isVehicleDisable = !!watch("vehicle.id") && !isEdit;
  const estimation = calculateTotalEstimation(services);
  const isProduct = services.length > 0 || sparepart.length > 0;
  const navigate = useNavigate();

  const onSubmit = (data: z.infer<typeof ServiceRegistrationSchema>) => {
    setLoading(true);
    const payload = {
      ...data,
      services: services.map((item) => ({
        id: item.id,
        qty: item.qty,
        price: Number(item.price),
      })),
      sparepart: sparepart.map((item) => ({
        id: item.id,
        qty: item.qty,
        price: item.price,
      })),
    };

    http
      .post("/work-order", payload)
      .then(({ data }) => {
        setErrorService(false);
        notify(data.message);
        setValue("complaints", "");
        setValue("current_km", 0);
        reset();
        handleVehicleReset();
        handleResetCustomer();
        dispatch(formWoClear());
        localStorage.removeItem("draft_wo");
      })
      .catch((err: AxiosError) => {
        notifyError(err);
        const data = (err.response?.data as any)?.data;

        if (data && (data.services || data.sparepart)) {
          setErrorService(true);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    dispatch(formWoClear());
  }, []);

  function handleVehicleReset() {
    setValue("vehicle", {
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
    });
    clearErrors("vehicle");
  }

  function handleResetCustomer() {
    setValue("customer", {
      id: undefined,
      name: "",
      phone: "",
      email: "",
      birth_date: "",
    });
    handleVehicleReset();
    clearErrors("customer");
  }

  function setFormVehicle(data: IVehicle) {
    if ((data as any).isNew) {
      setValue("vehicle", {
        plate_number: data.plate_number,
        brand: "",
        model: "",
        color: "",
        engine_capacity: "",
        engine_number: "",
        fuel_type: "",
        id: undefined,
        tire_size: "",
        transmission_type: "",
        vin_number: "",
        year: "",
      });
    } else {
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, val]) => [key, val ?? ""]),
      );

      setValue("vehicle", cleanedData as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }

  return (
    <Form validationBehavior="native">
      <div className="pb-20 space-y-8">
        {/* Header */}
        <HeaderAction
          actionIcon={ChevronLeft}
          actionTitle="Kembali ke Antrian"
          leadIcon={FilePlus2}
          subtitle="Input data kendaraan dan keluhan pelanggan untuk pembuatan Work
              Order."
          title="Pendaftaran Servis Baru"
          onAction={() => navigate("/service/queue")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Data Pemilik */}
            <Card className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <User className="size-5" />
                  <h5 className="font-bold">Informasi Pelanggan</h5>
                </div>
                <div>
                  <Button
                    color="danger"
                    size="sm"
                    type="button"
                    onPress={handleResetCustomer}
                  >
                    Reset Form
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomerSearch
                  placeholder="Cari atau masukkan nama..."
                  value={watch("customer.name")}
                  onChange={(cus) => {
                    console.log("CUS", cus);
                    setValue("customer.id", cus?.id || undefined);
                    setValue("customer.phone", cus?.phone || "");
                    setValue("customer.email", cus?.email! || "");
                    setValue("customer.name", cus?.name || "");

                    setValue(
                      "customer.birth_date",
                      cus?.profile?.birth_date || "",
                    );

                    dispatch(setCustomer(cus));
                    if (cus?.vehicles && cus?.vehicles?.length > 0) {
                      setFormVehicle(cus.vehicles[0]);
                    } else {
                      handleVehicleReset();
                    }
                  }}
                />

                <Controller
                  control={control}
                  name="customer.phone"
                  render={({ field, fieldState }) => (
                    <Input
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                      label="Nomor Telepon / WA"
                      startContent={
                        <PhoneCall className="text-gray-500" size={18} />
                      }
                      {...field}
                      labelPlacement="outside"
                      placeholder="Cari atau masukkan no hp..."
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="customer.birth_date"
                  render={({ field, fieldState }) => (
                    <CustomDatePicker
                      errorMessage={fieldState.error?.message}
                      isDisabled={
                        !!customer?.id && !!customer?.profile?.birth_date
                      }
                      isInvalid={fieldState.invalid}
                      label="Tanggal Lahir"
                      labelPlacement="outside"
                      value={field.value as any}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="customer.email"
                  render={({ field, fieldState }) => (
                    <Input
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                      label="Email (Optional)"
                      labelPlacement="outside"
                      startContent={
                        <Mail className="text-gray-500" size={18} />
                      }
                      {...field}
                      placeholder="Masukan Email valid"
                    />
                  )}
                />
              </div>
            </Card>

            {/* Section 2: Data Kendaraan */}
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Car className="size-5" />
                  <h5 className="font-bold">Detail Kendaraan</h5>
                </div>

                <div className="flex items-center gap-2 ">
                  {isVehicleDisable && (
                    <Button
                      color="warning"
                      size="sm"
                      startContent={<Edit size={18} />}
                      type="button"
                      onPress={() => setEdit(true)}
                    >
                      Ubah Data
                    </Button>
                  )}
                  {!!watch("vehicle.id") && !isNew && (
                    <Button
                      size="sm"
                      startContent={<Plus size={18} />}
                      onPress={() => {
                        setNew(true);
                        handleVehicleReset();
                      }}
                    >
                      Kendaraan Baru
                    </Button>
                  )}
                  {isNew && (
                    <Button
                      size="sm"
                      startContent={<CloudBackup size={18} />}
                      onPress={() => {
                        if (
                          customer?.vehicles &&
                          customer?.vehicles?.length > 0
                        ) {
                          setFormVehicle(customer?.vehicles?.[0]);
                          setNew(false);
                          setEdit(false);
                        }
                      }}
                    >
                      Setelan awal
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Controller
                  control={control}
                  name="vehicle.plate_number"
                  render={() => (
                    <VehicleOption
                      value={watch("vehicle.plate_number")}
                      onChange={(val) => {
                        setFormVehicle(val);
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="vehicle.brand"
                  render={({ field, fieldState }) => (
                    <Input
                      errorMessage={fieldState.error?.message}
                      isDisabled={isVehicleDisable}
                      isInvalid={fieldState.invalid}
                      label="Merk"
                      labelPlacement="outside"
                      placeholder="Contoh: Honda"
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="vehicle.model"
                  render={({ field, fieldState }) => (
                    <Input
                      errorMessage={fieldState.error?.message}
                      isDisabled={isVehicleDisable}
                      isInvalid={fieldState.invalid}
                      label="Tipe / Model"
                      labelPlacement="outside"
                      placeholder="Contoh: BRIO Satya"
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="vehicle.year"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      disabled={isVehicleDisable}
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                      label="Tahun"
                      labelPlacement="outside"
                      placeholder="Masukan Tahun"
                      type="number"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="vehicle.vin_number"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      disabled={isVehicleDisable}
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                      label="Nomor Rangka (VIN)"
                      labelPlacement="outside"
                      placeholder="Masukkan No. Rangka"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="vehicle.color"
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      disabled={isVehicleDisable}
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                      label="Warna"
                      labelPlacement="outside"
                      placeholder="Contoh: Hitam Metalic"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="current_km"
                  render={({ field, fieldState }) => (
                    <InputNumber
                      errorMessage={fieldState.error?.message}
                      isInvalid={
                        fieldState.invalid || !field.value || field.value === 0
                      }
                      label="KM Terakhir"
                      labelPlacement="outside"
                      placeholder="Masukan KM Terakhir"
                      value={(field.value || 0) as any}
                      onInput={field.onChange}
                    />
                  )}
                />
                {/* Baris 2: Spesifikasi Teknis (Detail) */}
                <div className="md:col-span-3 mt-2">
                  <h4 className="text-xs font-semibold mb-4 flex items-center gap-2 text-primary border-b pb-2">
                    <ClipboardList className="size-4" /> Spesifikasi Teknis
                    Kendaraan (Optional)
                  </h4>

                  {/* Layout Grid diubah menjadi maksimal 3 kolom pada layar besar agar Input tidak gepeng */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    {/* Kelompok: Mesin & Tenaga */}
                    <Controller
                      control={control}
                      name="vehicle.engine_capacity"
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={isVehicleDisable}
                          errorMessage={fieldState.error?.message}
                          isInvalid={fieldState.invalid}
                          label="Kapasitas Mesin (CC)"
                          labelPlacement="outside"
                          placeholder="Contoh: 1500"
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="vehicle.fuel_type"
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={isVehicleDisable}
                          errorMessage={fieldState.error?.message}
                          isInvalid={fieldState.invalid}
                          label="Bahan Bakar"
                          labelPlacement="outside"
                          placeholder="Pertalite / Solar / Dex"
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="vehicle.transmission_type"
                      render={({ field, fieldState }) => (
                        <Select
                          {...field}
                          disabled={isVehicleDisable}
                          errorMessage={fieldState.error?.message}
                          isInvalid={fieldState.invalid}
                          label="Tipe Transmisi"
                          labelPlacement="outside"
                          placeholder="Pilih Transmisi"
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

                    <Controller
                      control={control}
                      name="vehicle.engine_number"
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={isVehicleDisable}
                          errorMessage={fieldState.error?.message}
                          isInvalid={fieldState.invalid}
                          label="Nomor Mesin"
                          labelPlacement="outside"
                          placeholder="Masukkan No. Mesin"
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="vehicle.tire_size"
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          disabled={isVehicleDisable}
                          errorMessage={fieldState.error?.message}
                          isInvalid={fieldState.invalid}
                          label="Ukuran Ban & Velg"
                          labelPlacement="outside"
                          placeholder="Contoh: 185/65 R15"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 3: Keluhan & Layanan */}
            <Card
              className={`p-6 ${isErrorService ? "border border-red-500" : ""} space-y-4`}
            >
              {isErrorService ||
                (!isProduct && (
                  <Alert color="warning">
                    Mohon tambahkan **minimal satu** barang atau jasa sebelum
                    melanjutkan.
                  </Alert>
                ))}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <Wrench className="size-5" />
                  <h5 className="font-bold">Keluhan & Jenis Servis</h5>
                </div>
                <div className="text-right">
                  <ModalAddService />
                </div>
              </div>
              <div className="space-y-4">
                <Table
                  removeWrapper
                  aria-label="Tabel Daftar Layanan dan Sparepart"
                  classNames={{
                    th: "bg-default-50 text-gray-600 font-bold uppercase text-tiny",
                    td: "py-3",
                  }}
                >
                  <TableHeader>
                    <TableColumn width={300}>BARANG/JASA</TableColumn>
                    <TableColumn align="center">QTY</TableColumn>
                    <TableColumn align="end">BIAYA</TableColumn>
                    <TableColumn align="end">TOTAL</TableColumn>
                    <TableColumn align="center" width={50}>
                      {" "}
                    </TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="Belum ada item yang ditambahkan">
                    {[
                      ...(sparepart.length > 0
                        ? [
                            <TableRow
                              key="header-sparepart"
                              className="bg-default-100"
                            >
                              <TableCell className="font-semibold text-primary">
                                Sparepart
                              </TableCell>
                              <TableCell className="text-right" colSpan={4}>
                                <Button
                                  color="danger"
                                  size="sm"
                                  startContent={<Trash2 size={16} />}
                                  variant="flat"
                                  onPress={() =>
                                    confirmSweat(() =>
                                      dispatch(setWoSparepart([])),
                                    )
                                  }
                                >
                                  Hapus Semua
                                </Button>
                              </TableCell>
                            </TableRow>,
                            ...sparepart.map((item, i) => (
                              <TableRow key={`spt-item-${item.id || i}`}>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {item.name}
                                    </span>
                                    <span className="text-gray-400 text-xs font-mono">
                                      {item.code}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  {formatNumber(Number(item.qty || 0))}
                                </TableCell>
                                <TableCell className="text-end">
                                  {formatIDR(Number(item.sell_price))}
                                </TableCell>
                                <TableCell className="text-end font-semibold">
                                  {formatIDR(
                                    Number(item.qty || 0) *
                                      Number(item.sell_price),
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    onPress={() =>
                                      dispatch(removeSparepartService(item))
                                    }
                                  >
                                    <Trash2 className="size-4 text-danger" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )),
                          ]
                        : []),

                      // Blok Jasa
                      ...(services.length > 0
                        ? [
                            <TableRow
                              key="header-services"
                              className="bg-default-100"
                            >
                              <TableCell className="font-semibold text-primary">
                                Jasa
                              </TableCell>
                              <TableCell className="text-right" colSpan={4}>
                                <Button
                                  color="danger"
                                  size="sm"
                                  startContent={<Trash2 size={16} />}
                                  variant="flat"
                                  onPress={() =>
                                    confirmSweat(() =>
                                      dispatch(setWoService([])),
                                    )
                                  }
                                >
                                  Hapus Semua
                                </Button>
                              </TableCell>
                            </TableRow>,
                            ...services.map((item, i) => (
                              <TableRow key={`svc-item-${item.id || i}`}>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {item.name}
                                    </span>
                                    <span className="text-gray-400 text-xs font-mono">
                                      {item.code}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  {formatNumber(Number(item.qty || 0))}
                                </TableCell>
                                <TableCell className="text-end">
                                  {formatIDR(Number(item.price))}
                                </TableCell>
                                <TableCell className="text-end font-semibold">
                                  {formatIDR(
                                    Number(item.qty || 0) * Number(item.price),
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    isIconOnly
                                    variant="light"
                                    onPress={() =>
                                      dispatch(removeWoService(item))
                                    }
                                  >
                                    <Trash2 className="size-4 text-danger" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )),
                          ]
                        : []),
                    ]}
                  </TableBody>
                </Table>

                <Divider className="my-4" />

                <div className="space-y-2">
                  <Controller
                    control={control}
                    name="complaints"
                    render={({ field, fieldState }) => (
                      <Textarea
                        {...field}
                        cacheMeasurements // Optimasi performa saat resize
                        classNames={{
                          label: "text-md font-semibold text-default-700",
                          input: "text-small",
                        }}
                        errorMessage={fieldState.error?.message}
                        isInvalid={fieldState.invalid}
                        label="Deskripsi Keluhan"
                        labelPlacement="outside"
                        maxRows={8}
                        minRows={3}
                        placeholder="Masukkan detail keluhan pelanggan secara lengkap di sini..."
                        variant="bordered"
                      />
                    )}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar: Ringkasan & Action */}
          <div>
            <div className="space-y-6 sticky top-32">
              <Card className="p-4">
                <CardBody>
                  <h5 className="font-bold border-b border-white/10 pb-3 flex items-center gap-2">
                    <ClipboardCheck className="size-5" />
                    Ringkasan Order
                  </h5>
                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex justify-between opacity-80">
                      <span>Estimasi Waktu</span>
                      <span className="font-semibold">
                        {estimation.readable_format}
                      </span>
                    </div>
                    <div className="flex justify-between opacity-80">
                      <span>Total Sparepart</span>
                      <span>{formatIDR(sparepartPrice)}</span>
                    </div>
                    <div className="flex justify-between opacity-80">
                      <span>Total Jasa</span>
                      <span>{formatIDR(servicePrice)}</span>
                    </div>
                    <div className="flex justify-between opacity-80">
                      <span>Estimasi Harga</span>
                      <span className="font-semibold">
                        {formatIDR(servicePrice + sparepartPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center opacity-80 gap-10">
                      <span className="flex-1">Prioritas</span>

                      <Controller
                        control={control}
                        name="priority"
                        render={({ field }) => (
                          <Select
                            placeholder="Pilih Prioritas"
                            selectedKeys={[field.value]}
                            size="sm"
                            onSelectionChange={(keys) =>
                              field.onChange(Array.from(keys)[0])
                            }
                          >
                            <SelectItem key="low">Rendah</SelectItem>
                            <SelectItem key="normal">Normal</SelectItem>
                            <SelectItem key="hight">Tinggi</SelectItem>
                            <SelectItem key="urgent">Urgent</SelectItem>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    fullWidth
                    color="primary"
                    isDisabled={!isValid || !isProduct}
                    isLoading={isLoading}
                    startContent={<Save />}
                    onPress={() => handleSubmit(onSubmit)()}
                  >
                    {isLoading ? "Sedang Process..." : "Simpan Work Order"}
                  </Button>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-xs text-primary leading-relaxed">
                    <strong>Tips:</strong> Pastikan Anda telah memeriksa barang
                    berharga di dalam kendaraan sebelum memulai servis.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
