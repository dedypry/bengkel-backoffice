import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardFooter,
  Button,
  CardHeader,
  Input,
  Tooltip,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { PackageSearch, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ModalProductOrder from "./modal-product-order";
import { paymentSchema, PaymentSchema } from "./order-schema";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  formWoClear,
  ISparepart,
  removeWoProduct,
  setWoProducts,
} from "@/stores/features/work-order/wo-slice";
import { getCustomerList } from "@/stores/features/customer/customer-action";
import InputNumber from "@/components/input-number";
import { getEmploye } from "@/stores/features/employe/employe-action";
import { formatIDR } from "@/utils/helpers/format";
import { uploadFile } from "@/utils/helpers/upload-file";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

export default function PanelProduct() {
  const { products } = useAppSelector((state) => state.wo);
  const { list } = useAppSelector((state) => state.employe);
  const { data } = useAppSelector((state) => state.customer);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getCustomerList());
      dispatch(getEmploye({ page: 1, pageSize: 500 }));
    }
  }, []);

  const { control, watch, setValue, handleSubmit } = useForm<PaymentSchema>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      payment_method: "CASH",
      other_fee: 0,
      disc_percentage: 0,
      disc_value: 0,
      tax: 0,
      total: 0,
    },
  });

  useEffect(() => {
    const rawSubTotal = products.reduce((acc, item) => {
      const price = Number(item.sell_price ?? 0);
      const qty = Number(item.qty ?? 0);
      const disc = Number(item.disc_value ?? 0);

      return acc + price * qty - disc;
    }, 0);

    const discFinalNominal = Number(watch("disc_value") ?? 0);
    const otherFee = Number(watch("other_fee") ?? 0);

    const discRatio = rawSubTotal > 0 ? discFinalNominal / rawSubTotal : 0;

    let totalTax = 0;

    products.forEach((item) => {
      const qty = Number(item.qty ?? 0);
      const price = Number(item.sell_price ?? 0);
      const disc = Number(item.disc_value ?? 0);
      const itemAmount = price * qty - disc;

      const taxRate = Number(item.tax ?? 0) / 100;

      if (taxRate > 0) {
        const itemAllocatedDisc = itemAmount * discRatio;
        const itemNetForTax = itemAmount - itemAllocatedDisc;

        totalTax += itemNetForTax * taxRate;
      }
    });

    const grandTotal = rawSubTotal - discFinalNominal + totalTax + otherFee;

    setValue("sub_total", rawSubTotal);
    setValue("tax", Math.round(totalTax));
    setValue("total", Math.round(grandTotal));
  }, [products, watch("disc_value"), watch("other_fee")]);

  function updateRow(item: ISparepart) {
    const disc_val = item.disc_value || 0;
    const price = Number(item.sell_price ?? 0);
    const qty = Number(item.qty ?? 0);

    const subTotal = price * qty - disc_val;

    dispatch(
      setWoProducts({
        ...item,
        sell_price: String(price),
        qty: qty,
        disc_value: disc_val,
        total_price: subTotal,
      }),
    );
  }

  async function onSubmit(data: PaymentSchema) {
    setLoading(true);
    try {
      const payload = {
        ...data,
        products: products.map((item) => ({
          id: item.id,
          qty: item.qty,
          price: item.sell_price,
          tax: item.tax,
          disc_percentage: item.disc_percentage,
          disc_value: item.disc_value,
          total_price: item.total_price,
        })),
        type: "product",
      };

      if (data.proof_image?.[0] instanceof File) {
        const photo = await uploadFile(data.proof_image[0]);

        payload.proof_image = photo;
      }

      const response = await http.post("/payments", payload);

      notify(response.data.message);
      dispatch(formWoClear());
      if (response.data?.data?.id) {
        navigate(`/finance/${response.data.data.id}`);
      }
    } catch (err) {
      notifyError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-2/3 overflow-auto scrollbar-modern">
      <Card className="min-h-full h-full">
        <CardHeader>
          <div className="flex flex-col gap-1" />
        </CardHeader>
        <CardBody className="gap-2 flex flex-col overflow-y-auto scrollbar-modern">
          <Table isHeaderSticky removeWrapper>
            <TableHeader>
              <TableColumn>Produk</TableColumn>
              <TableColumn className="text-center">Harga</TableColumn>
              <TableColumn className="text-center">Qty</TableColumn>
              <TableColumn className="text-center">Disc %</TableColumn>
              <TableColumn className="text-center">Nilai Disc</TableColumn>
              <TableColumn className="text-center">PPN %</TableColumn>
              <TableColumn className="text-center">Jumlah</TableColumn>
              <TableColumn className="text-center w-20">Aksi</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="flex flex-col items-center text-center">
                    {/* Visual Indicator */}
                    <div className="p-4 bg-white rounded-full shadow-sm">
                      <PackageSearch className="text-slate-400" size={40} />
                    </div>

                    <div className="mt-2">
                      <p className="text-xl font-bold text-slate-800">
                        Produk Tidak Ditemukan
                      </p>
                      <p className="text-sm text-gray-500 max-w-64">
                        silahkan pilih product di sebelah kiri
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              {products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-col">
                      <Tooltip color="primary" content={item.name}>
                        <p className="font-semibold text-[11px] text-nowrap truncate">
                          {item.name}
                        </p>
                      </Tooltip>
                      <p className="text-[10px] text-gray-500 italic">
                        {item.code}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-24"
                      classNames={{
                        input: "text-right  text-[11px]",
                      }}
                      size="sm"
                      startContent={<p className="text-xs">Rp</p>}
                      value={Number(item.sell_price).toString()}
                      onInput={(val) =>
                        updateRow({
                          ...item,
                          sell_price: val.toString(),
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-14"
                      classNames={{
                        input: "text-center text-[11px]",
                      }}
                      size="sm"
                      value={(item.qty || 0).toString()}
                      onInput={(qty) => {
                        if (qty >= 0) {
                          updateRow({
                            ...item,
                            qty,
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-12"
                      classNames={{
                        input: "text-center text-[11px]",
                      }}
                      size="sm"
                      value={item.disc_percentage?.toString()}
                      onInput={(discPerc) => {
                        const price = Number(item.sell_price ?? 0);
                        const calculatedDiscValue = (
                          (discPerc / 100) *
                          price
                        ).toFixed(2);

                        updateRow({
                          ...item,
                          disc_percentage: discPerc,
                          disc_value: Number(calculatedDiscValue),
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-24"
                      classNames={{
                        input: "text-end text-[11px]",
                      }}
                      size="sm"
                      startContent={<p className="text-xs">Rp</p>}
                      value={item.disc_value?.toString()}
                      onInput={(disc) => {
                        const price = Number(item.sell_price ?? 0);
                        let calculatedPercentage = 0;

                        if (price > 0) {
                          calculatedPercentage = (disc / price) * 100;
                        }
                        updateRow({
                          ...item,
                          disc_percentage: Number(
                            calculatedPercentage.toFixed(2),
                          ),
                          disc_value: disc,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      className="w-12"
                      classNames={{
                        input: "text-center text-[11px]",
                      }}
                      size="sm"
                      value={item.tax?.toString()}
                      onInput={(tax) =>
                        updateRow({
                          ...item,
                          tax,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <InputNumber
                      isDisabled
                      className="w-24"
                      classNames={{
                        input: "text-end text-[11px]",
                      }}
                      size="sm"
                      startContent={<p className="text-xs">Rp</p>}
                      value={String(item.total_price)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => dispatch(removeWoProduct(item))}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter className="px-5 flex flex-col">
          <div className="grid grid-cols-3 w-full gap-3">
            <div className="col-span-2 space-y-1">
              <Controller
                control={control}
                name="po_no"
                render={({ field }) => (
                  <Input
                    {...(field as any)}
                    classNames={{
                      label: "w-24",
                      mainWrapper: "w-1/2",
                    }}
                    label="No PO"
                    labelPlacement="outside-left"
                    placeholder="#Order Customer"
                    size="sm"
                  />
                )}
              />
              <Controller
                control={control}
                name="customer_id"
                render={({ field }) => (
                  <Autocomplete
                    inputProps={{
                      label: "Pelanggan",
                      labelPlacement: "outside-left",
                      classNames: {
                        label: "w-24",
                        mainWrapper: "w-1/2",
                      },
                    }}
                    items={data}
                    placeholder="Pilih Pelanggan"
                    selectedKey={field.value}
                    size="sm"
                    onSelectionChange={field.onChange}
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
                name="signature_id"
                render={({ field }) => (
                  <Autocomplete
                    inputProps={{
                      size: "sm",
                      label: "Signature",
                      labelPlacement: "outside-left",
                      classNames: {
                        label: "w-24",
                        mainWrapper: "w-1/2",
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
                    {...field}
                    classNames={{
                      label: "w-24",
                      mainWrapper: "w-full",
                    }}
                    label="Catatan"
                    labelPlacement="outside-left"
                    size="sm"
                  />
                )}
              />
            </div>
            <div className="flex flex-col  gap-1">
              <InputNumber
                isDisabled
                classNames={{
                  input: "text-xs text-right",
                  label: "w-20",
                  mainWrapper: "w-full",
                }}
                label="Sub Total"
                labelPlacement="outside-left"
                size="sm"
                startContent={<p className="text-xs">Rp</p>}
                value={watch("sub_total") as any}
              />

              <div className="flex gap-1">
                <Controller
                  control={control}
                  name="disc_percentage"
                  render={({ field }) => (
                    <InputNumber
                      classNames={{
                        input: "text-[11px] text-center w-8",
                        label: "w-20",
                      }}
                      endContent={<p className="text-[11px]">%</p>}
                      label="Disc Final"
                      labelPlacement="outside-left"
                      maxInput={100}
                      size="sm"
                      value={field.value as any}
                      onInput={(val) => {
                        field.onChange(val);
                        const subTotal = watch("sub_total") ?? 0;
                        const nominal = (val / 100) * subTotal;

                        setValue("disc_value", nominal);
                      }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="disc_value"
                  render={({ field }) => (
                    <InputNumber
                      classNames={{
                        input: "text-[11px] text-right",
                        label: "w-20",
                      }}
                      maxInput={watch("total") ?? 0}
                      size="sm"
                      startContent={<p className="text-[11px]">Rp</p>}
                      value={field.value as any}
                      onInput={(val) => {
                        field.onChange(val);
                        const subTotal = watch("sub_total") ?? 0;

                        console.log(val);

                        const percent = (val / subTotal) * 100;

                        setValue("disc_percentage", Number(percent.toFixed(2)));
                      }}
                    />
                  )}
                />
              </div>
              <InputNumber
                isDisabled
                classNames={{
                  input: "text-xs text-right",
                  label: "w-20",
                  mainWrapper: "w-full",
                }}
                label="Pajak"
                labelPlacement="outside-left"
                size="sm"
                startContent={<p className="text-xs">Rp</p>}
                value={watch("tax") as any}
              />
              <Controller
                control={control}
                name="other_fee"
                render={({ field }) => (
                  <InputNumber
                    classNames={{
                      input: "text-xs text-right",
                      label: "w-20",
                      mainWrapper: "w-full",
                    }}
                    label="Biaya Lain"
                    labelPlacement="outside-left"
                    size="sm"
                    startContent={<p className="text-xs">Rp</p>}
                    value={field.value as any}
                    onInput={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className="w-full flex justify-between mt-2 items-center">
            <p className="text-md font-bold">
              Total : {formatIDR(watch("total"))}
            </p>
            <ModalProductOrder
              control={control}
              isDisable={products.length === 0}
              loading={loading}
              setValue={setValue}
              watch={watch}
              onSubmit={handleSubmit(onSubmit)}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
