import type { IService } from "@/utils/interfaces/IService";

import {
  Clock,
  Plus,
  Zap,
  ShieldCheck,
  Trash2,
  Edit,
  PackageOpen,
  Search,
  X,
  Download,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";

import ModalAdd from "./components/modal-add";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { formatIDR } from "@/utils/helpers/format";
import { CustomPagination } from "@/components/custom-pagination";
import { setServiceQuery } from "@/stores/features/service/service-slice";
import debounce from "@/utils/helpers/debounce";
import HeaderAction from "@/components/header-action";
import { confirmSweat, notify, notifyError } from "@/utils/helpers/notify";
import { http } from "@/utils/libs/axios";
import { handleDownloadExcel } from "@/utils/helpers/global";

export default function MasterServicePage() {
  const { services, query } = useAppSelector((state) => state.service);
  const { company } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [detail, setDetail] = useState<IService>();
  const dispatch = useAppDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getService(query));
      setTimeout(() => {
        hasFetched.current = false;
      }, 1000);
    }
  }, [company, query, dispatch]);

  const handleSearch = debounce((search) => {
    dispatch(setServiceQuery({ q: search }));
  }, 1000);

  // Helper untuk menentukan warna Chip kesulitan
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      default:
        return "default";
    }
  };

  function handleDelete(id: number) {
    http
      .delete(`/services/${id}`)
      .then(({ data }) => {
        notify(data.message);
        dispatch(getService(query));
      })
      .catch((err) => notifyError(err));
  }

  return (
    <div className="space-y-8 pb-20">
      <ModalAdd
        detail={detail}
        open={openModal}
        setDetail={() => setDetail(undefined)}
        setOpen={setOpenModal}
      />

      {/* Header Eksklusif */}
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
                  "/services/export/excel",
                  query,
                  "master-jasa-servis",
                  setIsExcelLoading,
                )
              }
            >
              Export Excel
            </Button>
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              onPress={() => setOpenModal(true)}
            >
              Tambah Jasa
            </Button>
          </div>
        }
        leadIcon={Zap}
        subtitle="Standarisasi biaya & estimasi waktu kerja tim."
        title="Katalog Jasa"
      />

      {/* Grid Kartu Jasa */}
      <Table
        aria-label="Tabel katalog jasa"
        topContent={
          <div className="grid grid-cols-2 items-center justify-between">
            <div />
            <Input
              endContent={
                search && (
                  <Button
                    isIconOnly
                    color="default"
                    radius="full"
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setSearch("");
                      handleSearch("");
                    }}
                  >
                    <X className="text-gray-400" size={18} />
                  </Button>
                )
              }
              placeholder="Cari jasa servis (contoh: Ganti Oli, Tune Up)"
              startContent={<Search className="text-gray-400" size={18} />}
              value={search}
              variant="bordered"
              onClear={() => {
                setSearch("");
                handleSearch("");
              }}
              onValueChange={(val) => {
                handleSearch(val);
                setSearch(val);
              }}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>JASA</TableColumn>
          <TableColumn>KATEGORI</TableColumn>
          <TableColumn>DURASI</TableColumn>
          <TableColumn>KESULITAN</TableColumn>
          <TableColumn>HARGA</TableColumn>
          <TableColumn align="center">AKSI</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-14">
              <PackageOpen className="text-gray-300 mb-3" size={36} />
              <p className="text-sm font-semibold text-gray-500 mb-4">
                Belum ada jasa terdaftar.
              </p>
              <Button
                color="primary"
                size="sm"
                onPress={() => setOpenModal(true)}
              >
                Tambah Jasa
              </Button>
            </div>
          }
        >
          {(services?.data || []).map((srv) => (
            <TableRow key={srv.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-700">
                    {srv.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="font-black uppercase text-[10px] tracking-widest text-gray-500"
                  size="sm"
                  variant="flat"
                >
                  {srv.category.name}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <Clock size={14} />
                  {srv.estimated_duration}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  className="h-5 border-none p-0 text-xs font-black uppercase"
                  color={getDifficultyColor(srv.difficulty)}
                  size="sm"
                  variant="dot"
                >
                  {srv.difficulty}
                </Chip>
              </TableCell>
              <TableCell>
                <span className="text-sm font-black text-gray-700">
                  {formatIDR(Number(srv.price))}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Tooltip content="Edit">
                    <Button
                      isIconOnly
                      color="default"
                      size="sm"
                      variant="light"
                      onPress={() => {
                        setDetail(srv);
                        setOpenModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip color="danger" content="Hapus">
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => confirmSweat(() => handleDelete(srv.id))}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {services?.data?.length! > 0 && (
        <CustomPagination
          meta={services?.meta!}
          onPageChange={(page) => dispatch(setServiceQuery({ page }))}
        />
      )}

      {/* Guarantee Badge */}
      <div className="flex justify-center mt-12">
        <Chip
          className="bg-white py-6 px-8 rounded-full border border-blue-50 shadow-xl shadow-blue-50"
          startContent={
            <div className="bg-blue-600 text-white p-1.5 rounded-lg mr-2">
              <ShieldCheck size={18} />
            </div>
          }
          variant="shadow"
        >
          <span className="text-small font-bold text-gray-600 italic">
            Semua harga jasa terstandarisasi untuk menjamin kepuasan pelanggan.
          </span>
        </Chip>
      </div>
    </div>
  );
}
