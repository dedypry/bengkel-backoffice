import {
  Search,
  Truck,
  Calendar as CalendarIcon,
  FileText,
  ArrowDownLeft,
  Printer,
  ChevronRight,
  PackagePlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const incomingData = [
  {
    id: "RCV-2025-001",
    date: "25 Des 2025",
    supplier: "PT. Astra Otoparts",
    itemsCount: 5,
    totalCost: 4250000,
    receivedBy: "Admin Gudang",
    status: "Verified",
  },
  {
    id: "RCV-2025-002",
    date: "23 Des 2025",
    supplier: "Berkat Motor Jakarta",
    itemsCount: 12,
    totalCost: 1850000,
    receivedBy: "Admin Gudang",
    status: "Verified",
  },
  {
    id: "RCV-2025-003",
    date: "22 Des 2025",
    supplier: "Indo Sparepart",
    itemsCount: 2,
    totalCost: 600000,
    receivedBy: "Samsul",
    status: "Pending",
  },
];

export default function BarangMasuk() {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowDownLeft className="size-6 text-primary" />
            </div>
            Penerimaan Barang Masuk
          </h1>
          <p className="text-sm text-slate-500">
            Catat dan verifikasi kiriman sparepart dari supplier.
          </p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <PackagePlus className="size-4" /> Buat Penerimaan Baru
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Cari No. Referensi atau Supplier..."
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input className="pl-10 w-44" type="date" />
          </div>
          <Button className="gap-2" variant="outline">
            <Truck className="size-4" /> Supplier
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">
                ID Transaksi & Tanggal
              </TableHead>
              <TableHead className="font-bold">Supplier</TableHead>
              <TableHead className="font-bold text-center">
                Jumlah Item
              </TableHead>
              <TableHead className="font-bold text-right">
                Total Pembelian
              </TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomingData.map((data) => (
              <TableRow
                key={data.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell>
                  <div className="font-bold text-slate-800 uppercase tracking-tighter">
                    {data.id}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <CalendarIcon className="size-3" /> {data.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-700">
                    {data.supplier}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Penerima: {data.receivedBy}
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold text-slate-600">
                  {data.itemsCount} SKU
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900 underline decoration-primary/20 underline-offset-4">
                  {formatIDR(data.totalCost)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      data.status === "Verified"
                        ? "bg-emerald-500"
                        : "bg-amber-500 animate-pulse"
                    }
                  >
                    {data.status === "Verified" ? "Terverifikasi" : "Menunggu"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      title="Cetak Label/Struk"
                      variant="ghost"
                    >
                      <Printer className="size-4 text-slate-400" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <ChevronRight className="size-5 text-slate-300" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Stats Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[10px] uppercase opacity-60 font-bold">
                Total Pembelian Bulan Ini
              </p>
              <p className="text-xl font-black">{formatIDR(24500000)}</p>
            </div>
          </div>
          <Button className="text-white text-xs opacity-70" variant="link">
            Lihat Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
