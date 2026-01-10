import type { IProduct } from "@/utils/interfaces/IProduct";

import { Search, X } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addSparepartService,
  removeSparepartService,
} from "@/stores/features/work-order/wo-slice";
import debounce from "@/utils/helpers/debounce";
import { getProduct } from "@/stores/features/product/product-action";
import { formatIDR } from "@/utils/helpers/format";
import InputNumber from "@/components/ui/input-number";
import { CustomPagination } from "@/components/custom-pagination";

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
      dispatch(addSparepartService({ ...item, qty }));
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
    <>
      <div className="my-5">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              searchDebounce(e.target.value);
            }}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <X />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pilih</TableHead>
            <TableHead>Barang/Jasa</TableHead>
            <TableHead className="text-end">Harga</TableHead>
            <TableHead className="text-center">Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={(e) => handleCheck(e as boolean, item)}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-gray-400 text-xs">{item.code}</span>
                </div>
              </TableCell>
              <TableCell className="text-end">
                {formatIDR(Number(item.sell_price))}
              </TableCell>
              <TableCell className="flex justify-center">
                <div className="max-w-24">
                  <InputNumber
                    className="text-center"
                    endDecorator={
                      <button
                        className="cursor-pointer"
                        onClick={() => handleQty(item, findQty(item) + 1)}
                      >
                        +
                      </button>
                    }
                    startDecorator={
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          const val = findQty(item);

                          if (val >= 0) {
                            handleQty(item, val - 1);
                          }
                        }}
                      >
                        -
                      </button>
                    }
                    value={findQty(item)}
                    onInput={(val) => handleQty(item, val as number)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          <CustomPagination
            meta={products?.meta!}
            onPageChange={(page) => dispatch(getProduct({ page }))}
          />
        </TableCaption>
      </Table>
    </>
  );
}
