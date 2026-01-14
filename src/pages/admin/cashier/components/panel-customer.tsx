import type { IPromo } from "@/utils/interfaces/IPromo";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Typography,
} from "@mui/joy";
import {
  Banknote,
  Car,
  CheckCircle,
  Eye,
  Printer,
  Receipt,
  User,
  X,
} from "lucide-react";

import PaymentMethod from "./payment-method";
import { paymentSchema, type PaymentForm } from "./order-schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { uploadFile } from "@/utils/helpers/upload-file";
import { getWo, getWoDetail } from "@/stores/features/work-order/wo-action";
import { handleDownload } from "@/utils/helpers/global";
import InputNumber from "@/components/ui/input-number";
import { formatIDR } from "@/utils/helpers/format";
import FileUploader from "@/components/drop-zone";

export default function PanelCustomer() {
  const { workOrder } = useAppSelector((state) => state.wo);
  const [promoData, setPromoData] = useState<IPromo | null>(null);
  const [totalPromo, setTotalPromo] = useState(0);
  const [loading, setLoading] = useState(false);
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

  function handleChekPromo() {
    http
      .get<IPromo>("/promos/check", {
        params: {
          code: watch("promoCode"),
        },
      })
      .then(({ data }) => {
        setPromoData(data);
        setValue("isManualDiscount", false);
        const subtotal = Number(workOrder.sub_total || 0);
        let calculatedDiscount = 0;
        const minPurchase = Number(data.min_purchase || 0);

        if (subtotal < minPurchase) {
          notifyError(
            `Minimal pembelian untuk promo ini adalah Rp ${minPurchase.toLocaleString()}`,
          );

          return;
        }

        if (data.type === "percentage") {
          const percentageValue = Number(data.value || 0);
          const maxDiscount = Number(data.max_discount || 0);

          // Hitung nominal persentase
          const discountAmount = (subtotal * percentageValue) / 100;

          // Jika ada max_discount dan lebih dari 0, lakukan pembatasan (limit)
          if (maxDiscount > 0) {
            calculatedDiscount = Math.min(discountAmount, maxDiscount);
          } else {
            calculatedDiscount = discountAmount;
          }
        } else {
          // Jika tipe 'fix' atau nominal langsung
          calculatedDiscount = Number(data.value || 0);
        }

        calculatedDiscount = Math.min(calculatedDiscount, subtotal);

        if (calculatedDiscount > 0) {
          setValue("discount", calculatedDiscount);
          setTotalPromo(calculatedDiscount);
        }
      })
      .catch((err) => {
        notifyError(err);
        setPromoData(null);
      });
  }

  useEffect(() => {
    if (Number(watch("discount")) != totalPromo) {
      setPromoData(null);
      setValue("promoCode", "");
      setValue("isManualDiscount", true);
    }
  }, [watch("discount")]);

  return (
    <div className="w-full md:w-2/3 overflow-y-auto scrollbar-modern">
      {workOrder?.id ? (
        <Card className="min-h-full flex flex-col border-[#168BAB]/20 shadow-lg">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="mb-1">Rincian Tagihan</CardTitle>
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
                <p className="italic text-sm text-gray-500">
                  Dibuat tanggal :{" "}
                  {dayjs(workOrder.created_at).format(
                    "DD MMM YYYY | HH:mm WIB",
                  )}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  color="success"
                  startDecorator={<Eye />}
                  onClick={() => navigate(`/service/queue/${workOrder.id}`)}
                >
                  Detail
                </Button>
                <IconButton
                  variant="outlined"
                  onClick={() => handleDownload(`/invoices/${workOrder.id}`)}
                >
                  <Printer className="size-5" />
                </IconButton>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-3">
            {/* Info Pelanggan */}
            <div className="grid grid-cols-2 gap-4 p-2 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <User className="w-4 h-4 text-[#168BAB]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 italic">Pelanggan</p>
                  <p className="font-semibold text-sm">
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
                  <Car className="w-4 h-4 text-[#168BAB]" />
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
            <div className="space-y-3 border-t pt-2">
              {workOrder.status != "closed" && (
                <div className="grid grid-cols-2 gap-4 py-2">
                  <Controller
                    control={control}
                    name="discount"
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel>Diskon Manual</FormLabel>
                        <InputNumber
                          startDecorator="Rp"
                          value={field.value}
                          onInput={field.onChange}
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name="promoCode"
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel>Kode Promo</FormLabel>
                        <Input
                          endDecorator={
                            <Button
                              color="neutral"
                              size="sm"
                              onClick={handleChekPromo}
                            >
                              Cek
                            </Button>
                          }
                          placeholder="Masukan Kode Promo"
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              )}

              {promoData && (
                <Card>
                  <CardContent className="flex">
                    <Box sx={{ flex: 1 }}>
                      <Typography color="success" level="title-sm">
                        Promo Berhasil Digunakan: <b>{promoData.code}</b>
                      </Typography>
                      <Typography level="body-xs">
                        Potongan:{" "}
                        {promoData.type === "percentage"
                          ? `${Number(promoData.value)}% (Maks. Rp ${Number(promoData.max_discount).toLocaleString()})`
                          : formatIDR(Number(promoData.value))}
                      </Typography>
                    </Box>
                    <IconButton
                      color="danger"
                      size="sm"
                      variant="plain"
                      onClick={() => {
                        setPromoData(null);
                        setValue("promoCode", "");
                        setValue("discount", 0);
                      }}
                    >
                      <X size={18} />
                    </IconButton>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal Jasa & Part</span>
                <span className="font-semibold">
                  {formatIDR(Number(workOrder.sub_total))}
                </span>
              </div>

              {/* Detail Pemotongan */}
              <div className="flex justify-between text-red-500 text-sm italic">
                <span>Potongan Diskon</span>
                <span>-{formatIDR(watch("discount"))}</span>
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
                          <FormControl>
                            <FormLabel
                              sx={{ fontSize: "xs", fontWeight: "bold" }}
                            >
                              Uang Diterima
                            </FormLabel>
                            <InputNumber
                              endDecorator={
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setValue("receivedAmount", grandTotal);
                                  }}
                                >
                                  Penuh
                                </Button>
                              }
                              placeholder="Rp 0"
                              startDecorator={<Banknote size={18} />}
                              value={field.value}
                              onInput={field.onChange}
                            />
                          </FormControl>
                        )}
                      />
                      <FormControl>
                        <FormLabel sx={{ fontSize: "xs", fontWeight: "bold" }}>
                          Kembalian
                        </FormLabel>
                        <div
                          className={`h-10 flex items-center px-3 rounded-md border ${changeAmount >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                        >
                          <Typography
                            color={changeAmount >= 0 ? "success" : "danger"}
                            level="title-sm"
                          >
                            {changeAmount >= 0
                              ? `Rp ${changeAmount.toLocaleString()}`
                              : "Kurang Bayar"}
                          </Typography>
                        </div>
                      </FormControl>
                    </div>
                  ) : (
                    <Controller
                      control={control}
                      name="proofImage"
                      render={({ field }) => (
                        <FormControl>
                          <FormLabel
                            sx={{ fontSize: "xs", fontWeight: "bold" }}
                          >
                            Uang Diterima
                          </FormLabel>
                          <FileUploader
                            maxFiles={1}
                            value={field.value}
                            onFileSelect={field.onChange}
                          />
                        </FormControl>
                      )}
                    />
                  )}
                </div>
                <Button
                  fullWidth
                  disabled={
                    !isValid ||
                    loading ||
                    (selectedMethod === "CASH" && changeAmount < 0)
                  }
                  onClick={handleSubmit(onSubmit)}
                >
                  {loading
                    ? "Pembayaran sedang di proses"
                    : "Konfirmasi Pembayaran"}
                </Button>
              </>
            ) : (
              <>
                <Alert
                  color="success"
                  startDecorator={<CheckCircle size={24} />}
                  sx={{
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 2,
                    mt: "auto",
                  }}
                  variant="soft"
                >
                  <div style={{ width: "100%" }}>
                    <Typography color="success" level="title-lg">
                      Pembayaran Berhasil
                    </Typography>

                    <Typography level="body-sm" sx={{ mt: 0.5, mb: 1.5 }}>
                      Transaksi telah selesai. Unit sudah bisa diserahkan
                      kembali kepada pelanggan.
                    </Typography>

                    <Divider sx={{ my: 1, opacity: 0.5 }} />

                    <div className="grid grid-cols-2 gap-y-1 mt-2">
                      <Typography fontWeight="bold" level="body-xs">
                        Metode:
                      </Typography>
                      <Typography level="body-xs" textAlign="right">
                        {workOrder.payment.method || "CASH"}
                      </Typography>

                      <Typography fontWeight="bold" level="body-xs">
                        Waktu:
                      </Typography>
                      <Typography level="body-xs" textAlign="right">
                        {dayjs(
                          workOrder.payment.payment_date ||
                            workOrder.updated_at,
                        ).format("DD MMM YY | HH:mm")}
                      </Typography>

                      {workOrder.payment.reference_no && (
                        <>
                          <Typography fontWeight="bold" level="body-xs">
                            Ref No:
                          </Typography>
                          <Typography level="body-xs" textAlign="right">
                            {workOrder.payment.reference_no}
                          </Typography>
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
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">
          <div className="p-6 bg-slate-50 rounded-full mb-4">
            <Receipt className="w-12 h-12 opacity-20" />
          </div>
          <p>Pilih antrean di sebelah kiri untuk memproses pembayaran</p>
        </div>
      )}
    </div>
  );
}
