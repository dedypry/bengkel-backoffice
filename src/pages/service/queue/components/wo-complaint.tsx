import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { usePermission } from "@/components/use-permission";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWoDetail } from "@/stores/features/work-order/wo-action";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

const schema = z.object({
  complaints: z.string(),
});

type TWoComplaint = z.output<typeof schema>;

export default function WoComplaint() {
  const { t } = useTranslation();
  const { detail: data } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermission();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canUpdate = hasPermission("wo.update");

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TWoComplaint>({
    resolver: zodResolver(schema),
    defaultValues: {
      complaints: "",
    },
  });

  useEffect(() => {
    if (!open || !data) return;

    reset({
      complaints: data.complaints || "",
    });
  }, [open, data, reset]);

  if (!canUpdate || ["cancel", "closed"].includes(data?.status || "")) {
    return null;
  }

  const onSubmit = (values: TWoComplaint) => {
    if (!data?.id) return;

    setIsLoading(true);
    http
      .patch(`/work-order/complaint/${data.id}`, {
        complaints: values.complaints.trim(),
      })
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
        size="2xl"
        onOpenChange={setOpen}
      >
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <div className="flex items-center gap-2 text-primary font-bold">
                <AlertCircle className="size-5" />
                <h5 className="font-bold">
                  {t("service.edit_complaint.title")}
                </h5>
              </div>
            </ModalHeader>
            <ModalBody>
              <Controller
                control={control}
                name="complaints"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    errorMessage={errors.complaints?.message}
                    isInvalid={!!errors.complaints}
                    label={t("service.edit_complaint.label")}
                    labelPlacement="outside"
                    minRows={6}
                    placeholder={t("service.edit_complaint.placeholder")}
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
