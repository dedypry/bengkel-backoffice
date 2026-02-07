import type { IProduct } from "@/utils/interfaces/IProduct";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Chip,
} from "@heroui/react";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  addSparepartService,
  removeSparepartService,
} from "@/stores/features/work-order/wo-slice";
import debounce from "@/utils/helpers/debounce";
import { getProduct } from "@/stores/features/product/product-action";
import { formatIDR, formatNumber } from "@/utils/helpers/format";
// Menggunakan InputNumber HeroUI yang kita buat di awal
import { CustomPagination } from "@/components/custom-pagination";
import InputQty from "@/components/input-qty";

export default function TabSparepart() {
  const { products } = useAppSelector((state) => state.product);
  const { sparepart } = useAppSelector((state) => state.wo);
  const [search, setSearch] = useState("");
  const selectedIds = sparepart.map((e) => e.id);

  const dispatch = useAppDispatch();

  function handleCheck(isCheck: boolean, item: IProduct) {
    if (isCheck) {
      dispatch(
        addSparepartService({
          ...item,
          qty: 1,
          price: Number(item.sell_price),
        }),
      );
    } else {
      dispatch(removeSparepartService(item));
    }
  }

  function handleQty(item: IProduct, qty: number) {
    if (qty > 0) {
      dispatch(
        addSparepartService({
          ...item,
          qty: item.stock < qty ? item.stock : qty,
        }),
      );
    } else {
      dispatch(removeSparepartService(item));
    }
  }

  function findQty(item: IProduct) {
    const find = sparepart.find((e) => e.id === item.id);

    return find?.qty || 0;
  }

  const searchDebounce = debounce((q) => dispatch(getProduct({ q })), 500);

  return (
    <div className="space-y-4">
      <Input
        isClearable
        className="max-w-full"
        placeholder="Cari sparepart berdasarkan nama atau kode..."
        startContent={<Search className="text-default-400" size={18} />}
        value={search}
        variant="bordered"
        onChange={(e) => {
          setSearch(e.target.value);
          searchDebounce(e.target.value);
        }}
        onClear={() => {
          setSearch("");
          dispatch(getProduct({ q: "" }));
        }}
      />

      <Table
        aria-label="Tabel Pemilihan Sparepart"
        classNames={{
          wrapper: "border border-default-100 p-0 overflow-hidden",
          th: "bg-default-50 text-gray-600 font-bold",
        }}
        shadow="none"
      >
        <TableHeader>
          <TableColumn width={40}>PILIH</TableColumn>
          <TableColumn>PRODUK</TableColumn>
          <TableColumn align="end">STOK TERSEDIA</TableColumn>
          <TableColumn align="end">HARGA</TableColumn>
          <TableColumn align="center" width={160}>
            JUMLAH
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="Sparepart tidak ditemukan">
          {(products?.data || []).map((item) => {
            const currentQty = findQty(item);
            const remainingStock = Number(item.stock - currentQty);
            const isOutOfStock = item.stock < 1;

            return (
              <TableRow
                key={item.id}
                className="border-b border-default-50 last:border-none"
              >
                <TableCell>
                  <Checkbox
                    isDisabled={isOutOfStock}
                    isSelected={selectedIds.includes(item.id)}
                    onValueChange={(isSelected) =>
                      handleCheck(isSelected, item)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-small font-semibold">
                      {item.name}
                    </span>
                    <span className="text-tiny text-gray-400 font-mono">
                      {item.code}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-small font-bold ${remainingStock < 0 ? "text-danger" : "text-default-700"}`}
                    >
                      {formatNumber(remainingStock)}
                    </span>
                    <Chip
                      className="h-4 text-[10px] uppercase"
                      size="sm"
                      variant="flat"
                    >
                      {item.uom?.code || "Unit"}
                    </Chip>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-small font-bold text-success">
                    {formatIDR(Number(item.sell_price))}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <InputQty
                      handleQty={(newVal) => handleQty(item, newVal)} // Menggunakan prop dari InputNumber refactor kita
                      isDisabled={isOutOfStock}
                      value={currentQty}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <CustomPagination
        meta={products?.meta!}
        onPageChange={(page) => dispatch(getProduct({ page }))}
      />
    </div>
  );
}
