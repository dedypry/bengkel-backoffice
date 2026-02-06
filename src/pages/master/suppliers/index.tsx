import type { ISupplier } from "@/utils/interfaces/ISupplier";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@heroui/react";
import {
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
} from "lucide-react";

import AddModal from "./components/add-modal";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getSupplier } from "@/stores/features/supplier/supplier-action";
import { CustomPagination } from "@/components/custom-pagination";
import { setSupplierQuery } from "@/stores/features/supplier/supplier-slice";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import HeaderAction from "@/components/header-action";
import { http } from "@/utils/libs/axios";

export default function MasterSupplierPage() {
  const { suppliers, supplierQuery } = useAppSelector(
    (state) => state.supplier,
  );
  const { company } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (company) {
      dispatch(getSupplier(supplierQuery));
    }
  }, [supplierQuery, company, dispatch]);

  const handleDelete = (id: number) => {
    http
      .delete(`/suppliers/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getSupplier(supplierQuery));
      })
      .catch((err) => notifyError(err));
  };

  return (
    <div className="space-y-6 pb-20 px-4">
      <AddModal
        open={open}
        setOpen={setOpen}
        supplier={selectedSupplier}
        onClose={() => setSelectedSupplier(undefined)}
      />

      <HeaderAction
        actionIcon={Plus}
        actionTitle="Tambah Supplier"
        subtitle="Kelola data vendor dan penyedia jasa bengkel Anda."
        title="Master Supplier"
        onAction={() => setOpen(true)}
      />

      {/* Control Bar: Pencarian & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <input
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gray-200 font-bold text-gray-600 placeholder:text-gray-400 text-sm transition-all"
            placeholder="Cari nama, kode, atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && dispatch(setSupplierQuery({ q: search }))
            }
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            className="flex-1 md:flex-none bg-gray-900 text-white font-bold uppercase italic tracking-wider px-8"
            onPress={() => dispatch(setSupplierQuery({ q: search }))}
          >
            Cari
          </Button>
          {/* <Button
            isIconOnly
            className="bg-gray-100 text-gray-600"
            variant="flat"
          >
            <Filter size={20} />
          </Button> */}
        </div>
      </div>

      {/* Table Section */}
      <Table
        isStriped
        aria-label="Tabel Supplier"
        classNames={{
          th: "bg-gray-50 text-gray-500 font-black uppercase text-[11px] tracking-widest py-4 px-6",
          td: "py-4 px-6 border-b border-gray-50",
        }}
      >
        <TableHeader>
          <TableColumn width={150}>KODE</TableColumn>
          <TableColumn>SUPPLIER</TableColumn>
          <TableColumn>KONTAK</TableColumn>
          <TableColumn>INFORMASI</TableColumn>
          <TableColumn width={120}>STATUS</TableColumn>
          <TableColumn align="center" width={80}>
            AKSI
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-gray-50 rounded-full mb-4">
                <Search className="text-gray-300" size={40} />
              </div>
              <p className="font-black uppercase italic text-gray-400">
                Supplier Tidak Ditemukan
              </p>
            </div>
          }
        >
          {(suppliers?.data || []).map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell>
                <Chip
                  className="font-black text-gray-600 border-none"
                  size="sm"
                  variant="flat"
                >
                  {item.code}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <p className="font-black text-gray-600 uppercase text-xs">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold truncate max-w-[200px]">
                      {item.address || "Alamat belum diatur"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="text-gray-300" size={14} />
                    <span className="text-xs font-bold">
                      {item.phone || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="text-gray-300" size={14} />
                    <span className="text-xs font-bold">
                      {item.email || "-"}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    NPWP: {item.npwp || "-"}
                  </p>
                  {item.website && (
                    <a
                      className="flex items-center gap-1 text-blue-500 hover:underline text-[10px] font-bold"
                      href={`https://${item.website}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ExternalLink size={10} /> {item.website}
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-black uppercase text-[10px] border-none"
                  color={item.is_active ? "success" : "default"}
                  size="sm"
                  variant="dot"
                >
                  {item.is_active ? "Aktif" : "Non-Aktif"}
                </Chip>
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly size="sm" variant="light">
                      <MoreVertical className="text-gray-400" size={20} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Aksi Supplier" variant="flat">
                    <DropdownItem
                      key="edit"
                      startContent={<Edit2 size={16} />}
                      onPress={() => {
                        setSelectedSupplier(item);
                        setOpen(true);
                      }}
                    >
                      Edit Data
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 size={16} />}
                      onPress={() => confirmSweat(() => handleDelete(item.id))}
                    >
                      Hapus Supplier
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        meta={suppliers?.meta!}
        onPageChange={(page) => dispatch(setSupplierQuery({ page }))}
      />
    </div>
  );
}
