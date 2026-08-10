import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X, Receipt } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { ExpenseFormValues, createExpenseSchema } from "./schemas";

import InputNumber from "@/components/input-number";
import CustomDatePicker from "@/components/forms/date-picker";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getExpenseCategories } from "@/stores/features/expense/expense-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import FileUploader from "@/components/drop-zone";
import { uploadFile } from "@/utils/helpers/upload-file";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExpenseModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const { categories } = useAppSelector((state) => state.expense);
  const expenseSchema = useMemo(() => createExpenseSchema(t), [t]);

  const hasFetched = useRef(false);
  const isLoading = useRef(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getExpenseCategories());
    }
  }, []);

  const { control, handleSubmit, reset } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (payload: ExpenseFormValues) => {
    isLoading.current = true;
    try {
      if (
        payload.attachment_path?.length > 0 &&
        payload.attachment_path[0] instanceof File
      ) {
        const photo = await uploadFile(payload.attachment_path[0]);

        payload.attachment_path = photo;
      }

      const { data } = await http.post("/expense", payload);

      notify(data.message);
      reset();
      onClose();
    } catch (error) {
      notifyError(error);
    } finally {
      isLoading.current = false;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="outside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex gap-2 items-center">
            <Receipt className="text-rose-500" size={24} />
            {t("finance.expenses.modal_title")}
          </ModalHeader>

          <ModalBody className="py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="title"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("finance.expenses.form_title")}
                    placeholder={t("finance.expenses.form_title_placeholder")}
                  />
                )}
              />

              <Controller
                control={control}
                name="category_id"
                render={({ field, fieldState }) => (
                  <Autocomplete
                    defaultItems={Array.isArray(categories) ? categories : []}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("finance.expenses.form_category")}
                    placeholder={t("finance.expenses.form_category_placeholder")}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  >
                    {(item) => (
                      <AutocompleteItem key={item.id} textValue={item.name}>
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="amount"
                render={({ field, fieldState }) => (
                  <InputNumber
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                    label={t("finance.expenses.form_amount")}
                    placeholder="0"
                    startContent="Rp"
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="date"
                render={({ field, fieldState }) => (
                  <CustomDatePicker
                    label={t("finance.expenses.form_date")}
                    {...(field as any)}
                    errorMessage={fieldState.error?.message}
                    isInvalid={!!fieldState.error}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  {...field}
                  label={t("finance.expenses.form_notes")}
                  placeholder={t("finance.expenses.form_notes_placeholder")}
                />
              )}
            />
            <Controller
              control={control}
              name="attachment_path"
              render={({ field }) => (
                <FileUploader
                  maxFiles={1}
                  value={field.value}
                  onFileSelect={field.onChange}
                />
              )}
            />
          </ModalBody>

          <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
            <Button
              startContent={<X size={18} />}
              variant="flat"
              onPress={onClose}
            >
              {t("common.cancel")}
            </Button>
            <Button
              color="primary"
              isLoading={isLoading.current}
              radius="sm"
              startContent={!isLoading.current && <Save size={18} />}
              type="submit"
            >
              {t("finance.expenses.save_transaction")}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
