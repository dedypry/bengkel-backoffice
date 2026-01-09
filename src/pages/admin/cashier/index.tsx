/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect } from "react";
import {
  Banknote,
  CreditCard,
  User,
  Car,
  Receipt,
  Printer,
} from "lucide-react";

import ListOrder from "./components/list-order";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWo } from "@/stores/features/work-order/wo-action";
import { formatIDR } from "@/utils/helpers/format";
import { Input } from "@/components/ui/input";

export default function Cashier() {
  const { woQuery, workOrder } = useAppSelector((state) => state.wo);
  const { company } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getWo(woQuery));
    }
  }, [company]);

  function handlePrint() {
    console.log(workOrder);
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4 p-4 antialiased">
      {/* --- BAGIAN KIRI: DAFTAR ANTREAN --- */}
      <ListOrder />

      {/* --- BAGIAN KANAN: RINCIAN & PEMBAYARAN --- */}
      <div className="w-full md:w-2/3">
        {workOrder?.id ? (
          <Card className="h-full flex flex-col border-[#168BAB]/20 shadow-lg">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Rincian Tagihan</CardTitle>
                  <p className="text-slate-500">
                    Selesaikan transaksi untuk #{workOrder.trx_no}
                  </p>
                </div>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="size-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-6 flex flex-col gap-6">
              {/* Info Pelanggan */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <User className="w-4 h-4 text-[#168BAB]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 italic">Pelanggan</p>
                    <p className="font-semibold">{workOrder.customer.name}</p>
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
                    <p className="font-semibold">
                      {workOrder.vehicle.plate_number} -{" "}
                      {workOrder.vehicle.brand} {workOrder.vehicle.model}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ringkasan Biaya & Diskon */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal Jasa & Part</span>
                  <span>{formatIDR(Number(workOrder.grand_total))}</span>
                </div>

                {/* BAGIAN DISKON & PROMO */}
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">
                      Diskon Manual
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        Rp
                      </span>
                      <Input
                        className="pl-8 h-9 focus-visible:ring-[#168BAB]"
                        placeholder="0"
                        type="number"
                        onChange={(e) => {
                          console.log(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">
                      Kode Promo
                    </label>
                    <div className="flex gap-2">
                      <Input
                        className="h-9 uppercase focus-visible:ring-[#168BAB]"
                        placeholder="PROMO123"
                      />
                      <Button className="bg-slate-800 h-9" size="sm">
                        Cek
                      </Button>
                    </div>
                  </div>
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
                  <div>
                    <span className="text-lg font-bold block">
                      Total Tagihan
                    </span>
                    <span className="text-[10px] text-slate-400 italic">
                      *Sudah termasuk PPN jika berlaku
                    </span>
                  </div>
                  <span className="text-3xl font-black text-[#168BAB]">
                    {formatIDR(Number(workOrder.grand_total))}
                  </span>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="mt-auto pt-6">
                <p className="font-bold mb-3">Metode Pembayaran</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="h-16 flex flex-col gap-1 border-2 hover:border-[#168BAB] hover:bg-blue-50"
                    variant="outline"
                  >
                    <Banknote className="w-5 h-5" />
                    Tunai
                  </Button>
                  <Button
                    className="h-16 flex flex-col gap-1 border-2 hover:border-[#168BAB] hover:bg-blue-50"
                    variant="outline"
                  >
                    <CreditCard className="w-5 h-5" />
                    Transfer / Debit
                  </Button>
                </div>
                <Button className="w-full mt-6 h-14 text-lg bg-[#168BAB] hover:bg-[#13748f] shadow-lg shadow-blue-200">
                  Konfirmasi Pembayaran
                </Button>
              </div>
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
