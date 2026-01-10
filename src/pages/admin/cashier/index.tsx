import { useEffect } from "react";
import {
  Banknote,
  CreditCard,
  User,
  Car,
  Receipt,
  Printer,
} from "lucide-react";
import dayjs from "dayjs";
import { Button, FormControl, FormLabel, IconButton, Input } from "@mui/joy";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ListOrder from "./components/list-order";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";
import { formatIDR } from "@/utils/helpers/format";
import InputNumber from "@/components/ui/input-number";

const paymentSchema = z.object({
  discount: z.number().min(0, "Diskon tidak boleh negatif"),
  promoCode: z.string().optional(),
  paymentMethod: z.enum(["CASH", "TRANSFER"]),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export default function Cashier() {
  const { woQuery, workOrder } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getWo(woQuery));
    }
  }, [company]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      discount: 0,
    },
  });

  console.log("valid", isValid);
  function handlePrint() {
    console.log(workOrder);
  }
  function onSubmit() {
    console.log(workOrder);
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4 antialiased">
      {/* --- BAGIAN KIRI: DAFTAR ANTREAN --- */}
      <ListOrder />

      {/* --- BAGIAN KANAN: RINCIAN & PEMBAYARAN --- */}
      <div className="w-full md:w-2/3 overflow-y-auto scrollbar-modern">
        {workOrder?.id ? (
          <Card className="h-full flex flex-col border-[#168BAB]/20 shadow-lg">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Rincian Tagihan</CardTitle>
                  <p className="text-slate-500 text-xs">
                    Selesaikan transaksi untuk #{workOrder.trx_no}
                  </p>
                </div>
                <IconButton variant="outlined" onClick={handlePrint}>
                  <Printer className="size-5" />
                </IconButton>
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
                          {dayjs(
                            workOrder?.customer?.profile?.birth_date,
                          ).format("DD MMM YY")}
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
                      {workOrder.vehicle.plate_number} -{" "}
                      {workOrder.vehicle.brand} {workOrder.vehicle.model}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ringkasan Biaya & Diskon */}
              <div className="space-y-3 border-t pt-2">
                {/* BAGIAN DISKON & PROMO */}
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
                    name="discount"
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel>Kode Promo</FormLabel>
                        <Input
                          {...field}
                          endDecorator={
                            <Button color="neutral" size="sm">
                              Cek
                            </Button>
                          }
                          placeholder="Masukan Kode Promo"
                        />
                      </FormControl>
                    )}
                  />
                </div>

                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal Jasa & Part</span>
                  <span className="font-semibold">
                    {formatIDR(Number(workOrder.grand_total))}
                  </span>
                </div>

                {/* Detail Pemotongan */}
                <div className="flex justify-between text-red-500 text-sm italic">
                  <span>Potongan Diskon</span>
                  <span>-{formatIDR(0)}</span>
                </div>

                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Pajak (0%)</span>
                  <span>Rp 0</span>
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
                    {formatIDR(Number(workOrder.grand_total))}
                  </span>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <div className="mt-auto pt-2">
                    <p className="font-bold mb-3 text-slate-600">
                      Metode Pembayaran
                    </p>
                    <div className="grid grid-cols-2 gap-4 pb-5">
                      <Button
                        color="success"
                        size="lg"
                        startDecorator={<Banknote />}
                        sx={{ height: 50 }}
                        variant={field.value === "CASH" ? "soft" : "outlined"}
                        onClick={() => field.onChange("CASH")}
                      >
                        Tunai
                      </Button>
                      <Button
                        color="success"
                        size="lg"
                        startDecorator={<CreditCard />}
                        sx={{ height: 50 }}
                        variant={
                          field.value === "TRANSFER" ? "soft" : "outlined"
                        }
                        onClick={() => field.onChange("TRANSFER")}
                      >
                        Transfer / Debit
                      </Button>
                    </div>
                    <Button
                      fullWidth
                      disabled={!isValid}
                      onClick={handleSubmit(onSubmit)}
                    >
                      Konfirmasi Pembayaran
                    </Button>
                  </div>
                )}
              />
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
    </div>
  );
}
