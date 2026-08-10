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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { list } = useAppSelector((state) => state.employe);
  const { roles } = useAppSelector((state) => state.role);
  const { warehouses } = useAppSelector((state) => state.warehouse);
  const warehouseItems = warehouses?.data || [];

  return (
    <div className="space-y-6">
      <SectionCard
        description={t("settings.operations.transaction_numbering_desc")}
        icon={Hash}
        title={t("settings.operations.transaction_numbering")}
        tone="sky"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PrefixInput
            control={control}
            label={t("settings.operations.service_registration")}
            name="service_reg_prefix"
          />
          <PrefixInput
            control={control}
            label={t("settings.operations.service_payment")}
            name="service_pay_prefix"
          />
          <PrefixInput
            control={control}
            label={t("settings.operations.job_purchase")}
            name="job_order_prefix"
          />
          <PrefixInput
            control={control}
            label={t("settings.operations.sales_order")}
            name="sales_order_prefix"
          />
          <PrefixInput
            control={control}
            label={t("settings.operations.sales_invoice")}
            name="sales_inv_prefix"
          />
          <PrefixInput
            control={control}
            label={t("settings.operations.sales_return")}
            name="sales_ret_prefix"
          />
          <PrefixInput
            control={control}
            label={t("settings.operations.ar_payment")}
            name="ar_pay_prefix"
          />
        </div>
      </SectionCard>

      <SectionCard
        description={t("settings.operations.default_ops_desc")}
        icon={Wrench}
        title={t("settings.operations.default_ops")}
        tone="violet"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="default_km_increment"
            render={({ field }) => (
              <InputNumber
                label={t("settings.operations.next_km_increment")}
                placeholder="7000"
                value={field.value != null ? String(field.value) : undefined}
                onInput={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="next_service_interval_days"
            render={({ field }) => (
              <InputNumber
                label={t("settings.operations.next_service_interval")}
                placeholder="90"
                value={field.value != null ? String(field.value) : undefined}
                onInput={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="next_service_reminder_days"
            render={({ field }) => (
              <InputNumber
                label={t("settings.operations.email_reminder_days")}
                placeholder="7"
                value={field.value != null ? String(field.value) : undefined}
                onInput={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="pit_count"
            render={({ field }) => (
              <InputNumber
                label={t("settings.operations.pit_count")}
                placeholder="10"
                value={field.value != null ? String(field.value) : undefined}
                onInput={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="default_warehouse_id"
            render={({ field }) => (
              <Select
                label={t("settings.operations.default_warehouse")}
                placeholder={t("settings.operations.select_warehouse")}
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
                  <SelectItem
                    key={String(warehouse.id)}
                    textValue={warehouse.name}
                  >
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
                description={t("settings.operations.cash_account_desc")}
                label={t("settings.operations.cash_account")}
                placeholder={t("common.optional")}
                value={field.value != null ? String(field.value) : undefined}
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
                label={t("settings.operations.default_pic")}
                placeholder={t("settings.operations.select_employee")}
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
                label={t("settings.operations.default_advisor")}
                placeholder={t("settings.operations.select_employee")}
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
                label={t("settings.operations.mechanic_role")}
                placeholder={t("settings.operations.select_mechanic_role")}
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
        description={t("settings.operations.document_notes_desc")}
        icon={FileText}
        title={t("settings.operations.document_notes")}
        tone="amber"
      >
        <div className="grid grid-cols-1 gap-4">
          <Controller
            control={control}
            name="notes_service"
            render={({ field }) => (
              <Textarea
                {...field}
                label={t("settings.operations.service_invoice_notes")}
                minRows={3}
                placeholder={t(
                  "settings.operations.service_invoice_notes_placeholder",
                )}
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
                label={t("settings.operations.sales_invoice_notes")}
                minRows={3}
                placeholder={t(
                  "settings.operations.sales_invoice_notes_placeholder",
                )}
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
