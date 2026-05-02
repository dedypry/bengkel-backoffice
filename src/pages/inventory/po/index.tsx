import { Box, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
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
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";

export function PoPage() {
  const { list, loading, poQuery } = useAppSelector((state) => state.po);
  const [open, setOpen] = useState(false);
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
  }, []);

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

      <Table>
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
                  onDelete={() => confirmSweat(() => handleDelete(item.id))}
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
