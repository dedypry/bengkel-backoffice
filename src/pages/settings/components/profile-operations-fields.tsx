import type { ReactNode } from "react";
import type { Control } from "react-hook-form";
import type { OperationsFormValues } from "../schemas/operations-schema";

import { Controller } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { FileText, Hash, Wrench } from "lucide-react";

import InputNumber from "@/components/input-number";
import NextServiceNotesField from "@/components/next-service-notes-field";
import { useAppSelector } from "@/stores/hooks";

type ProfileOperationsFieldsProps = {
  control: Control<OperationsFormValues>;
};

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  tone = "sky",
}: {
  title: string;
  description: string;
  icon: typeof Wrench;
  children: ReactNode;
  tone?: "sky" | "violet" | "amber" | "emerald";
}) {
  const tones = {
    sky: "border-sky-100 bg-sky-50/50",
    violet: "border-violet-100 bg-violet-50/50",
    amber: "border-amber-100 bg-amber-50/50",
    emerald: "border-emerald-100 bg-emerald-50/50",
  };

  return (
    <div className={`rounded-2xl border p-5 space-y-4 ${tones[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2.5 text-gray-600 shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase text-gray-600">
            {title}
          </h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function PrefixInput({
  control,
  name,
  label,
}: {
  control: Control<OperationsFormValues>;
  name: keyof OperationsFormValues;
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input
          {...field}
          label={label}
          size="sm"
          value={String(field.value ?? "")}
          variant="bordered"
        />
      )}
    />
  );
}

export default function ProfileOperationsFields({
  control,
}: ProfileOperationsFieldsProps) {
  const { list } = useAppSelector((state) => state.employe);
  const { roles } = useAppSelector((state) => state.role);
  const { warehouses } = useAppSelector((state) => state.warehouse);
  const warehouseItems = warehouses?.data || [];

  return (
    <div className="space-y-6">
      <SectionCard
        description="Format nomor transaksi servis dan penjualan."
        icon={Hash}
        title="Penomoran Transaksi"
        tone="sky"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PrefixInput
            control={control}
            label="Pendaftaran Servis"
            name="service_reg_prefix"
          />
          <PrefixInput
            control={control}
            label="Pembayaran Servis"
            name="service_pay_prefix"
          />
          <PrefixInput
            control={control}
            label="Pembelian Jasa"
            name="job_order_prefix"
          />
          <PrefixInput
            control={control}
            label="Order Penjualan"
            name="sales_order_prefix"
          />
          <PrefixInput
            control={control}
            label="Faktur Penjualan"
            name="sales_inv_prefix"
          />
          <PrefixInput
            control={control}
            label="Retur Penjualan"
            name="sales_ret_prefix"
          />
          <PrefixInput
            control={control}
            label="Pembayaran Piutang"
            name="ar_pay_prefix"
          />
        </div>
      </SectionCard>

      <SectionCard
        description="Nilai bawaan saat servis dan operasional bengkel."
        icon={Wrench}
        title="Default Operasional"
        tone="violet"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="default_km_increment"
            render={({ field }) => (
              <InputNumber
                label="Penambahan KM Servis Berikutnya"
                placeholder="7000"
                value={field.value as number}
                onInput={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="pit_count"
            render={({ field }) => (
              <InputNumber
                label="Jumlah Pit / Stall Servis"
                placeholder="10"
                value={field.value as number}
                onInput={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="default_warehouse_id"
            render={({ field }) => (
              <Select
                label="Gudang Default Stok"
                placeholder="Pilih gudang"
                selectedKeys={
                  field.value ? new Set([String(field.value)]) : new Set()
                }
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  field.onChange(value ? Number(value) : null);
                }}
              >
                {warehouseItems.map((warehouse) => (
                  <SelectItem key={String(warehouse.id)} textValue={warehouse.name}>
                    {warehouse.code} — {warehouse.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <Controller
            control={control}
            name="default_cash_account_id"
            render={({ field }) => (
              <InputNumber
                description="ID akun kas untuk pembayaran default"
                label="Kas Pembayaran (Account ID)"
                placeholder="Opsional"
                value={field.value as number}
                onInput={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="default_pic_id"
            render={({ field }) => (
              <Autocomplete
                defaultItems={list?.data || []}
                label="PIC Service Default"
                placeholder="Pilih karyawan"
                selectedKey={field.value ? String(field.value) : undefined}
                variant="bordered"
                onSelectionChange={(key) =>
                  field.onChange(key ? Number(key) : null)
                }
              >
                {(item: { id: number; name: string }) => (
                  <AutocompleteItem key={String(item.id)}>
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            )}
          />
          <Controller
            control={control}
            name="default_advisor_id"
            render={({ field }) => (
              <Autocomplete
                defaultItems={list?.data || []}
                label="Service Advisor Default"
                placeholder="Pilih karyawan"
                selectedKey={field.value ? String(field.value) : undefined}
                variant="bordered"
                onSelectionChange={(key) =>
                  field.onChange(key ? Number(key) : null)
                }
              >
                {(item: { id: number; name: string }) => (
                  <AutocompleteItem key={String(item.id)}>
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            )}
          />
          <Controller
            control={control}
            name="mechanic_roles"
            render={({ field }) => (
              <Select
                className="md:col-span-2"
                label="Role Mekanik"
                placeholder="Pilih role yang dihitung sebagai mekanik"
                selectedKeys={new Set(field.value || [])}
                selectionMode="multiple"
                variant="bordered"
                onSelectionChange={(keys) =>
                  field.onChange(Array.from(keys) as string[])
                }
              >
                {(roles || []).map((role) => (
                  <SelectItem key={role.slug}>{role.name}</SelectItem>
                ))}
              </Select>
            )}
          />
        </div>
      </SectionCard>

      <SectionCard
        description="Catatan bawaan yang tampil di dokumen servis dan penjualan."
        icon={FileText}
        title="Catatan Dokumen"
        tone="amber"
      >
        <div className="grid grid-cols-1 gap-4">
          <Controller
            control={control}
            name="notes_service"
            render={({ field }) => (
              <Textarea
                {...field}
                label="Catatan Invoice Servis"
                minRows={3}
                placeholder="Terima kasih telah mempercayakan kendaraan Anda..."
                value={field.value || ""}
                variant="bordered"
              />
            )}
          />
          <Controller
            control={control}
            name="notes_sales"
            render={({ field }) => (
              <Textarea
                {...field}
                label="Catatan Invoice Penjualan"
                minRows={3}
                placeholder="Barang yang sudah dibeli tidak dapat ditukar..."
                value={field.value || ""}
                variant="bordered"
              />
            )}
          />
        </div>
      </SectionCard>

      <NextServiceNotesField control={control} />
    </div>
  );
}
