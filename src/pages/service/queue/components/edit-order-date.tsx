import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CalendarDays, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import CustomDatePicker from "@/components/forms/date-picker";
import { usePermission } from "@/components/use-permission";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

const schema = z.object({
  created_at: z.string().min(1, "Tanggal wajib diisi"),
});

type TOrderDateForm = z.output<typeof schema>;

export default function EditOrderDate() {
  const { t } = useTranslation();
  const { detail: data } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermission();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canUpdate = hasPermission("wo.update");

  const canEdit =
    canUpdate &&
    data?.progress !== "finish" &&
    !["cancel", "closed"].includes(data?.status || "");

  const { control, reset, handleSubmit } = useForm<TOrderDateForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      created_at: dayjs().format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    if (!open || !data?.created_at) return;

    reset({
      created_at: dayjs(data.created_at).format("YYYY-MM-DD"),
    });
  }, [open, data, reset]);

  if (!data?.created_at) return null;

  const formattedDate = new Date(data.created_at).toLocaleDateString("id-ID", {
    dateStyle: "full",
  });

  const onSubmit = (values: TOrderDateForm) => {
    if (!data?.id) return;

    setIsLoading(true);
    http
      .patch(`/work-order/order-date/${data.id}`, {
        created_at: values.created_at,
      })
      .then(({ data: response }) => {
        notify(response.message || t("service.edit_order_date.success"));
        dispatch(getWoDetail(data.id));
        setOpen(false);
      })
      .catch((error) => notifyError(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Modal isOpen={open} size="md" onOpenChange={setOpen}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <div className="flex items-center gap-2 text-primary font-bold">
                <CalendarDays className="size-5" />
                <h5 className="font-bold">{t("service.edit_order_date.title")}</h5>
              </div>
            </ModalHeader>
            <ModalBody>
              <Controller
                control={control}
                name="created_at"
                render={({ field, fieldState }) => (
                  <CustomDatePicker
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                    label={t("service.edit_order_date.label")}
                    labelPlacement="outside"
                    maxDate={new Date()}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={() => setOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                startContent={!isLoading ? <Save size={16} /> : undefined}
                type="submit"
              >
                {t("common.save")}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <div className="flex items-center gap-2">
        <CalendarDays className="text-gray-400" size={14} />
        <span>{formattedDate}</span>
        {canEdit && (
          <Button
            isIconOnly
            className="min-w-6 w-6 h-6"
            color="warning"
            size="sm"
            variant="light"
            onPress={() => setOpen(true)}
          >
            <Edit size={14} />
          </Button>
        )}
      </div>
    </>
  );
}
