import { useState } from "react";
import {
  Search,
  Filter,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";
const dummyStockLogs = [
  {
    id: 1,
    created_at: "2026-01-02T10:00:00Z",
    product: { name: "Oli mobil avanza", code: "OLI-123" },
    type: "IN",
    quantity: 50,
    balance_after: 1000,
    notes: "Restock dari Supplier Utama",
    admin: "Riyadh Firdaus",
  },
  {
    id: 2,
    created_at: "2026-01-02T11:30:00Z",
    product: { name: "Busi Denso", code: "BSI-002" },
    type: "OUT",
    quantity: -4,
    balance_after: 12,
    notes: "Servis Rutin Invoice #882",
    admin: "Dedy Priyatna",
  },
  {
    id: 3,
    created_at: "2026-01-03T08:15:00Z",
    product: { name: "Filter Udara", code: "FLT-99" },
    type: "ADJUSTMENT",
    quantity: -2,
    balance_after: 18,
    notes: "Penyesuaian stok opname - barang rusak",
    admin: "Hani Alfiyyah",
  },
  {
    id: 4,
    created_at: "2026-01-03T09:00:00Z",
    product: { name: "Oli mobil avanza", code: "OLI-123" },
    type: "OUT",
    quantity: -1,
    balance_after: 999,
    notes: "Ganti oli pelanggan",
    admin: "Firdhaus Al Hussein",
  },
];

export default function StockLogPage() {
  const [logs] = useState(dummyStockLogs);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Log Mutasi Stok</h1>
          <p className="text-slate-500 text-sm">
            Pantau semua perubahan stok barang masuk dan keluar
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Export Excel
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-4 bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Cari produk atau kode..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold tracking-wider">
                <th className="px-6 py-4 border-b">Waktu & Admin</th>
                <th className="px-6 py-4 border-b">Informasi Produk</th>
                <th className="px-6 py-4 border-b">Tipe</th>
                <th className="px-6 py-4 border-b text-right">Perubahan</th>
                <th className="px-6 py-4 border-b text-right">Stok Akhir</th>
                <th className="px-6 py-4 border-b">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">
                      {new Date(log.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-slate-400">{log.admin}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-blue-600">
                      {log.product.name}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {log.product.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                        log.type === "IN"
                          ? "bg-emerald-50 text-emerald-700"
                          : log.type === "OUT"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {log.type === "IN" && (
                        <ArrowUpCircle className="h-3 w-3" />
                      )}
                      {log.type === "OUT" && (
                        <ArrowDownCircle className="h-3 w-3" />
                      )}
                      {log.type === "ADJUSTMENT" && (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      {log.type}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 text-right font-bold text-sm",
                      log.quantity > 0 ? "text-emerald-600" : "text-rose-600",
                    )}
                  >
                    {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm font-medium text-slate-700">
                    {log.balance_after}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                    {log.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
