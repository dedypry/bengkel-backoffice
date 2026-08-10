import type { IAttendance } from "@/utils/interfaces/IAttendance";
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
  Textarea,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { z } from "zod";
import dayjs from "dayjs";
import { CalendarClock, Save, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getEmploye } from "@/stores/features/employe/employe-action";
import {
  getAttendance,
  getAttendanceSummary,
} from "@/stores/features/attendance/attendance-action";

const createManualAttendanceSchema = (t: TFunction) =>
  z.object({
    user_id: z.number({
      message: t("hr.attendance.validation.employee_required"),
    }),
    date: z.string().min(1, t("hr.attendance.validation.date_required")),
    check_in: z.string().optional().or(z.literal("")),
    check_out: z.string().optional().or(z.literal("")),
    status: z.string().optional().or(z.literal("")),
    note: z.string().optional(),
  });

type FormValues = z.infer<ReturnType<typeof createManualAttendanceSchema>>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  attendance?: IAttendance | null;
  onClose?: () => void;
}

export default function ManualAttendanceModal({
  open,
  setOpen,
  attendance,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.employe);
  const { attendanceQuery } = useAppSelector((state) => state.attendance);
  const [loading, setLoading] = useState(false);

  const employees = list?.data || [];

  const schema = useMemo(() => createManualAttendanceSchema(t), [t]);

  const statusOptions = useMemo(
    () => [
      { key: "present", label: t("hr.common.status_present") },
      { key: "late", label: t("hr.common.status_late") },
      { key: "permit", label: t("hr.common.status_permit") },
      { key: "sick", label: t("hr.common.status_sick") },
      { key: "leave", label: t("hr.common.status_leave") },
      { key: "absent", label: t("hr.common.status_absent") },
    ],
    [t],
  );

  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: dayjs().format("YYYY-MM-DD"),
      status: "present",
      check_in: "",
      check_out: "",
      note: "",
    },
  });

  useEffect(() => {
    if (open && employees.length === 0) {
      dispatch(getEmploye({ page: 1, pageSize: 1000, q: "" }));
    }
  }, [open]);

  useEffect(() => {
    if (open && attendance) {
      reset({
        user_id: attendance.user_id,
        date: attendance.date
          ? dayjs(attendance.date).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
        check_in: attendance.check_in
          ? dayjs(attendance.check_in).format("HH:mm")
          : "",
        check_out: attendance.check_out
          ? dayjs(attendance.check_out).format("HH:mm")
          : "",
        status: attendance.status,
        note: attendance.note || "",
      });
    } else if (open) {
      reset({
        date: attendanceQuery.date || dayjs().format("YYYY-MM-DD"),
        status: "present",
        check_in: "",
        check_out: "",
        note: "",
      });
    }
  }, [attendance, open]);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    reset();
  };

  const onSubmit = (data: FormValues) => {
    setLoading(true);
    http
      .post("/attendances", {
        ...data,
        id: attendance?.id,
      })
      .then(({ data }) => {
        notify(data.message);
        dispatch(getAttendance(attendanceQuery));
        dispatch(getAttendanceSummary({ date: attendanceQuery.date }));
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
      <form id="attendance-form" onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-sm bg-primary/10 text-primary">
              <CalendarClock size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-black uppercase">
                {attendance?.id
                  ? t("hr.attendance.manual_modal_edit")
                  : t("hr.attendance.manual_modal_add")}
              </h2>
              <p className="text-tiny font-medium text-gray-400">
                {t("hr.attendance.manual_modal_subtitle")}
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
                  isDisabled={!!attendance?.id}
                  isInvalid={!!fieldState.error}
                  label={t("hr.attendance.form_employee")}
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
                name="date"
                render={({ field, fieldState }) => (
                  <Input
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("common.date")}
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
                name="status"
                render={({ field }) => (
                  <Select
                    label={t("hr.attendance.form_status")}
                    labelPlacement="inside"
                    selectedKeys={field.value ? [field.value] : []}
                    variant="faded"
                    onSelectionChange={(keys) =>
                      field.onChange(Array.from(keys)[0]?.toString() || "")
                    }
                  >
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="check_in"
                render={({ field }) => (
                  <Input
                    label={t("hr.attendance.form_check_in")}
                    labelPlacement="inside"
                    type="time"
                    value={field.value || ""}
                    variant="faded"
                    onValueChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="check_out"
                render={({ field }) => (
                  <Input
                    label={t("hr.attendance.form_check_out")}
                    labelPlacement="inside"
                    type="time"
                    value={field.value || ""}
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
                  label={t("hr.attendance.form_notes")}
                  labelPlacement="inside"
                  placeholder={t("hr.attendance.form_notes_placeholder")}
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
              {t("common.save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
