import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
} from "@heroui/react";
import { useEffect, useMemo, useState, type Key } from "react";
import { useTranslation } from "react-i18next";
import { PlusSquare } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import ModalAddCategory from "../../categories/components/add-category";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getCategories,
  getProduct,
} from "@/stores/features/product/product-action";
import { IProductCategory } from "@/utils/interfaces/IProduct";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

interface Props {
  catIds: Selection;
  /** Produk di halaman saat ini (hasil filter/search) — dipakai jika checkbox header = "all". */
  pageProducts: { id: number }[];
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  isDismissable?: boolean;
}

function resolveBulkProductIds(
  selection: Selection,
  pageProducts: { id: number }[],
): number[] {
  if (selection === "all") {
    return pageProducts.map((product) => product.id);
  }

  return Array.from(selection)
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

const schema = z.object({
  mainCategoryId: z
    .number({ message: "Main kategori wajib diisi" })
    .min(1, "Main kategori wajib diisi"),
  categoryId: z
    .number({ message: "Sub kategori wajib diisi" })
    .min(1, "Sub kategori wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

function sortSubCategories(children: IProductCategory[] = []) {
  return [...children].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", "id", {
      sensitivity: "base",
    }),
  );
}

function filterCategoriesByQuery(
  list: IProductCategory[],
  query: string,
): IProductCategory[] {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return list;
  }

  return list.filter((item) =>
    (item.name ?? "").toLowerCase().includes(keyword),
  );
}

export default function ModalBulkCategory({
  open,
  setOpen,
  catIds,
  pageProducts,
  onSuccess,
  isDismissable = true,
}: Props) {
  const { t } = useTranslation();
  const { categories, productQuery } = useAppSelector((state) => state.product);
  const [modalAddCat, setModalAddCat] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [categoryChildren, setCategoryChildren] = useState<IProductCategory[]>(
    [],
  );
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const [mainCategoryQuery, setMainCategoryQuery] = useState("");
  const [subCategoryQuery, setSubCategoryQuery] = useState("");

  const { control, handleSubmit, setValue, reset, trigger } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        mainCategoryId: 0,
        categoryId: 0,
      },
    });

  const dispatch = useAppDispatch();
  const mainCategoryId = useWatch({ control, name: "mainCategoryId" });
  const mainCategoryItems = Array.isArray(categories) ? categories : [];

  const filteredMainCategories = useMemo(
    () => filterCategoriesByQuery(mainCategoryItems, mainCategoryQuery),
    [mainCategoryItems, mainCategoryQuery],
  );

  const filteredSubCategories = useMemo(
    () => filterCategoriesByQuery(categoryChildren, subCategoryQuery),
    [categoryChildren, subCategoryQuery],
  );

  function parseAutocompleteKey(val: Key | null): number {
    if (val == null || val === "") {
      return 0;
    }

    const id = typeof val === "number" ? val : Number(val);

    return Number.isFinite(id) ? id : 0;
  }

  async function loadSubCategories(parentId: number) {
    setIsLoadingSubCategories(true);

    try {
      const { data } = await http.get(`/products/categories/${parentId}`);

      setCategoryChildren(sortSubCategories(data.children ?? []));
    } catch (err) {
      notifyError(err);
      setCategoryChildren([]);
    } finally {
      setIsLoadingSubCategories(false);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    dispatch(getCategories({}));
    reset({ mainCategoryId: 0, categoryId: 0 });
    setCategoryChildren([]);
    setMainCategoryQuery("");
    setSubCategoryQuery("");
  }, [open, dispatch, reset]);

  function onSubmit(data: FormValues) {
    const productIds = resolveBulkProductIds(catIds, pageProducts);

    if (productIds.length === 0) {
      notify("Pilih minimal satu produk", "error");

      return;
    }

    setLoading(true);
    http
      .post("/products/categories/bulk-update", {
        productIds,
        categoryId: data.categoryId,
      })
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        dispatch(getProduct(productQuery));
        reset();
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <ModalAddCategory
        open={modalAddCat}
        setOpen={setModalAddCat}
        onClose={(val) => {
          if (val?.id) {
            setValue("mainCategoryId", val.id);
            setValue("categoryId", 0);
            void loadSubCategories(val.id);
          }

          dispatch(getCategories({}));
        }}
      />
      <Modal
        isDismissable={isDismissable}
        isOpen={open}
        scrollBehavior="outside"
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent data-tour="stock-bulk-modal">
            <ModalHeader>
              {t("inventory.stock.bulk_category.title")}
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-end">
                <Button
                  className="font-bold text-white"
                  color="success"
                  size="sm"
                  startContent={<PlusSquare />}
                  onPress={() => setModalAddCat(true)}
                >
                  {t("inventory.stock.bulk_category.create_new")}
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="mainCategoryId"
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      isClearable
                      errorMessage={fieldState.error?.message}
                      inputValue={mainCategoryQuery}
                      isInvalid={!!fieldState.error}
                      items={filteredMainCategories}
                      label={t("inventory.stock.bulk_category.category")}
                      listboxProps={{
                        emptyContent: t(
                          "inventory.stock.bulk_category.select_category",
                        ),
                      }}
                      placeholder={t(
                        "inventory.stock.bulk_category.select_category",
                      )}
                      selectedKey={field.value > 0 ? String(field.value) : null}
                      onClear={() => {
                        setMainCategoryQuery("");
                        field.onChange(0);
                        setValue("categoryId", 0, { shouldValidate: false });
                        setSubCategoryQuery("");
                        setCategoryChildren([]);
                      }}
                      onInputChange={setMainCategoryQuery}
                      onSelectionChange={(val) => {
                        const nextId = parseAutocompleteKey(val);

                        field.onChange(nextId);
                        setValue("categoryId", 0, { shouldValidate: false });
                        setSubCategoryQuery("");

                        if (nextId > 0) {
                          const selected = mainCategoryItems.find(
                            (item) => item.id === nextId,
                          );

                          setMainCategoryQuery(selected?.name ?? "");
                          void loadSubCategories(nextId);
                        } else {
                          setMainCategoryQuery("");
                          setCategoryChildren([]);
                        }
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem
                          key={String(item.id)}
                          textValue={item.name}
                        >
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      key={String(mainCategoryId || "none")}
                      isClearable
                      errorMessage={fieldState.error?.message}
                      inputValue={subCategoryQuery}
                      isDisabled={!mainCategoryId || isLoadingSubCategories}
                      isInvalid={!!fieldState.error}
                      isLoading={isLoadingSubCategories}
                      items={filteredSubCategories}
                      label={t("inventory.stock.bulk_category.sub_category")}
                      listboxProps={{
                        emptyContent: t(
                          "inventory.stock.bulk_category.select_sub_category",
                        ),
                      }}
                      placeholder={t(
                        "inventory.stock.bulk_category.select_sub_category",
                      )}
                      selectedKey={field.value > 0 ? String(field.value) : null}
                      onClear={() => {
                        setSubCategoryQuery("");
                        field.onChange(0);
                      }}
                      onInputChange={setSubCategoryQuery}
                      onSelectionChange={(val) => {
                        const nextId = parseAutocompleteKey(val);

                        field.onChange(nextId);

                        if (nextId > 0) {
                          const selected = categoryChildren.find(
                            (item) => item.id === nextId,
                          );

                          setSubCategoryQuery(selected?.name ?? "");
                          void trigger("categoryId");
                        } else {
                          setSubCategoryQuery("");
                        }
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem
                          key={String(item.id)}
                          textValue={item.name}
                        >
                          {item.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" isLoading={isLoading} type="submit">
                {t("inventory.stock.bulk_update")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
