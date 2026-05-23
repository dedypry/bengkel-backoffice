import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import {
  ArrowBigLeftDash,
  DownloadIcon,
  Plus,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Input,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ModalPart from "../po/modal-part";

import DatePicker from "@/components/forms/date-picker";
import HeaderAction from "@/components/header-action";
import AutocompleteControl from "@/components/forms/auto-complete-control";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { getSupplierAll } from "@/stores/features/supplier/supplier-action";
import { getWarehouse } from "@/stores/features/warehouse/warehouse-action";
import { setWarehouseQuery } from "@/stores/features/warehouse/warehouse-slice";
import AddSupplierModal from "@/pages/master/suppliers/components/add-modal";
import WarehouseCreateModal from "@/pages/master/warehouses/warehouse-create-modal";
import { IProduct } from "@/utils/interfaces/IProduct";
import SumaryTable from "@/components/sumary";
import InputNumber from "@/components/input-number";
import { formatIDR } from "@/utils/helpers/format";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { IPo } from "@/utils/interfaces/po";
import { handleDownload } from "@/utils/helpers/global";

const schema = z.object({
  id: z.number().optional().nullable(),
  po_no: z.string().optional().nullable(),
  date: z.string().min(1, "Date must be selected"),
  invoice_no: z.string().optional().nullable(),
  payment_type: z.enum(["cash", "credit"]),
  payment_method: z.string(),
  payment_method_data: z.any().optional(),
  supplier_id: z.number("Supplier harus dipilih"),
  due_days: z.number().nonnegative(),
  due_date: z.string().optional().nullable(),
  received_at: z.string().optional().nullable(),
  warehouse_id: z.number().optional().nullable(),
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
  notes: z.string().optional().nullable(),
  signature_id: z.number().optional(),
  sub_total: z.number().nonnegative(),
  disc_value: z.number().nonnegative(),
  disc_percentage: z.number().nonnegative().optional().nullable(),
  tax: z.number().min(0),
  other_fee: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

type InvoiceFormValues = z.infer<typeof schema>;

export default function PoInvoiceCreatePage({ po }: { po?: IPo }) {
  const { warehouses } = useAppSelector((state) => state.warehouse);
  const { suppliersAll } = useAppSelector((state) => state.supplier);
  const { list } = useAppSelector((state) => state.employe);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
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

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: undefined,
      po_no: "",
      date: new Date().toISOString(),
      received_at: new Date().toISOString(),
      invoice_no: "",
      payment_type: "cash",
      payment_method: "Cash",
      due_days: 1,
      due_date: dayjs().add(1, "day").toISOString(),
      items: [],
      other_fee: 0,
      notes: "",
      disc_percentage: 0,
      disc_value: 0,
      tax: 0,
      sub_total: 0,
      total: 0,
    },
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (po) {
      const paymentType = po.payment_type === "credit" ? "credit" : "cash";

      reset({
        id: po.id,
        po_no: po.po_no,
        date: po.date,
        invoice_no: po.invoice_no,
        payment_type: paymentType,
        payment_method: po.payment_method,
        due_days: Number(po.due_day ?? 1),
        due_date: po.due_date,
        received_at: po.received_at,
        warehouse_id: po.warehouse_id,
        supplier_id: po.supplier_id,
        items: (po.items || []).map((item) => ({
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
        notes: po.notes,
        signature_id: po.signature_id,
        sub_total: Number(po.sub_total || 0),
        tax: Number(po.tax || 0),
        total: Number(po.total || 0),
        other_fee: Number(po.other_fee || 0),
        disc_percentage: Number(po.disc_percentage || 0),
        disc_value: Number(po.disc_value || 0),
      });
    }
  }, [po]);

  console.error(errors);

  const onSubmit = (data: InvoiceFormValues) => {
    setLoading(true);

    http
      .post("/po", { ...data, status: "invoice" })
      .then(({ data }) => {
        notify(data.message);
        navigate("/purchase/invoice");
      })
      .catch(notifyError)
      .finally(() => {
        setLoading(false);
      });
  };

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

  function handleDueDay(day: number) {
    const date = dayjs().add(day, "day").toISOString();

    setValue("due_date", date);
  }

  function handleDueDate(date: string) {
    const targetDate = dayjs(date);
    const today = dayjs().startOf("day");
    const diffInDays = targetDate.diff(today, "day");

    setValue("due_days", diffInDays);
  }

  return (
    <>
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
        actionContent={
          po && (
            <div className="flex">
              <Button
                className="text-white"
                color="success"
                isLoading={downloadLoading}
                size="sm"
                startContent={!downloadLoading && <DownloadIcon size={18} />}
                onPress={() =>
                  handleDownload(
                    `/po/invoice/download/${po.id}`,
                    po.po_no,
                    true,
                    setDownloadLoading,
                  )
                }
              >
                Download Invoice
              </Button>
            </div>
          )
        }
        subtitle="Tambah faktur pembelian"
        title="Tambah Faktur"
      />
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit as any)}>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-1">
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      classNames={{
                        label: "w-28 text-sm",
                        mainWrapper: "w-full",
                      }}
                      label="Tanggal Faktur"
                      labelPlacement="outside-left"
                      size="sm"
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
                <div className="flex w-full gap-1">
                  <Controller
                    control={control}
                    name="po_no"
                    render={({ field }) => (
                      <Input
                        {...(field as any)}
                        className="min-w-0 flex-1"
                        classNames={{
                          label: "w-28 text-sm",
                          mainWrapper: "w-full",
                        }}
                        label="No. PO"
                        labelPlacement="outside-left"
                        placeholder="Autogenerate jika kosong"
                        size="sm"
                      />
                    )}
                  />
                  {/* <Button isIconOnly size="sm" variant="bordered">
                    <SearchCodeIcon size={18} />
                  </Button> */}
                </div>
                <Controller
                  control={control}
                  name="invoice_no"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      classNames={{
                        label: "w-28 text-sm",
                        mainWrapper: "w-full",
                      }}
                      label="No. Faktur"
                      labelPlacement="outside-left"
                      placeholder="#Faktur Supplier"
                      size="sm"
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
                    variant="bordered"
                    onPress={() => setSupplierCreateModal(true)}
                  >
                    <PlusCircle size={18} />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Controller
                  control={control}
                  name="payment_type"
                  render={({ field }) => (
                    <div className="flex items-center gap-1 mb-4">
                      <label
                        className="w-28 text-sm ml-2 -mr-2"
                        htmlFor="payment_type"
                      >
                        Pembayaran
                      </label>
                      <RadioGroup
                        id="payment_type"
                        orientation="horizontal"
                        size="sm"
                        value={field.value}
                        onValueChange={(val) => field.onChange(val)}
                      >
                        <Radio value="cash">Tunai</Radio>
                        <Radio value="credit">Kredit</Radio>
                      </RadioGroup>
                    </div>
                  )}
                />
                <Controller
                  control={control}
                  name="due_days"
                  render={({ field }) => (
                    <InputNumber
                      classNames={{
                        label: "w-28 text-sm",
                        mainWrapper: "w-full",
                      }}
                      endContent={<span className="text-sm">Hari</span>}
                      isDisabled={watch("payment_type") === "cash"}
                      label="Tempo"
                      labelPlacement="outside-left"
                      size="sm"
                      value={field.value as any}
                      onInput={(val) => {
                        field.onChange(val);
                        handleDueDay(val);
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="due_date"
                  render={({ field }) => (
                    <DatePicker
                      classNames={{
                        label: "w-28 text-sm",
                        mainWrapper: "w-full",
                      }}
                      isDisabled={watch("payment_type") === "cash"}
                      label="Tgl. Tempo"
                      labelPlacement="outside-left"
                      size="sm"
                      value={field.value as any}
                      onChange={(val) => {
                        field.onChange(val);
                        handleDueDate(val as any);
                      }}
                    />
                  )}
                />

                <div className="flex gap-1">
                  <AutocompleteControl
                    control={control}
                    items={warehouses?.data || []}
                    label="Gudang"
                    name="warehouse_id"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    variant="bordered"
                    onPress={() => setWarehouseCreateModal(true)}
                  >
                    <PlusCircle size={20} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <Button
                color="primary"
                size="sm"
                startContent={<Plus size={18} />}
                onPress={() => setOpen(true)}
              >
                Tambah Barang
              </Button>
            </div>
            <Table
              className="mb-5 mt-2"
              classNames={{
                wrapper: "shadow-none p-0",
              }}
            >
              <TableHeader>
                <TableColumn>Kode Barang</TableColumn>
                <TableColumn>Nama Barang</TableColumn>
                <TableColumn>Satuan</TableColumn>
                <TableColumn className="text-center">Qty</TableColumn>
                <TableColumn className="text-center">Harga Beli</TableColumn>
                <TableColumn className="text-center">Disc (%)</TableColumn>
                <TableColumn className="text-center">Nilai Disc</TableColumn>
                <TableColumn>Pjk (%)</TableColumn>
                <TableColumn className="text-center">Jumlah</TableColumn>
                <TableColumn className="text-center">Aksi</TableColumn>
              </TableHeader>
              <TableBody emptyContent={<div>Tidak Ada Barang</div>}>
                {fields.map((field, index) => (
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

                              setValue(`items.${index}.disc_value`, discValue);
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
                    <TableCell className="text-right">
                      {formatIDR(
                        Number(watch("items")[index].qty) *
                          Number(watch("items")[index].price) -
                          Number(watch("items")[index].disc_value || 0) +
                          (Number(watch("items")[index].qty) *
                            Number(watch("items")[index].price) *
                            Number(watch("items")[index].ppn_percentage || 0)) /
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
                          onPress={() => {
                            remove(index);
                            calculate();
                          }}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex gap-10 justify-between">
              <div className="space-y-1 flex flex-col justify-end">
                <Controller
                  control={control}
                  name="received_at"
                  render={({ field }) => (
                    <DatePicker
                      classNames={{
                        label: "w-34",
                        mainWrapper: "w-full",
                      }}
                      label="Tanggal Penerimaan"
                      labelPlacement="outside-left"
                      size="sm"
                      value={field.value!}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
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
                          mainWrapper: "w-full",
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
                <Controller
                  control={control}
                  name="notes"
                  render={({ field }) => (
                    <Input
                      {...(field as any)}
                      classNames={{
                        label: "w-34",
                        mainWrapper: "w-full",
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
            <div className="flex justify-end mt-5 gap-2">
              <Button
                color="default"
                size="sm"
                variant="bordered"
                onPress={() => navigate("/purchase/invoice")}
              >
                <ArrowBigLeftDash size={18} />
              </Button>
              <Button
                color="primary"
                isLoading={loading}
                size="sm"
                startContent={<Save size={18} />}
                type="submit"
              >
                Simpan
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
