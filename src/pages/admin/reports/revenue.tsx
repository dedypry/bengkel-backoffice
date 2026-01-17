import {
  DollarSign,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Target,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button, Card, CardActions, CardContent } from "@mui/joy";

import InvoiceListPage from "../finance/list";

import { Progress } from "@/components/ui/progress";
import HeaderAction from "@/components/header-action";
import { formatIDR } from "@/utils/helpers/format";

export default function LaporanPendapatan() {
  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/20">
      <HeaderAction
        actionTitle="EXPORT EXCEL"
        subtitle="Analisis pemasukan dan pertumbuhan bengkel secara akurat."
        title="Laporan Pendapatan"
      />

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2 relative z-20">
        {[
          {
            label: "Total Pendapatan",
            val: 85450000,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Unit Servis",
            val: "124 Unit",
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Rata-rata Transaksi",
            val: 689000,
            icon: BarChart3,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Pertumbuhan",
            val: "+12.5%",
            icon: ArrowUpRight,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
        ].map((item, i) => (
          <Card key={i}>
            <CardContent sx={{ alignItems: "center", gap: 2 }}>
              <div
                className={`${item.bg} ${item.color} p-4 rounded-2xl w-15 flex justify-center`}
              >
                <item.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {item.label}
              </p>
              <p className="text-xl font-black text-slate-800">
                {typeof item.val === "number" ? formatIDR(item.val) : item.val}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Target & Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="col-span-2">
          <Card sx={{ flex: 1, display: "flex" }}>
            <CardContent>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <PieChart className="text-emerald-500" /> Sumber Pendapatan
                </h3>
                <Button variant="outlined">Lihat Detail</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[
                    { name: "Jasa Servis", pct: 65, color: "bg-emerald-500" },
                    { name: "Suku Cadang", pct: 25, color: "bg-blue-500" },
                    { name: "Aksesoris", pct: 10, color: "bg-amber-500" },
                  ].map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">{cat.name}</span>
                        <span className="text-slate-800">{cat.pct}%</span>
                      </div>
                      <Progress
                        className={`h-2 bg-slate-100 ${cat.color}`}
                        value={cat.pct}
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 rounded-[2rem] flex items-center justify-center border border-dashed border-slate-200">
                  <p className="text-slate-400 text-xs font-medium italic">
                    Grafik Area Chart Disini
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent>
            <div className="flex gap-2 items-center">
              <Target className="size-5 opacity-50" />
              <h5 className="font-black tracking-tight">Target Bulanan</h5>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Anda sudah mencapai 85% dari target pendapatan Desember.
            </p>
            <div className="bg-gray-100 rounded-xl py-2 px-4 backdrop-blur-md border border-gray-400">
              <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">
                Pencapaian
              </p>
              <p className="text-3xl font-black mb-4 tracking-tighter">
                {formatIDR(85450000)}
              </p>
              <Progress className="h-3 bg-gray-300" value={85} />
            </div>
          </CardContent>
          <CardActions>
            <Button endDecorator={<ArrowRight />}>Sesuaikan Target</Button>
          </CardActions>
        </Card>
      </div>

      <InvoiceListPage noHeader />
    </div>
  );
}
