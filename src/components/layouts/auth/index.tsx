import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
      {/* 1. Bola-bola Cahaya (Orbs) */}
      {/* Bola Biru Utama - Pojok Kiri Atas */}
      <div className="absolute top-[-15%] left-[-10%] w-125 h-125 rounded-full bg-blue-400/20 blur-[100px] animate-pulse" />

      {/* Bola Teal/Hijau Toska - Tengah Kanan */}
      <div className="absolute top-[20%] right-[-5%] w-100 h-100 rounded-full bg-teal-300/15 blur-[80px]" />

      {/* Bola Orange Lembut (Aksen Lampu) - Kiri Bawah */}
      <div className="absolute bottom-[-10%] left-[-5%] w-112.5 h-112.5 rounded-full bg-orange-200/20 blur-[110px]" />

      {/* Bola Ungu Muda - Kanan Bawah */}
      <div className="absolute bottom-[5%] right-[10%] w-75 h-75 rounded-full bg-indigo-200/20 blur-[90px]" />

      {/* 2. Tekstur Halus (Opsional, agar tidak terlalu polos) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-light.png")`,
        }}
      />

      {/* 3. Konten Utama */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
        {/* Header Bengkel */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
            {/* Ikon Kunci Pas / Bengkel */}
            <svg
              className="text-blue-600"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Workshop Center
          </h1>
        </div>

        {/* Card Login */}
        <div className="w-full flex justify-center">
          <Outlet />
        </div>
      </div>

      {/* 4. Footer */}
      <div className="absolute bottom-6 text-slate-400 text-[11px] font-medium uppercase tracking-widest">
        Sistem Manajemen Bengkel Terpadu
      </div>
    </div>
  );
}
