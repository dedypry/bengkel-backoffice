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
import { useRef, useEffect, useState } from "react";
import { PlusSquare } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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
}

const schema = z.object({
  mainCategoryId: z
    .number({ message: "Main kategori wajib diisi" })
    .min(1, "Main kategori wajib diisi"),
  categoryId: z
    .number({ message: "Kategori wajib diisi" })
    .min(1, "Kategori wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export default function ModalBulkCategory({
  open,
  setOpen,
  catIds,
  onSuccess,
}: Props) {
  const { categories, productQuery } = useAppSelector((state) => state.product);
  const [modalAddCat, setModalAddCat] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [categoryChildren, setCategoryChildren] = useState<IProductCategory[]>(
    [],
  );

  const { control, handleSubmit, setValue, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mainCategoryId: 0,
      categoryId: 0,
    },
  });

  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getCategories({}));

      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [dispatch]);

  function onSubmit(data: FormValues) {
    setLoading(true);
    http
      .post("/products/categories/bulk-update", {
        productIds: catIds !== "all" ? Array.from(catIds) : "all",
        ...data,
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
          if (val) {
            setCategoryChildren(val?.children);
            setValue("categoryId", val?.children[0]?.id);
            setValue("mainCategoryId", val?.id);
          }

          dispatch(getCategories({}));
        }}
      />
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Bulk Update Kategori</ModalHeader>
            <ModalBody>
              <div className="flex justify-end">
                <Button
                  className="font-bold text-white"
                  color="success"
                  size="sm"
                  startContent={<PlusSquare />}
                  onPress={() => setModalAddCat(true)}
                >
                  Buat Kategori Baru
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="mainCategoryId"
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      defaultItems={categories}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Kategori"
                      placeholder="Pilih Kategori"
                      selectedKey={field.value.toString()}
                      onSelectionChange={(val) => {
                        field.onChange(Number(val));
                        if (val) {
                          const category = categories.find(
                            (e) => e.id === Number(val),
                          );

                          if (category) {
                            setCategoryChildren(category.children);
                          }
                        }
                      }}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id} textValue={item.name}>
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
                      defaultItems={categoryChildren}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Sub Kategori"
                      placeholder="Pilih Sub Kategori"
                      selectedKey={field.value.toString()}
                      onSelectionChange={(val) => field.onChange(Number(val))}
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
            </ModalBody>
            <ModalFooter>
              <Button color="primary" isLoading={isLoading} type="submit">
                Bulk Update Kategori
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
