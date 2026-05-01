import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useRef, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import ModalPart from "./modal-part";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplierAll } from "@/stores/features/supplier/supplier-action";
import DatePicker from "@/components/forms/date-picker";
import { IProduct } from "@/utils/interfaces/IProduct";

const poSchema = z.object({
  supplierId: z.number(),
  warehouseId: z.number(),
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
  const [poItems, setPoItems] = useState<IProduct[]>([]);
  const [open, setOpen] = useState(false);
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

  const { control, handleSubmit, setValue } = useForm<PoFormValues>({
    resolver: zodResolver(poSchema),
    mode: "onChange",
    defaultValues: {
      supplierId: undefined,
      date: new Date().toISOString(),
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  function onSubmit(data: PoFormValues) {}

  return (
    <div>
      <ModalPart
        open={open}
        setOpen={setOpen}
        onProducts={(items) => {
          setValue(
            "items",
            items.map((item) => {
              return {
                id: item.id,
                code: item.code,
                name: item.name,
                unit: item.unit,
                qty: 1,
                price: item.purchase_price,
                disc_percentage: 0,
                disc_value: 0,
                ppn_percentage: 0,
                ppn_value: 0,
                total: item.purchase_price,
              } as any;
            }),
          );
        }}
      />
      <HeaderAction subtitle="PO" title="Buat PO" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <div className="space-y-1">
            <Controller
              control={control}
              name="date"
              render={({ field, fieldState }) => (
                <DatePicker
                  classNames={{
                    label: "w-28 text-sm",
                  }}
                  errorMessage={fieldState.error?.message}
                  isInvalid={!!fieldState.error}
                  label="Tanggal PO"
                  labelPlacement="outside-left"
                  size="sm"
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
            <AutocompleteControl
              control={control}
              items={suppliersAll}
              label="Supplier"
              name="supplierId"
              placeholder="Pilih Supplier"
            />
          </div>
          <div>
            <AutocompleteControl
              control={control}
              items={[]}
              label="Gudang"
              name="warehouseId"
              placeholder="Pilih Gudang"
            />
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-end">
              <Button
                color="primary"
                size="sm"
                startContent={<Plus size={18} />}
                onPress={() => setOpen(true)}
              >
                Tambah Barang
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>Kode Barang</TableColumn>
                <TableColumn>Nama Barang</TableColumn>
                <TableColumn>Unit</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Harga</TableColumn>
                <TableColumn>Disc (%)</TableColumn>
                <TableColumn>Disc (Rp)</TableColumn>
                <TableColumn>PPN (%)</TableColumn>
                <TableColumn>PPN (Rp)</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Aksi</TableColumn>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => {
                  return (
                    <TableRow key={field.id}>
                      <TableCell>{field.code}</TableCell>
                      <TableCell>{field.name}</TableCell>
                      <TableCell>{field.unit}</TableCell>
                      <TableCell>{field.qty}</TableCell>
                      <TableCell>{field.price}</TableCell>
                      <TableCell>{field.disc_percentage}</TableCell>
                      <TableCell>{field.disc_value}</TableCell>
                      <TableCell>{field.ppn_percentage}</TableCell>
                      <TableCell>{field.ppn_value}</TableCell>
                      <TableCell>{field.total}</TableCell>
                      <TableCell>
                        <Button
                          color="danger"
                          size="sm"
                          onPress={() => remove(index)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}

function AutocompleteControl({
  control,
  items,
  name,
  label,
  placeholder,
}: {
  control: Control<PoFormValues>;
  items: any[];
  name: keyof PoFormValues;
  label: string;
  placeholder: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Autocomplete
          defaultItems={items}
          errorMessage={fieldState.error?.message}
          inputProps={{
            classNames: {
              label: "w-28 text-sm",
            },
          }}
          isInvalid={!!fieldState.error}
          label={label}
          labelPlacement="outside-left"
          placeholder={placeholder}
          selectedKey={field.value?.toString()}
          size="sm"
          onSelectionChange={(val) => field.onChange(Number(val))}
        >
          {(item) => (
            <AutocompleteItem key={item.id} textValue={item.name}>
              {item.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    />
  );
}
