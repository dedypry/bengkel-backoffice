import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Modal from "@/components/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCategories } from "@/stores/features/product/product-action";

// Skema validasi sesuai database
const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Nama kategori minimal 3 karakter"),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  initialData?: any; // Untuk mode edit
}

export default function ModalAddCategory({
  open,
  setOpen,
  initialData,
}: Props) {
  const { categoryQuery } = useAppSelector((state) => state.product);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  // Sinkronisasi data saat modal dibuka/edit
  useEffect(() => {
    if (open)
      form.reset(initialData || { name: "", description: "", is_active: true });
  }, [open, initialData]);

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true);
    http
      .post("/products/categories", data)
      .then(({ data }) => {
        notify(data.message);
        form.reset();
        setOpen(false);
        dispatch(getCategories(categoryQuery));
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      isLoading={isLoading}
      open={open}
      title={initialData ? "Ubah Kategori" : "Tambah Kategori Produk"}
      onOpenChange={setOpen}
      onSave={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <form className="space-y-5 py-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Nama Kategori */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: Mesin, Interior, atau Body"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description">
                  Deskripsi (Opsional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    {...field}
                    className="resize-none"
                    placeholder="Jelaskan jenis produk dalam kategori ini..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Item variant="outline">
                    <ItemContent>
                      <ItemTitle>Kategori</ItemTitle>
                      <ItemDescription className="text-xs">
                        {field.value
                          ? "Kategori aktif dan muncul di pilihan produk"
                          : "Kategori disembunyikan"}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </ItemActions>
                  </Item>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
}
