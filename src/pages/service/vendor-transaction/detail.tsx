import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Divider,
  Input,
  CheckboxGroup,
  Checkbox,
  Textarea,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Selection } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import { IPurchaseVendorForm, PurchaseVendorSchema } from "./schema";

import { useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import FormRow from "@/components/form-row";
import DatePicker from "@/components/forms/date-picker";
import InputNumber from "@/components/input-number";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const schema = "";

export default function DetailTrx({ open, setOpen }: Props) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [ids, setIds] = useState<number[]>([]);
  const { trxDetail } = useAppSelector((state) => state.vendor);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrantTotal] = useState(0);

  useEffect(() => {
    if (selectedKeys === "all") {
      // Logika jika semua dipilih
      const sub = trxDetail?.items.reduce(
        (a, sum) => a + (Number(sum.price) + sum.qty),
        0,
      );

      setIds(trxDetail?.items.map((e) => e.id) || []);
      setSubTotal(sub || 0);
    } else {
      const selectedIds = Array.from(selectedKeys).map((e) => Number(e));

      setIds(selectedIds as number[]);

      const selectedItems = trxDetail?.items.filter((e) =>
        selectedIds.includes(e.id),
      );

      console.log("selected", selectedItems, selectedIds, trxDetail?.items);

      const sub = selectedItems?.reduce(
        (sum, item) => sum + (Number(item.price) + item.qty),
        0,
      );

      setSubTotal(sub || 0);
    }
  }, [selectedKeys]);

  const { control, watch, setValue } = useForm<IPurchaseVendorForm>({
    resolver: zodResolver(PurchaseVendorSchema),
    defaultValues: {
      date: dayjs().toISOString(),
      invoiceNo: "",
      paymentType: "cash",
      dueDays: 1,
      dueDate: dayjs().add(1, "day").toISOString(),
    },
  });

  function handleDueDay(day: number) {
    const date = dayjs().add(day, "day").toISOString();

    setValue("dueDate", date);
  }

  if (!trxDetail) return null;

  return (
    <Modal
      isOpen={open}
      scrollBehavior="outside"
      size="5xl"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Pembelian Jasa Divendorkan</ModalHeader>
            <form action="">
              <ModalBody className="py-6">
                <div className="grid grid-cols-12 gap-x-8 gap-y-1 mb-6">
                  <div className="col-span-5 flex flex-col gap-1">
                    <FormRow label="No. Beli" value={trxDetail.wo.trx_no} />
                    <FormRow
                      label="Tanggal"
                      value={
                        <Controller
                          control={control}
                          name="date"
                          render={({ field, fieldState }) => (
                            <DatePicker
                              size="sm"
                              {...field}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                            />
                          )}
                        />
                      }
                    />
                    <FormRow
                      label="No. Faktur"
                      value={
                        <Controller
                          control={control}
                          name="invoiceNo"
                          render={({ field, fieldState }) => (
                            <Input
                              placeholder="#Faktur Supplier"
                              size="sm"
                              {...(field as any)}
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                            />
                          )}
                        />
                      }
                    />
                    <FormRow
                      label="Supplier"
                      value={trxDetail.supplier?.name || "-"}
                    />
                  </div>
                  <div className="col-span-2" /> {/* Spacer */}
                  <div className="col-span-5 flex flex-col gap-1">
                    <FormRow
                      label="Pembayaran"
                      value={
                        <Controller
                          control={control}
                          name="paymentType"
                          render={({ field, fieldState }) => (
                            <CheckboxGroup
                              errorMessage={fieldState.error?.message}
                              isInvalid={!!fieldState.error}
                              orientation="horizontal"
                              size="sm"
                              value={[field.value || ""]}
                              onValueChange={(val) => field.onChange(val[1])}
                            >
                              <Checkbox value="cash">Lunas</Checkbox>
                              <Checkbox value="credit">Kredit</Checkbox>
                            </CheckboxGroup>
                          )}
                        />
                      }
                    />
                    <FormRow
                      label="Tempo"
                      value={
                        <Controller
                          control={control}
                          name="dueDays"
                          render={({ field, fieldState }) => (
                            <InputNumber
                              endContent="Hari"
                              errorMessage={fieldState.error?.message}
                              isDisabled={watch("paymentType") === "cash"}
                              isInvalid={!!fieldState.error}
                              size="sm"
                              value={field.value as any}
                              onInput={(val) => {
                                field.onChange(val);
                                handleDueDay(val);
                              }}
                            />
                          )}
                        />
                      }
                    />
                    <FormRow
                      label="Tgl. Tempo"
                      value={
                        <Controller
                          control={control}
                          name="dueDate"
                          render={({ field, fieldState }) => (
                            <DatePicker
                              {...(field as any)}
                              errorMessage={fieldState.error?.message}
                              isDisabled={watch("paymentType") === "cash"}
                              isInvalid={!!fieldState.error}
                              minDate={new Date()}
                              size="sm"
                            />
                          )}
                        />
                      }
                    />
                  </div>
                </div>

                {/* TABLE SECTION */}
                <Table
                  removeWrapper
                  aria-label="Detail Jasa Table"
                  selectedKeys={selectedKeys}
                  selectionMode="multiple"
                  onSelectionChange={setSelectedKeys}
                >
                  <TableHeader>
                    <TableColumn>No. PKB</TableColumn>
                    <TableColumn>Kode Jasa</TableColumn>
                    <TableColumn>Nama Jasa</TableColumn>
                    <TableColumn className="text-right">Harga Beli</TableColumn>
                    <TableColumn className="text-center">Qty</TableColumn>
                    <TableColumn className="text-right">Jumlah</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {trxDetail.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="py-2">
                          {trxDetail.wo.trx_no}
                        </TableCell>
                        <TableCell>{item.data.code}</TableCell>
                        <TableCell>{item.data.name}</TableCell>
                        <TableCell className="text-right">
                          {formatIDR(item.price)}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.qty}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatIDR(item.total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* FOOTER SECTION */}
                <div className="grid grid-cols-12 mt-6 gap-20">
                  <div className="col-span-7 flex flex-col gap-3">
                    <div className="flex flex-col gap-1 mb-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Catatan :
                      </p>
                      <Textarea minRows={6} />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold w-20">Signature :</p>
                      <p className="text-sm border-b w-40">
                        {trxDetail.signature || "MANSUR SAH"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-5 flex flex-col gap-1 text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span>Sub Total</span>
                      <InputNumber
                        isDisabled
                        className="w-32"
                        classNames={{
                          input: "text-right",
                        }}
                        size="sm"
                        startContent="Rp"
                        value={subTotal as any}
                      />
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div className="flex gap-2 items-center">
                        <span>Disc. Final</span>
                        <span className="border px-1 text-[10px]">0%</span>
                      </div>
                      <InputNumber
                        className="w-32"
                        classNames={{
                          input: "text-right",
                        }}
                        size="sm"
                        startContent="Rp"
                        value={discount as any}
                        onInput={setDiscount}
                      />
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Pajak</span>
                      <InputNumber
                        className="w-32"
                        classNames={{
                          input: "text-right",
                        }}
                        endContent="%"
                        size="sm"
                        value={discount as any}
                        onInput={setDiscount}
                      />
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Biaya Lain</span>
                      <InputNumber
                        className="w-32"
                        classNames={{
                          input: "text-right",
                        }}
                        size="sm"
                        startContent="Rp"
                        value={discount as any}
                        onInput={setDiscount}
                      />
                    </div>
                    <Divider className="my-1" />
                    <div className="flex justify-between items-center py-1 font-bold text-lg">
                      <span>Total</span>
                      <span className="bg-blue-50 text-primary px-2 py-1 w-32 text-right border border-blue-200">
                        {formatIDR(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
