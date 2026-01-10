import type { IServiceCategory } from "@/utils/interfaces/IService";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getCategories } from "@/stores/features/service/service-action";

// Schema Validasi
const categorySchema = z.object({
  name: z.string().min(3, "Nama kategori minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface Props {
  onFinish?: (val: IServiceCategory) => void;
}
export default function CategoryAdd({ onFinish }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setLoading(true);
    http
      .post("/services/categories", values)
      .then(({ data }) => {
        dispatch(getCategories());
        if (onFinish) {
          onFinish(data);
        }
        setOpen(false);
        form.reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal
        description="Buat kategori baru untuk mengelompokkan layanan servis."
        footer={
          <div className="flex w-full justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
              {isLoading ? "Menyimpan..." : "Simpan Kategori"}
            </Button>
          </div>
        }
        open={open}
        size="sm"
        title="Tambah Kategori"
        onOpenChange={setOpen}
      >
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Nama Kategori */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Mesin, Kelistrikan..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deskripsi Kategori */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Penjelasan singkat kategori ini"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Modal>

      <Button
        className="shrink-0 bg-green-600 hover:bg-green-600/80 text-white hover:text-white shadow-lg"
        size="icon"
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="size-4" />
      </Button>
    </>
  );
}
