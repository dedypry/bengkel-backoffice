/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react";
import {
  Search,
  Banknote,
  CreditCard,
  User,
  Car,
  Receipt,
  Printer,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Interface sederhana untuk data WO
interface WorkOrder {
  id: number;
  customer_name: string;
  plate_number: string;
  vehicle_model: string;
  total_amount: number;
  status: "ready" | "paid";
}

export default function Cashier() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);

  // Data dummy untuk contoh
  const workOrders: WorkOrder[] = [
    {
      id: 101,
      customer_name: "Budi Santoso",
      plate_number: "B 1234 GAI",
      vehicle_model: "Toyota Avanza",
      total_amount: 750000,
      status: "ready",
    },
    {
      id: 102,
      customer_name: "Siska Amelia",
      plate_number: "F 8821 OK",
      vehicle_model: "Honda HR-V",
      total_amount: 1200000,
      status: "ready",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4 p-4 antialiased">
      {/* --- BAGIAN KIRI: DAFTAR ANTREAN --- */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#168BAB]" />
              Antrean Pembayaran
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Cari plat nomor atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto scrollbar-modern flex-1">
            <div className="space-y-3">
              {workOrders.map((wo) => (
                <div
                  key={wo.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedWO?.id === wo.id
                      ? "border-[#168BAB] bg-blue-50/50"
                      : "border-transparent bg-slate-50 hover:border-slate-200"
                  }`}
                  onClick={() => setSelectedWO(wo)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      className="bg-white text-[#168BAB] border-[#168BAB]"
                      variant="outline"
                    >
                      #{wo.id}
                    </Badge>
                    <span className="font-bold text-slate-700">
                      {wo.plate_number}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{wo.customer_name}</p>
                  <p className="text-xs text-slate-500 mb-2">
                    {wo.vehicle_model}
                  </p>
                  <p className="text-[#168BAB] font-bold">
                    {formatCurrency(wo.total_amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- BAGIAN KANAN: RINCIAN & PEMBAYARAN --- */}
      <div className="w-full md:w-2/3">
        {selectedWO ? (
          <Card className="h-full flex flex-col border-[#168BAB]/20 shadow-lg">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">Rincian Tagihan</CardTitle>
                  <p className="text-slate-500">
                    Selesaikan transaksi untuk #{selectedWO.id}
                  </p>
                </div>
                <Button size="icon" variant="outline">
                  <Printer className="w-4 h-4" />
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
                    <p className="font-semibold">{selectedWO.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    <Car className="w-4 h-4 text-[#168BAB]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 italic">Kendaraan</p>
                    <p className="font-semibold">
                      {selectedWO.plate_number} - {selectedWO.vehicle_model}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ringkasan Biaya */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Jasa & Part</span>
                  <span>{formatCurrency(selectedWO.total_amount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pajak (0%)</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-dashed">
                  <span className="text-lg font-bold">Total Tagihan</span>
                  <span className="text-3xl font-black text-[#168BAB]">
                    {formatCurrency(selectedWO.total_amount)}
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
