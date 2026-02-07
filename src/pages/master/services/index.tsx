import type { IService } from "@/utils/interfaces/IService";

import {
  Clock,
  Plus,
  Filter,
  Zap,
  ShieldCheck,
  Award,
  Trash2,
  Edit,
  PackageOpen,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
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

export default function MasterServicePage() {
  const { services, query } = useAppSelector((state) => state.service);
  const { company } = useAppSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState<IService>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getService(query));
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
    <div className="space-y-8 pb-20 px-4 max-w-[1600px] mx-auto">
      <ModalAdd
        detail={detail}
        open={openModal}
        setDetail={() => setDetail(undefined)}
        setOpen={setOpenModal}
      />

      {/* Header Eksklusif */}
      <HeaderAction
        actionIcon={Plus}
        actionTitle="Tambah Jasa"
        leadIcon={Zap}
        subtitle="Standarisasi biaya & estimasi waktu kerja tim."
        title="Katalog Jasa"
        onAction={() => setOpenModal(true)}
      />

      {/* Bar Pencarian Modern */}
      <div className="sticky top-16 z-40">
        <Card
          className="max-w-3xl mx-auto rounded-full border border-gray-100 bg-white/80 backdrop-blur-md"
          shadow="sm"
        >
          <CardBody className="p-2 flex flex-row items-center gap-2">
            {/* Icon Search di dalam input biasa */}
            <div className="pl-4 text-gray-400">
              <Search size={20} />
            </div>

            <input
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-2 font-bold text-gray-600 placeholder:text-gray-300 placeholder:font-medium text-sm"
              placeholder="Cari jasa servis (misal: Ganti Oli, Tune Up)..."
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Button
              isIconOnly
              className="rounded-full min-w-12 h-12 bg-gray-100 hover:bg-gray-200 transition-colors"
              variant="flat"
            >
              <Filter className="text-gray-600" size={20} />
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Grid Kartu Jasa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services?.data.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <PackageOpen className="text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-black uppercase italic text-gray-700">
              Katalog Kosong
            </h3>
            <p className="text-gray-400 mb-8 max-w-xs font-medium">
              Layanan jasa Anda belum terdaftar di sistem kami.
            </p>
            <Button color="primary" onPress={() => setOpenModal(true)}>
              Buat Jasa Pertama
            </Button>
          </div>
        ) : (
          services?.data.map((srv) => {
            return (
              <Card
                key={srv.id}
                className="group border border-gray-200 hover:border-gray-800 transition-all duration-300 overflow-visible"
              >
                <CardBody className="p-6">
                  {/* Category & Action Menu */}
                  <div className="flex justify-between items-start mb-6">
                    <Chip
                      className="font-black uppercase text-[10px] tracking-widest text-gray-500"
                      size="sm"
                      variant="flat"
                    >
                      {srv.category.name}
                    </Chip>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip color="danger" content="Hapus">
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          variant="light"
                          onPress={() =>
                            confirmSweat(() => handleDelete(srv.id))
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  <h5 className="text-lg font-black uppercase text-gray-500 mb-6 leading-tight min-h-[3rem]">
                    {srv.name}
                  </h5>

                  {/* Info Row */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1 mb-1">
                        <Clock size={10} /> Durasi
                      </p>
                      <p className="text-xs font-black text-gray-700">
                        {srv.estimated_duration}
                      </p>
                    </div>
                    <div className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1 mb-1">
                        <Award size={10} /> Kesulitan
                      </p>
                      <Chip
                        className="h-5 border-none p-0 text-xs font-black uppercase"
                        color={getDifficultyColor(srv.difficulty)}
                        size="sm"
                        variant="dot"
                      >
                        {srv.difficulty}
                      </Chip>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="relative p-5 rounded-2xl bg-gray-500 overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-gray-200 uppercase mb-1">
                        Biaya Layanan
                      </p>
                      <p className="text-xl font-black text-white">
                        {formatIDR(Number(srv.price))}
                      </p>
                    </div>
                    <Zap
                      className="absolute -right-2 -bottom-2 text-white/10 rotate-12"
                      size={60}
                    />
                  </div>
                </CardBody>

                <CardFooter className="p-4 pt-0">
                  <Button
                    fullWidth
                    className="bg-gray-100 hover:bg-gray-800 hover:text-white font-black uppercase transition-all"
                    endContent={<Edit size={16} />}
                    onPress={() => {
                      setDetail(srv);
                      setOpenModal(true);
                    }}
                  >
                    Edit Detail
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

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
