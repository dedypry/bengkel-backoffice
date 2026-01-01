import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import UploadAvatar from "@/components/upload-avatar";
import { uploadFile } from "@/utils/helpers/upload-file";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch } from "@/stores/hooks";
import { getProfile } from "@/stores/features/auth/auth-action";

// 1. Definisi Skema Validasi Zod
const companySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama cabang wajib diisi"),
  logo_url: z.any().optional(),
  email: z.string().email("Format email tidak valid"),
  phone_number: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9]+$/, "Hanya boleh berisi angka"),
  fax: z.string().optional().or(z.literal("")),
  npwp: z.string().optional().or(z.literal("")),
});

// Infer tipe data dari skema Zod untuk TypeScript
type CompanyFormValues = z.infer<typeof companySchema>;

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  initialData?: Partial<CompanyFormValues>;
}

export default function ModalAddCompany({ open, setOpen, initialData }: Props) {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      logo_url: "",
      email: "",
      phone_number: "",
      fax: "",
      npwp: "",
    },
  });

  // Reset data saat mode Edit atau Modal dibuka
  useEffect(() => {
    if (open) {
      form.reset(
        initialData || {
          name: "",
          logo_url: "",
          email: "",
          phone_number: "",
          fax: "",
          npwp: "",
        },
      );
    }
  }, [open, initialData]);

  const onSubmit = async (data: CompanyFormValues) => {
    setLoading(true);
    if (data.logo_url instanceof File) {
      const logo = await uploadFile(data.logo_url);

      form.setValue("logo_url", logo);
      data.logo_url = logo;
    }

    http
      .post("/companies", data)
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        dispatch(getProfile());
        form.reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      isLoading={isLoading}
      open={open}
      title={initialData?.id ? "Ubah Cabang" : "Tambah Cabang Baru"}
      onOpenChange={setOpen}
      onSave={form.handleSubmit(onSubmit)}
    >
      <Form {...form}>
        <form
          className="flex space-y-5 flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="logo_url"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <UploadAvatar
                    buttonTitle="Upload Logo"
                    field={field}
                    isInvalid={!!form.formState.errors.logo_url}
                    value={value}
                    onChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Cabang</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    {...field}
                    placeholder="Contoh: Cabang Jakarta Pusat"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input id="email" {...field} placeholder="admin@cabang.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telepon</FormLabel>
                <FormControl>
                  <Input
                    id="phone_number"
                    {...field}
                    placeholder="admin@cabang.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="npwp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NPWP (Opsional)</FormLabel>
                <FormControl>
                  <Input id="fax" {...field} placeholder="admin@cabang.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fax (Opsional)</FormLabel>
                <FormControl>
                  <Input id="fax" {...field} placeholder="admin@cabang.com" />
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
