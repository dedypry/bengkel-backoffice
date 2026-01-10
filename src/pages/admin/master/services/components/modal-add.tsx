import type { IService } from "@/utils/interfaces/IService";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";

import CategoryAdd from "./category-add";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  getCategories,
  getService,
} from "@/stores/features/service/service-action";
import InputNumber from "@/components/ui/input-number";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

// Schema berdasarkan struktur IService yang kita buat sebelumnya
const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Nama layanan minimal 3 karakter"),
  code: z.string().min(3, "Kode wajib diisi"),
  price: z
    .string({ message: "Harga harus diisi" })
    .min(1, { message: "Harga harus diisi" })
    .refine((val) => !isNaN(Number(val)), "Harga harus berupa angka"),
  estimated_duration: z
    .string({ message: "Durasi harus diisi" })
    .min(1, { message: "Durasi harus diisi" })
    .refine((val) => !isNaN(Number(val)), "Durasi harus angka"),
  difficulty: z.enum(["easy", "medium", "hard", "extreme"]),
  category_id: z.string().min(1, "Pilih kategori"),
  description: z.string().optional(),
});

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  detail?: IService;
  setDetail?: () => void;
}

export default function ModalAdd({ open, setOpen, detail, setDetail }: Props) {
  const { categories, query } = useAppSelector((state) => state.service);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      name: detail?.name,
      code: detail?.code || "SRV-",
      price: detail?.price,
      estimated_duration: detail?.estimated_duration?.toString(),
      difficulty: detail?.difficulty || "easy",
      category_id: detail?.category.id?.toString(),
      description: detail?.description,
    },
  });

  useEffect(() => {
    if (detail) {
      form.setValue("id", detail.id);
      form.setValue("name", detail.name);
      form.setValue("code", detail.code);
      form.setValue("price", detail.price);
      form.setValue(
        "estimated_duration",
        detail.estimated_duration?.toString(),
      );
      form.setValue("difficulty", detail.difficulty);
      form.setValue("category_id", detail.category?.id?.toString());
      form.setValue("description", detail.description);
    }
  }, [detail]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    http
      .post("/services", values)
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        form.reset();
        dispatch(getService(query));
        setDetail?.();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <Modal
      description="Masukkan detail layanan jasa baru untuk katalog bengkel."
      footer={
        <div className="flex w-full justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading ? "Sedang Menyimpan..." : "Simpan Jasa"}
          </Button>
        </div>
      }
      open={open}
      size="5xl"
      title="Tambah Jasa Service"
      onOpenChange={setOpen}
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Jasa */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Jasa</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Ganti Oli Mesin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kode Jasa */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Jasa</FormLabel>
                  <FormControl>
                    <Input placeholder="SRV-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Harga */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="50.000"
                      startDecorator="Rp"
                      value={field.value}
                      onInput={(val) => {
                        field.onChange(val.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Durasi */}
            <FormField
              control={form.control}
              name="estimated_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimasi Durasi</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="15"
                      {...field}
                      endDecorator="Menit"
                      onInput={(val) => {
                        field.onChange(val.toString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tingkat Kesulitan */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tingkat Kesulitan</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kesulitan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy (Mudah)</SelectItem>
                      <SelectItem value="medium">Medium (Sedang)</SelectItem>
                      <SelectItem value="hard">Hard (Sulit)</SelectItem>
                      <SelectItem value="extreme">
                        Extreme (Sangat Sulit)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CategoryAdd onFinish={(val) => field.onChange(val.id)} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Deskripsi */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Layanan</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Jelaskan detail apa saja yang dikerjakan..."
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
  );
}
