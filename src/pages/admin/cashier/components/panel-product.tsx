import { IconButton, Sheet, Stack, Table, Typography } from "@mui/joy";
import { PackageSearch, Trash2 } from "lucide-react";

import ModalProductOrder from "./modal-product-order";

import { Card, CardAction, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import InputQty from "@/components/input-qty";
import {
  removeWoProduct,
  setWoProducts,
} from "@/stores/features/work-order/wo-slice";
import { Empty, EmptyTitle } from "@/components/ui/empty";

export default function PanelProduct() {
  const { products } = useAppSelector((state) => state.wo);
  const dispatch = useAppDispatch();

  const grandTotal = products.reduce(
    (sum, a) => sum + Number(a.sell_price || 0) * Number(a.qty || 1),
    0,
  );

  return (
    <Card className="min-h-full flex flex-col border-[#168BAB]/20 shadow-lg">
      <CardContent className="gap-2 flex flex-col overflow-y-auto scrollbar-modern flex-1">
        <Sheet
          sx={{
            backgroundColor: "transparent",
          }}
        >
          <Table stickyHeader>
            <thead>
              <tr>
                <th>Produk</th>
                <th style={{ textAlign: "end" }}>Harga</th>
                <th style={{ textAlign: "center" }}>Jumlah</th>
                <th style={{ textAlign: "center", width: 80 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex flex-col">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-gray-500 italic">
                          {item.code}
                        </p>
                      </div>
                    </td>
                    <td style={{ textAlign: "end" }}>
                      <p className="font-semibold text-[14px]">
                        {formatIDR(Number(item.sell_price))}
                      </p>
                    </td>
                    <td>
                      <div className="w-full flex justify-end">
                        <div className="max-w-32.5">
                          <InputQty
                            handleQty={(qty) => {
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
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <IconButton
                        onClick={() => dispatch(removeWoProduct(item))}
                      >
                        <Trash2 className="text-rose-600" size={18} />
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <Empty className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <Stack alignItems="center" spacing={2} textAlign="center">
                        {/* Visual Indicator */}
                        <div className="p-4 bg-white rounded-full shadow-sm">
                          <PackageSearch className="text-slate-400" size={40} />
                        </div>

                        <Stack spacing={0.5}>
                          <EmptyTitle className="text-xl font-bold text-slate-800">
                            Produk Tidak Ditemukan
                          </EmptyTitle>
                          <Typography
                            level="body-sm"
                            sx={{ maxWidth: 280, color: "text.tertiary" }}
                          >
                            silahkan pilih product di sebelah kiri
                          </Typography>
                        </Stack>
                      </Stack>
                    </Empty>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>
      </CardContent>
      <CardAction className="px-5 w-full">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <p className="">Sub Total</p>
            <p className="font-semibold text-[18px]">{formatIDR(grandTotal)}</p>
          </div>
          <div>
            <ModalProductOrder
              disable={products.length === 0}
              grandTotal={grandTotal}
            />
          </div>
        </div>
      </CardAction>
    </Card>
  );
}
