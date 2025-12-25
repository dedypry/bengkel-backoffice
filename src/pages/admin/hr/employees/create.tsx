import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers/global";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi." }),
  email: z
    .email({ message: "Format email tidak valid." })
    .min(1, { message: "Email wajib diisi." }),
  phone: z.string().min(1, { message: "Nomor telepon wajib diisi." }),
  role: z.string().min(1, { message: "Jabatan wajib diisi." }),
  department: z.string().min(1, { message: "Departemen wajib diisi." }),
  joinDate: z.string().min(1, { message: "Tanggal bergabung wajib diisi." }),
  status: z.string().min(1, { message: "Status wajib dipilih." }),
  photo: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Foto wajib diupload." })
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, {
      message: "Ukuran file maksimal 5MB.",
    })
    .refine(
      (files) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(files[0]?.type),
      { message: "Format file harus JPG, JPEG, atau PNG." },
    ),
});

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      joinDate: "",
      status: "Permanent",
    },
  });

  const photoFile = form.watch("photo")?.[0];
  const photoPreview = photoFile ? URL.createObjectURL(photoFile) : null;

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // TODO: Implement API call to create employee
    // For now, just navigate back
    navigate("/admin/hr/employees");
  }

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30 min-h-screen">
      <div className="flex items-center gap-4">
        <Button
          className="rounded-full hover:bg-white hover:shadow-md"
          size="icon"
          variant="ghost"
          onClick={() => navigate("/hr/employees")}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Tambah Karyawan Baru
          </h1>
          <p className="text-sm font-bold text-slate-500">
            Lengkapi informasi karyawan untuk menambah ke database.
          </p>
        </div>
      </div>

      <Card className="shadow-lg shadow-gray-100 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="text-blue-600" size={24} />
            Formulir Data Karyawan
          </CardTitle>
          <CardDescription>
            Isi semua field yang diperlukan dengan informasi yang akurat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <Avatar className="size-24 border-4 border-white shadow-lg">
                  <AvatarImage src={photoPreview || ""} />
                  <AvatarFallback className="text-2xl">
                    {photoPreview
                      ? ""
                      : getInitials(form.watch("name") || "Karyawan")}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem className="text-center">
                      <FormLabel className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                          <Upload size={18} />
                          <span className="font-bold">Upload Foto</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          accept="image/*"
                          className="hidden"
                          type="file"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-slate-500 mt-2">
                        Format: JPG, PNG. Maksimal 5MB.
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap" {...field} />
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
                        <Input
                          placeholder="contoh@bengkel.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input placeholder="0812-3456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Lead Mechanic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departemen</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih departemen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Front Office">
                            Front Office
                          </SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Bergabung</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Karyawan</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Permanent">Permanent</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  className="flex-1"
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/hr/employees")}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1"
                  disabled={form.formState.isSubmitting}
                  type="submit"
                >
                  {form.formState.isSubmitting
                    ? "Menyimpan..."
                    : "Simpan Karyawan"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
