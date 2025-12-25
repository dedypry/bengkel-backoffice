import {
  Search,
  Download,
  Eye,
  Filter,
  Calendar as CalendarIcon,
  FileText,
  Printer,
  History,
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

const historyData = [
  {
    id: "INV-2025-001",
    date: "24 Des 2025",
    customer: "Budi Santoso",
    vehicle: "Toyota Avanza",
    plate: "B 1234 GHO",
    service: "Ganti Oli + Filter",
    total: 450000,
    mechanic: "Agus",
    status: "Completed",
  },
  {
    id: "INV-2025-002",
    date: "22 Des 2025",
    customer: "Lani Wijaya",
    vehicle: "Honda HR-V",
    plate: "D 9999 RS",
    service: "Tune Up & Rem",
    total: 1250000,
    mechanic: "Budi",
    status: "Completed",
  },
  {
    id: "INV-2025-003",
    date: "20 Des 2025",
    customer: "Rian Hidayat",
    vehicle: "Mitsubishi Xpander",
    plate: "F 4567 JK",
    service: "Ganti Aki",
    total: 850000,
    mechanic: "Agus",
    status: "Cancelled",
  },
];

export default function RiwayatServis() {
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <History className="size-6 text-primary" />
            Riwayat Servis
          </h1>
          <p className="text-sm text-slate-500">
            Arsip seluruh pengerjaan unit dan transaksi selesai.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" size="sm" variant="outline">
            <Download className="size-4" /> Export Excel
          </Button>
          <Button className="gap-2" size="sm">
            <Printer className="size-4" /> Cetak Laporan
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Cari No. Invoice, Plat, atau Nama Pelanggan..."
          />
        </div>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input className="pl-10" type="date" />
        </div>
        <Button className="gap-2" variant="secondary">
          <Filter className="size-4" /> Filter Lanjut
        </Button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Tanggal & ID</TableHead>
              <TableHead className="font-bold">Kendaraan</TableHead>
              <TableHead className="font-bold">Detail Layanan</TableHead>
              <TableHead className="font-bold text-right">
                Total Biaya
              </TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="font-bold text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="font-medium text-slate-900">{item.date}</div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-tighter">
                    {item.id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-800">{item.plate}</div>
                  <div className="text-xs text-slate-500">
                    {item.vehicle} • {item.customer}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-700">{item.service}</div>
                  <div className="text-[10px] text-indigo-600 font-semibold uppercase">
                    Mekanik: {item.mechanic}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-slate-900">
                    {formatIDR(item.total)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={
                      item.status === "Completed"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : ""
                    }
                    variant={
                      item.status === "Completed" ? "default" : "destructive"
                    }
                  >
                    {item.status === "Completed" ? "Sukses" : "Batal"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      className="size-8 text-blue-600 hover:text-blue-700"
                      size="icon"
                      variant="ghost"
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      className="size-8 text-slate-600"
                      size="icon"
                      variant="ghost"
                    >
                      <FileText className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-slate-500">
          Menampilkan 3 dari 1,240 riwayat
        </p>
        <div className="flex gap-2">
          <Button disabled size="sm" variant="outline">
            Sebelumnya
          </Button>
          <Button size="sm" variant="outline">
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
