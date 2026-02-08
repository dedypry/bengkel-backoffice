import type { IProduct } from "@/utils/interfaces/IProduct";

import {
  Download,
  TrendingUp,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";

import TopPartSkeleton from "./components/top-part-skeleton";
import TopPartEmptyState from "./components/top-part-empty";

import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";
import { notifyError } from "@/utils/helpers/notify";
import { formatIDR, formatNumber } from "@/utils/helpers/format";

export default function ReportTopPart() {
  const [products, setProduct] = useState<IProduct[]>([]);
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getProduct();
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, []);

  function getProduct() {
    setLoading(true);
    http
      .get("/products/top-part")
      .then(({ data }) => {
        setProduct(data);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  if (loading) return <TopPartSkeleton />;

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
        {products.length > 0 ? (
          products.map((item, index) => {
            const isLowStock = item.stock < 10;
            const totalRevenue =
              Number(item.sold || 0) * Number(item.sell_price || 0);

            return (
              <Card
                key={item.id}
                isPressable
                className="p-4 hover:translate-y-[-8px] transition-all duration-300"
              >
                <CardHeader className="flex flex-col items-start px-4 pt-6 relative">
                  {/* Floating Rank Indicator */}
                  <div className="absolute top-0 right-2 flex flex-col items-center">
                    <Chip
                      className="font-bold uppercase text-white text-[10px] bg-orange-500 shadow-sm shadow-orange-200"
                      color="warning"
                      size="sm"
                      variant="shadow"
                    >
                      Top Item #{index + 1}
                    </Chip>
                  </div>

                  <div className="text-start mt-2">
                    <h3 className="text-md font-black text-gray-500 uppercase ">
                      {item.name}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      {item.category?.name || "General Part"}
                    </p>
                  </div>
                </CardHeader>

                <CardBody className="space-y-6">
                  {/* Sales Metrics */}
                  <div className="flex flex-col gap-2">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1">
                        <TrendingUp className="text-success" size={20} />
                        Terjual
                      </p>
                      <p className="text-lg font-black text-gray-500">
                        {formatNumber(Number(item.sold || 0))}
                        <span className="text-sm ml-1 text-gray-400 uppercase font-bold">
                          {item.uom?.code || item.unit}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase">
                        Total Omzet
                      </p>
                      <p className="text-lg font-black text-success">
                        {formatIDR(totalRevenue)}
                      </p>
                    </div>
                  </div>

                  {/* Stock Status Section */}
                  <div
                    className={`p-2 rounded-sm border transition-colors flex flex-col ${
                      isLowStock
                        ? "bg-rose-50 border-rose-100 shadow-sm shadow-rose-50"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div
                        className={`p-3 rounded-sm ${isLowStock ? "bg-white text-danger" : "bg-white text-secondary"}`}
                      >
                        <PackageSearch size={20} />
                      </div>
                      <div>
                        <p
                          className={`text-[10px] font-black uppercase  ${isLowStock ? "text-rose-400" : "text-gray-400"}`}
                        >
                          Stok Saat Ini
                        </p>
                        <p
                          className={`text-xl font-black  ${isLowStock ? "text-rose-600" : "text-gray-500"}`}
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
                        className="font-black uppercase"
                        color="danger"
                        size="sm"
                        startContent={
                          <AlertTriangle className="animate-bounce" size={18} />
                        }
                        variant="shadow"
                      >
                        Restok
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <TopPartEmptyState />
          </div>
        )}
      </div>
    </div>
  );
}
