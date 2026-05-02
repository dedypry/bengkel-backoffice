import { Box, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import { ModalPoDetail } from "./modal-detail";

import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchPo, fetchPoDetail } from "@/stores/features/po/po-action";
import Loading from "@/components/loading/Loading";
import {
  capitalizeStatus,
  formatDate,
  formatIDR,
} from "@/utils/helpers/format";
import TableAction from "@/components/table-action";
import { notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { CustomPagination } from "@/components/custom-pagination";
import { setPoQuery } from "@/stores/features/po/po-slice";
import PageSize from "@/components/page-size";
import debounce from "@/utils/helpers/debounce";

export function PoPage() {
  const { list, loading, poQuery } = useAppSelector((state) => state.po);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const hasFetch = useRef(false);

  useEffect(() => {
    if (!hasFetch.current) {
      hasFetch.current = true;
      dispatch(fetchPo(poQuery));

      setTimeout(() => {
        hasFetch.current = false;
      }, 1000);
    }
  }, [poQuery]);

  const handleDetail = (id: number) => {
    dispatch(fetchPoDetail(id));
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    http
      .delete(`po/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(fetchPo(poQuery));
      })
      .catch(notifyError);
  };

  const searchDebounce = debounce((q) => dispatch(setPoQuery({ q })), 500);

  return (
    <>
      <ModalPoDetail open={open} onOpen={setOpen} />
      <HeaderAction
        actionIcon={Plus}
        actionTitle="Buat PO Baru"
        leadIcon={Box}
        subtitle="Daftar Order Pembelian Sparepart Bengkel"
        title="Order Pembelian"
        onAction={() => navigate("create")}
      />

      <Table
        bottomContent={
          <CustomPagination
            meta={list?.meta!}
            onPageChange={(page) => dispatch(setPoQuery({ page }))}
          />
        }
        topContent={
          <div className="flex justify-between">
            <PageSize
              selectedKeys={[poQuery.pageSize.toString()]}
              onSelectionChange={(key) => {
                const val = Array.from(key)[0].toString();

                dispatch(setPoQuery({ pageSize: val }));
              }}
            />
            <div>
              <Input
                endContent={
                  search && (
                    <X
                      className="cursor-pointer"
                      size={18}
                      onClick={() => {
                        setSearch("");
                        dispatch(setPoQuery({ q: "" }));
                      }}
                    />
                  )
                }
                placeholder="Cari PO"
                startContent={<Search size={18} />}
                value={search}
                onValueChange={(val) => {
                  setSearch(val);
                  searchDebounce(val);
                }}
              />
            </div>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>No PO</TableColumn>
          <TableColumn>Tanggal</TableColumn>
          <TableColumn>Supplier</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Total</TableColumn>
          <TableColumn>Tanggal diminta</TableColumn>
          <TableColumn>Catatan</TableColumn>
          <TableColumn>Aksi</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent="Data Kosong"
          isLoading={loading}
          loadingContent={<Loading />}
        >
          {(list?.data || [])?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleDetail(item.id)}
                >
                  {item.po_no}
                </Button>
              </TableCell>
              <TableCell>{formatDate(item.date)}</TableCell>
              <TableCell>{item.supplier?.name}</TableCell>
              <TableCell>{capitalizeStatus(item.status)}</TableCell>
              <TableCell>{formatIDR(item.total)}</TableCell>
              <TableCell>{formatDate(item.requested_date)}</TableCell>
              <TableCell>{item.notes}</TableCell>
              <TableCell>
                <TableAction
                  onDelete={() => handleDelete(item.id)}
                  onDetail={() => handleDetail(item.id)}
                  onEdit={() => navigate(`${item.id}`)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
