import type { ISupplier } from "@/utils/interfaces/ISupplier";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea, Typography } from "@mui/joy";
import { useEffect, useState } from "react";

import { supplierSchema, type SupplierFormValues } from "./form-schema";

import Modal from "@/components/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { NpwpMask, PhoneMask } from "@/utils/mask/mask";
import Province from "@/components/regions/province";
import City from "@/components/regions/city";
import District from "@/components/regions/district";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getCity, getDistrict } from "@/stores/features/region/region-action";
import { getSupplier } from "@/stores/features/supplier/supplier-action";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  supplier?: ISupplier;
}

export default function AddModal({ open, setOpen, supplier }: Props) {
  const { supplierQuery } = useAppSelector((state) => state.supplier);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      npwp: "",
      website: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (open && supplier) {
      form.reset(supplier as any);
      if (supplier.province_id) {
        dispatch(getCity(supplier.province_id));
      }
      if (supplier.city_id) {
        dispatch(getDistrict(supplier.city_id));
      }
    }
  }, [supplier, open]);

  const handleFormSubmit = (data: SupplierFormValues) => {
    setLoading(true);
    http
      .post("/suppliers", data)
      .then(({ data }) => {
        dispatch(getSupplier(supplierQuery));
        notify(data.message);
        form.reset();
        setOpen(false);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      isLoading={loading}
      open={open}
      size="xl"
      title="Tambah Supplier"
      onOpenChange={setOpen}
      onSave={form.handleSubmit(handleFormSubmit)}
    >
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleFormSubmit)}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Nama Supplier */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Supplier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Contoh: PT. Maju Jaya" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kode Supplier */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SUP-001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0812..."
                      slotProps={{ input: { component: PhoneMask } }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="vendor@mail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="province_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <FormControl>
                    <Province {...field} />
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
                    <City {...field} />
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
                    <District {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Alamat */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Lengkap</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Jl. Industri No. 5..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* NPWP */}
            <FormField
              control={form.control}
              name="npwp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NPWP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="00.000.000.0-000.000"
                      slotProps={{ input: { component: NpwpMask } }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Website */}
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status Switch */}
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <div>
                    <FormLabel>
                      Status {field.value ? "Aktif" : "Tidak Aktif"}
                    </FormLabel>
                    <Typography level="body-xs">
                      {field.value
                        ? "Supplier tersedia dan dapat dipilih dalam modul pembelian atau transaksi."
                        : "Supplier akan disembunyikan dari daftar pilihan transaksi aktif."}
                    </Typography>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
}
