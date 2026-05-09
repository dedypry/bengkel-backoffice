import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useRef, useEffect, useState } from "react";
import {
  ArrowBigLeftDash,
  Plus,
  PlusCircle,
  SaveAllIcon,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ModalPart from "./modal-part";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplierAll } from "@/stores/features/supplier/supplier-action";
import DatePicker from "@/components/forms/date-picker";
import { IProduct } from "@/utils/interfaces/IProduct";
import InputNumber from "@/components/input-number";
import { formatIDR } from "@/utils/helpers/format";
import SumaryTable from "@/components/sumary";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import AddSupplierModal from "@/pages/master/suppliers/components/add-modal";
import { getWarehouse } from "@/stores/features/warehouse/warehouse-action";
import { setWarehouseQuery } from "@/stores/features/warehouse/warehouse-slice";
import WarehouseCreateModal from "@/pages/master/warehouses/warehouse-create-modal";
import { IPo } from "@/utils/interfaces/po";

const poSchema = z.object({
  id: z.number().optional().nullable(),
  supplier_id: z.number(),
  warehouse_id: z.number().optional().nullable(),
  date: z.string(),
  sub_total: z.any().optional().nullable(),
  other_fee: z.any().optional().nullable(),
  total: z.any().optional().nullable(),
  note: z.string(),
  term_credit: z.number().optional().nullable(),
  disc_percentage: z.number().optional().nullable(),
  disc_value: z.number().optional().nullable(),
  requested_date: z.string().optional().nullable(),
  notes: z.string().optional(),
  closed_notes: z.string().optional(),
  status: z.string().optional(),
  signature_id: z.number().optional().nullable(),
  tax: z.number().optional().nullable(),
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
      total: z.number(),
    }),
  ),
});

type PoFormValues = z.infer<typeof poSchema>;

interface Props {
  po?: IPo;
}

export default function PoCreatePage({ po }: Props) {
  const { warehouses } = useAppSelector((state) => state.warehouse);
  const { suppliersAll } = useAppSelector((state) => state.supplier);
  const { list } = useAppSelector((state) => state.employe);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supplierCreateModal, setSupplierCreateModal] = useState(false);
  const [warehouseCreateModal, setWarehouseCreateModal] = useState(false);
  const hasFetch = useRef(false);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;
      dispatch(getSupplierAll());
      dispatch(getEmploye({ page: 1, pageSize: 100 }));
      dispatch(getWarehouse({ page: 1, pageSize: 100 }));
      dispatch(setWarehouseQuery({ pageSize: 100 }));

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, []);

  const { control, handleSubmit, setValue, watch, reset } =
    useForm<PoFormValues>({
      resolver: zodResolver(poSchema),
      mode: "onChange",
      defaultValues: {
        supplier_id: undefined,
        date: new Date().toISOString(),
        sub_total: 0,
        tax: 0,
        total: 0,
        other_fee: 0,
        note: "",
        term_credit: 0,
        requested_date: "",
        notes: "",
        signature_id: 0,
        items: [],
        status: "on_progress",
      },
    });

  const { fields, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (po) {
      reset({
        id: po.id,
        supplier_id: po.supplier_id,
        warehouse_id: po.warehouse_id,
        date: po.date,
        sub_total: po.sub_total,
        tax: Number(po.tax || 0),
        total: po.total,
        other_fee: po.other_fee,
        note: po.notes,
        term_credit: Number(po.term_credit || 0),
        requested_date: po.requested_date,
        disc_percentage: Number(po.disc_percentage || 0),
        disc_value: Number(po.disc_value || 0),
        notes: po.notes,
        closed_notes: po.closed_notes,
        status: po.status,
        signature_id: po.signature_id,
        items: po.items.map((item) => ({
          id: item.product_id,
          code: item.product?.code,
          name: item.product?.name,
          unit: item.product?.unit,
          qty: Number(item.qty),
          price: Number(item.price),
          disc_percentage: Number(item.disc_percentage),
          disc_value: Number(item.disc_value),
          ppn_percentage: Number(item.ppn_percentage),
          total: Number(item.total),
        })),
      });
    }
  }, [po]);

  useEffect(() => {
    calculate();
  }, []);

  function calculate() {
    const rawSubTotal = watch("items").reduce((acc, item) => {
      const price = Number(item.price ?? 0);
      const qty = Number(item.qty ?? 0);
      const disc = Number(item.disc_value ?? 0);

      return acc + price * qty - disc;
    }, 0);

    const discFinalNominal = Number(watch("disc_value") ?? 0);
    const otherFee = Number(watch("other_fee") ?? 0);

    const discRatio = rawSubTotal > 0 ? discFinalNominal / rawSubTotal : 0;

    let totalTax = 0;

    watch("items").forEach((item) => {
      const qty = Number(item.qty ?? 0);
      const price = Number(item.price ?? 0);
      const disc = Number(item.disc_value ?? 0);
      const itemAmount = price * qty - disc;

      const taxRate = Number(item.ppn_percentage ?? 0) / 100;

      if (taxRate > 0) {
        const itemAllocatedDisc = itemAmount * discRatio;
        const itemNetForTax = itemAmount - itemAllocatedDisc;

        totalTax += itemNetForTax * taxRate;
      }
    });

    const grandTotal = rawSubTotal - discFinalNominal + totalTax + otherFee;

    setValue("sub_total", rawSubTotal);
    setValue("total", Math.round(grandTotal));
    setValue("tax", totalTax);
  }

  function onSubmit(data: PoFormValues) {
    setLoading(true);

    http
      .post("/po", data)
      .then(({ data }) => {
        notify(data.message);
        navigate("/inventory/po");
      })
      .catch(notifyError)
      .finally(() => {
        setLoading(false);
      });
  }

  function setItems(items: IProduct[]) {
    const payload = [...watch("items")];

    for (const item of items) {
      const find = payload.find((it) => it.id === item.id);

      if (!find) {
        payload.push({
          id: item.id,
          code: item.code,
          name: item.name,
          unit: item.unit,
          qty: 1,
          price: Number(item.purchase_price),
          disc_percentage: 0,
          disc_value: 0,
          ppn_percentage: 0,
          total: Number(item.purchase_price),
        });
      }
    }
    setValue("items", payload);
    calculate();
  }

  return (
    <div>
      <AddSupplierModal
        open={supplierCreateModal}
        setOpen={setSupplierCreateModal}
        onClose={() => dispatch(getSupplierAll())}
      />
      <WarehouseCreateModal
        open={warehouseCreateModal}
        onOpen={setWarehouseCreateModal}
      />
      <ModalPart open={open} setOpen={setOpen} onProducts={setItems} />
      <HeaderAction
        subtitle={`${po ? "Edit" : "Buat"} pesanan pembelian baru ke supplier untuk stok barang.`}
        title={`${po ? "Edit" : "Buat"} PO`}
      />

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
            <div className="flex gap-1">
              <AutocompleteControl
                control={control}
                items={suppliersAll}
                label="Supplier"
                name="supplier_id"
                placeholder="Pilih Supplier"
              />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setSupplierCreateModal(true)}
              >
                <PlusCircle size={20} />
              </Button>
            </div>
          </div>
          <div>
            <div className="flex gap-1">
              <AutocompleteControl
                control={control}
                items={warehouses?.data ?? []}
                label="Gudang"
                name="warehouse_id"
                placeholder="Pilih Gudang"
              />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setWarehouseCreateModal(true)}
              >
                <PlusCircle size={20} />
              </Button>
            </div>
          </div>
        </div>
        <Card className="mt-10">
          <CardHeader className="w-full">
            <div className="flex justify-end w-full">
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
                <TableColumn>Total</TableColumn>
                <TableColumn>Aksi</TableColumn>
              </TableHeader>
              <TableBody emptyContent={<div>Tidak Ada Sparepart</div>}>
                {fields.map((field, index) => {
                  return (
                    <TableRow key={field.id}>
                      <TableCell>{field.code}</TableCell>
                      <TableCell className="max-w-[20rem]">
                        <Tooltip color="primary" content={field.name}>
                          <p className="truncate">{field.name}</p>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{field.unit}</TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`items.${index}.qty`}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              classNames={{
                                input: "text-center w-10",
                              }}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                              size="sm"
                              value={field.value as any}
                              onInput={(val) => {
                                field.onChange(val);
                                calculate();
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`items.${index}.price`}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              classNames={{
                                input: "text-right w-20",
                              }}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                              size="sm"
                              startContent={<span className="text-sm">Rp</span>}
                              value={Number(field.value) as any}
                              onInput={(val) => {
                                field.onChange(val);
                                calculate();
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`items.${index}.disc_percentage`}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              classNames={{
                                input: "text-center w-8",
                              }}
                              endContent={<span className="text-sm">%</span>}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                              size="sm"
                              value={Number(field.value) as any}
                              onInput={(val) => {
                                field.onChange(val);
                                const discValue =
                                  (Number(val) / 100) *
                                  Number(watch("items")[index].price) *
                                  Number(watch("items")[index].qty);

                                setValue(
                                  `items.${index}.disc_value`,
                                  discValue,
                                );
                                calculate();
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`items.${index}.disc_value`}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              classNames={{
                                input: "text-right w-24",
                              }}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                              size="sm"
                              startContent={<span className="text-sm">Rp</span>}
                              value={Number(field.value) as any}
                              onInput={(val) => {
                                field.onChange(val);

                                const percentage =
                                  (Number(val) /
                                    (Number(watch("items")[index].qty) *
                                      Number(watch("items")[index].price))) *
                                  100;

                                setValue(
                                  `items.${index}.disc_percentage`,
                                  percentage,
                                );

                                calculate();
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`items.${index}.ppn_percentage`}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              classNames={{
                                input: "text-center w-8",
                              }}
                              endContent={<span className="text-sm">%</span>}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                              size="sm"
                              value={Number(field.value) as any}
                              onInput={(val) => {
                                field.onChange(val);
                                calculate();
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        {formatIDR(
                          Number(watch("items")[index].qty) *
                            Number(watch("items")[index].price) -
                            Number(watch("items")[index].disc_value || 0) +
                            (Number(watch("items")[index].qty) *
                              Number(watch("items")[index].price) *
                              Number(
                                watch("items")[index].ppn_percentage || 0,
                              )) /
                              100,
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip color="danger" content={`Hapus ${field.name}`}>
                          <Button
                            isIconOnly
                            color="danger"
                            radius="full"
                            size="sm"
                            variant="light"
                            onPress={() => remove(index)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
          <CardFooter>
            <div className="flex w-full justify-between gap-5 mt-5">
              <div className="flex flex-col gap-1 justify-end w-full">
                <Controller
                  control={control}
                  name="term_credit"
                  render={({ field, fieldState }) => (
                    <InputNumber
                      classNames={{
                        label: "w-34",
                        input: "text-end",
                      }}
                      endContent={<span className="text-sm">Hari</span>}
                      errorMessage={fieldState.error?.message}
                      isInvalid={!!fieldState.error}
                      label="Term Credit"
                      labelPlacement="outside-left"
                      size="sm"
                      value={field.value as any}
                      onInput={field.onChange}
                    />
                  )}
                />
                <div className="flex gap-10">
                  <div>
                    <Controller
                      control={control}
                      name="requested_date"
                      render={({ field, fieldState }) => (
                        <DatePicker
                          classNames={{
                            label: "w-34",
                          }}
                          errorMessage={fieldState.error?.message}
                          isInvalid={!!fieldState.error}
                          label="Tgl Diminta"
                          labelPlacement="outside-left"
                          size="sm"
                          value={field.value as any}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        isSelected={field.value === "closed"}
                        size="sm"
                        onChange={(e) => {
                          field.onChange(
                            e.target.checked ? "closed" : "in_progress",
                          );
                        }}
                      >
                        {field.value === "closed"
                          ? "Closed (Catatan Close Order)"
                          : "In Progress"}
                      </Checkbox>
                    )}
                  />
                </div>
                <div className="flex gap-10">
                  <div>
                    <Controller
                      control={control}
                      name="signature_id"
                      render={({ field }) => (
                        <Autocomplete
                          inputProps={{
                            size: "sm",
                            label: "Signature",
                            labelPlacement: "outside-left",
                            classNames: {
                              label: "w-34",
                            },
                          }}
                          items={list?.data || []}
                          selectedKey={field.value?.toString()}
                          size="sm"
                          onSelectionChange={(val) => {
                            field.onChange(Number(val));
                          }}
                        >
                          {(item) => (
                            <AutocompleteItem key={item.id}>
                              {item.name}
                            </AutocompleteItem>
                          )}
                        </Autocomplete>
                      )}
                    />
                  </div>
                  {watch("status") === "closed" && (
                    <Controller
                      control={control}
                      name="closed_notes"
                      render={({ field }) => (
                        <Input
                          {...field}
                          fullWidth
                          className="w-1/3"
                          placeholder="Catatan Penutup"
                          size="sm"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  )}
                </div>
                <Controller
                  control={control}
                  name="notes"
                  render={({ field }) => (
                    <Input
                      {...field}
                      classNames={{
                        label: "w-34",
                        mainWrapper: "w-1/2",
                      }}
                      label="Catatan"
                      labelPlacement="outside-left"
                      size="sm"
                    />
                  )}
                />
              </div>
              <div>
                <SumaryTable
                  control={control}
                  isDisable={false}
                  setValue={setValue}
                  showTotal={true}
                  watch={watch}
                  onAction={calculate}
                />
              </div>
            </div>
          </CardFooter>
          <CardFooter className="flex w-full justify-end mt-5 gap-2">
            <Button
              color="default"
              size="sm"
              startContent={<ArrowBigLeftDash />}
              variant="bordered"
              onPress={() => navigate("/inventory/po")}
            >
              Kembali
            </Button>
            <Button
              color="primary"
              disabled={loading}
              size="sm"
              startContent={!loading && <SaveAllIcon />}
              type="submit"
            >
              {loading ? "Loading..." : "Simpan"}
            </Button>
          </CardFooter>
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
