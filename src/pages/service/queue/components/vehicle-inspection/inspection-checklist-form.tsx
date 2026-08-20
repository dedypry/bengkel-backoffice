import type { InspectionPartKey, VehicleInspection } from "./inspection-types";

import { Input, Radio, RadioGroup, Textarea } from "@heroui/react";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type InspectionFormValues = VehicleInspection;

interface Props {
  disabled?: boolean;
  highlightedPart?: InspectionPartKey | null;
  onSelectItem?: (partKey?: InspectionPartKey) => void;
}

export default function InspectionChecklistForm({
  disabled = false,
  highlightedPart,
  onSelectItem,
}: Props) {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<InspectionFormValues>();
  const [search, setSearch] = useState("");
  const items = watch("items");

  const groupedItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const groups = new Map<
      string,
      Array<(typeof items)[number] & { index: number }>
    >();

    items.forEach((item, index) => {
      const label = t(item.labelKey).toLowerCase();

      if (keyword && !label.includes(keyword)) {
        return;
      }

      const current = groups.get(item.groupKey) || [];

      current.push({ ...item, index });
      groups.set(item.groupKey, current);
    });

    return [...groups.entries()];
  }, [items, search, t]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Controller
          control={control}
          name="meta.customerName"
          render={({ field }) => (
            <Input
              {...field}
              isDisabled={disabled}
              label={t("service.inspection.fields.customer_name")}
              variant="bordered"
            />
          )}
        />
        <Controller
          control={control}
          name="meta.plateNumber"
          render={({ field }) => (
            <Input
              {...field}
              isDisabled={disabled}
              label={t("service.inspection.fields.plate_number")}
              variant="bordered"
            />
          )}
        />
        <Controller
          control={control}
          name="meta.inspectedAt"
          render={({ field }) => (
            <Input
              {...field}
              isDisabled={disabled}
              label={t("service.inspection.fields.inspected_at")}
              type="date"
              variant="bordered"
            />
          )}
        />
      </div>

      <Input
        isClearable
        isDisabled={disabled}
        placeholder={t("service.inspection.search_placeholder")}
        value={search}
        variant="bordered"
        onClear={() => setSearch("")}
        onValueChange={setSearch}
      />

      <div className="space-y-5">
        {groupedItems.map(([groupKey, groupItems]) => (
          <div key={groupKey} className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-secondary-500">
              {t(groupKey)}
            </h3>
            <div className="space-y-3">
              {groupItems.map((item) => (
                <div
                  key={item.key}
                  className={`rounded-xl border p-3 transition-colors ${
                    highlightedPart && item.partKey === highlightedPart
                      ? "border-primary bg-primary-50"
                      : "border-secondary-100 bg-white"
                  }`}
                  onMouseEnter={() => onSelectItem?.(item.partKey)}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm font-semibold text-secondary-700">
                      {t(item.labelKey)}
                    </p>
                    <Controller
                      control={control}
                      name={`items.${item.index}.status`}
                      render={({ field }) => (
                        <RadioGroup
                          isDisabled={disabled}
                          orientation="horizontal"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Radio value="ok">
                            {t("service.inspection.status_ok")}
                          </Radio>
                          <Radio value="not_ok">
                            {t("service.inspection.status_not_ok")}
                          </Radio>
                        </RadioGroup>
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name={`items.${item.index}.note`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="mt-3"
                        isDisabled={disabled}
                        placeholder={t("service.inspection.note_placeholder")}
                        size="sm"
                        variant="bordered"
                      />
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Controller
        control={control}
        name="meta.notes"
        render={({ field }) => (
          <Textarea
            {...field}
            isDisabled={disabled}
            label={t("service.inspection.fields.notes")}
            minRows={3}
            variant="bordered"
          />
        )}
      />
    </div>
  );
}
