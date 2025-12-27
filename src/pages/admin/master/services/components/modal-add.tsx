import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Modal } from "@/components/modal";
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

// Schema berdasarkan struktur IService yang kita buat sebelumnya
const formSchema = z.object({
  name: z.string().min(3, "Nama layanan minimal 3 karakter"),
  code: z.string().min(3, "Kode wajib diisi"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Harga harus berupa angka"),
  estimated_duration: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Durasi harus angka"),
  difficulty: z.enum(["easy", "medium", "hard", "extreme"]),
  category_id: z.string().min(1, "Pilih kategori"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ModalAdd({ open, setOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "SRV-",
      price: "",
      estimated_duration: "",
      difficulty: "easy",
      category_id: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Data dikirim ke API:", values);
    // Logika kirim ke API di sini
    setOpen(false);
    form.reset();
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
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Simpan Jasa
          </Button>
        </div>
      }
      open={open}
      size="xl" // xl sudah cukup luas untuk form ini
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
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input placeholder="50000" type="number" {...field} />
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
                  <FormLabel>Estimasi Durasi (Menit)</FormLabel>
                  <FormControl>
                    <Input placeholder="15" type="number" {...field} />
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
                      <SelectItem value="1">Perawatan Rutin</SelectItem>
                      <SelectItem value="2">Perbaikan Berat</SelectItem>
                      <SelectItem value="3">Kelistrikan</SelectItem>
                    </SelectContent>
                  </Select>
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
