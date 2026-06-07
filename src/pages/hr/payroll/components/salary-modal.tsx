import type { IEmployeeSalary } from "@/utils/interfaces/IPayroll";

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
  Select,
  SelectItem,
  Switch,
  Autocomplete,
  AutocompleteItem,
  Textarea,
} from "@heroui/react";
import { z } from "zod";
import { Wallet, Save, X } from "lucide-react";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { getSalaries } from "@/stores/features/payroll/payroll-action";
import InputNumber from "@/components/input-number";

export const SALARY_TYPES = [
  { key: "monthly", label: "Bulanan" },
  { key: "weekly", label: "Mingguan" },
  { key: "daily", label: "Harian" },
];

const schema = z.object({
  user_id: z.number({ message: "Karyawan wajib dipilih" }),
  salary_type: z.string().min(1, "Tipe gaji wajib dipilih"),
  base_salary: z.number().min(0, "Gaji pokok tidak valid"),
  allowance: z.number().min(0).optional(),
  deduction: z.number().min(0).optional(),
  note: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  salary?: IEmployeeSalary | null;
  onClose?: () => void;
}

export default function SalaryModal({ open, setOpen, salary, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.employe);
  const { salaryQuery } = useAppSelector((state) => state.payroll);
  const [loading, setLoading] = useState(false);

  const employees = list?.data || [];

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
                {salary?.id ? "Ubah Gaji Karyawan" : "Atur Gaji Karyawan"}
              </h2>
              <p className="text-tiny font-medium text-gray-400">
                Tetapkan gaji pokok, tunjangan, dan potongan tetap.
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
                  label="Karyawan"
                  labelPlacement="inside"
                  placeholder="Pilih karyawan"
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
                          {item.nik || "-"} · {item.department || "Karyawan"}
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
                    label="Tipe Gaji"
                    labelPlacement="inside"
                    selectedKeys={field.value ? [field.value] : []}
                    variant="faded"
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0]?.toString() || "")
                    }
                  >
                    {SALARY_TYPES.map((opt) => (
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
                    label="Gaji Pokok"
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
                    label="Tunjangan Tetap"
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
                    label="Potongan Tetap"
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
                  label="Catatan"
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
                    Gaji Aktif
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
              Batal
            </Button>
            <Button
              color="primary"
              isLoading={loading}
              startContent={!loading && <Save size={18} />}
              type="submit"
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
