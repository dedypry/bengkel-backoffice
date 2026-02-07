import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw, ShieldAlert, SearchX } from "lucide-react";
import { Button, Image } from "@heroui/react";

import EmptyBox from "@/assets/images/empty-box.png";

interface Props {
  id?: string;
}

export default function Detail404({ id }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-8 text-center bg-transparent">
      {/* Visual Section */}
      <div className="relative mb-10 group">
        {/* Glow Effect Industrial */}
        <div className="absolute inset-0 bg-rose-200/20 blur-[100px] rounded-full group-hover:bg-rose-300/30 transition-colors duration-700" />

        <div className="relative z-10 scale-90 md:scale-100 transition-transform duration-500 hover:scale-105">
          <Image
            alt="Data Not Found"
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
            src={EmptyBox}
          />

          {/* Badge Error Overlay */}
          <div className="absolute -bottom-4 -right-4 bg-gray-900 text-white p-4 rounded-[1.5rem] shadow-2xl flex items-center gap-3 border-4 border-white">
            <ShieldAlert className="text-rose-500" size={24} />
            <span className="font-black italic uppercase text-xs tracking-tighter">
              Code: 404_NOT_FOUND
            </span>
          </div>
        </div>
      </div>

      {/* Message Section */}
      <div className="max-w-lg space-y-4">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-800 leading-none">
          Data Hilang dari Radar
        </h2>
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
            Pencarian Gagal untuk ID:{" "}
            <span className="text-rose-500 font-black italic">
              #{id || "NULL"}
            </span>
          </p>
          <p className="text-gray-500 text-sm font-medium italic leading-relaxed">
            Sistem tidak dapat mengidentifikasi personil dengan kode tersebut.
            Data mungkin telah diarsipkan, dihapus secara permanen, atau terjadi
            kesalahan pada input tautan.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button
          className="h-14 px-8 rounded-2xl font-black uppercase italic text-xs tracking-widest text-gray-500 bg-white border border-gray-100 shadow-sm"
          startContent={<ArrowLeft size={18} />}
          variant="flat"
          onPress={() => navigate("/hr/employees")}
        >
          Kembali ke Database
        </Button>
        <Button
          className="h-14 px-8 rounded-2xl bg-gray-900 text-white font-black uppercase italic text-xs tracking-widest shadow-xl shadow-gray-200"
          startContent={<RefreshCcw size={18} />}
          onPress={() => window.location.reload()}
        >
          Sinkronkan Ulang
        </Button>
      </div>

      {/* Subtle Hint */}
      <p className="mt-12 text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
        <SearchX size={12} /> Hubungi IT Support jika masalah berlanjut
      </p>
    </div>
  );
}
