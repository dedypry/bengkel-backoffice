import { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { List, Plus, Search, Tags, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/product/product-action";
import { IProductCategory } from "@/utils/interfaces/IProduct";

const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Nama kategori minimal 3 karakter"),
  description: z.string().optional().nullable(),
  is_active: z.boolean(),
  subCategories: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(2, "Nama sub-kategori minimal 2 karakter"),
    }),
  ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  onClose?: (data?: any) => void;
  initialData?: any;
  isCreateSubCategory?: boolean;
}

export default function ModalAddCategory({
  open,
  setOpen,
  onClose,
  initialData,
  isCreateSubCategory = false,
}: Props) {
  const { t } = useTranslation();
  const { categoryQuery } = useAppSelector((state) => state.product);
  const [isLoading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [mainCategoryOptions, setMainCategoryOptions] = useState<
    IProductCategory[]
  >([]);
  const dispatch = useAppDispatch();
  const prevOpenRef = useRef(false);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
      subCategories: [],
    },
  });

  useEffect(() => {
    if (!isCreateSubCategory) {
      return;
    }

    setValue("subCategories", [{ name: "" }]);
  }, [isCreateSubCategory, setValue]);

  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;

    prevOpenRef.current = open;

    if (!justOpened) {
      return;
    }

    setSubCategorySearch("");

    if (initialData) {
      reset({
        id: initialData.id,
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        is_active: initialData.is_active ?? true,
        subCategories: (initialData.children ?? []).map((child: any) => ({
          id: child.id,
          name: child.name ?? "",
        })),
      });

      return;
    }

    reset({
      name: "",
      description: "",
      is_active: true,
      subCategories: [],
    });
  }, [open, initialData, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    http
      .post("/products/categories", data)
      .then(({ data }) => {
        notify(data.message);
        setValue("subCategories", []);
        reset();
        setOpen(false);
        if (onClose) {
          onClose(data?.data);
        } else {
          dispatch(getCategories(categoryQuery));
        }
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });

  const categoryId = watch("id");
  const subCategoryValues = watch("subCategories") ?? [];
  const isEditMode = Boolean(categoryId);

  const visibleSubCategories = fields
    .map((field, index) => ({ field, index }))
    .filter(({ index }) => {
      const keyword = subCategorySearch.trim().toLowerCase();

      if (!keyword) {
        return true;
      }

      return String(subCategoryValues[index]?.name ?? "")
        .toLowerCase()
        .includes(keyword);
    });

  const filteredMainCategories = mainCategoryOptions.filter((category) => {
    const keyword = pickerSearch.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return category.name.toLowerCase().includes(keyword);
  });

  function loadMainCategoryForm(category: IProductCategory) {
    reset({
      id: category.id,
      name: category.name ?? "",
      description: category.description ?? "",
      is_active: category.is_active ?? true,
      subCategories: (category.children ?? []).map((child) => ({
        id: child.id,
        name: child.name ?? "",
      })),
    });
    setPickerSearch("");
    setSubCategorySearch("");
    setPickerOpen(false);
  }

  async function openMainCategoryPicker() {
    try {
      const { data } = await http.get("/products/categories/list");

      setMainCategoryOptions(Array.isArray(data) ? data : []);
      setPickerOpen(true);
    } catch (err) {
      notifyError(err);
    }
  }

  function handleAddSubCategory() {
    append({ name: "" });
  }

  const addSubButton = (
    <Button
      color="primary"
      size="sm"
      startContent={<Plus size={14} />}
      type="button"
      variant="flat"
      onPress={handleAddSubCategory}
    >
      {t("inventory.categories.modal.add_sub")}
    </Button>
  );

  return (
    <>
      <Modal
        backdrop="blur"
        classNames={{
          base: "border border-gray-100 shadow-2xl",
          header: "border-b border-gray-50",
          footer: "border-t border-gray-50",
        }}
        isOpen={open}
        scrollBehavior="outside"
        size="lg"
        onOpenChange={setOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-3 items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Tags className="size-5 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-small text-gray-500 font-black uppercase italic tracking-tight">
                    {isEditMode
                      ? t("inventory.categories.modal.edit_title")
                      : t("inventory.categories.modal.add_title")}
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 normal-case tracking-normal">
                    {t("inventory.categories.modal.subtitle")}
                  </span>
                </div>
              </ModalHeader>

              <ModalBody className="py-6">
                <form
                  className="space-y-6"
                  id="category-form"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        classNames={{
                          label:
                            "text-tiny font-bold text-gray-500 uppercase tracking-wider",
                          inputWrapper:
                            "border-gray-200 group-data-[focus=true]:border-gray-800",
                        }}
                        endContent={
                          <Button
                            isIconOnly
                            aria-label={t(
                              "inventory.categories.modal.pick_main",
                            )}
                            color="primary"
                            size="sm"
                            type="button"
                            variant="light"
                            onPress={openMainCategoryPicker}
                          >
                            <List size={16} />
                          </Button>
                        }
                        errorMessage={errors.name?.message}
                        isInvalid={!!errors.name}
                        label={t("inventory.categories.modal.name")}
                        labelPlacement="outside"
                        placeholder="Contoh: Mesin, Interior, atau Body"
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        classNames={{
                          label:
                            "text-tiny font-bold text-gray-500 uppercase tracking-wider",
                          inputWrapper:
                            "border-gray-200 group-data-[focus=true]:border-gray-800",
                        }}
                        label={t("inventory.categories.modal.description")}
                        labelPlacement="outside"
                        minRows={3}
                        placeholder="Jelaskan jenis produk dalam kategori ini..."
                        value={field.value || ""}
                        variant="bordered"
                        onValueChange={field.onChange}
                      />
                    )}
                  />

                  {/* SECTION SUBCATEGORIES */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-2">
                      <span className="text-sm font-black uppercase text-gray-400">
                        {t("inventory.categories.modal.sub_categories")}
                      </span>
                    </div>

                    {fields.length > 0 ? (
                      <Input
                        isClearable
                        placeholder={t("inventory.categories.modal.sub_search")}
                        size="sm"
                        startContent={
                          <Search className="text-gray-400" size={16} />
                        }
                        value={subCategorySearch}
                        variant="bordered"
                        onClear={() => setSubCategorySearch("")}
                        onValueChange={setSubCategorySearch}
                      />
                    ) : null}

                    {fields.length === 0 && (
                      <div className="py-4 text-center border border-dashed border-gray-200 rounded-sm">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          {t("inventory.categories.modal.no_sub")}
                        </p>
                      </div>
                    )}

                    {fields.length > 0 && visibleSubCategories.length === 0 ? (
                      <div className="py-4 text-center border border-dashed border-gray-200 rounded-sm">
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          {t("inventory.categories.modal.sub_search_empty")}
                        </p>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-3">
                      {visibleSubCategories.map(({ field, index }) => (
                        <div
                          key={field.id}
                          className="flex items-end gap-2 group"
                        >
                          <div className="flex-1">
                            <Controller
                              control={control}
                              name={`subCategories.${index}.name`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  classNames={{
                                    inputWrapper:
                                      "group-data-[focus=true]:border-gray-900",
                                  }}
                                  isInvalid={
                                    !!errors.subCategories?.[index]?.name
                                  }
                                  placeholder={t(
                                    "inventory.categories.modal.sub_placeholder",
                                    {
                                      n: index + 1,
                                    },
                                  )}
                                  radius="sm"
                                  size="sm"
                                  variant="bordered"
                                />
                              )}
                            />
                          </div>
                          <Button
                            isIconOnly
                            className="h-8 w-8"
                            color="danger"
                            radius="sm"
                            size="sm"
                            type="button"
                            variant="flat"
                            onPress={() => remove(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end border-t border-gray-100 pt-3">
                      {addSubButton}
                    </div>
                  </div>
                  {/* <Controller
                  control={control}
                  name="is_active"
                  render={({ field }) => (
                    <Card
                      className="bg-gray-50 border border-gray-100"
                      shadow="none"
                    >
                      <CardBody className="flex flex-row items-center justify-between p-4">
                        <div className="flex gap-3 items-center">
                          <div
                            className={`p-2 rounded-full ${field.value ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-500"}`}
                          >
                            <Power size={16} />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-small font-bold text-gray-800">
                              Status Kategori
                            </p>
                            <p className="text-tiny text-gray-400 font-medium">
                              {field.value
                                ? "Muncul di pilihan produk"
                                : "Disembunyikan dari sistem"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          color="success"
                          isSelected={field.value}
                          size="sm"
                          onValueChange={field.onChange}
                        />
                      </CardBody>
                    </Card>
                  )}
                /> */}
                </form>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="font-bold text-gray-500"
                  variant="light"
                  onPress={onClose}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  color="primary"
                  form="category-form"
                  isLoading={isLoading}
                  onPress={() => handleSubmit(onSubmit)()}
                >
                  {isEditMode
                    ? t("inventory.categories.modal.update")
                    : t("inventory.categories.modal.save")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        backdrop="blur"
        classNames={{
          base: "border border-gray-100 shadow-2xl",
          header: "border-b border-gray-50",
        }}
        isOpen={pickerOpen}
        scrollBehavior="outside"
        size="md"
        onOpenChange={setPickerOpen}
      >
        <ModalContent>
          {(onPickerClose) => (
            <>
              <ModalHeader className="text-small font-black uppercase text-gray-600">
                {t("inventory.categories.modal.pick_main")}
              </ModalHeader>
              <ModalBody className="gap-4 py-4">
                <Input
                  placeholder={t("inventory.categories.modal.pick_main_search")}
                  startContent={<Search className="text-gray-400" size={16} />}
                  value={pickerSearch}
                  variant="bordered"
                  onValueChange={setPickerSearch}
                />

                {filteredMainCategories.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center">
                    <p className="text-tiny font-bold uppercase tracking-widest text-gray-400">
                      {t("inventory.categories.modal.pick_main_empty")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {filteredMainCategories.map((category) => (
                      <Button
                        key={category.id}
                        className="h-auto min-h-12 justify-start px-3 py-3"
                        type="button"
                        variant="flat"
                        onPress={() => loadMainCategoryForm(category)}
                      >
                        <div className="flex w-full flex-col items-start gap-1 text-left">
                          <span className="text-sm font-bold text-gray-800">
                            {category.name}
                          </span>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                            {(category.children || []).length}{" "}
                            {t("inventory.categories.modal.sub_categories")}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onPickerClose}>
                  {t("common.cancel")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
