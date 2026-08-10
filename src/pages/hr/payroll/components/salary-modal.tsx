import type { IEmployeeSalary } from "@/utils/interfaces/IPayroll";
import type { TFunction } from "i18next";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Switch,
  Autocomplete,
  AutocompleteItem,
  Textarea,
} from "@heroui/react";
import { z } from "zod";
import { Wallet, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { getSalaries } from "@/stores/features/payroll/payroll-action";
import InputNumber from "@/components/input-number";

export const getSalaryTypes = (t: TFunction) => [
  { key: "monthly", label: t("hr.common.monthly") },
  { key: "weekly", label: t("hr.common.weekly") },
  { key: "daily", label: t("hr.common.daily") },
];

const createSalarySchema = (t: TFunction) =>
  z.object({
    user_id: z.number({
      message: t("hr.payroll.validation.employee_required"),
    }),
    salary_type: z
      .string()
      .min(1, t("hr.payroll.validation.salary_type_required")),
    base_salary: z
      .number()
      .min(0, t("hr.payroll.validation.base_salary_invalid")),
    allowance: z.number().min(0).optional(),
    deduction: z.number().min(0).optional(),
    note: z.string().optional(),
    is_active: z.boolean(),
  });

type FormValues = z.infer<ReturnType<typeof createSalarySchema>>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  salary?: IEmployeeSalary | null;
  onClose?: () => void;
}

export default function SalaryModal({ open, setOpen, salary, onClose }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.employe);
  const { salaryQuery } = useAppSelector((state) => state.payroll);
  const [loading, setLoading] = useState(false);

  const employees = list?.data || [];

  const schema = useMemo(() => createSalarySchema(t), [t]);
  const salaryTypes = useMemo(() => getSalaryTypes(t), [t]);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      salary_type: "monthly",
      base_salary: 0,
      allowance: 0,
      deduction: 0,
      is_active: true,
      note: "",
    },
  });

  useEffect(() => {
    if (open && employees.length === 0) {
      dispatch(getEmploye({ page: 1, pageSize: 1000, q: "" }));
    }
  }, [open]);

  useEffect(() => {
    if (open && salary) {
      reset({
        user_id: salary.user_id,
        salary_type: salary.salary_type,
        base_salary: Number(salary.base_salary) || 0,
        allowance: Number(salary.allowance) || 0,
        deduction: Number(salary.deduction) || 0,
        note: salary.note || "",
        is_active: salary.is_active,
      });
    } else if (open) {
      reset({
        salary_type: "monthly",
        base_salary: 0,
        allowance: 0,
        deduction: 0,
        is_active: true,
        note: "",
      });
    }
  }, [salary, open]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    reset();
  };

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    http
      .post("/payrolls/salaries", { ...data, id: salary?.id })
      .then(({ data }) => {
        notify(data.message);
        dispatch(getSalaries(salaryQuery));
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
      <form id="salary-form" onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-sm bg-primary/10 text-primary">
              <Wallet size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black uppercase">
                {salary?.id
                  ? t("hr.payroll.salary_modal_edit")
                  : t("hr.payroll.salary_modal_add")}
              </h2>
              <p className="text-tiny font-medium text-gray-400">
                {t("hr.payroll.salary_modal_subtitle")}
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="py-4">
            <Controller
              control={control}
              name="user_id"
              render={({ field, fieldState }) => (
                <Autocomplete
                  defaultItems={employees}
                  errorMessage={fieldState.error?.message}
                  isDisabled={!!salary?.id}
                  isInvalid={!!fieldState.error}
                  label={t("hr.common.employee")}
                  labelPlacement="inside"
                  placeholder={t("hr.attendance.form_employee_placeholder")}
                  selectedKey={field.value ? field.value.toString() : null}
                  variant="faded"
                  onSelectionChange={(key) =>
                    field.onChange(key ? Number(key) : undefined)
                  }
                >
                  {(item: any) => (
                    <AutocompleteItem key={item.id} textValue={item.name}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-tiny text-gray-400">
                          {item.nik || "-"} ·{" "}
                          {item.department || t("hr.common.employee_fallback")}
                        </span>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="salary_type"
                render={({ field, fieldState }) => (
                  <Select
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("hr.payroll.form_salary_type")}
                    labelPlacement="inside"
                    selectedKeys={field.value ? [field.value] : []}
                    variant="faded"
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0]?.toString() || "")
                    }
                  >
                    {salaryTypes.map((opt) => (
                      <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={control}
                name="base_salary"
                render={({ field, fieldState }) => (
                  <InputNumber
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("hr.payroll.form_base_salary")}
                    labelPlacement="inside"
                    startContent={<span className="text-gray-400">Rp</span>}
                    value={field.value?.toString() ?? ""}
                    variant="faded"
                    onInput={field.onChange}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="allowance"
                render={({ field }) => (
                  <Input
                    label={t("hr.payroll.form_fixed_allowance")}
                    labelPlacement="inside"
                    startContent={<span className="text-gray-400">Rp</span>}
                    type="number"
                    value={field.value?.toString() ?? ""}
                    variant="faded"
                    onValueChange={(v) =>
                      field.onChange(v === "" ? 0 : Number(v))
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="deduction"
                render={({ field }) => (
                  <Input
                    label={t("hr.payroll.form_fixed_deduction")}
                    labelPlacement="inside"
                    startContent={<span className="text-gray-400">Rp</span>}
                    type="number"
                    value={field.value?.toString() ?? ""}
                    variant="faded"
                    onValueChange={(v) =>
                      field.onChange(v === "" ? 0 : Number(v))
                    }
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
                  value={field.value || ""}
                  variant="faded"
                  onValueChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm border border-gray-100">
                  <span className="text-sm font-bold text-gray-600 uppercase">
                    {t("hr.payroll.form_salary_active")}
                  </span>
                  <Switch
                    color="success"
                    isSelected={field.value}
                    onValueChange={field.onChange}
                  />
                </div>
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
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
