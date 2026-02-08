import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardFooter,
  Button,
} from "@heroui/react";
import { PackageSearch, Trash2 } from "lucide-react";

import ModalProductOrder from "./modal-product-order";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import {
  removeWoProduct,
  setWoProducts,
} from "@/stores/features/work-order/wo-slice";
import InputQty from "@/components/input-qty";

export default function PanelProduct() {
  const { products } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();

  const grandTotal = products.reduce(
    (sum, a) => sum + Number(a.sell_price || 0) * Number(a.qty || 1),
    0,
  );

  return (
    <div className="w-full md:w-2/3 overflow-auto">
      <Card className="min-h-full flex flex-col border-[#168BAB]/20 shadow-lg w-full">
        <CardBody className="gap-2 flex flex-col overflow-y-auto scrollbar-modern">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>Produk</TableColumn>
              <TableColumn className="text-end">Harga</TableColumn>
              <TableColumn className="text-center">Jumlah</TableColumn>
              <TableColumn className="text-center w-20">Aksi</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="flex flex-col items-center text-center">
                    {/* Visual Indicator */}
                    <div className="p-4 bg-white rounded-full shadow-sm">
                      <PackageSearch className="text-slate-400" size={40} />
                    </div>

                    <div className="mt-2">
                      <p className="text-xl font-bold text-slate-800">
                        Produk Tidak Ditemukan
                      </p>
                      <p className="text-sm text-gray-500 max-w-64">
                        silahkan pilih product di sebelah kiri
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              {products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="font-semibold text-xs">{item.name}</p>
                      <p className="text-[10px] text-gray-500 italic">
                        {item.code}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-end">
                    <p className="font-semibold text-xs">
                      {formatIDR(Number(item.sell_price))}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="w-full flex justify-center">
                      <div className="max-w-32">
                        <InputQty
                          handleQty={(qty: number) => {
                            if (qty > 0) {
                              dispatch(
                                setWoProducts({
                                  ...item,
                                  qty,
                                }),
                              );
                            } else {
                              dispatch(removeWoProduct(item));
                            }
                          }}
                          value={Number(item?.qty || 0)}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onClick={() => dispatch(removeWoProduct(item))}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
        <CardFooter className="px-5">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4 items-center">
              <p className="font-bold">Sub Total</p>
              <p className="font-semibold text-[18px]">
                {formatIDR(grandTotal)}
              </p>
            </div>
            <div>
              <ModalProductOrder
                disable={products.length === 0}
                grandTotal={grandTotal}
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
