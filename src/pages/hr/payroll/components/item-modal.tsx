import type { IPayrollItem } from "@/utils/interfaces/IPayroll";

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
  Textarea,
} from "@heroui/react";
import { Pencil, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { http } from "@/utils/libs/axios";
import { formatIDR } from "@/utils/helpers/format";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getPayrollDetail } from "@/stores/features/payroll/payroll-action";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  item?: IPayrollItem | null;
  payrollId: number;
  onClose?: () => void;
}

interface FormValues {
  base_salary: number | string;
  allowance: number | string;
  overtime_amount: number | string;
  bonus: number | string;
  deduction: number | string;
  note?: string;
}

export default function ItemModal({
  open,
  setOpen,
  item,
  payrollId,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const moneyFields = useMemo(
    () =>
      [
        { name: "base_salary" as const, label: t("hr.payroll.form_base_salary") },
        { name: "allowance" as const, label: t("hr.payroll.form_allowance") },
        { name: "overtime_amount" as const, label: t("hr.payroll.form_overtime") },
        { name: "bonus" as const, label: t("hr.payroll.form_bonus") },
        { name: "deduction" as const, label: t("hr.payroll.form_deduction") },
      ] as const,
    [t],
  );

  const { handleSubmit, control, reset, watch } = useForm<FormValues>({
    defaultValues: {
      base_salary: 0,
      allowance: 0,
      overtime_amount: 0,
      bonus: 0,
      deduction: 0,
      note: "",
    },
  });

  useEffect(() => {
    if (open && item) {
      reset({
        base_salary: Number(item.base_salary) || 0,
        allowance: Number(item.allowance) || 0,
        overtime_amount: Number(item.overtime_amount) || 0,
        bonus: Number(item.bonus) || 0,
        deduction: Number(item.deduction) || 0,
        note: item.note || "",
      });
    }
  }, [item, open]);

  const values = watch();
  const net =
    Number(values.base_salary || 0) +
    Number(values.allowance || 0) +
    Number(values.overtime_amount || 0) +
    Number(values.bonus || 0) -
    Number(values.deduction || 0);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    reset();
  };

  const onSubmit = (data: FormValues) => {
    if (!item) return;
    setLoading(true);
    http
      .patch(`/payrolls/items/${item.id}`, data)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getPayrollDetail(payrollId.toString()));
        handleClose();
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
      <form id="item-form" onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-sm bg-primary/10 text-primary">
              <Pencil size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black uppercase">
                {item?.user?.name || t("hr.payroll.item_modal_title")}
              </h2>
              <p className="text-tiny font-medium text-gray-400">
                {t("hr.payroll.item_modal_subtitle")}
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moneyFields.map(({ name, label }) => (
                <Controller
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input
                      label={label}
                      labelPlacement="inside"
                      startContent={<span className="text-gray-400">Rp</span>}
                      type="number"
                      value={field.value?.toString() ?? ""}
                      variant="faded"
                      onValueChange={field.onChange}
                    />
                  )}
                />
              ))}
            </div>

            <Controller
              control={control}
              name="note"
              render={({ field }) => (
                <Textarea
                  label={t("common.notes")}
                  labelPlacement="inside"
                  value={field.value || ""}
                  variant="faded"
                  onValueChange={field.onChange}
                />
              )}
            />

            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-sm border border-primary/10">
              <span className="text-sm font-bold text-gray-600 uppercase">
                {t("hr.payroll.net_salary")}
              </span>
              <span className="text-xl font-black text-primary">
                {formatIDR(net)}
              </span>
            </div>
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
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
