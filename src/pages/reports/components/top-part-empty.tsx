import { Button, Card, CardBody } from "@heroui/react";
import { PackageOpen, Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TopPartEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full border-2 border-dashed border-gray-100 shadow-none bg-transparent">
        <CardBody className="flex flex-col items-center text-center p-12 space-y-6">
          {/* Icon Area */}
          <div className="relative">
            <div className="size-24 rounded-full bg-gray-50 flex items-center justify-center">
              <PackageOpen
                className="text-gray-300"
                size={48}
                strokeWidth={1}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 size-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
              <ShoppingCart className="text-orange-500" size={20} />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-500 uppercase">
              Belum Ada Data Penjualan
            </h3>
            <p className="text-xs font-bold text-gray-400">
              Analisis barang terlaris akan muncul di sini setelah Anda
              melakukan transaksi penjualan suku cadang di sistem kasir.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3 pt-4">
            <Button
              color="primary"
              radius="sm"
              startContent={<Plus size={18} />}
              onPress={() => navigate("/service/add")}
            >
              Mulai Penjualan Baru
            </Button>
            <Button
              radius="sm"
              variant="light"
              onPress={() => navigate("/inventory/stock")}
            >
              Cek Stok Inventaris
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
