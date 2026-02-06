/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Alert,
  Button,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PaymentMethod from "./payment-method";
import { paymentSchema, type PaymentForm } from "./order-schema";

import { formatIDR } from "@/utils/helpers/format";
import InputNumber from "@/components/input-number";
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
  const receivedAmount = watch("receivedAmount") || 0;
  const changeAmount = receivedAmount - grandTotal;

  async function onSubmit(data: PaymentForm) {
    setLoading(true);
    try {
      const payload = {
        ...data,
        products: products.map((item) => ({ id: item.id, qty: item.qty })),
        type: "product",
      };

      if (data.proofImage?.[0] instanceof File) {
        const photo = await uploadFile(data.proofImage[0]);

        payload.proofImage = photo;
      }

      const response = await http.post("/payments", payload);

      notify(response.data.message);
      reset();
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
    <>
      <Modal backdrop="blur" isOpen={open} size="lg" onOpenChange={setOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                Konfirmasi Pembayaran
              </ModalHeader>
              <ModalBody className="pb-6">
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3">
                      <p className="font-bold text-default-600 text-sm">
                        Metode Pembayaran
                      </p>
                      <PaymentMethod
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  {selectedMethod === "CASH" ? (
                    <Card
                      className="bg-default-50 border-1 border-default-200"
                      shadow="none"
                    >
                      <CardBody className="grid grid-cols-2 gap-4 p-4">
                        <Controller
                          control={control}
                          name="receivedAmount"
                          render={({ field }) => (
                            <InputNumber
                              classNames={{
                                inputWrapper: "pr-1",
                              }}
                              endContent={
                                <Button
                                  color="primary"
                                  size="sm"
                                  variant="flat"
                                  onPress={() =>
                                    setValue("receivedAmount", grandTotal, {
                                      shouldValidate: true,
                                    })
                                  }
                                >
                                  PAS
                                </Button>
                              }
                              label="Uang Diterima"
                              labelPlacement="outside"
                              placeholder="Rp 0"
                              startContent="Rp. "
                              value={field.value as any}
                              variant="bordered"
                              onInput={field.onChange}
                            />
                          )}
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-tiny font-bold text-gray-600">
                            Kembalian
                          </label>
                          <div
                            className={`h-10 flex items-center px-3 rounded-sm border-1 transition-colors ${
                              changeAmount >= 0
                                ? "bg-success-50 border-success-200"
                                : "bg-danger-50 border-danger-200"
                            }`}
                          >
                            <p
                              className={`font-bold text-sm ${changeAmount >= 0 ? "text-success" : "text-danger"}`}
                            >
                              {changeAmount >= 0
                                ? formatIDR(changeAmount)
                                : "Kurang Bayar"}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="text-tiny font-bold text-default-600">
                        Bukti Transfer
                      </label>
                      <Controller
                        control={control}
                        name="proofImage"
                        render={({ field }) => (
                          <FileUploader
                            maxFiles={1}
                            value={field.value}
                            onFileSelect={field.onChange}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>

                <Divider className="my-4" />

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1">
                    <p className="text-base font-semibold text-gray-600">
                      Total Tagihan
                    </p>
                    <p className="text-2xl font-black text-primary">
                      {formatIDR(grandTotal)}
                    </p>
                  </div>

                  <Alert
                    color="warning"
                    description="Pastikan jumlah uang yang diterima sudah sesuai sebelum menyimpan transaksi ini."
                    title="Perhatian"
                    variant="flat"
                  />
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <Button color="danger" variant="flat" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  className="font-bold"
                  color="primary"
                  isDisabled={
                    (selectedMethod === "CASH" && changeAmount < 0) || !isValid
                  }
                  isLoading={loading}
                  startContent={!loading && <CheckCircle2 size={18} />}
                  onPress={() => handleSubmit(onSubmit)()}
                >
                  Simpan & Selesaikan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button
        className="font-bold"
        color="primary"
        isDisabled={disable}
        startContent={<Banknote size={20} />}
        variant="shadow"
        onPress={() => setOpen(true)}
      >
        Bayar Sekarang
      </Button>
    </>
  );
}
