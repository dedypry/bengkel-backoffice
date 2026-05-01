import { Box, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableColumn, TableHeader } from "@heroui/react";

import HeaderAction from "@/components/header-action";

export function PoPage() {
  const navigate = useNavigate();

  return (
    <>
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
        <TableBody />
      </Table>
    </>
  );
}
