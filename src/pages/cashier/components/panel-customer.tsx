import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  CardFooter,
  Input,
  Chip,
  Button,
  Alert,
  Divider,
} from "@heroui/react";
import { Eye, Printer, Receipt, Trash2 } from "lucide-react";
import dayjs from "dayjs";

import { PaymentSchema, paymentSchema } from "./order-schema";
import { BillingSkeleton } from "./billing-skeleton";
import ModalProductOrder from "./modal-product-order";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getWo, getWoDetail } from "@/stores/features/work-order/wo-action";
import InputNumber from "@/components/input-number";
import { formatIDR } from "@/utils/helpers/format";
import {
  removeRowPart,
  removeRowService,
  updateRowPart,
  updateRowService,
} from "@/stores/features/work-order/wo-slice";
import { handleDownload } from "@/utils/helpers/global";

export default function PanelCustomer() {
  const { workOrder, isLoadingDetail } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isDisable = workOrder?.status === "closed";

  const { control, watch, handleSubmit, setValue, reset } =
    useForm<PaymentSchema>({
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
    if (workOrder) {
      const sparepart = workOrder.spareparts || [];
      const services = workOrder.services || [];
      const data = [...sparepart, ...services];

      const rawSubTotal = data.reduce((acc, item) => {
        const price = Number(item.price ?? 0);
        const qty = Number(item.qty ?? 0);
        const disc = Number(item.disc_value ?? 0);

        return acc + price * qty - disc;
      }, 0);

      const discFinalNominal = Number(watch("disc_value") ?? 0);
      const otherFee = Number(watch("other_fee") ?? 0);

      const discRatio = rawSubTotal > 0 ? discFinalNominal / rawSubTotal : 0;

      let totalTax = 0;

      data.forEach((item) => {
        const qty = Number(item.qty ?? 0);
        const price = Number(item.price ?? 0);
        const disc = Number(item.disc_value ?? 0);
        const itemAmount = price * qty - disc;

        const taxRate = Number(item.tax_percentage ?? 0) / 100;

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
      setValue("customer_id", workOrder.customer_id);
    }
  }, [workOrder, watch("disc_value"), watch("other_fee")]);

  async function onSubmit(data: PaymentSchema) {
    setLoading(true);
    const payload = {
      woId: workOrder.id,
      ...data,
      products: [
        ...workOrder.services.map((item) => ({
          id: item.id,
          product_id: item.data.id,
          price: Number(item.price),
          qty: Number(item.qty),
          total_price: Number(item.total_price),
          tax: Number(item.tax_percentage),
          disc_percentage: Number(item.disc_percentage),
          disc_value: Number(item.disc_value),
          type: "service",
        })),
        ...(workOrder.spareparts || []).map((item) => ({
          id: item.id,
          product_id: item.data.id,
          price: Number(item.price),
          qty: Number(item.qty),
          total_price: Number(item.total_price),
          tax: Number(item.tax_percentage),
          disc_percentage: Number(item.disc_percentage),
          disc_value: Number(item.disc_value),
          type: "sparepart",
        })),
      ],
    };

    if (data.proof_image && data.proof_image.length > 0) {
      if (data.proof_image[0] instanceof File) {
        const photo = await uploadFile(data.proof_image[0]);

        setValue("proof_image", [photo]);
        payload.proof_image = photo;
      } else {
        payload.proof_image = data.proof_image[0];
      }
    }

    http
      .post("/payments", payload)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getWoDetail(workOrder.id.toString()));
        dispatch(getWo({}));
        reset();
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  // function handleSendMail(id: number) {
  //   http
  //     .post(`/invoices/${id}/send`)
  //     .then(({ data }) => {
  //       notify(data.message);
  //     })
  //     .catch((err) => notifyError(err));
  // }

  if (isLoadingDetail) return <BillingSkeleton />;

  return (
    <div className="w-full md:w-2/3 overflow-y-auto scrollbar-modern">
      {workOrder?.id ? (
        <Card className="min-h-full h-full">
          <CardHeader className="w-full flex justify-between">
            <div>
              <p className="text-sm font-bold">
                Rincian Tagihan TRX NO. {workOrder.trx_no}
              </p>
              <p className="text-sm font-bold">
                Plat No : {workOrder.vehicle.plate_number}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="text-white font-semibold uppercase"
                color="success"
                size="sm"
                startContent={<Eye size={18} />}
                onPress={() => navigate(`/service/queue/${workOrder.id}`)}
              >
                Detail
              </Button>
              <Button
                isIconOnly
                isLoading={printLoading}
                size="sm"
                variant="bordered"
                onPress={() =>
                  handleDownload(
                    `/invoices/${workOrder.id}`,
                    workOrder.trx_no,
                    true,
                    setPrintLoading,
                  )
                }
              >
                <Printer className="size-5" />
              </Button>
            </div>
          </CardHeader>
          <CardBody className="gap-2 flex flex-col overflow-y-auto scrollbar-modern max-h-[calc(100vh-360px)]">
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>Deskripsi Jasa</TableColumn>
                <TableColumn className="text-center">Harga Jual</TableColumn>
                <TableColumn className="text-center">Disc %</TableColumn>
                <TableColumn className="text-center">Nilai Disc</TableColumn>
                <TableColumn className="text-center">Jumlah</TableColumn>
                <TableColumn className="text-center">Pjk %</TableColumn>
                <TableColumn> </TableColumn>
              </TableHeader>
              <TableBody>
                {workOrder.services.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[150px]  truncate whitespace-nowrap">
                      <Tooltip color="primary" content={item.data.name}>
                        <p className="text-xs">{item.data.name}</p>
                      </Tooltip>
                      <p className="text-[10px]">
                        {item.data.code}{" "}
                        <span>
                          / {item.data.estimated_duration}{" "}
                          {item.data.estimated_type}{" "}
                        </span>{" "}
                      </p>
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.price) as any}
                        onInput={(price) => {
                          dispatch(
                            updateRowService({
                              ...item,
                              price: String(price),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={100}
                        size="sm"
                        value={Number(item.disc_percentage) as any}
                        onInput={(disc_percentage) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          const calculatedDiscValue = (
                            (disc_percentage / 100) *
                            price
                          ).toFixed(2);

                          dispatch(
                            updateRowService({
                              ...item,
                              disc_percentage: disc_percentage,
                              disc_value: Number(calculatedDiscValue),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={
                          Number(item.price ?? 0) * Number(item.qty ?? 0)
                        }
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.disc_value) as any}
                        onInput={(dic_value) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          let calculatedPercentage = 0;

                          if (price > 0) {
                            calculatedPercentage = (dic_value / price) * 100;
                          }
                          dispatch(
                            updateRowService({
                              ...item,
                              disc_percentage: Number(
                                calculatedPercentage.toFixed(2),
                              ),
                              disc_value: dic_value,
                            }),
                          );
                        }}
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
                        value={Number(item.total_price) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        value={Number(item.tax_percentage) as any}
                        onInput={(tax_percentage) => {
                          dispatch(
                            updateRowService({
                              ...item,
                              tax_percentage,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {!isDisable && (
                        <Trash2
                          className="cursor-pointer hover:text-danger"
                          size={15}
                          onClick={() => dispatch(removeRowService(item))}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Table removeWrapper className="mt-1">
              <TableHeader>
                <TableColumn>Deskripsi Part</TableColumn>
                <TableColumn className="text-center">Harga Jual</TableColumn>
                <TableColumn className="text-center">Qty</TableColumn>
                <TableColumn className="text-center">Disc %</TableColumn>
                <TableColumn className="text-center">Nilai Disc</TableColumn>
                <TableColumn className="text-center">Jumlah</TableColumn>
                <TableColumn className="text-center">Pjk %</TableColumn>
                <TableColumn> </TableColumn>
              </TableHeader>
              <TableBody>
                {(workOrder.spareparts || []).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="max-w-[150px] truncate whitespace-nowrap">
                      <Tooltip color="primary" content={item.data.name}>
                        <p className="text-xs">{item.data.name}</p>
                      </Tooltip>
                      <p className="text-[10px]">{item.data.code} </p>
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.price) as any}
                        onInput={(price) => {
                          dispatch(
                            updateRowPart({
                              ...item,
                              price: String(price),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        value={Number(item.qty) as any}
                        onInput={(qty) => {
                          dispatch(
                            updateRowPart({
                              ...item,
                              qty,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={100}
                        size="sm"
                        value={Number(item.disc_percentage) as any}
                        onInput={(disc_percentage) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          const calculatedDiscValue = (
                            (disc_percentage / 100) *
                            price
                          ).toFixed(2);

                          dispatch(
                            updateRowPart({
                              ...item,
                              disc_percentage: disc_percentage,
                              disc_value: Number(calculatedDiscValue),
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-24"
                        classNames={{
                          input: "text-end text-[11px]",
                        }}
                        isDisabled={isDisable}
                        maxInput={
                          Number(item.price ?? 0) * Number(item.qty ?? 0)
                        }
                        size="sm"
                        startContent={<p className="text-xs">Rp</p>}
                        value={Number(item.disc_value) as any}
                        onInput={(dic_value) => {
                          const price =
                            Number(item.price ?? 0) * Number(item.qty ?? 0);
                          let calculatedPercentage = 0;

                          if (price > 0) {
                            calculatedPercentage = (dic_value / price) * 100;
                          }

                          dispatch(
                            updateRowPart({
                              ...item,
                              disc_percentage: Number(
                                calculatedPercentage.toFixed(2),
                              ),
                              disc_value: dic_value,
                            }),
                          );
                        }}
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
                        value={Number(item.total_price) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <InputNumber
                        className="w-10"
                        classNames={{
                          input: "text-center text-[11px]",
                        }}
                        isDisabled={isDisable}
                        size="sm"
                        value={Number(item.tax_percentage) as any}
                        onInput={(tax_percentage) => {
                          dispatch(
                            updateRowPart({
                              ...item,
                              tax_percentage,
                            }),
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {!isDisable && (
                        <Trash2
                          className="cursor-pointer hover:text-danger"
                          size={15}
                          onClick={() => dispatch(removeRowPart(item))}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
          <Divider />
          <CardFooter className="px-5 flex flex-col">
            <div className="grid grid-cols-3 w-full gap-3">
              <div className="col-span-2 space-y-1">
                <Input
                  isDisabled
                  classNames={{
                    label: "w-24",
                    mainWrapper: "w-1/2",
                  }}
                  label="Pelanggan"
                  labelPlacement="outside-left"
                  placeholder="#Order Customer"
                  size="sm"
                  value={workOrder.customer.name}
                />
                <div className="flex items-center">
                  <p className="w-24 text-xs pl-2">Mekanik</p>
                  <div className="flex flex-wrap gap-1">
                    {(workOrder.mechanics || []).map((item) => (
                      <Chip key={item.id} size="sm" variant="bordered">
                        {item.name}
                      </Chip>
                    ))}
                  </div>
                </div>

                {isDisable && (
                  <Alert className="mb-2 mt-5" color="success" variant="faded">
                    <div className="w-full">
                      <p className="font-semibold text-sm">
                        Pembayaran Berhasil #{workOrder.payment?.reference_no}
                      </p>

                      <Divider className="my-1 opacity-50" />

                      <div className="grid grid-cols-2 gap-y-1 mt-2">
                        <p className="font-bold text-xs">Metode:</p>
                        <p className="text-xs text-right">
                          {workOrder.payment.method || "CASH"}
                        </p>

                        <p className="font-bold text-xs">Waktu:</p>
                        <p className="text-xs text-right">
                          {dayjs(
                            workOrder.payment.payment_date ||
                              workOrder.updated_at,
                          ).format("DD MMM YY | HH:mm")}
                        </p>
                      </div>
                    </div>
                  </Alert>
                )}

                {/* {workOrder.next_sugestion && (
                  <div className="flex items-center">
                    <p className="w-24 text-xs pl-2">Catatan</p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: workOrder.next_sugestion,
                      }}
                    />
                  </div>
                )} */}
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
                        isDisabled={isDisable}
                        label="Disc Final"
                        labelPlacement="outside-left"
                        maxInput={100}
                        size="sm"
                        value={Number(field.value) as any}
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
                        isDisabled={isDisable}
                        maxInput={watch("sub_total") ?? 0}
                        size="sm"
                        startContent={<p className="text-[11px]">Rp</p>}
                        value={field.value as any}
                        onInput={(val) => {
                          field.onChange(val);
                          const subTotal = watch("sub_total") ?? 0;

                          const percent = (val / subTotal) * 100;

                          setValue(
                            "disc_percentage",
                            Number(percent.toFixed(2)),
                          );
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
                      isDisabled={isDisable}
                      label="Biaya Lain"
                      labelPlacement="outside-left"
                      size="sm"
                      startContent={<p className="text-xs">Rp</p>}
                      value={Number(field.value) as any}
                      onInput={field.onChange}
                    />
                  )}
                />
                {isDisable && (
                  <InputNumber
                    classNames={{
                      input: "text-sm !font-bold text-right",
                      label: "w-20 text-sm",
                      mainWrapper: "w-full",
                    }}
                    isDisabled={isDisable}
                    label="Total"
                    labelPlacement="outside-left"
                    size="sm"
                    startContent={<p className="text-xs">Rp</p>}
                    value={watch("total") as any}
                  />
                )}
              </div>
            </div>
            {!isDisable && (
              <div className="w-full flex justify-between mt-2 items-center">
                <p className="text-md font-bold">
                  Total : {formatIDR(watch("total"))}
                </p>
                <ModalProductOrder
                  control={control}
                  isDisable={!workOrder}
                  loading={loading}
                  setValue={setValue}
                  watch={watch}
                  onSubmit={handleSubmit(onSubmit)}
                />
              </div>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="h-full flex flex-col items-center justify-center text-gray-500 border border-dashed rounded-xl">
          <div className="p-6 bg-slate-100 rounded-full mb-4">
            <Receipt className="w-12 h-12" />
          </div>
          <p>Pilih antrean di sebelah kiri untuk memproses pembayaran</p>
        </Card>
      )}
    </div>
  );
}
