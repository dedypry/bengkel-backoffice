import type { IService } from "@/utils/interfaces/IService";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@mui/joy";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addWoService,
  removeWoService,
} from "@/stores/features/work-order/wo-slice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { CustomPagination } from "@/components/custom-pagination";
import { getService } from "@/stores/features/service/service-action";
import debounce from "@/utils/helpers/debounce";
import InputQty from "@/components/input-qty";

export default function TabService() {
  const { services } = useAppSelector((state) => state.service);
  const { services: selectedServices } = useAppSelector((state) => state.wo);
  const [search, setSearch] = useState("");

  const selectedIds = selectedServices.map((e) => e.id);

  const dispatch = useAppDispatch();

  function handleCheck(isCheck: boolean, item: IService) {
    if (isCheck) {
      dispatch(addWoService({ ...item, qty: 1 }));
    } else {
      dispatch(removeWoService(item));
    }
  }

  function handleQty(item: IService, qty: number) {
    if (qty > 0) {
      dispatch(addWoService({ ...item, qty }));
    } else {
      dispatch(removeWoService(item));
    }
  }

  function findQty(item: IService) {
    const find = selectedServices.find((e) => e.id === item.id);

    return find?.qty || 0;
  }

  const searchDebounce = debounce((q) => dispatch(getService({ q })), 500);

  return (
    <>
      <div className="my-5">
        <Input
          endDecorator={
            <button
              className="cursor-pointer"
              onClick={() => {
                setSearch("");
                dispatch(getService({ q: "" }));
              }}
            >
              <X />
            </button>
          }
          placeholder="Search..."
          startDecorator={<Search />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchDebounce(e.target.value);
          }}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pilih</TableHead>
            <TableHead>Jasa</TableHead>
            <TableHead className="text-end">Harga</TableHead>
            <TableHead className="text-center">Qty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services?.data?.map((item) => (
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
                {formatIDR(Number(item.price))}
              </TableCell>
              <TableCell className="flex justify-center">
                <div className="max-w-32">
                  <InputQty
                    handleQty={(qty) => {
                      console.log("qty", qty, findQty(item));
                      handleQty(item, qty);
                    }}
                    value={findQty(item)}
                  />
                  {/* <InputNumber
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
                  /> */}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>
          <CustomPagination
            meta={services?.meta!}
            onPageChange={(page) => dispatch(getService({ page }))}
          />
        </TableCaption>
      </Table>
    </>
  );
}
