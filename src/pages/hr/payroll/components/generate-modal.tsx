import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { CalendarRange, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getPayrolls,
  getPayrollSummary,
} from "@/stores/features/payroll/payroll-action";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

interface FormValues {
  period_type: string;
  period_start: string;
  period_end: string;
  note?: string;
}

function defaultRange(type: string) {
  const now = dayjs();

  if (type === "weekly") {
    return {
      period_start: now.startOf("week").format("YYYY-MM-DD"),
      period_end: now.endOf("week").format("YYYY-MM-DD"),
    };
  }

  return {
    period_start: now.startOf("month").format("YYYY-MM-DD"),
    period_end: now.endOf("month").format("YYYY-MM-DD"),
  };
}

export default function GeneratePayrollModal({ open, setOpen }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { payrollQuery } = useAppSelector((state) => state.payroll);
  const [loading, setLoading] = useState(false);

  const periodTypes = useMemo(
    () => [
      { key: "monthly", label: t("hr.common.monthly") },
      { key: "weekly", label: t("hr.common.weekly") },
    ],
    [t],
  );

  const { handleSubmit, control, reset, watch, setValue } = useForm<FormValues>(
    {
      defaultValues: {
        period_type: "monthly",
        ...defaultRange("monthly"),
        note: "",
      },
    },
  );

  const periodType = watch("period_type");

  useEffect(() => {
    if (open) {
      reset({
        period_type: "monthly",
        ...defaultRange("monthly"),
        note: "",
      });
    }
  }, [open]);

  useEffect(() => {
    if (periodType) {
      const range = defaultRange(periodType);

      setValue("period_start", range.period_start);
      setValue("period_end", range.period_end);
    }
  }, [periodType]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    http
      .post("/payrolls/generate", data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPayrolls(payrollQuery));
        dispatch(getPayrollSummary());
        handleClose();
        if (data.data?.id) navigate(`/hr/payroll/${data.data.id}`);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={open}
      scrollBehavior="outside"
      size="2xl"
      onOpenChange={handleClose}
    >
      <form id="generate-form" onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-sm bg-primary/10 text-primary">
              <CalendarRange size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black uppercase">
                {t("hr.payroll.generate_modal_title")}
              </h2>
              <p className="text-tiny font-medium text-gray-400">
                {t("hr.payroll.generate_modal_subtitle")}
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="py-4">
            <Controller
              control={control}
              name="period_type"
              render={({ field }) => (
                <Select
                  label={t("hr.payroll.form_period_type")}
                  labelPlacement="inside"
                  selectedKeys={field.value ? [field.value] : []}
                  variant="faded"
                  onSelectionChange={(keys) =>
                    field.onChange(Array.from(keys)[0]?.toString() || "")
                  }
                >
                  {periodTypes.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="period_start"
                render={({ field }) => (
                  <Input
                    label={t("hr.payroll.form_period_start")}
                    labelPlacement="inside"
                    type="date"
                    value={field.value}
                    variant="faded"
                    onValueChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="period_end"
                render={({ field }) => (
                  <Input
                    label={t("hr.payroll.form_period_end")}
                    labelPlacement="inside"
                    type="date"
                    value={field.value}
                    variant="faded"
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name="note"
              render={({ field }) => (
                <Textarea
                  label={t("common.notes")}
                  labelPlacement="inside"
                  placeholder={t("hr.payroll.form_notes_placeholder")}
                  value={field.value || ""}
                  variant="faded"
                  onValueChange={field.onChange}
                />
              )}
            />
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
              {t("hr.payroll.process_payroll")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
