import type { IProduct } from "@/utils/interfaces/IProduct";

import { Box, Download } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { formatIDR, formatNumber } from "@/utils/helpers/format";

export default function LaporanBarangTerlaris() {
  const [products, setProduct] = useState<IProduct[]>([]);

  useEffect(() => {
    getProduct();
  }, []);
  function getProduct() {
    http
      .get("/products/top-part")
      .then(({ data }) => {
        setProduct(data);
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/20">
      {/* Header Vibrant - Amber Gradient */}
      <HeaderAction
        actionIcon={Download}
        actionTitle="LAPORAN STOK"
        subtitle="Analisis perputaran stok dan produk yang paling diminati
              pelanggan"
        title="Barang Terlaris"
      />

      {/* Top 3 Best Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-20">
        {products.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-5 shadow-xl shadow-slate-200/50 border border-white hover:border-orange-200 transition-all flex flex-col relative overflow-hidden"
          >
            {/* Rank Badge */}
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-2 rounded-bl-3xl font-black italic">
              #{index + 1}
            </div>

            <div className="mb-6 bg-slate-50 size-20 rounded-3xl flex items-center justify-center border border-slate-100">
              <Box className="size-10 text-orange-500" />
            </div>

            <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">
              {item.name}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              {item.category?.name}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">
                  Terjual
                </span>
                <span className="text-xl font-black text-slate-800">
                  {formatNumber(Number(item.sold || 0))}{" "}
                  {item.uom?.code || item.unit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Omzet</span>
                <span className="text-lg font-black text-emerald-600">
                  {formatIDR(
                    Number(item.sold || 0) * Number(item.sell_price || 0),
                  )}
                </span>
              </div>
            </div>

            <div className="mt-auto p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase">
                  Sisa Stok
                </p>
                <p
                  className={`text-lg font-black ${item.stock < 10 ? "text-rose-500" : "text-slate-700"}`}
                >
                  {item.stock} {item.uom?.code || item.unit}
                </p>
              </div>
              {item.stock < 10 && (
                <Badge className="bg-rose-500 text-white animate-pulse border-none">
                  RESTOK!
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
