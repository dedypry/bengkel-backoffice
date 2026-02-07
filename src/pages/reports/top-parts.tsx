import type { IProduct } from "@/utils/interfaces/IProduct";

import {
  Box,
  Download,
  TrendingUp,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Divider,
  Progress,
} from "@heroui/react";

import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { formatIDR, formatNumber } from "@/utils/helpers/format";

export default function ReportTopPart() {
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
    <div className="space-y-10 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header with Custom Icon */}
      <HeaderAction
        actionIcon={Download}
        actionTitle="LAPORAN STOK"
        subtitle="Analisis perputaran stok dan produk yang paling diminati pelanggan bengkel."
        title="Barang Terlaris"
        onAction={() => {}}
      />

      {/* Top Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item, index) => {
          const isLowStock = item.stock < 10;
          const totalRevenue =
            Number(item.sold || 0) * Number(item.sell_price || 0);

          return (
            <Card
              key={item.id}
              isPressable
              className="border-none shadow-sm rounded-[2.5rem] p-4 bg-white hover:shadow-xl hover:translate-y-[-8px] transition-all duration-300"
            >
              <CardHeader className="flex flex-col items-start px-4 pt-6 relative">
                {/* Floating Rank Indicator */}
                <div className="absolute top-0 right-2 flex flex-col items-center">
                  <span className="text-5xl font-black italic text-gray-100 absolute -top-2 right-0 -z-10">
                    #{index + 1}
                  </span>
                  <Chip
                    className="font-black italic uppercase text-[10px] bg-orange-500 shadow-orange-200"
                    color="warning"
                    size="sm"
                    variant="shadow"
                  >
                    Top Item
                  </Chip>
                </div>

                <div className="mb-6 bg-gray-900 size-20 rounded-[2rem] flex items-center justify-center shadow-lg shadow-gray-200 group-hover:bg-orange-500 transition-colors">
                  <Box className="size-10 text-white" strokeWidth={1.5} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-800 leading-none uppercase italic tracking-tighter">
                    {item.name}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    {item.category?.name || "General Part"}
                  </p>
                </div>
              </CardHeader>

              <CardBody className="px-4 py-6 space-y-6">
                {/* Sales Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <TrendingUp className="text-orange-500" size={10} />{" "}
                      Volume Terjual
                    </p>
                    <p className="text-2xl font-black text-gray-800 italic">
                      {formatNumber(Number(item.sold || 0))}
                      <span className="text-xs ml-1 text-gray-400 uppercase font-bold">
                        {item.uom?.code || item.unit}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Total Omzet
                    </p>
                    <p className="text-xl font-black text-emerald-600 italic">
                      {formatIDR(totalRevenue)}
                    </p>
                  </div>
                </div>

                <Divider className="bg-gray-50" />

                {/* Stock Status Section */}
                <div
                  className={`p-5 rounded-[2rem] border transition-colors flex items-center justify-between ${
                    isLowStock
                      ? "bg-rose-50 border-rose-100 shadow-sm shadow-rose-50"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className={`p-3 rounded-2xl ${isLowStock ? "bg-white text-rose-500" : "bg-white text-gray-400"}`}
                    >
                      <PackageSearch size={20} />
                    </div>
                    <div>
                      <p
                        className={`text-[10px] font-black uppercase tracking-tight ${isLowStock ? "text-rose-400" : "text-gray-400"}`}
                      >
                        Stok Saat Ini
                      </p>
                      <p
                        className={`text-xl font-black italic leading-none ${isLowStock ? "text-rose-600" : "text-gray-800"}`}
                      >
                        {item.stock}{" "}
                        <span className="text-[10px] uppercase">
                          {item.uom?.code || item.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  {isLowStock && (
                    <Button
                      className="bg-rose-600 text-white font-black italic uppercase text-[9px] h-8 px-4 rounded-xl shadow-lg shadow-rose-200"
                      size="sm"
                      startContent={
                        <AlertTriangle className="animate-bounce" size={12} />
                      }
                    >
                      Restok
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Insight Section */}
      <Card className="bg-gray-900 border-none rounded-[3rem] p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <CardBody className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
              <TrendingUp className="text-orange-400" size={32} />
            </div>
            <div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter">
                Performa Inventori
              </h4>
              <p className="text-gray-400 text-sm italic font-medium">
                3 Barang teratas menyumbang 40% dari total omzet suku cadang
                bulan ini.
              </p>
            </div>
          </div>
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase italic text-gray-500">
              <span>Target Perputaran</span>
              <span className="text-orange-500">85%</span>
            </div>
            <Progress
              aria-label="Stock turnover"
              className="h-2"
              classNames={{ track: "bg-white/10", indicator: "bg-orange-500" }}
              color="warning"
              value={85}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
