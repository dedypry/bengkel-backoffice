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
  Button,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { BanknoteArrowUp } from "lucide-react";

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

export default function DetailTrx({ open, setOpen }: Props) {
  const { trxDetail } = useAppSelector((state) => state.vendor);
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPurchaseVendorForm>({
    resolver: zodResolver(PurchaseVendorSchema),
    mode: "onChange",
    defaultValues: {
      date: dayjs().toISOString(),
      invoiceNo: "",
      paymentType: "cash",
      paymentMethod: "cash",
      dueDays: 1,
      dueDate: dayjs().add(1, "day").toISOString(),
      items: [],
      otherFees: 0,
      purchaseNo: "",
      signature: "MANSUR SAH",
    },
  });

  console.log(errors);

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  function handleCalculate() {
    const items = watch("items") || [];
    const otherFees = watch("otherFees") || 0;
    const itemsSelected = items.filter((e) => e.select);

    const selAll = items.length === itemsSelected.length;

    setSelectAll(selAll);
    setIsIndeterminate(itemsSelected.length > 0 && !selAll);

    let subTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    for (const item of itemsSelected) {
      const price = Number(item.purchasePrice || 0);
      const discValue = item.discValue || 0;
      const taxRate = item.taxPercentage || 0;

      subTotal += price;
      totalDiscount += discValue;
      const dpp = price - discValue;
      const lineTax = (dpp * taxRate) / 100;

      totalTax += lineTax;
    }

    const finalTotal = subTotal - totalDiscount + totalTax + otherFees;

    setValue("subTotal", subTotal);
    setValue("finalDiscValue", totalDiscount);
    setValue("tax", totalTax);
    setValue("total", finalTotal);
  }

  useEffect(() => {
    if (trxDetail && open) {
      const items = trxDetail?.items.map((e) => ({
        id: e.id,
        code: e.data.code,
        name: e.data.name,
        purchasePrice: +e.total_price,
        discPercentage: 0,
        total: +e.total_price,
        taxPercentage: 0,
        discValue: 0,
        select: true,
      }));

      setValue("items", items as any);

      setValue("purchaseNo", trxDetail.wo.trx_no);
      handleCalculate();
    }
  }, [trxDetail, open]);

  function handleDueDay(day: number) {
    const date = dayjs().add(day, "day").toISOString();

    setValue("dueDate", date);
  }

  function handleDueDate(date: string) {
    const targetDate = dayjs(date);
    const today = dayjs().startOf("day");
    const diffInDays = targetDate.diff(today, "day");

    setValue("dueDays", diffInDays);
  }

  function handleCheckAll(val: boolean) {
    setSelectAll(val);

    const items = watch("items").map((e) => ({
      ...e,
      select: val,
    }));

    setValue("items", items);
    setIsIndeterminate(false);
    handleCalculate();
  }

  function onSubmit(data: IPurchaseVendorForm) {
    console.log(data);
  }

  if (!trxDetail) return null;

  return (
    <Modal
      classNames={{
        wrapper: "w-full",
        base: "max-w-[95%] w-full",
      }}
      isOpen={open}
      scrollBehavior="outside"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Pembelian Jasa Divendorkan</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody className="py-6">
                <div className="grid grid-cols-12 gap-x-8 gap-y-1 mb-6">
                  <div className="col-span-5 flex flex-col gap-1">
                    <FormRow label="No. Beli" value={watch("purchaseNo")} />
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
                              errorMessage={fieldState.error?.message}
                              isDisabled={watch("paymentType") === "cash"}
                              isInvalid={!!fieldState.error}
                              minDate={new Date()}
                              size="sm"
                              value={field.value as any}
                              onChange={(val) => {
                                field.onChange(val);
                                handleDueDate(val as any);
                              }}
                            />
                          )}
                        />
                      }
                    />
                    <FormRow
                      label="Metode"
                      value={
                        <Controller
                          control={control}
                          name="paymentMethod"
                          render={({ field, fieldState }) => (
                            <div className="flex justify-between">
                              <p>{field.value}</p>
                              <Button isIconOnly size="sm" variant="light">
                                <BanknoteArrowUp size={18} />
                              </Button>
                            </div>
                          )}
                        />
                      }
                    />
                  </div>
                </div>

                {/* TABLE SECTION */}
                <Table removeWrapper aria-label="Detail Jasa Table">
                  <TableHeader>
                    <TableColumn>
                      <Checkbox
                        isIndeterminate={isIndeterminate}
                        isSelected={selectAll}
                        onValueChange={handleCheckAll}
                      />
                    </TableColumn>
                    <TableColumn>Kode Jasa</TableColumn>
                    <TableColumn>Nama Jasa</TableColumn>
                    <TableColumn className="text-center">
                      Harga Beli
                    </TableColumn>
                    <TableColumn className="text-center">Disc %</TableColumn>
                    <TableColumn className="text-center">
                      Nilai Disc
                    </TableColumn>
                    <TableColumn className="text-center">PPN %</TableColumn>
                    <TableColumn className="text-center">Jumlah</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            control={control}
                            name={`items.${index}.select`}
                            render={({ field: { onChange } }) => (
                              <Checkbox
                                isSelected={watch(`items.${index}.select`)}
                                onValueChange={(val) => {
                                  onChange(val);
                                  handleCalculate();
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>{field.code} </TableCell>
                        <TableCell>{field.name}</TableCell>
                        <TableCell className="text-right">
                          <Controller
                            control={control}
                            name={`items.${index}.purchasePrice`}
                            render={({ field: { onChange, value } }) => (
                              <InputNumber
                                className="w-32"
                                classNames={{
                                  input: "text-right",
                                }}
                                size="sm"
                                startContent="Rp"
                                value={Number(value) as any}
                                onInput={(val) => {
                                  onChange(val);
                                  handleCalculate();
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Controller
                            control={control}
                            name={`items.${index}.discPercentage`}
                            render={({ field: { onChange, value } }) => (
                              <InputNumber
                                className="w-32"
                                classNames={{
                                  input: "text-right",
                                }}
                                size="sm"
                                startContent="Rp"
                                value={Number(value) as any}
                                onInput={(val) => {
                                  onChange(val);
                                  const purchasePrice = Number(
                                    watch(`items.${index}.purchasePrice`) || 0,
                                  );

                                  const percentage = Number(val) || 0;
                                  const calculatedDiscValue =
                                    (percentage / 100) * purchasePrice;

                                  setValue(
                                    `items.${index}.discValue`,
                                    calculatedDiscValue,
                                  );
                                  setValue(
                                    `items.${index}.total`,
                                    purchasePrice - calculatedDiscValue,
                                  );
                                  handleCalculate();
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Controller
                            control={control}
                            name={`items.${index}.discValue`}
                            render={({ field: { onChange, value } }) => (
                              <InputNumber
                                className="w-32"
                                classNames={{
                                  input: "text-right",
                                }}
                                size="sm"
                                startContent="Rp"
                                value={Number(value) as any}
                                onInput={(val) => {
                                  onChange(val);
                                  const purchasePrice = Number(
                                    watch(`items.${index}.purchasePrice`) || 0,
                                  );
                                  const discValue = Number(val) || 0;
                                  let calculatedPercentage = 0;

                                  if (purchasePrice > 0) {
                                    calculatedPercentage =
                                      (discValue / purchasePrice) * 100;
                                  }
                                  setValue(
                                    `items.${index}.discPercentage`,
                                    calculatedPercentage,
                                  );

                                  setValue(
                                    `items.${index}.total`,
                                    purchasePrice - val,
                                  );

                                  handleCalculate();
                                }}
                              />
                            )}
                          />
                        </TableCell>

                        <TableCell className="text-right">
                          <Controller
                            control={control}
                            name={`items.${index}.taxPercentage`}
                            render={({ field: { onChange, value } }) => (
                              <InputNumber
                                className="w-32"
                                classNames={{
                                  input: "text-right",
                                }}
                                endContent="%"
                                size="sm"
                                value={Number(value) as any}
                                onInput={(val) => {
                                  onChange(val);
                                  handleCalculate();
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatIDR(watch(`items.${index}.total`))}
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
                      <Controller
                        control={control}
                        name="notes"
                        render={({ field }) => (
                          <Textarea
                            {...(field as any)}
                            minRows={6}
                            placeholder="Tuliskan catatan disini..."
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold w-20">Signature :</p>
                      <p className="text-sm border-b w-40">
                        {watch("signature")}
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
                        value={Number(watch("subTotal")) as any}
                      />
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div className="flex gap-2 items-center">
                        <span>Disc. Final</span>
                      </div>
                      <InputNumber
                        isDisabled
                        className="w-32"
                        classNames={{
                          input: "text-right",
                        }}
                        size="sm"
                        startContent="Rp"
                        value={watch("finalDiscValue") as any}
                      />
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Pajak</span>
                      <InputNumber
                        isDisabled
                        className="w-32"
                        classNames={{
                          input: "text-right",
                        }}
                        size="sm"
                        startContent="Rp"
                        value={watch("tax") as any}
                      />
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Biaya Lain</span>
                      <Controller
                        control={control}
                        name="otherFees"
                        render={({ field }) => (
                          <InputNumber
                            className="w-32"
                            classNames={{
                              input: "text-right",
                            }}
                            size="sm"
                            startContent="Rp"
                            value={field.value as any}
                            onInput={(val) => {
                              field.onChange(val);
                              handleCalculate();
                            }}
                          />
                        )}
                      />
                    </div>
                    <Divider className="my-1" />
                    <div className="flex justify-between items-center py-1 font-bold text-lg">
                      <span>Total</span>
                      <InputNumber
                        isDisabled
                        className="w-32"
                        classNames={{
                          input: "text-right",
                        }}
                        value={watch("total") as any}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-5">
                  <Button
                    onPress={() => {
                      setOpen(false);
                      reset();
                    }}
                  >
                    Batal
                  </Button>
                  <Button color="primary" type="submit">
                    Simpan
                  </Button>
                </div>
              </ModalBody>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
