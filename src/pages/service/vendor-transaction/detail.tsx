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
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Edit, Printer } from "lucide-react";

import { IPurchaseVendorForm, PurchaseVendorSchema } from "./schema";
import PaymentMethod from "./payment-method";
import AddWoItems from "./add-wo-items";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import FormRow from "@/components/form-row";
import DatePicker from "@/components/forms/date-picker";
import InputNumber from "@/components/input-number";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { getAvatarByName, handleDownload } from "@/utils/helpers/global";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { getVendorTransaction } from "@/stores/features/vendor/vendor-action";
import SupplierList from "@/components/supplier-list";
import { IService } from "@/utils/interfaces/IService";
import { IWOItems } from "@/utils/interfaces/IUser";
import debounce from "@/utils/helpers/debounce";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  onSuccess?: () => void;
  isViewOnly?: boolean;
  setIsViewOnly?: (val: boolean) => void;
}

interface ICalculateTotal {
  price: any;
  ppn: any;
  disc: any;
}

export default function DetailTrx({
  open,
  setOpen,
  onSuccess,
  isViewOnly,
  setIsViewOnly,
}: Props) {
  const { trxDetail, vendorQuery } = useAppSelector((state) => state.vendor);
  const { list } = useAppSelector((state) => state.employe);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  const { control, watch, setValue, handleSubmit, reset } =
    useForm<IPurchaseVendorForm>({
      resolver: zodResolver(PurchaseVendorSchema),
      mode: "onChange",
      defaultValues: {
        date: dayjs().toISOString(),
        invoiceNo: "",
        paymentType: "cash",
        paymentMethod: "Cash",
        dueDays: 1,
        dueDate: dayjs().add(1, "day").toISOString(),
        items: [],
        otherFees: 0,
        purchaseNo: "",
        notes: "",
      },
    });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const handleCalculate = debounce(calculate, 1000);

  function calculate() {
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

  const paymentItems = (e: IWOItems<IService>) => {
    const payload = {
      id: e.id,
      trx_no: e.trx_no,
      code: e.data.code,
      name: e.data.name,
      purchasePrice: Number(e.purchase_price) || Number(e.total_price) || 0,
      discPercentage: Number(e.disc_percentage || 0),
      total: Number(e.total_payment) || Number(e.total_price) || 0,
      taxPercentage: Number(e.tax_percentage || 0),
      discValue: Number(e.disc_value || 0),
      select: true,
    };

    return payload;
  };

  useEffect(() => {
    if (trxDetail && open) {
      const items = trxDetail?.items.map(paymentItems);

      setValue("items", items as any);

      if (trxDetail.id) {
        setValue("id", trxDetail.id);
        setValue("date", trxDetail.date);
        setValue("invoiceNo", trxDetail.invoice_no);
        setValue("paymentType", trxDetail.payment_type);
        setValue("paymentMethod", trxDetail.payment_method);
        setValue("dueDays", trxDetail.due_days);
        setValue("dueDate", trxDetail.due_date);
        setValue("notes", trxDetail.notes);
        setValue("signatureId", trxDetail.signature_id || undefined);
      }

      setValue("purchaseNo", trxDetail?.purchase_no);
      setValue("supplierId", trxDetail?.supplier?.id);
      handleCalculate();
      if (!hasFetched.current) {
        hasFetched.current = true;
        dispatch(getEmploye({ page: 1, pageSize: 500 }));
        setTimeout(() => {
          hasFetched.current = false;
        }, 1000);
      }
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
    setLoading(true);
    http
      .post("/vendor-transaction", {
        ...data,
        items: data.items.filter((e) => e.select),
      })
      .then(({ data }) => {
        notify(data.message);
        setOpen(false);
        dispatch(getVendorTransaction(vendorQuery));
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch(notifyError)
      .finally(() => {
        setLoading(false);
      });
  }

  function calculateTotal({ ppn = 0, price = 0, disc = 0 }: ICalculateTotal) {
    ppn = Number(ppn);
    price = Number(price);
    disc = Number(disc);

    const subtotal = price - disc;

    ppn = subtotal * (ppn / 100);

    return subtotal + ppn;
  }

  function handleAddList(data: IWOItems<IService>[]) {
    const payload = [...watch("items"), ...data.map(paymentItems)];

    setValue("items", payload);
    handleCalculate();
  }

  if (!trxDetail) return null;

  return (
    <Modal
      backdrop="blur"
      classNames={{
        wrapper: "w-full",
        base: "max-w-[95%] w-full",
      }}
      isDismissable={false}
      isOpen={open}
      scrollBehavior="outside"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="flex w-full justify-between">
                <p>Pembelian Jasa Divendorkan</p>
                {isViewOnly && (
                  <div className="flex gap-1 mr-10">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() =>
                        handleDownload(
                          `/vendor-transaction/payment/download/${trxDetail.id}`,
                          trxDetail.purchase_no,
                          true,
                        )
                      }
                    >
                      <Printer />
                    </Button>
                    <Button
                      isIconOnly
                      color="warning"
                      size="sm"
                      variant="light"
                      onPress={() => {
                        if (setIsViewOnly) {
                          setIsViewOnly(false);
                        }
                      }}
                    >
                      <Edit />
                    </Button>
                  </div>
                )}
              </div>
            </ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody className="py-6">
                <div className="grid grid-cols-12 gap-x-8 gap-y-1 mb-6">
                  <div className="col-span-5 flex flex-col gap-1">
                    <FormRow
                      label="No. Beli"
                      value={
                        <Controller
                          control={control}
                          name="purchaseNo"
                          render={({ field, fieldState }) => (
                            <Input
                              isDisabled
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
                      label="Tanggal"
                      value={
                        <Controller
                          control={control}
                          name="date"
                          render={({ field, fieldState }) => (
                            <DatePicker
                              isDisabled={isViewOnly}
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
                              isDisabled={isViewOnly}
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
                      value={
                        <Controller
                          control={control}
                          name="supplierId"
                          render={({ field, fieldState }) => (
                            <SupplierList
                              errorMessage={fieldState.error?.message}
                              isDisabled={isViewOnly}
                              isInvalid={!!fieldState.error}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      }
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
                              isDisabled={isViewOnly}
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
                              isDisabled={
                                watch("paymentType") === "cash" || isViewOnly
                              }
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
                              isDisabled={
                                watch("paymentType") === "cash" || isViewOnly
                              }
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
                          render={({ field }) => (
                            <span className="flex justify-between">
                              <p>{field.value}</p>
                              {!isViewOnly && (
                                <PaymentMethod
                                  onSave={(val) => {
                                    setValue(
                                      "paymentMethod",
                                      val.payment_method,
                                    );
                                    setValue("paymentMethodData", val);
                                  }}
                                />
                              )}
                            </span>
                          )}
                        />
                      }
                    />
                  </div>
                </div>

                {!isViewOnly && (
                  <div className="flex w-full justify-end">
                    <AddWoItems
                      selectedIds={watch("items").map((e) => e.id)}
                      supplierId={watch("supplierId")}
                      onSave={handleAddList}
                    />
                  </div>
                )}

                {/* TABLE SECTION */}
                <Table removeWrapper aria-label="Detail Jasa Table">
                  <TableHeader>
                    <TableColumn>
                      {!isViewOnly && (
                        <Checkbox
                          isIndeterminate={isIndeterminate}
                          isSelected={selectAll}
                          onValueChange={handleCheckAll}
                        />
                      )}
                    </TableColumn>
                    <TableColumn>Deskripsi</TableColumn>
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
                          {!isViewOnly && (
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
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs ">
                            [{field.code}]-{field.name}{" "}
                          </p>
                          <p className="text-xs text-gray-600">
                            {field.trx_no}
                          </p>
                        </TableCell>
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
                                isDisabled={isViewOnly}
                                size="sm"
                                startContent="Rp"
                                value={Number(value) as any}
                                onInput={(val) => {
                                  onChange(val);
                                  const total = calculateTotal({
                                    ppn: watch(`items.${index}.taxPercentage`),
                                    price: val,
                                    disc: watch(`items.${index}.discValue`),
                                  });

                                  setValue(`items.${index}.total`, total);

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
                                isDisabled={isViewOnly}
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

                                  const total = calculateTotal({
                                    ppn: watch(`items.${index}.taxPercentage`),
                                    price: purchasePrice,
                                    disc: calculatedDiscValue,
                                  });

                                  setValue(
                                    `items.${index}.discValue`,
                                    calculatedDiscValue,
                                  );
                                  setValue(`items.${index}.total`, total);
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
                                isDisabled={isViewOnly}
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

                                  const total = calculateTotal({
                                    ppn: watch(`items.${index}.taxPercentage`),
                                    price: purchasePrice,
                                    disc: val,
                                  });

                                  setValue(
                                    `items.${index}.discPercentage`,
                                    calculatedPercentage,
                                  );

                                  setValue(`items.${index}.total`, total);

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
                                isDisabled={isViewOnly}
                                size="sm"
                                value={Number(value) as any}
                                onInput={(val) => {
                                  onChange(val);
                                  const total = calculateTotal({
                                    ppn: watch(`items.${index}.taxPercentage`),
                                    price: watch(
                                      `items.${index}.purchasePrice`,
                                    ),
                                    disc: watch(`items.${index}.discValue`),
                                  });

                                  setValue(`items.${index}.total`, total);
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
                            isDisabled={isViewOnly}
                            minRows={6}
                            placeholder="Tuliskan catatan disini..."
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name="signatureId"
                        render={({ field, fieldState }) => (
                          <Autocomplete
                            defaultItems={list?.data || []}
                            errorMessage={fieldState.error?.message}
                            isDisabled={isViewOnly}
                            isInvalid={!!fieldState.error}
                            label="Signature"
                            labelPlacement="outside-left"
                            listboxProps={{
                              emptyContent:
                                "User tidak ditemukan, tekan Enter untuk tambah baru.",
                            }}
                            placeholder="Pilih User"
                            selectedKey={field.value?.toString()}
                            onSelectionChange={(val) =>
                              field.onChange(Number(val))
                            }
                          >
                            {(item) => (
                              <AutocompleteItem
                                key={item.id}
                                textValue={item.name}
                              >
                                <div className="flex gap-3 items-center">
                                  <Avatar
                                    alt={item.name}
                                    size="sm"
                                    src={
                                      item.profile?.photo_url ||
                                      getAvatarByName(item.name)
                                    }
                                  />

                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                      {item.position}
                                    </span>
                                  </div>
                                </div>
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        )}
                      />
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
                            isDisabled={isViewOnly}
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
                  {isViewOnly ? (
                    <Button
                      color="danger"
                      variant="bordered"
                      onPress={() => {
                        setOpen(false);
                        reset();
                      }}
                    >
                      Keluar
                    </Button>
                  ) : (
                    <>
                      <Button
                        onPress={() => {
                          setOpen(false);
                          reset();
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        color="primary"
                        isDisabled={watch("items").length === 0}
                        isLoading={loading}
                        type="submit"
                      >
                        Simpan
                      </Button>
                    </>
                  )}
                </div>
              </ModalBody>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
