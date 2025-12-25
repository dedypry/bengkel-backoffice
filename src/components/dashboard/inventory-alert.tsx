import { AlertTriangle, PackageSearch, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const lowStockItems = [
  {
    id: 1,
    name: "Oli Shell Helix 1L",
    stock: 2,
    unit: "Botol",
    status: "Critical",
  },
  { id: 2, name: "Kampas Rem Vario", stock: 0, unit: "Set", status: "Empty" },
  { id: 3, name: "Busi NGK", stock: 5, unit: "Pcs", status: "Low" },
];

export function InventoryAlert() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-500" />
          Stok Kritis
        </h3>
        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {lowStockItems.length} Item
        </span>
      </div>

      <div className="space-y-3">
        {lowStockItems.map((item) => (
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

      <Button className="w-full mt-4 text-xs h-9 gap-2" variant="outline">
        Lihat Gudang <ArrowRight className="size-3" />
      </Button>
    </div>
  );
}
