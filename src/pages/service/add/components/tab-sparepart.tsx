import type { IProduct } from "@/utils/interfaces/IProduct";

import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { formatNumber } from "@/utils/helpers/format";
// Menggunakan InputNumber HeroUI yang kita buat di awal
import InputQty from "@/components/input-qty";
import InputNumber from "@/components/input-number";

export default function TabSparepart() {
  const { t } = useTranslation();
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

    return find;
  }

  const searchDebounce = debounce((q) => dispatch(getProduct({ q })), 500);
  const handlePrice = debounce((val: number, item: IProduct) => {
    dispatch(
      addSparepartService({
        ...item,
        price: val,
        sell_price: val?.toString(),
      }),
    );
  }, 1000);

  return (
    <div className="space-y-4">
      <Input
        isClearable
        className="max-w-full"
        placeholder={t("service.add.search_sparepart")}
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

      <Table removeWrapper aria-label={t("service.add.sparepart_table_aria")}>
        <TableHeader>
          <TableColumn width={40}>{t("service.add.select_col")}</TableColumn>
          <TableColumn>{t("service.add.product_col")}</TableColumn>
          <TableColumn align="end">{t("service.add.stock_col")}</TableColumn>
          <TableColumn align="end">{t("service.detail_tab.price")}</TableColumn>
          <TableColumn align="center" width={160}>
            {t("service.add.amount_col")}
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={t("service.add.sparepart_empty")}>
          {(products?.data || []).map((item) => {
            const find = findQty(item);
            const remainingStock = Number(item.stock - (find?.qty || 0));
            const isOutOfStock = item.stock < 1;
            const itemData: any = {
              ...item,
              qty: find?.qty || 0,
              sell_price: find?.price || item.sell_price || 0,
            };

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
                      handleCheck(isSelected, itemData)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{item.name}</span>
                    <span className="text-xs text-gray-400 font-mono">
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
                  <InputNumber
                    classNames={{
                      input: "text-right",
                    }}
                    isDisabled={!selectedIds.includes(item.id)}
                    size="sm"
                    startContent="Rp"
                    value={Number(itemData.sell_price || 0).toString()}
                    onInput={(val) => handlePrice(val, itemData)}
                  />
                  {/* <span className="text-small font-bold text-success">
                    {formatIDR(Number(item.sell_price))}
                  </span> */}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <InputQty
                      handleQty={(newVal) => handleQty(item, newVal)} // Menggunakan prop dari InputNumber refactor kita
                      isDisabled={isOutOfStock}
                      value={find?.qty || 0}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
