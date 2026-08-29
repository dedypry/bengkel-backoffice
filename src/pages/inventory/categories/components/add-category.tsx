import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
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
  Chip,
} from "@heroui/react";
import {
  List,
  Plus,
  Search,
  Tags,
  Trash2,
  AlertCircle,
  ArrowRightLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/product/product-action";
import { IProductCategory } from "@/utils/interfaces/IProduct";
import debounce from "@/utils/helpers/debounce";

const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Nama kategori minimal 3 karakter"),
  description: z.string().optional().nullable(),
  is_active: z.boolean(),
  subCategories: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(2, "Nama sub-kategori minimal 2 karakter"),
      total_product: z.number().optional(),
    }),
  ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type SubCategoryFormItem = CategoryFormValues["subCategories"][number];

type BlockedSubCategory = {
  id: number;
  name: string;
  productCount: number;
};

function parseProductCount(value: unknown) {
  const count = Number(value ?? 0);

  return Number.isFinite(count) ? count : 0;
}

function buildProductCountMap(items: SubCategoryFormItem[]) {
  return items.reduce<Record<number, number>>((acc, item) => {
    if (item.id) {
      acc[item.id] = parseProductCount(item.total_product);
    }

    return acc;
  }, {});
}

function mergeProductCountMap(
  current: Record<number, number>,
  items: Array<{
    id: number;
    productCount?: number;
    total_product?: unknown;
  }>,
) {
  const next = { ...current };

  items.forEach((item) => {
    next[item.id] = parseProductCount(item.productCount ?? item.total_product);
  });

  return next;
}

function resolveSubCategoryProductCount(
  item: SubCategoryFormItem | undefined,
  productCountById: Record<number, number>,
) {
  if (!item) {
    return 0;
  }

  if (item.id && productCountById[item.id] !== undefined) {
    return productCountById[item.id];
  }

  return parseProductCount(item.total_product);
}

function getDuplicateGroups(subCategories: Array<{ name?: string | null }>) {
  const grouped = new Map<string, number[]>();

  subCategories.forEach((item, index) => {
    const key = item.name?.trim().toLowerCase();

    if (!key) {
      return;
    }

    const indexes = grouped.get(key) ?? [];

    indexes.push(index);
    grouped.set(key, indexes);
  });

  return Array.from(grouped.entries())
    .filter(([, indexes]) => indexes.length > 1)
    .map(([key, indexes]) => ({
      key,
      displayName: subCategories[indexes[0]]?.name?.trim() || key,
      indexes,
    }));
}

function findDuplicateSubCategoryIndexes(
  subCategories: Array<{ name?: string | null }>,
) {
  const duplicateIndexes = new Set<number>();

  getDuplicateGroups(subCategories).forEach((group) => {
    group.indexes.forEach((index) => duplicateIndexes.add(index));
  });

  return duplicateIndexes;
}

function pickBestDuplicateIndex(
  indexes: number[],
  subCategories: SubCategoryFormItem[],
  productCountById: Record<number, number>,
) {
  return indexes.reduce((bestIndex, currentIndex) => {
    const currentCount = resolveSubCategoryProductCount(
      subCategories[currentIndex],
      productCountById,
    );
    const bestCount = resolveSubCategoryProductCount(
      subCategories[bestIndex],
      productCountById,
    );

    if (currentCount > bestCount) {
      return currentIndex;
    }

    if (currentCount === bestCount && currentIndex < bestIndex) {
      return currentIndex;
    }

    return bestIndex;
  }, indexes[0]);
}

function mapSubCategoriesFromCategory(children: IProductCategory[] = []) {
  return [...children]
    .sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? "", "id", {
        sensitivity: "base",
      }),
    )
    .map((child) => ({
      id: child.id,
      name: child.name ?? "",
      total_product: parseProductCount(child.total_product),
    }));
}

function buildCategoryPayload(data: CategoryFormValues) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    is_active: data.is_active,
    subCategories: data.subCategories.map(({ id, name }) => ({
      ...(id ? { id } : {}),
      name,
    })),
  };
}

function mergeBlockedSubCategories(
  current: SubCategoryFormItem[],
  blocked: BlockedSubCategory[],
  source: SubCategoryFormItem[],
) {
  const merged = [...current];
  const existingIds = new Set(
    merged.filter((item) => item.id).map((item) => item.id),
  );

  blocked.forEach((blockedItem) => {
    if (existingIds.has(blockedItem.id)) {
      const index = merged.findIndex((item) => item.id === blockedItem.id);

      if (index >= 0) {
        merged[index] = {
          ...merged[index],
          name: blockedItem.name,
          total_product: blockedItem.productCount,
        };
      }

      return;
    }

    const fromSource = source.find((item) => item.id === blockedItem.id);

    merged.push(
      fromSource ?? {
        id: blockedItem.id,
        name: blockedItem.name,
        total_product: blockedItem.productCount,
      },
    );
    existingIds.add(blockedItem.id);
  });

  return merged;
}

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
  const [duplicateKeepSelections, setDuplicateKeepSelections] = useState<
    Record<string, number>
  >({});
  const [blockedSubCategories, setBlockedSubCategories] = useState<
    BlockedSubCategory[]
  >([]);
  const [keepAllDuplicates, setKeepAllDuplicates] = useState(false);
  const [productCountById, setProductCountById] = useState<
    Record<number, number>
  >({});
  const [mainCategoryOptions, setMainCategoryOptions] = useState<
    IProductCategory[]
  >([]);
  const dispatch = useAppDispatch();
  const prevOpenRef = useRef(false);
  const originalSubCategoriesRef = useRef<SubCategoryFormItem[]>([]);

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

  async function loadCategoryForEdit(category: IProductCategory) {
    const fallbackSubCategories = mapSubCategoriesFromCategory(
      category.children ?? [],
    );

    reset({
      id: category.id,
      name: category.name ?? "",
      description: category.description ?? "",
      is_active: category.is_active ?? true,
      subCategories: fallbackSubCategories,
    });
    originalSubCategoriesRef.current = fallbackSubCategories;
    setProductCountById(buildProductCountMap(fallbackSubCategories));

    try {
      const { data } = await http.get(`/products/categories/${category.id}`);
      const subCategories = mapSubCategoriesFromCategory(data.children ?? []);

      originalSubCategoriesRef.current = subCategories;
      setProductCountById(buildProductCountMap(subCategories));
      reset({
        id: category.id,
        name: data.name ?? category.name ?? "",
        description: data.description ?? category.description ?? "",
        is_active: data.is_active ?? category.is_active ?? true,
        subCategories,
      });
    } catch (err) {
      notifyError(err);
    }
  }

  useEffect(() => {
    if (blockedSubCategories.length === 0) {
      return;
    }

    setProductCountById((prev) =>
      mergeProductCountMap(prev, blockedSubCategories),
    );
  }, [blockedSubCategories]);

  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;

    prevOpenRef.current = open;

    if (!justOpened) {
      return;
    }

    setSubCategorySearch("");
    setBlockedSubCategories([]);
    setKeepAllDuplicates(false);
    setProductCountById({});
    setDebouncedSubCategoryValues([]);
    subCategoryLengthRef.current = 0;

    if (initialData?.id) {
      void loadCategoryForEdit(initialData);

      return;
    }

    if (initialData) {
      const subCategories = mapSubCategoriesFromCategory(
        initialData.children ?? [],
      );

      originalSubCategoriesRef.current = subCategories;
      setProductCountById(buildProductCountMap(subCategories));
      reset({
        id: initialData.id,
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        is_active: initialData.is_active ?? true,
        subCategories,
      });

      return;
    }

    originalSubCategoriesRef.current = [];

    reset({
      name: "",
      description: "",
      is_active: true,
      subCategories: [],
    });
  }, [open, initialData, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    const duplicateIndexes = findDuplicateSubCategoryIndexes(
      data.subCategories,
    );

    if (!keepAllDuplicates && duplicateIndexes.size > 0) {
      notify(t("inventory.categories.modal.sub_duplicate_banner"), "warning");

      return;
    }

    setLoading(true);
    http
      .post("/products/categories", buildCategoryPayload(data))
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
      .catch((err) => {
        const blocked = err?.response?.data?.data?.blockedSubCategories;

        if (Array.isArray(blocked) && blocked.length > 0) {
          const restored = mergeBlockedSubCategories(
            data.subCategories,
            blocked,
            originalSubCategoriesRef.current,
          );

          setValue("subCategories", restored, { shouldValidate: true });
          setBlockedSubCategories(blocked);
          setProductCountById((prev) => mergeProductCountMap(prev, blocked));
          notify(
            t("inventory.categories.modal.sub_restored_banner", {
              count: blocked.length,
            }),
            "warning",
          );
        }

        notifyError(err);
      })
      .finally(() => setLoading(false));
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });

  const categoryId = watch("id");
  const subCategoryValues = useWatch({ control, name: "subCategories" }) ?? [];
  const [debouncedSubCategoryValues, setDebouncedSubCategoryValues] = useState<
    SubCategoryFormItem[]
  >([]);
  const subCategoryLengthRef = useRef(0);

  const debouncedSyncSubCategories = useMemo(
    () =>
      debounce((values: SubCategoryFormItem[]) => {
        setDebouncedSubCategoryValues(values);
      }, 400),
    [],
  );

  useEffect(() => {
    const lengthChanged =
      subCategoryValues.length !== subCategoryLengthRef.current;

    subCategoryLengthRef.current = subCategoryValues.length;

    if (lengthChanged) {
      setDebouncedSubCategoryValues(subCategoryValues);

      return;
    }

    debouncedSyncSubCategories(subCategoryValues);
  }, [subCategoryValues, debouncedSyncSubCategories]);

  const subCategoriesForDuplicateCheck =
    debouncedSubCategoryValues.length > 0
      ? debouncedSubCategoryValues
      : subCategoryValues;

  const isEditMode = Boolean(categoryId);

  const duplicateSubCategoryIndexes = useMemo(
    () => findDuplicateSubCategoryIndexes(subCategoriesForDuplicateCheck),
    [subCategoriesForDuplicateCheck],
  );

  const duplicateGroups = useMemo(
    () => getDuplicateGroups(subCategoriesForDuplicateCheck),
    [subCategoriesForDuplicateCheck],
  );

  const hasDuplicateSubCategories = duplicateSubCategoryIndexes.size > 0;

  const blockedSubCategoryIds = useMemo(
    () => new Set(blockedSubCategories.map((item) => item.id)),
    [blockedSubCategories],
  );

  const duplicateGroupsSignature = useMemo(
    () =>
      duplicateGroups
        .map((group) => `${group.key}:${group.indexes.join(",")}`)
        .join("|"),
    [duplicateGroups],
  );

  const prevDuplicateGroupsSignatureRef = useRef("");

  useEffect(() => {
    if (
      prevDuplicateGroupsSignatureRef.current &&
      prevDuplicateGroupsSignatureRef.current !== duplicateGroupsSignature
    ) {
      setKeepAllDuplicates(false);
    }

    prevDuplicateGroupsSignatureRef.current = duplicateGroupsSignature;
  }, [duplicateGroupsSignature]);

  useEffect(() => {
    if (duplicateGroups.length === 0) {
      setDuplicateKeepSelections({});

      return;
    }

    setDuplicateKeepSelections((prev) => {
      const next: Record<string, number> = {};

      duplicateGroups.forEach((group) => {
        const existing = prev[group.key];

        if (existing !== undefined && group.indexes.includes(existing)) {
          next[group.key] = existing;

          return;
        }

        next[group.key] = pickBestDuplicateIndex(
          group.indexes,
          subCategoriesForDuplicateCheck,
          productCountById,
        );
      });

      return next;
    });
  }, [duplicateGroups, subCategoriesForDuplicateCheck, productCountById]);

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
    setBlockedSubCategories([]);
    setKeepAllDuplicates(false);
    setPickerSearch("");
    setSubCategorySearch("");
    setPickerOpen(false);
    void loadCategoryForEdit(category);
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

  function handleRemoveDuplicateSubCategories() {
    setKeepAllDuplicates(false);

    if (duplicateGroups.length === 0) {
      return;
    }

    const indexesToRemove = new Set<number>();

    duplicateGroups.forEach((group) => {
      const keepIndex =
        duplicateKeepSelections[group.key] ??
        pickBestDuplicateIndex(
          group.indexes,
          subCategoriesForDuplicateCheck,
          productCountById,
        );

      group.indexes.forEach((index) => {
        if (index !== keepIndex) {
          indexesToRemove.add(index);
        }
      });
    });

    const blockedRemovals = Array.from(indexesToRemove).filter(
      (index) =>
        resolveSubCategoryProductCount(
          subCategoryValues[index],
          productCountById,
        ) > 0,
    );

    if (blockedRemovals.length > 0) {
      const details = blockedRemovals
        .map((index) => {
          const item = subCategoryValues[index];

          return `"${item?.name ?? "-"}" (${resolveSubCategoryProductCount(item, productCountById)} ${t("inventory.categories.modal.sub_product_unit")})`;
        })
        .join(", ");

      notify(
        t("inventory.categories.modal.sub_duplicate_blocked", {
          names: details,
        }),
        "warning",
      );

      return;
    }

    const deduped = subCategoryValues.filter(
      (_, index) => !indexesToRemove.has(index),
    );
    const removedCount = subCategoryValues.length - deduped.length;

    if (removedCount === 0) {
      return;
    }

    setValue("subCategories", deduped, { shouldValidate: true });
    notify(
      t("inventory.categories.modal.sub_duplicates_removed", {
        count: removedCount,
      }),
    );
  }

  function handleKeepAllDuplicates() {
    setKeepAllDuplicates(true);
    notify(t("inventory.categories.modal.sub_keep_all_confirmed"));
  }

  function applyMovedProductCounts(
    fromCategoryId: number,
    toCategoryId: number,
    movedCount: number,
  ) {
    if (movedCount <= 0) {
      return;
    }

    setProductCountById((prev) => {
      const fromCount = prev[fromCategoryId] ?? 0;
      const toCount = prev[toCategoryId] ?? 0;

      return {
        ...prev,
        [fromCategoryId]: Math.max(0, fromCount - movedCount),
        [toCategoryId]: toCount + movedCount,
      };
    });

    setValue(
      "subCategories",
      subCategoryValues.map((item) => {
        if (item.id === fromCategoryId) {
          return {
            ...item,
            total_product: Math.max(
              0,
              resolveSubCategoryProductCount(item, productCountById) -
                movedCount,
            ),
          };
        }

        if (item.id === toCategoryId) {
          return {
            ...item,
            total_product:
              resolveSubCategoryProductCount(item, productCountById) +
              movedCount,
          };
        }

        return item;
      }),
      { shouldValidate: true },
    );

    setBlockedSubCategories((prev) =>
      prev
        .map((item) => {
          if (item.id === fromCategoryId) {
            return {
              ...item,
              productCount: Math.max(0, item.productCount - movedCount),
            };
          }

          if (item.id === toCategoryId) {
            return {
              ...item,
              productCount: item.productCount + movedCount,
            };
          }

          return item;
        })
        .filter((item) => item.productCount > 0),
    );
  }

  function handleMoveProducts(
    fromCategoryId: number,
    toCategoryId: number,
    productCount: number,
  ) {
    setLoading(true);
    http
      .post("/products/categories/move-products", {
        fromCategoryId,
        toCategoryId,
      })
      .then(({ data }) => {
        const movedCount = Number(data?.data?.movedCount ?? productCount);

        applyMovedProductCounts(fromCategoryId, toCategoryId, movedCount);
        notify(
          data?.message ||
            t("inventory.categories.modal.sub_move_products_success", {
              count: movedCount,
            }),
        );
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  function getDuplicateGroupKey(index: number) {
    const key = subCategoriesForDuplicateCheck[index]?.name
      ?.trim()
      .toLowerCase();

    if (!key) {
      return null;
    }

    const group = duplicateGroups.find((item) => item.key === key);

    return group ? group.key : null;
  }

  function isDuplicateKeepTarget(index: number) {
    const groupKey = getDuplicateGroupKey(index);

    if (!groupKey) {
      return false;
    }

    const group = duplicateGroups.find((item) => item.key === groupKey);

    if (!group) {
      return false;
    }

    const keepIndex =
      duplicateKeepSelections[groupKey] ??
      pickBestDuplicateIndex(
        group.indexes,
        subCategoriesForDuplicateCheck,
        productCountById,
      );

    return keepIndex === index;
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
        isDismissable={!isLoading}
        isKeyboardDismissDisabled={isLoading}
        isOpen={open}
        scrollBehavior="outside"
        size="lg"
        onOpenChange={(nextOpen) => {
          if (!nextOpen && isLoading) {
            return;
          }

          setOpen(nextOpen);
        }}
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

                    {blockedSubCategories.length > 0 ? (
                      <div className="flex flex-col gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-3">
                        <div className="flex items-start gap-2 text-xs text-danger-700">
                          <AlertCircle className="mt-0.5 size-4 shrink-0" />
                          <p>
                            {t("inventory.categories.modal.sub_blocked_banner")}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {blockedSubCategories.map((item) => (
                            <Chip
                              key={item.id}
                              classNames={{
                                content: "text-[10px] font-bold",
                              }}
                              color="danger"
                              size="sm"
                              variant="flat"
                            >
                              {item.name} ({item.productCount}{" "}
                              {t("inventory.categories.modal.sub_product_unit")}
                              )
                            </Chip>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {hasDuplicateSubCategories ? (
                      <div
                        className={`flex flex-col gap-3 rounded-lg border px-3 py-3 ${
                          keepAllDuplicates
                            ? "border-success-200 bg-success-50"
                            : "border-warning-200 bg-warning-50"
                        }`}
                      >
                        <div
                          className={`flex items-start gap-2 text-xs ${
                            keepAllDuplicates
                              ? "text-success-700"
                              : "text-warning-700"
                          }`}
                        >
                          <AlertCircle className="mt-0.5 size-4 shrink-0" />
                          <p>
                            {keepAllDuplicates
                              ? t(
                                  "inventory.categories.modal.sub_keep_all_active",
                                )
                              : t(
                                  "inventory.categories.modal.sub_duplicate_banner",
                                )}
                          </p>
                        </div>

                        {!keepAllDuplicates ? (
                          <div className="space-y-3">
                            {duplicateGroups.map((group) => (
                              <div
                                key={group.key}
                                className="rounded-lg border border-warning-100 bg-white/70 p-3"
                              >
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-warning-800">
                                  {t(
                                    "inventory.categories.modal.sub_duplicate_group",
                                    {
                                      name: group.displayName,
                                      count: group.indexes.length,
                                    },
                                  )}
                                </p>
                                <div className="space-y-2">
                                  {group.indexes.map((index) => {
                                    const item = subCategoryValues[index];
                                    const productCount =
                                      resolveSubCategoryProductCount(
                                        item,
                                        productCountById,
                                      );
                                    const keepIndex =
                                      duplicateKeepSelections[group.key] ??
                                      pickBestDuplicateIndex(
                                        group.indexes,
                                        subCategoriesForDuplicateCheck,
                                        productCountById,
                                      );
                                    const isSelected = keepIndex === index;
                                    const keepItem =
                                      subCategoryValues[keepIndex];
                                    const canMoveProducts =
                                      !isSelected &&
                                      productCount > 0 &&
                                      Boolean(item?.id) &&
                                      Boolean(keepItem?.id);

                                    return (
                                      <div
                                        key={`${group.key}-${index}`}
                                        className={`flex flex-col gap-2 rounded-lg border px-3 py-2 sm:flex-row sm:items-center sm:justify-between ${
                                          isSelected
                                            ? "border-success-200 bg-success-50"
                                            : "border-secondary-100 bg-white"
                                        }`}
                                      >
                                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                                          <span className="text-xs font-medium text-secondary-700">
                                            {item?.name}
                                          </span>
                                          {item?.id ? (
                                            <span className="font-mono text-[10px] text-secondary-400">
                                              #{item.id}
                                            </span>
                                          ) : null}
                                          <Chip
                                            classNames={{
                                              content: "text-[10px] font-bold",
                                            }}
                                            color={
                                              productCount > 0
                                                ? "warning"
                                                : "default"
                                            }
                                            size="sm"
                                            variant="flat"
                                          >
                                            {t(
                                              "inventory.categories.modal.sub_product_count",
                                              { count: productCount },
                                            )}
                                          </Chip>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          {canMoveProducts ? (
                                            <Button
                                              className="font-semibold"
                                              color="warning"
                                              isLoading={isLoading}
                                              size="sm"
                                              startContent={
                                                <ArrowRightLeft size={14} />
                                              }
                                              type="button"
                                              variant="flat"
                                              onPress={() =>
                                                handleMoveProducts(
                                                  item.id!,
                                                  keepItem.id!,
                                                  productCount,
                                                )
                                              }
                                            >
                                              {t(
                                                "inventory.categories.modal.sub_move_products_to",
                                                { id: keepItem.id },
                                              )}
                                            </Button>
                                          ) : null}
                                          <Button
                                            className="shrink-0 font-semibold"
                                            color={
                                              isSelected ? "success" : "primary"
                                            }
                                            isDisabled={isSelected}
                                            size="sm"
                                            type="button"
                                            variant="flat"
                                            onPress={() => {
                                              setKeepAllDuplicates(false);
                                              setDuplicateKeepSelections(
                                                (prev) => ({
                                                  ...prev,
                                                  [group.key]: index,
                                                }),
                                              );
                                            }}
                                          >
                                            {isSelected
                                              ? t(
                                                  "inventory.categories.modal.sub_keep",
                                                )
                                              : t(
                                                  "inventory.categories.modal.sub_keep_item",
                                                )}
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        <div className="flex flex-wrap gap-2">
                          {!keepAllDuplicates ? (
                            <Button
                              className="font-semibold"
                              color="warning"
                              size="sm"
                              type="button"
                              variant="flat"
                              onPress={handleRemoveDuplicateSubCategories}
                            >
                              {t(
                                "inventory.categories.modal.sub_remove_duplicates",
                              )}
                            </Button>
                          ) : null}
                          <Button
                            className="font-semibold"
                            color={keepAllDuplicates ? "success" : "primary"}
                            isDisabled={keepAllDuplicates}
                            size="sm"
                            type="button"
                            variant="flat"
                            onPress={handleKeepAllDuplicates}
                          >
                            {t("inventory.categories.modal.sub_keep_all")}
                          </Button>
                        </div>
                      </div>
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
                      {visibleSubCategories.map(({ field, index }) => {
                        const item = subCategoryValues[index];
                        const productCount = resolveSubCategoryProductCount(
                          item,
                          productCountById,
                        );
                        const isDuplicate =
                          duplicateSubCategoryIndexes.has(index) &&
                          !keepAllDuplicates;
                        const willKeep = isDuplicateKeepTarget(index);
                        const groupKey = getDuplicateGroupKey(index);
                        const willRemove =
                          isDuplicate &&
                          groupKey &&
                          !willKeep &&
                          productCount > 0;
                        const isBlockedSubCategory =
                          Boolean(item?.id) &&
                          blockedSubCategoryIds.has(item.id!);
                        const cannotDelete =
                          Boolean(item?.id) && productCount > 0;
                        const subCategoryErrorMessage = willRemove
                          ? t(
                              "inventory.categories.modal.sub_duplicate_keep_with_products",
                            )
                          : isDuplicate
                            ? t("inventory.categories.modal.sub_duplicate")
                            : errors.subCategories?.[index]?.name?.message;
                        const hasSubCategoryError = Boolean(
                          subCategoryErrorMessage,
                        );

                        return (
                          <div
                            key={field.id}
                            className={`space-y-1 group rounded-lg ${
                              isBlockedSubCategory
                                ? "border border-danger-200 bg-danger-50/60 p-2"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <Controller
                                  control={control}
                                  name={`subCategories.${index}.name`}
                                  render={({ field }) => (
                                    <Input
                                      classNames={{
                                        inputWrapper:
                                          "group-data-[focus=true]:border-gray-900",
                                      }}
                                      isInvalid={hasSubCategoryError}
                                      name={field.name}
                                      placeholder={t(
                                        "inventory.categories.modal.sub_placeholder",
                                        {
                                          n: index + 1,
                                        },
                                      )}
                                      radius="sm"
                                      size="sm"
                                      value={field.value ?? ""}
                                      variant="bordered"
                                      onBlur={field.onBlur}
                                      onValueChange={field.onChange}
                                    />
                                  )}
                                />
                                {hasSubCategoryError ? (
                                  <p className="mt-1 px-1 text-tiny text-danger">
                                    {subCategoryErrorMessage}
                                  </p>
                                ) : null}
                              </div>
                              {!cannotDelete ? (
                                <Button
                                  isIconOnly
                                  className="h-8 w-8 shrink-0"
                                  color="danger"
                                  radius="sm"
                                  size="sm"
                                  type="button"
                                  variant="flat"
                                  onPress={() => remove(index)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 px-1">
                              {item?.id ? (
                                <span className="font-mono text-[10px] text-secondary-400">
                                  #{item.id}
                                </span>
                              ) : null}
                              {item?.id ? (
                                <Chip
                                  classNames={{
                                    content: "text-[10px] font-bold",
                                  }}
                                  color={
                                    productCount > 0 ? "warning" : "default"
                                  }
                                  size="sm"
                                  variant="flat"
                                >
                                  {t(
                                    "inventory.categories.modal.sub_product_count",
                                    { count: productCount },
                                  )}
                                </Chip>
                              ) : null}
                              {isDuplicate ? (
                                <Chip
                                  classNames={{
                                    content: "text-[10px] font-bold uppercase",
                                  }}
                                  color={willKeep ? "success" : "danger"}
                                  size="sm"
                                  variant="flat"
                                >
                                  {willKeep
                                    ? t("inventory.categories.modal.sub_keep")
                                    : t(
                                        "inventory.categories.modal.sub_will_remove",
                                      )}
                                </Chip>
                              ) : null}
                              {keepAllDuplicates &&
                              duplicateSubCategoryIndexes.has(index) ? (
                                <Chip
                                  classNames={{
                                    content: "text-[10px] font-bold uppercase",
                                  }}
                                  color="success"
                                  size="sm"
                                  variant="flat"
                                >
                                  {t("inventory.categories.modal.sub_keep")}
                                </Chip>
                              ) : null}
                              {isBlockedSubCategory || cannotDelete ? (
                                <Chip
                                  classNames={{
                                    content: "text-[10px] font-bold uppercase",
                                  }}
                                  color="danger"
                                  size="sm"
                                  variant="flat"
                                >
                                  {t(
                                    "inventory.categories.modal.sub_cannot_delete",
                                  )}
                                </Chip>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
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
                  isDisabled={hasDuplicateSubCategories && !keepAllDuplicates}
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
