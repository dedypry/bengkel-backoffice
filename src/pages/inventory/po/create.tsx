import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useRef, useEffect } from "react";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplierAll } from "@/stores/features/supplier/supplier-action";

const poSchema = z.object({
  supplierId: z.number(),
  date: z.string(),
  sub_total: z.number(),
  disc_percentage: z.number(),
  disc_value: z.number(),
  ppn_value: z.number(),
  total: z.number(),
  other_cost: z.number(),
  total_final: z.number(),
  note: z.string(),
  term_credit: z.number(),
  delivery_date: z.string(),
  notes: z.string(),
  signature_id: z.number(),
  items: z.array(
    z.object({
      id: z.number(),
      code: z.string(),
      name: z.string(),
      unit: z.string(),
      qty: z.number(),
      price: z.number(),
      disc_percentage: z.number(),
      disc_value: z.number(),
      ppn_percentage: z.number(),
      ppn_value: z.number(),
      total: z.number(),
    }),
  ),
});

type PoFormValues = z.infer<typeof poSchema>;

export default function PoCreatePage() {
  const { suppliersAll } = useAppSelector((state) => state.supplier);

  const hasFetch = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;
      dispatch(getSupplierAll());

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, []);

  const { control, handleSubmit } = useForm<PoFormValues>({
    resolver: zodResolver(poSchema),
    mode: "onChange",
    defaultValues: {
      supplierId: undefined,
      date: "",
      sub_total: 0,
      disc_percentage: 0,
      disc_value: 0,
      ppn_value: 0,
      total: 0,
      other_cost: 0,
      total_final: 0,
      note: "",
      term_credit: 0,
      delivery_date: "",
      notes: "",
      signature_id: 0,
      items: [],
    },
  });

  function onSubmit(data: PoFormValues) {}

  return (
    <div>
      <HeaderAction subtitle="PO" title="Buat PO" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <div>
            <Controller
              control={control}
              name="supplierId"
              render={({ field, fieldState }) => (
                <Autocomplete
                  defaultItems={suppliersAll}
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  label="Supplier"
                  placeholder="Pilih Supplier"
                  selectedKey={field.value}
                  onSelectionChange={field.onChange}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id} textValue={item.name}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
