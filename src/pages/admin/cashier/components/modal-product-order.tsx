import { Alert, Button, FormControl, FormLabel, Typography } from "@mui/joy";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PaymentMethod from "./payment-method";
import { paymentSchema, type PaymentForm } from "./order-schema";

import Modal from "@/components/modal";
import { formatIDR } from "@/utils/helpers/format";
import { Separator } from "@/components/ui/separator";
import InputNumber from "@/components/ui/input-number";
import FileUploader from "@/components/drop-zone";
import { uploadFile } from "@/utils/helpers/upload-file";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formWoClear } from "@/stores/features/work-order/wo-slice";

interface Props {
  disable: boolean;
  grandTotal: number;
}

export default function ModalProductOrder({ disable, grandTotal }: Props) {
  const { products } = useAppSelector((state) => state.wo);
  const [open, setOpen] = useState(false);
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

  const selectedMethod = watch("paymentMethod");
  const changeAmount = (watch("receivedAmount") || 0) - grandTotal;

  async function onSubmit(data: PaymentForm) {
    setLoading(true);

    const payload = {
      ...data,
      products: products.map((item) => ({ id: item.id, qty: item.qty })),
      type: "product",
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
        reset();
        dispatch(formWoClear());
        if (data?.data?.id) {
          navigate(`/finance/${data.data.id}`);
        }
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Modal
        disable={
          (selectedMethod === "CASH" && changeAmount < 0) || !isValid || loading
        }
        open={open}
        size="lg"
        title="Konfirmasi Pembayaran"
        onOpenChange={setOpen}
        onSave={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <div className="mt-auto pt-2">
              <p className="font-bold mb-3 text-slate-600">Metode Pembayaran</p>
              <PaymentMethod value={field.value} onChange={field.onChange} />
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
                    <FormLabel sx={{ fontSize: "xs", fontWeight: "bold" }}>
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
                  <FormLabel sx={{ fontSize: "xs", fontWeight: "bold" }}>
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

        <Separator className="my-3" />

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Grand Total</p>
          <p className="text-xl font-bold text-primary">
            {formatIDR(grandTotal)}
          </p>
        </div>
        <Alert color="warning">
          Pastikan Jumlah Uang sudah sesuai sebelum menyimpan
        </Alert>
      </Modal>
      <Button disabled={disable} onClick={() => setOpen(true)}>
        Konfirmasi Pembayaran
      </Button>
    </>
  );
}
