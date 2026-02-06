import type { ISupplier } from "@/utils/interfaces/ISupplier";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
} from "@heroui/react";
import {
  Building2,
  Hash,
  Phone,
  Mail,
  Globe,
  FileText,
  MapPin,
  Save,
  X,
  Info,
} from "lucide-react";

import { supplierSchema, type SupplierFormValues } from "./form-schema";

import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCity, getDistrict } from "@/stores/features/region/region-action";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import PhoneInput from "@/components/forms/phone-input";
import NpwpInput from "@/components/forms/npwp-input";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  supplier?: ISupplier;
  onClose?: () => void;
}

export default function AddModal({ open, setOpen, supplier, onClose }: Props) {
  const { supplierQuery } = useAppSelector((state) => state.supplier);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { handleSubmit, control, reset, watch } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      is_active: true,
      code: "",
      website: "",
      npwp: "",
    },
  });

  useEffect(() => {
    if (open && supplier) {
      reset({
        ...supplier,
        npwp: supplier.npwp || "",
        website: supplier.website || "",
      } as any);
      if (supplier.province_id) dispatch(getCity(supplier.province_id));
      if (supplier.city_id) dispatch(getDistrict(supplier.city_id));
    } else if (open) {
      reset({
        is_active: true,
        code: "",
        website: "",
        npwp: "",
      });
    }
  }, [supplier, open, reset, dispatch]);

  const handleFormSubmit = (data: SupplierFormValues) => {
    setLoading(true);
    http
      .post("/suppliers", data)
      .then(({ data }) => {
        dispatch(getSupplier(supplierQuery));
        notify(data.message);
        handleClose();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    reset();
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        base: "border border-gray-100",
        header: "border-b-[1px] border-gray-100",
        footer: "border-t-[1px] border-gray-100",
      }}
      isOpen={open}
      scrollBehavior="outside"
      size="3xl"
      onOpenChange={handleClose}
    >
      <form
        className="space-y-8"
        id="supplier-form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-black uppercase italic tracking-tight">
              {supplier?.id ? "Ubah Data Supplier" : "Tambah Supplier Baru"}
            </h2>
            <p className="text-tiny font-medium text-gray-400">
              Kelola informasi vendor untuk kebutuhan operasional.
            </p>
          </ModalHeader>

          <ModalBody className="py-6">
            {/* Bagian Identitas */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black italic text-xs uppercase tracking-widest">
                <Building2 size={14} /> Identitas Perusahaan
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Nama Supplier"
                      labelPlacement="outside"
                      placeholder="PT. Maju Jaya"
                      variant="bordered"
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="code"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Kode"
                      labelPlacement="outside"
                      placeholder="SUP-001"
                      startContent={
                        <Hash className="text-gray-400" size={16} />
                      }
                      variant="bordered"
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
                  )}
                />
              </div>
            </section>

            {/* Bagian Kontak */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black italic text-xs uppercase tracking-widest">
                <Phone size={14} /> Informasi Kontak
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <PhoneInput
                      label="No Telp"
                      value={field.value}
                      variant="bordered"
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Email"
                      labelPlacement="outside"
                      placeholder="vendor@mail.com"
                      startContent={
                        <Mail className="text-gray-400" size={16} />
                      }
                      type="email"
                      variant="bordered"
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
                  )}
                />
              </div>
            </section>

            {/* Bagian Wilayah */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black italic text-xs uppercase tracking-widest">
                <MapPin size={14} /> Lokasi & Alamat
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Controller
                  control={control}
                  name="province_id"
                  render={({ field }) => <Province {...field} />}
                />
                <Controller
                  control={control}
                  name="city_id"
                  render={({ field }) => <City {...field} />}
                />
                <Controller
                  control={control}
                  name="district_id"
                  render={({ field }) => <District {...field} />}
                />
              </div>
              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Alamat Lengkap"
                    labelPlacement="outside"
                    placeholder="Jl. Industri No. 5..."
                    variant="bordered"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                  />
                )}
              />
            </section>

            {/* Bagian Administrasi */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black italic text-xs uppercase tracking-widest">
                <FileText size={14} /> Legalitas & Status
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="npwp"
                  render={({ field, fieldState }) => (
                    <NpwpInput
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="NPWP"
                      labelPlacement="outside"
                      value={field.value}
                      variant="bordered"
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="website"
                  render={({ field, fieldState }) => (
                    <Input
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Website"
                      labelPlacement="outside"
                      placeholder="https://..."
                      startContent={
                        <Globe className="text-gray-400" size={16} />
                      }
                      variant="bordered"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                    <Info className="text-blue-500" size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black uppercase italic text-gray-700">
                      Status Aktif
                    </span>
                    <p className="text-[10px] text-gray-500 max-w-[280px]">
                      {watch("is_active")
                        ? "Supplier tersedia untuk transaksi aktif."
                        : "Supplier akan diarsipkan dari daftar pilihan."}
                    </p>
                  </div>
                </div>
                <Controller
                  control={control}
                  name="is_active"
                  render={({ field }) => (
                    <Switch
                      color="success"
                      isSelected={field.value}
                      size="lg"
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </div>
            </section>
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              startContent={<X size={18} />}
              variant="flat"
              onPress={handleClose}
            >
              Batal
            </Button>
            <Button
              color="primary"
              isLoading={loading}
              startContent={!loading && <Save size={18} />}
              type="submit"
            >
              {supplier?.id ? "Simpan Perubahan" : "Simpan Supplier"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
