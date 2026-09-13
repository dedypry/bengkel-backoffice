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
import { useEffect, useState, type Key } from "react";
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
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  isDismissable?: boolean;
}

const schema = z.object({
  mainCategoryId: z.coerce
    .number({ message: "Main kategori wajib diisi" })
    .min(1, "Main kategori wajib diisi"),
  categoryId: z.coerce
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

export default function ModalBulkCategory({
  open,
  setOpen,
  catIds,
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
  }, [open, dispatch, reset]);

  function onSubmit(data: FormValues) {
    setLoading(true);
    http
      .post("/products/categories/bulk-update", {
        productIds: catIds !== "all" ? Array.from(catIds) : "all",
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
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      items={mainCategoryItems}
                      label={t("inventory.stock.bulk_category.category")}
                      placeholder={t(
                        "inventory.stock.bulk_category.select_category",
                      )}
                      selectedKey={field.value > 0 ? String(field.value) : null}
                      onSelectionChange={(val) => {
                        const nextId = parseAutocompleteKey(val);

                        field.onChange(nextId);
                        setValue("categoryId", 0, { shouldValidate: false });

                        if (nextId > 0) {
                          void loadSubCategories(nextId);
                        } else {
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
                      errorMessage={fieldState.error?.message}
                      isDisabled={!mainCategoryId || isLoadingSubCategories}
                      isInvalid={!!fieldState.error}
                      isLoading={isLoadingSubCategories}
                      items={categoryChildren}
                      label={t("inventory.stock.bulk_category.sub_category")}
                      placeholder={t(
                        "inventory.stock.bulk_category.select_sub_category",
                      )}
                      selectedKey={field.value > 0 ? String(field.value) : null}
                      onSelectionChange={(val) => {
                        const nextId = parseAutocompleteKey(val);

                        field.onChange(nextId);

                        if (nextId > 0) {
                          void trigger("categoryId");
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
