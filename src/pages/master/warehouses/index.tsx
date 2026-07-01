import { Building2, Edit, Search, Trash2, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";

import WarehouseCreateModal from "./warehouse-create-modal";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getWarehouse } from "@/stores/features/warehouse/warehouse-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setWarehouseQuery } from "@/stores/features/warehouse/warehouse-slice";
import PageSize from "@/components/page-size";
import debounce from "@/utils/helpers/debounce";
import { handleDownloadExcel } from "@/utils/helpers/global";
import { IWarehouse } from "@/utils/interfaces/warehouse";
import { http } from "@/utils/libs/axios";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";

export default function WarehousesPage() {
  const { warehouses, warehouseQuery } = useAppSelector(
    (state) => state.warehouse,
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<IWarehouse>();
  const hasFetch = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      dispatch(getWarehouse(warehouseQuery));
      hasFetch.current = true;

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, [warehouseQuery]);

  const searecDebounce = debounce((q) => {
    dispatch(setWarehouseQuery({ q }));
  }, 500);

  function onDelete(id: number) {
    http
      .delete(`/warehouse/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getWarehouse(warehouseQuery));
      })
      .catch(notifyError);
  }

  return (
    <>
      <WarehouseCreateModal data={data} open={open} onOpen={setOpen} />
      <HeaderAction
        actionContent={
          <div className="flex gap-2">
            <Button
              className="bg-emerald-50 text-emerald-700 font-bold"
              isLoading={isExcelLoading}
              startContent={!isExcelLoading ? <Download size={16} /> : undefined}
              variant="flat"
              onPress={() =>
                void handleDownloadExcel(
                  "/warehouse/export/excel",
                  warehouseQuery,
                  "master-gudang",
                  setIsExcelLoading,
                )
              }
            >
              Export Excel
            </Button>
            <Button
              color="primary"
              startContent={<Building2 size={16} />}
              onPress={() => {
                setData(undefined);
                setOpen(true);
              }}
            >
              Buat Gudang Baru
            </Button>
          </div>
        }
        subtitle="Master"
        title="Gudang"
      />
      <Table
        bottomContent={
          <CustomPagination
            meta={warehouses?.meta!}
            onPageChange={(page) => dispatch(setWarehouseQuery({ page }))}
          />
        }
        topContent={
          <div className="flex justify-between gap-2">
            <PageSize
              selectedKeys={[String(warehouseQuery.pageSize || 10)]}
              onSelectionChange={(e) =>
                dispatch(
                  setWarehouseQuery({ pageSize: Array.from(e)[0] as number }),
                )
              }
            />
            <Input
              className="w-sm"
              placeholder="Cari Gudang"
              startContent={<Search className="size-4 text-gray-500" />}
              value={search}
              onValueChange={(val) => {
                setSearch(val);
                searecDebounce(val);
              }}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Nama Gudang</TableColumn>
          <TableColumn>Kontak</TableColumn>
          <TableColumn>Alamat</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn className="w-28 text-center">Aksi</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Data tidak ditemukan">
          {(warehouses?.data || []).map((warehouse) => (
            <TableRow key={warehouse.id}>
              <TableCell>
                <div className="space-y-0">
                  <p>{warehouse.name}</p>
                  <p className="text-xs text-gray-400">{warehouse.code}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-0">
                  <p>{warehouse.phone_number}</p>
                  <p className="text-xs text-gray-400">{warehouse.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-0">
                  <p>{warehouse?.district?.name}</p>
                  <p className="text-xs text-gray-400">
                    {warehouse?.city?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {warehouse?.province?.name}
                  </p>
                  <p className="text-xs text-gray-400">{warehouse.address}</p>
                </div>
              </TableCell>
              <TableCell>
                {warehouse.is_active ? "Aktif" : "Tidak Aktif"}
              </TableCell>
              <TableCell>
                <Tooltip content="Edit" placement="top">
                  <Button
                    isIconOnly
                    color="warning"
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setData(warehouse);
                      setOpen(true);
                    }}
                  >
                    <Edit size={18} />
                  </Button>
                </Tooltip>
                <Tooltip content="Hapus" placement="top">
                  <Button
                    isIconOnly
                    color="danger"
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => confirmSweat(() => onDelete(warehouse.id))}
                  >
                    <Trash2 size={18} />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
