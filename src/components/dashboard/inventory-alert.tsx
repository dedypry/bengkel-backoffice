import { AlertTriangle, PackageSearch, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tooltip,
  ScrollShadow,
} from "@heroui/react";

import { useAppSelector } from "@/stores/hooks";

export function InventoryAlert() {
  const { dashboard } = useAppSelector((state) => state.dashboard);
  const navigate = useNavigate();

  return (
    <Card className="border-none bg-content1" shadow="sm">
      <CardHeader className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-danger-50 rounded-lg">
            <AlertTriangle className="size-4 text-danger" />
          </div>
          <h3 className="font-bold text-default-800 text-small">Stok Kritis</h3>
        </div>
        <Chip
          className="font-bold text-[10px] h-5 border-none"
          color="danger"
          size="sm"
          variant="flat"
        >
          {dashboard?.product?.length || 0} Item
        </Chip>
      </CardHeader>

      <CardBody className="px-5 pb-5">
        <ScrollShadow className="max-h-[320px] space-y-3">
          {dashboard?.product.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 opacity-40">
              <PackageSearch size={32} />
              <p className="text-tiny mt-2">Semua stok aman</p>
            </div>
          ) : (
            dashboard?.product.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-default-50 border border-default-100 hover:bg-default-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Tooltip
                    color={item.stock === 0 ? "danger" : "warning"}
                    content={item.stock === 0 ? "Stok Habis!" : "Stok Menipis"}
                    placement="left"
                  >
                    <div
                      className={`size-2.5 rounded-full shadow-sm ${
                        item.stock === 0
                          ? "bg-danger animate-pulse shadow-danger/50"
                          : "bg-warning shadow-warning/50"
                      }`}
                    />
                  </Tooltip>
                  <div>
                    <p className="text-small font-semibold text-default-700 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-tiny text-default-500 font-medium">
                      Sisa:{" "}
                      <span
                        className={
                          item.stock === 0 ? "text-danger font-bold" : ""
                        }
                      >
                        {item.stock} {item.unit}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  isIconOnly
                  className="group-hover:text-primary transition-colors"
                  radius="full"
                  size="sm"
                  variant="light"
                >
                  <PackageSearch className="size-4 text-default-400 group-hover:text-primary" />
                </Button>
              </div>
            ))
          )}
        </ScrollShadow>

        <Button
          fullWidth
          className="mt-4 font-bold text-tiny"
          color="default"
          endContent={<ArrowRight className="size-3" />}
          variant="flat"
          onPress={() => navigate("/inventory/stock")}
        >
          Lihat Gudang
        </Button>
      </CardBody>
    </Card>
  );
}
