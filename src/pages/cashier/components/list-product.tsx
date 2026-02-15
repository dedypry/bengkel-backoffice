import { Card, CardBody, Chip, ScrollShadow, Divider } from "@heroui/react";
import { Package, MapPin, Tag } from "lucide-react"; // Ikon tambahan agar lebih pro

import { ProductListSkeleton } from "./product-list-skeleton";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { setWoProducts } from "@/stores/features/work-order/wo-slice";

export default function ListProduct() {
  const { products, isLoadingProduct } = useAppSelector(
    (state) => state.product,
  );
  const { products: datas } = useAppSelector((state) => state.wo);

  const dispatch = useAppDispatch();

  if (isLoadingProduct) return <ProductListSkeleton />;

  return (
    <ScrollShadow className="px-1 scrollbar-modern">
      <div className="flex flex-col gap-3">
        {products?.data.map((item) => {
          const isSelected = datas.some((e) => e.id === item.id);

          return (
            <Card
              key={item.id}
              isHoverable
              isPressable
              className={`border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary-50/20"
                  : "border-transparent bg-content1"
              }`}
              shadow="sm"
              onPress={() =>
                dispatch(
                  setWoProducts({
                    ...item,
                    qty: 1,
                  }),
                )
              }
            >
              <CardBody className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="text-primary" size={12} />
                      <span className="text-tiny font-bold uppercase text-primary tracking-wider">
                        {item.category?.name}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xs leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      {item.code}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-success tracking-tight">
                      {formatIDR(Number(item.sell_price))}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      per {item.uom?.name || "Unit"}
                    </p>
                  </div>
                </div>

                <Divider className="my-3 opacity-50" />

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Chip
                      className="h-6 text-xs font-semibold"
                      color={
                        item.stock <= item.min_stock ? "danger" : "default"
                      }
                      size="sm"
                      startContent={<Package size={12} />}
                      variant="flat"
                    >
                      Stok: {item.stock}
                    </Chip>
                    <Chip
                      className="h-6 text-xs font-semibold border-none"
                      color="primary"
                      size="sm"
                      startContent={<MapPin size={12} />}
                      variant="dot"
                    >
                      {item.location}
                    </Chip>
                  </div>

                  {isSelected && (
                    <Chip
                      className="h-5 text-[10px] font-bold animate-pulse"
                      color="primary"
                      size="sm"
                      variant="solid"
                    >
                      TERPILIH
                    </Chip>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </ScrollShadow>
  );
}
