import type { IService } from "@/utils/interfaces/IService";

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

import {
  addWoService,
  removeWoService,
} from "@/stores/features/work-order/wo-slice";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { formatIDR } from "@/utils/helpers/format";
import { CustomPagination } from "@/components/custom-pagination";
import { getService } from "@/stores/features/service/service-action";
import debounce from "@/utils/helpers/debounce";
// Menggunakan InputNumber HeroUI kita
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
    <div className="space-y-4">
      {/* Search Input HeroUI */}
      <Input
        isClearable
        className="max-w-full"
        placeholder="Cari nama atau kode jasa servis..."
        startContent={<Search className="text-default-400" size={18} />}
        value={search}
        variant="bordered"
        onChange={(e) => {
          setSearch(e.target.value);
          searchDebounce(e.target.value);
        }}
        onClear={() => {
          setSearch("");
          dispatch(getService({ q: "" }));
        }}
      />

      <Table
        aria-label="Tabel Pemilihan Jasa"
        classNames={{
          wrapper: "border border-default-100 p-0 overflow-hidden",
          th: "bg-default-50 text-gray-600 font-bold",
        }}
        shadow="none"
      >
        <TableHeader>
          <TableColumn width={40}>PILIH</TableColumn>
          <TableColumn>NAMA JASA</TableColumn>
          <TableColumn align="end">HARGA SATUAN</TableColumn>
          <TableColumn align="center" width={160}>
            QTY / DURASI
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="Layanan jasa tidak ditemukan">
          {(services?.data || []).map((item) => {
            const currentQty = findQty(item);
            const isSelected = selectedIds.includes(item.id);

            return (
              <TableRow
                key={item.id}
                className="border-b border-default-50 last:border-none"
              >
                <TableCell>
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={(isSelected) =>
                      handleCheck(isSelected, item)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-small font-semibold text-default-700">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-tiny text-gray-400 font-mono">
                        {item.code}
                      </span>
                      <Chip
                        className="border-none h-4 text-[10px]"
                        color="primary"
                        size="sm"
                        variant="dot"
                      >
                        Servis
                      </Chip>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-small font-bold text-default-700">
                    {formatIDR(Number(item.price))}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <InputQty
                      handleQty={(newVal) => handleQty(item, newVal)}
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
        meta={services?.meta!}
        onPageChange={(page) => dispatch(getService({ page }))}
      />
    </div>
  );
}
