/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
} from "@heroui/react";
import { useState } from "react";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Banknote, CheckCircle2 } from "lucide-react";

import PaymentMethod from "./payment-method";
import { PaymentSchema } from "./order-schema";

import { formatIDR } from "@/utils/helpers/format";
import InputNumber from "@/components/input-number";
import FileUploader from "@/components/drop-zone";

interface Props {
  control: Control<PaymentSchema>;
  setValue: UseFormSetValue<PaymentSchema>;
  onSubmit: () => void;
  watch: UseFormWatch<PaymentSchema>;
  loading?: boolean;
  isDisable?: boolean;
}

export default function ModalProductOrder({
  control,
  onSubmit,
  setValue,
  watch,
  loading,
  isDisable,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedMethod = watch("payment_method");
  const receivedAmount = watch("received_amount") || 0;
  const changeAmount = receivedAmount - (watch("total") ?? 0);

  return (
    <>
      <Modal
        isOpen={open}
        scrollBehavior="outside"
        size="lg"
        onOpenChange={setOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                <p className="text-sm">Konfirmasi Pembayaran</p>
              </ModalHeader>
              <ModalBody className="pb-6">
                <Controller
                  control={control}
                  name="payment_method"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3">
                      <p className="font-bold text-gray-600 text-sm">
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
                          name="received_amount"
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
                                    setValue(
                                      "received_amount",
                                      watch("total") ?? 0,
                                      {
                                        shouldValidate: true,
                                      },
                                    )
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
                      <label className="text-tiny font-bold text-gray-600">
                        Bukti Transfer
                      </label>
                      <Controller
                        control={control}
                        name="proof_image"
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
              </ModalBody>
              <ModalFooter className="border-t border-gray-100">
                <div className="text-sm  w-full">
                  <p className="text-xs">Total Pembayaran</p>
                  <p className="font-bold">{formatIDR(watch("total"))}</p>
                </div>
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={onClose}
                >
                  Batal
                </Button>
                <Button
                  className="font-bold px-10"
                  color="primary"
                  isDisabled={selectedMethod === "CASH" && changeAmount < 0}
                  isLoading={loading}
                  size="sm"
                  startContent={!loading && <CheckCircle2 size={18} />}
                  onPress={onSubmit}
                >
                  Bayar & Selesaikan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button
        color="primary"
        isDisabled={isDisable}
        size="sm"
        startContent={<Banknote size={20} />}
        onPress={() => setOpen(true)}
      >
        Bayar Sekarang
      </Button>
    </>
  );
}
