import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { formSchema } from "./schemas/create-schema";

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
import { DatePicker } from "@/components/date-picker";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getRole } from "@/stores/features/role/role-action";
import { Separator } from "@/components/ui/separator";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import UploadAvatar from "@/components/upload-avatar";
import { uploadFile } from "@/utils/helpers/upload-file";
import Combobox from "@/components/ui/combobox";

interface Props {
  id?: string;
  userForm?: z.infer<typeof formSchema>;
}
export default function CreateEmployeePage({ id, userForm }: Props) {
  const { roles } = useAppSelector((state) => state.role);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRole());
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      status: "Permanent",
      join_date: new Date().toISOString(),
      birth_date: new Date().toISOString(),
      ...userForm,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (values.photo && values.photo instanceof File) {
      const photo = await uploadFile(values.photo);

      form.setValue("photo", photo);
      values.photo = photo;
    }
    http
      .post("/employees", {
        id,
        ...values,
      })
      .then(({ data }) => {
        notify(data.message);
        navigate("/hr/employees");
        form.reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <div className="space-y-8 pb-20 bg-slate-50/30 min-h-screen">
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
          <h3 className="text-lg font-bold">
            {id ? "Edit Data Karyawan" : "Registrasi Karyawan Baru"}
          </h3>
          <p className="text-sm font-medium text-slate-500">
            {id
              ? "Perbarui informasi detail karyawan untuk menjaga keakuratan data."
              : "Lengkapi formulir di bawah ini untuk menambahkan karyawan ke dalam sistem."}
          </p>
        </div>
      </div>

      <Card className="shadow-lg shadow-gray-100">
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
              <FormField
                control={form.control}
                name="photo"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="text-center">
                    <FormControl>
                      <UploadAvatar
                        field={field}
                        value={value}
                        onChange={onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  name="role_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <Combobox
                        isMulti
                        items={roles
                          .filter((e) => ![1, 2].includes(e.id))
                          .map((item) => ({
                            label: item.name,
                            value: item.id,
                            description: item.description,
                          }))}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-6">
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
                            <SelectTrigger className="w-full">
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Karyawan</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
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
                <FormField
                  control={form.control}
                  name="join_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Bergabung</FormLabel>
                      <FormControl>
                        <DatePicker
                          setValue={field.onChange}
                          value={new Date(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="place_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempat Lahir</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Masukan Tempat lahir" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <FormControl>
                        <DatePicker
                          setValue={field.onChange}
                          value={new Date(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Laki-laki</SelectItem>
                          <SelectItem value="female">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <Province
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota</FormLabel>
                      <FormControl>
                        <City value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecamatan</FormLabel>
                      <FormControl>
                        <District
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <h3 className="m-0 pb-2">Kontak Darurat</h3>
              <Separator />
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="emergency_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kontak Yang bisa di hubungi</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Masukan Nama" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Telp Kontak Yang bisa di hubungi</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Masukan No. Telp" />
                      </FormControl>
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
                  onClick={() => navigate("/hr/employees")}
                >
                  Batal
                </Button>
                <Button className="flex-1" disabled={isLoading} type="submit">
                  {isLoading
                    ? "Menyimpan..."
                    : id
                      ? "Ubah data karyawan"
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
