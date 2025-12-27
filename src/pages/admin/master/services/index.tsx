import type { IService } from "@/utils/interfaces/IService";

import {
  Clock,
  Plus,
  Search,
  Filter,
  Zap,
  ShieldCheck,
  Award,
  Trash2,
  Edit,
} from "lucide-react";
import { useEffect, useState } from "react";

import ModalAdd from "./components/modal-add";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import HeaderAction from "@/components/header-action";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { getService } from "@/stores/features/service/service-action";
import { formatIDR } from "@/utils/helpers/format";
import { statusServiceColor } from "@/utils/helpers/service";
import { CustomPagination } from "@/components/custom-pagination";
import { setServiceQuery } from "@/stores/features/service/service-slice";
import debounce from "@/utils/helpers/debounce";

export default function MasterJasaLight() {
  const { services, query } = useAppSelector((state) => state.service);
  const { company } = useAppSelector((state) => state.auth);
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState<IService>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getService(query));
  }, [company, query]);

  const handleSearch = debounce((search) => {
    dispatch(
      setServiceQuery({
        q: search,
      }),
    );
  }, 1000);

  return (
    <div className="space-y-8 pb-20 px-4 bg-slate-50/30">
      <ModalAdd
        detail={detail}
        open={openModal}
        setDetail={() => setDetail(undefined)}
        setOpen={setOpenModal}
      />
      <HeaderAction
        actionIcon={Zap}
        actionTitle="Tambah Jasa"
        leadIcon={Plus}
        subtitle="Atur standarisasi harga dan estimasi waktu kerja tim."
        title="Katalog Layanan"
        onAction={() => setOpenModal(true)}
      />

      {/* Bar Pencarian Melayang */}
      <div className="relative mt-12 mx-auto max-w-4xl z-30">
        <div className="bg-white p-3 rounded-3xl shadow-2xl shadow-slate-200/60 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-blue-400" />
            <Input
              className="h-14 pl-14 pr-6 rounded-2xl border-none bg-slate-50 font-semibold text-slate-700 placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-100"
              placeholder="Cari jasa servis..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button
            className="h-14 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50 gap-2"
            variant="outline"
          >
            <Filter className="size-5" /> Filter
          </Button>
        </div>
      </div>

      {/* Grid Kartu Jasa */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services?.data.map((srv) => {
          const clr = statusServiceColor(srv.difficulty);

          return (
            <div
              key={srv.id}
              className={`group bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-2xl ${clr.border} transition-all duration-300 flex flex-col overflow-hidden`}
            >
              <div className="p-5">
                {/* Kategori & Judul */}
                <div className="space-y-2 mb-6">
                  <Badge
                    className="border-slate-300 text-slate-500 text-xs px-3 py-1"
                    variant="outline"
                  >
                    {srv.category.name}
                  </Badge>
                  <h5
                    className={`leading-tight ${clr.hover} transition-colors`}
                  >
                    {srv.name}
                  </h5>
                </div>

                {/* Detail Estimasi & Kesulitan */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100/50">
                    <p className="text-[9px] font-semibold text-slate-500 uppercase mb-1 flex items-center justify-center gap-1">
                      <Clock size={10} /> Durasi
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {srv.estimated_duration}
                    </p>
                  </div>
                  <div
                    className={`${clr.lightBg} p-3 rounded-2xl text-center border border-slate-100/50`}
                  >
                    <p
                      className={`text-[9px] font-black text-slate-500 uppercase mb-1 flex items-center justify-center gap-1`}
                    >
                      <Award size={10} /> Sulit
                    </p>
                    <p
                      className={`text-sm font-black uppercase ${clr.textColor}`}
                    >
                      {srv.difficulty}
                    </p>
                  </div>
                </div>

                {/* Panel Harga (Light Style) */}
                <div
                  className={`p-6 rounded-3xl text-center border-2 border-dashed ${clr.lightBg} ${clr.textColor} border-current opacity-80 group-hover:opacity-100 transition-opacity`}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">
                    Biaya Layanan
                  </p>
                  <p className="text-lg font-semibold tracking-tighter">
                    {formatIDR(Number(srv.price))}
                  </p>
                </div>
              </div>

              {/* Footer Kartu */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex gap-2 mt-auto">
                <Button className="flex-1 shadow-red-50 font-semibold bg-white border border-slate-200 text-red-500 hover:bg-slate-100">
                  <Trash2 />
                  HAPUS
                </Button>
                <Button
                  className={`flex-1 shadow-gray-50 font-semibold text-white shadow-lg ${clr.themeColor} hover:${clr.themeColor} hover:opacity-80`}
                  onClick={() => {
                    setDetail(srv);
                    setOpenModal(true);
                  }}
                >
                  <Edit />
                  EDIT JASA
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <CustomPagination
          meta={services?.meta!}
          onPageChange={(page) => dispatch(setServiceQuery({ page }))}
        />
      </div>

      {/* Info Jaminan Kualitas */}
      <div className="flex justify-center mt-12">
        <div className="bg-white px-8 py-5 rounded-[2rem] border border-blue-100 shadow-lg flex items-center gap-4">
          <div className="bg-blue-500 text-white p-2 rounded-xl shadow-blue-200 shadow-lg">
            <ShieldCheck size={20} />
          </div>
          <p className="text-sm font-bold text-slate-600 italic">
            Semua harga jasa terstandarisasi untuk menjamin kepuasan pelanggan.
          </p>
        </div>
      </div>
    </div>
  );
}
