import { AlertTriangle, PackageSearch, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/stores/hooks";

export function InventoryAlert() {
  const { dashboard } = useAppSelector((state) => state.dashboard);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-500" />
          Stok Kritis
        </h3>
        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {dashboard?.product?.length} Item
        </span>
      </div>

      <div className="space-y-3">
        {dashboard?.product.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={`size-2 rounded-full ${item.stock === 0 ? "bg-red-500 animate-pulse" : "bg-amber-500"}`}
              />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  Sisa Stok: {item.stock} {item.unit}
                </p>
              </div>
            </div>
            <Button className="size-8" size="icon" variant="ghost">
              <PackageSearch className="size-4 text-slate-400" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        className="w-full mt-4 text-xs h-9 gap-2"
        variant="outline"
        onClick={() => navigate("/inventory/stock")}
      >
        Lihat Gudang <ArrowRight className="size-3" />
      </Button>
    </div>
  );
}
