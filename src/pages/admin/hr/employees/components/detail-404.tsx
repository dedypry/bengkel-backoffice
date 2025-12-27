import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";

import EmptyBox from "@/assets/images/empty-box.png";
import { Button } from "@/components/ui/button";

interface Props {
  id?: string;
}
export default function Detail404({ id }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
      {/* Container untuk Gambar 3D */}
      <div className="relative mb-8 h-64 w-64 md:h-80 md:w-80">
        <div className="absolute inset-0 bg-blue-100/50 blur-3xl rounded-full" />
        <img
          alt="Data Not Found Illustration"
          className="relative z-10 h-full w-full object-contain"
          src={EmptyBox}
        />
      </div>

      {/* Teks Informasi */}
      <div className="max-w-md space-y-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Ups! Data Tidak Ditemukan
        </h2>
        <p className="text-balance text-muted-foreground">
          Kami tidak dapat menemukan data karyawan dengan ID{" "}
          <span className="font-mono font-bold text-primary">#{id}</span>.
          Pastikan ID yang Anda cari sudah benar atau data mungkin telah
          dihapus.
        </p>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Button
          className="gap-2"
          variant="outline"
          onClick={() => navigate("/hr/employees")}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar
        </Button>
        <Button
          className="gap-2 shadow-lg shadow-primary/20"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
