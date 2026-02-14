/* eslint-disable jsx-a11y/label-has-associated-control */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import {
  Alert,
  Button,
  Spinner,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { Car, Eye, Printer, Receipt, Send, User } from "lucide-react";

import PaymentMethod from "./payment-method";
import { paymentSchema, type PaymentForm } from "./order-schema";
import { BillingSkeleton } from "./billing-skeleton";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getWo, getWoDetail } from "@/stores/features/work-order/wo-action";
import { handleDownload } from "@/utils/helpers/global";
import InputNumber from "@/components/input-number";
import { formatIDR } from "@/utils/helpers/format";
import FileUploader from "@/components/drop-zone";

export default function PanelCustomer() {
  const { workOrder, isLoadingDetail } = useAppSelector((state) => state.wo);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      discount: 0,
      isManualDiscount: false,
      receivedAmount: 0,
      paymentMethod: "CASH",
    },
  });

  const grandTotal =
    Number(workOrder.grand_total || 0) - Number(watch("discount") || 0);

  const selectedMethod = watch("paymentMethod");
  const changeAmount = (watch("receivedAmount") || 0) - grandTotal;

  async function onSubmit(data: PaymentForm) {
    setLoading(true);
    const payload = {
      woId: workOrder.id,
      ...data,
    };

    if (data.proofImage && data.proofImage.length > 0) {
      if (data.proofImage[0] instanceof File) {
        const photo = await uploadFile(data.proofImage[0]);

        setValue("proofImage", [photo]);
        payload.proofImage = photo;
      } else {
        payload.proofImage = data.proofImage[0];
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

  function handleSendMail(id: number) {
    http
      .post(`/invoices/${id}/send`)
      .then(({ data }) => {
        notify(data.message);
      })
      .catch((err) => notifyError(err));
  }

  if (isLoadingDetail) return <BillingSkeleton />;

  return (
    <div className="w-full md:w-2/3 overflow-y-auto scrollbar-modern">
      {workOrder?.id ? (
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center w-full border-b border-gray-500 pb-5">
              <div>
                <h3 className="mb-1 font-bold">Rincian Tagihan</h3>
                <p
                  className={
                    workOrder.status === "closed"
                      ? "text-success-600 font-medium text-xs"
                      : "text-slate-500 text-xs"
                  }
                >
                  {workOrder.status === "closed"
                    ? `Transaksi #${workOrder.trx_no} telah berhasil diselesaikan`
                    : `Selesaikan transaksi untuk #${workOrder.trx_no}`}
                </p>
                <p className="italic text-xs text-gray-500">
                  Dibuat tanggal :{" "}
                  {dayjs(workOrder.created_at).format(
                    "DD MMM YYYY | HH:mm WIB",
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
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
                    disabled={printLoading}
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
                    {printLoading ? (
                      <Spinner />
                    ) : (
                      <Printer className="size-5" />
                    )}
                  </Button>
                </div>
                {workOrder.customer?.email && (
                  <Button
                    className="text-white font-semibold uppercase"
                    color="warning"
                    size="sm"
                    startContent={<Send size={18} />}
                    onPress={() => handleSendMail(workOrder.id)}
                  >
                    Kirim Invoice
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody className="flex-1 flex flex-col gap-3">
            {/* Info Pelanggan */}
            <div className="grid grid-cols-2 gap-4 p-2 rounded-sm bg-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 italic">Pelanggan</p>
                  <p className="font-semibold text-sm uppercase">
                    {workOrder.customer.name}
                    {workOrder?.customer?.profile?.birth_date && (
                      <span className="font-normal text-xs italic">
                        {" - "}
                        {dayjs(workOrder?.customer?.profile?.birth_date).format(
                          "DD MMM YY",
                        )}
                      </span>
                    )}
                  </p>
                  <p className="text-xs italic">
                    {workOrder.customer.profile?.phone_number}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Car className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 italic">Kendaraan</p>
                  <p className="font-semibold text-sm">
                    {workOrder.vehicle.plate_number} - {workOrder.vehicle.brand}{" "}
                    {workOrder.vehicle.model}
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan Biaya & Diskon */}
            <div className="space-y-3 border-t pt-5">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal Jasa & Part</span>
                <span className="font-semibold">
                  {formatIDR(Number(workOrder.sub_total))}
                </span>
              </div>

              {workOrder.promo_data?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-red-500 text-sm italic"
                >
                  <span>
                    {item.name}{" "}
                    {item.type === "percentage"
                      ? `(${item.value} %) ${item.max_discount ? `MAX : ${formatIDR(Number(item.max_discount))}` : ""}`
                      : "Fixed"}{" "}
                  </span>
                  <span>-{formatIDR(Number(item.price))}</span>
                </div>
              ))}

              <div className="flex justify-between text-slate-600 text-sm">
                <span>Pajak ({Number(workOrder.ppn_percent || 0)}%)</span>
                <span>{formatIDR(Number(workOrder.ppn_amount || 0))}</span>
              </div>

              {/* TOTAL AKHIR */}
              <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-dashed">
                <div className="flex flex-col">
                  <span className="font-bold block text-slate-600">
                    Total Tagihan
                  </span>
                  <span className="text-[10px] text-slate-400 italic">
                    *Sudah termasuk PPN jika berlaku
                  </span>
                </div>
                <span className="font-black text-primary">
                  {formatIDR(Number(grandTotal))}
                </span>
              </div>
            </div>

            {workOrder.status !== "closed" ? (
              <>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <div className="mt-auto pt-2">
                      <p className="font-bold mb-3 text-slate-600">
                        Metode Pembayaran
                      </p>
                      <PaymentMethod
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <div className="mt-4 animate-in fade-in duration-500">
                  {selectedMethod === "CASH" ? (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <Controller
                        control={control}
                        name="receivedAmount"
                        render={({ field }) => (
                          <div>
                            <label className="text-xs font-bold">
                              Uang Diterima
                            </label>
                            <InputNumber
                              endContent={
                                <Button
                                  size="sm"
                                  onPress={() => {
                                    setValue("receivedAmount", grandTotal);
                                  }}
                                >
                                  Penuh
                                </Button>
                              }
                              placeholder="0"
                              startContent="Rp"
                              value={field.value as any}
                              onInput={field.onChange}
                            />
                          </div>
                        )}
                      />
                      <div>
                        <label className="text-xs font-bold">Kembalian</label>
                        <div
                          className={`h-10 flex items-center px-3 rounded-md border ${changeAmount >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                        >
                          <p
                            className={
                              changeAmount >= 0 ? "text-success" : "text-danger"
                            }
                          >
                            {changeAmount >= 0
                              ? `Rp ${changeAmount.toLocaleString()}`
                              : "Kurang Bayar"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Controller
                      control={control}
                      name="proofImage"
                      render={({ field }) => (
                        <div>
                          <label className="text-xs font-bold">
                            Uang Diterima
                          </label>
                          <FileUploader
                            maxFiles={1}
                            value={field.value}
                            onFileSelect={field.onChange}
                          />
                        </div>
                      )}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="pt-10">
                <Alert className="mb-2 mt-auto" color="success" variant="faded">
                  <div className="w-full">
                    <p className="font-semibold text-lg">Pembayaran Berhasil</p>

                    <p className="text-sm mt-1 mb-3">
                      Transaksi telah selesai. Unit sudah bisa diserahkan
                      kembali kepada pelanggan.
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

                      {workOrder.payment.reference_no && (
                        <>
                          <p className="font-bold text-xs">Ref No:</p>
                          <p className="text-xs text-right">
                            {workOrder.payment.reference_no}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Alert>
                {workOrder?.payment?.method === "TRANSFER" &&
                  workOrder?.payment?.proof_image && (
                    <img
                      alt="photo-transfer"
                      className="max-w-xs"
                      src={workOrder?.payment?.proof_image}
                    />
                  )}
              </div>
            )}
          </CardBody>
          {workOrder.status !== "closed" && (
            <CardFooter>
              <Button
                fullWidth
                className="z-50"
                color="primary"
                isDisabled={
                  !isValid ||
                  loading ||
                  (selectedMethod === "CASH" && changeAmount < 0)
                }
                isLoading={loading}
                onPress={() => handleSubmit(onSubmit)()}
              >
                {loading
                  ? "Pembayaran sedang di proses"
                  : "Konfirmasi Pembayaran"}
              </Button>
            </CardFooter>
          )}
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
