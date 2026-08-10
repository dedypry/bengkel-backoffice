import type { ISupplier } from "@/utils/interfaces/ISupplier";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  supplier?: ISupplier | null;
  onClose?: () => void;
}

export default function AddSupplierModal({
  open,
  setOpen,
  supplier,
  onClose,
}: Props) {
  const { t } = useTranslation();
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
            <h2 className="text-xl font-black uppercase">
              {supplier?.id
                ? t("master.suppliers.modal.edit_title")
                : t("master.suppliers.modal.add_title")}
            </h2>
            <p className="text-tiny font-medium text-gray-400">
              {t("master.suppliers.modal.subtitle")}
            </p>
          </ModalHeader>

          <ModalBody className="py-6">
            {/* Bagian Identitas */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black text-xs uppercase">
                <Building2 size={14} /> {t("master.suppliers.modal.identity")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      label={t("master.suppliers.modal.name")}
                      placeholder="PT. Maju Jaya"
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
                      label={t("master.suppliers.modal.code")}
                      placeholder="SUP-001"
                      startContent={
                        <Hash className="text-gray-400" size={16} />
                      }
                      {...(field as any)}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
                  )}
                />
              </div>
            </section>

            {/* Bagian Kontak */}
            <section className="space-y-4 mt-5">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black text-xs uppercase">
                <Phone size={14} /> {t("master.suppliers.modal.contact")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <PhoneInput
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label={t("master.suppliers.modal.phone")}
                      labelPlacement="inside"
                      value={field.value}
                      variant="faded"
                      onValueChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Input
                      label={t("master.suppliers.modal.email")}
                      placeholder="vendor@mail.com"
                      startContent={
                        <Mail className="text-gray-400" size={16} />
                      }
                      type="email"
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                    />
                  )}
                />
              </div>
            </section>

            {/* Bagian Wilayah */}
            <section className="space-y-4 mt-5">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black text-xs uppercase">
                <MapPin size={14} /> {t("master.suppliers.modal.location")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Controller
                  control={control}
                  name="province_id"
                  render={({ field, fieldState }) => (
                    <Province
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      {...field}
                      labelPlacement="inside"
                      variant="faded"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="city_id"
                  render={({ field, fieldState }) => (
                    <City
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      labelPlacement="inside"
                      variant="faded"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="district_id"
                  render={({ field, fieldState }) => (
                    <District
                      {...field}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      labelPlacement="inside"
                      variant="faded"
                    />
                  )}
                />
              </div>
              <Controller
                control={control}
                name="address"
                render={({ field, fieldState }) => (
                  <Textarea
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("master.suppliers.modal.address")}
                    placeholder="Jl. Industri No. 5..."
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </section>

            {/* Bagian Administrasi */}
            <section className="space-y-4 mt-5">
              <div className="flex items-center gap-2 mb-2 text-gray-400 font-black text-xs uppercase">
                <FileText size={14} /> {t("master.suppliers.modal.legal")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="npwp"
                  render={({ field, fieldState }) => (
                    <NpwpInput
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label={t("master.suppliers.modal.npwp")}
                      value={field.value}
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
                      label={t("master.suppliers.modal.website")}
                      placeholder="https://..."
                      startContent={
                        <Globe className="text-gray-400" size={16} />
                      }
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="p-2 bg-white rounded-sm shadow-sm h-fit">
                    <Info className="text-primary" size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black uppercase  text-gray-500">
                      {t("master.suppliers.modal.active_status")}
                    </span>
                    <p className="text-[10px] text-gray-500 max-w-[280px]">
                      {watch("is_active")
                        ? t("master.suppliers.modal.active_desc")
                        : t("master.suppliers.modal.inactive_desc")}
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
              {t("common.cancel")}
            </Button>
            <Button
              color="primary"
              isLoading={loading}
              startContent={!loading && <Save size={18} />}
              type="submit"
            >
              {supplier?.id
                ? t("master.suppliers.modal.save_changes")
                : t("master.suppliers.modal.save_supplier")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
