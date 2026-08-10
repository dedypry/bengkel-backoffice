import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, Controller, useForm } from "react-hook-form";
import z from "zod";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PhoneInput from "@/components/forms/phone-input";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { IWarehouse } from "@/utils/interfaces/warehouse";
import { getWarehouse } from "@/stores/features/warehouse/warehouse-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";

interface Props {
  open: boolean;
  onOpen: (val: boolean) => void;
  data?: IWarehouse;
}

const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama Gudang wajib diisi"),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
  fax: z.string().optional(),
  npwp: z.string().optional(),
  province_id: z.number().optional().nullable(),
  city_id: z.number().optional().nullable(),
  district_id: z.number().optional().nullable(),
  zipcode: z.string().optional(),
});

type IFormValues = z.infer<typeof schema>;

export default function WarehouseCreateModal({ open, onOpen, data }: Props) {
  const { t } = useTranslation();
  const { warehouseQuery } = useAppSelector((state) => state.warehouse);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { handleSubmit, control, reset } = useForm<IFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      phone_number: "",
      email: "",
      fax: "",
      npwp: "",
      province_id: undefined,
      city_id: undefined,
      district_id: undefined,
      zipcode: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    } else {
      reset({
        id: undefined,
        name: "",
        address: "",
        phone_number: "",
        email: "",
        fax: "",
        npwp: "",
        province_id: undefined,
        city_id: undefined,
        district_id: undefined,
        zipcode: "",
      });
    }
  }, [data]);

  function onSubmit(data: IFormValues) {
    setLoading(true);

    http
      .post("/warehouse", data)
      .then(({ data }) => {
        notify(data.message);
        onOpen(false);
        dispatch(getWarehouse(warehouseQuery));
      })
      .catch(notifyError)
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Modal isOpen={open} scrollBehavior="outside" onOpenChange={onOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>{t("master.warehouses.modal.title")}</ModalHeader>
          <ModalBody className="w-full space-y-2">
            <InputController
              control={control}
              label={t("master.warehouses.modal.name")}
              name="name"
              placeholder={t("master.warehouses.modal.name")}
            />
            <Controller
              control={control}
              name="phone_number"
              render={({ field, fieldState }) => (
                <PhoneInput
                  {...(field as any)}
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error?.message}
                  label={t("master.warehouses.modal.phone")}
                  labelPlacement="outside"
                  placeholder="08xx-xxxx-xxxx"
                  size="sm"
                />
              )}
            />
            <InputController
              control={control}
              label={t("master.warehouses.modal.email")}
              name="email"
              placeholder={t("master.warehouses.modal.email")}
            />
            <Controller
              control={control}
              name="province_id"
              render={({ field, fieldState }) => (
                <Province
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  labelPlacement="outside"
                  size="sm"
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
                  labelPlacement="outside"
                  size="sm"
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
                  labelPlacement="outside"
                  size="sm"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <InputController
              control={control}
              label={t("master.warehouses.modal.postal_code")}
              name="zipcode"
              placeholder={t("master.warehouses.modal.postal_code")}
            />
            <InputController
              control={control}
              label={t("master.warehouses.modal.address")}
              name="address"
              placeholder={t("master.warehouses.modal.address")}
              type="textarea"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              isDisabled={loading}
              variant="flat"
              onPress={() => onOpen(false)}
            >
              {t("common.close")}
            </Button>
            <Button color="primary" isLoading={loading} type="submit">
              {loading ? t("master.warehouses.modal.saving") : t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

function InputController({
  control,
  name,
  label,
  placeholder,
  size = "sm",
  type = "text",
}: {
  control: Control<IFormValues>;
  name: keyof IFormValues;
  label: string;
  placeholder: string;
  size?: "sm" | "md" | "lg";
  type?: "text" | "textarea";
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        if (type === "textarea") {
          return (
            <Textarea
              {...(field as any)}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error?.message}
              label={label}
              labelPlacement="outside"
              placeholder={placeholder}
              size={size as any}
            />
          );
        }

        return (
          <Input
            {...(field as any)}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error?.message}
            label={label}
            labelPlacement="outside"
            placeholder={placeholder}
            size={size as any}
          />
        );
      }}
    />
  );
}
