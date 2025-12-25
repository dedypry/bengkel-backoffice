import React from "react";
import {
  Wallet,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Banknote,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const payrollData = [
  {
    id: "PAY-2512-01",
    name: "Agus Supriatna",
    role: "Senior Mechanic",
    basicSalary: 5500000,
    allowance: 750000, // Tunjangan Makan & Transport
    bonus: 450000, // Bonus Lembur/Performa
    deductions: 50000, // Potongan Telat
    status: "Paid",
    method: "Bank Transfer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
  },
  {
    id: "PAY-2512-02",
    name: "Siska Putri",
    role: "Front Office",
    basicSalary: 4200000,
    allowance: 500000,
    bonus: 200000,
    deductions: 0,
    status: "Processing",
    method: "Bank Transfer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siska",
  },
  {
    id: "PAY-2512-03",
    name: "Budi Hermawan",
    role: "Junior Mechanic",
    basicSalary: 3800000,
    allowance: 500000,
    bonus: 150000,
    deductions: 120000,
    status: "Unpaid",
    method: "Cash",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
  },
];

export default function PayrollPage() {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      {/* Header - Royal Blue Gradient */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-xl shadow-blue-100">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-4 border border-white/30">
              <Banknote className="size-4 text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Financial Module
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">
              Penggajian Staf
            </h1>
            <p className="text-blue-50 font-medium opacity-90 italic">
              &quot;Periode Desember 2025 - Akurasi data gaji berdasarkan
              performa & absensi.&quot;
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-8 rounded-full font-black text-lg shadow-xl border-none transition-all group">
              <Send className="mr-2 size-5 group-hover:translate-x-1 transition-transform" />{" "}
              BAYAR SEMUA
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Payroll Bulan Ini
            </p>
            <h2 className="text-3xl font-black text-slate-800">
              {formatIDR(125450000)}
            </h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-500 font-bold text-xs">
              <ArrowUpRight size={16} /> <span>+4.2% dari bulan lalu</span>
            </div>
          </div>
          <Wallet className="absolute right-4 bottom-2 size-24 text-slate-50" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Bonus & Lembur
            </p>
            <h2 className="text-3xl font-black text-blue-600">
              {formatIDR(12800000)}
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-4 italic">
              Berdasarkan 45 jam lembur tim
            </p>
          </div>
          <Receipt className="absolute right-4 bottom-2 size-24 text-slate-50" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Potongan Keterlambatan
            </p>
            <h2 className="text-3xl font-black text-rose-500">
              {formatIDR(850000)}
            </h2>
            <div className="flex items-center gap-2 mt-4 text-rose-400 font-bold text-xs">
              <ArrowDownRight size={16} />{" "}
              <span>Efisiensi kedisiplinan 96%</span>
            </div>
          </div>
          <Clock className="absolute right-4 bottom-2 size-24 text-slate-50" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-blue-400" />
          <Input
            className="h-14 pl-14 pr-6 rounded-2xl border-none bg-blue-50/30 font-bold text-slate-700 placeholder:text-blue-300"
            placeholder="Cari slip gaji karyawan..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Filter size={18} /> Periode
          </Button>
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50"
            variant="outline"
          >
            <Download size={18} /> Download CSV
          </Button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Karyawan
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Gaji Pokok
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Tunjangan & Bonus
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Potongan
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Gaji Bersih
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payrollData.map((pay) => {
                const takeHomePay =
                  pay.basicSalary + pay.allowance + pay.bonus - pay.deductions;

                return (
                  <tr
                    key={pay.id}
                    className="group hover:bg-blue-50/30 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-10 border-2 border-white shadow-sm">
                          <AvatarImage src={pay.avatar} />
                          <AvatarFallback>
                            {pay.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-black text-slate-800 leading-none mb-1">
                            {pay.name}
                          </p>
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                            {pay.method}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-slate-600">
                      {formatIDR(pay.basicSalary)}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-emerald-600">
                      +{formatIDR(pay.allowance + pay.bonus)}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-rose-500">
                      -{formatIDR(pay.deductions)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="font-black text-slate-800 text-lg leading-tight">
                        {formatIDR(takeHomePay)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                        {pay.id}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <Badge
                        className={`rounded-lg px-3 py-1 font-black text-[9px] uppercase border-none
                        ${
                          pay.status === "Paid"
                            ? "bg-emerald-100 text-emerald-600"
                            : pay.status === "Processing"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {pay.status === "Paid" && (
                          <CheckCircle2 className="mr-1 inline" size={10} />
                        )}
                        {pay.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Button
                        className="rounded-xl text-slate-300 hover:text-blue-600 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                        size="icon"
                        variant="ghost"
                      >
                        <Download size={18} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info - Disburse Note */}
      <div className="bg-amber-50 border-2 border-dashed border-amber-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-white p-4 rounded-3xl shadow-lg shadow-amber-100 text-amber-500">
            <CreditCard size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-amber-900 leading-tight">
              Konfirmasi Pembayaran Gaji
            </h4>
            <p className="text-sm text-amber-700/80 font-medium">
              Pastikan saldo akun bank operasional mencukupi sebelum klik
              &quot;Bayar Semua&quot;.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-white border-amber-200 text-amber-700 font-black rounded-2xl px-8 py-6"
            variant="outline"
          >
            JADWALKAN
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-gray-500 font-black rounded-2xl px-10 py-6 shadow-xl shadow-amber-200">
            PROSES SEKARANG
          </Button>
        </div>
      </div>
    </div>
  );
}
