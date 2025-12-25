import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4 text-center relative overflow-hidden">
      {/* Background Sphere/Orb - Memberi kesan 3D ambient */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000 -z-0" />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center">
        {/* Angka 404 dengan efek 3D dan glitch */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 drop-shadow-lg animate-glitch-text relative">
          404
          {/* Glitch Overlay */}
          <span className="absolute top-0 left-0 text-purple-300 opacity-70 animate-glitch-1">
            404
          </span>
          <span className="absolute top-0 left-0 text-blue-300 opacity-70 animate-glitch-2">
            404
          </span>
        </h1>

        {/* Gambar 3D Placeholder - Deskripsi atau Ilustrasi */}
        <div className="relative my-8">
          {/* Ini adalah tempat imajinasi Anda tentang objek 3D. 
              Sebagai placeholder, kita akan deskripsikan, 
              namun Anda bisa menggantinya dengan <img src="ilustrasi-3d-anda.svg">
              atau bahkan komponen 3D interaktif jika menggunakan react-three-fiber.
          */}
          <div className="w-64 h-64 bg-slate-800 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 opacity-60" />
            <div className="absolute inset-0 border border-purple-500/20 rounded-3xl animate-pulse" />
            <p className="text-gray-400 text-lg font-medium animate-bounce-slow">
              <span className="block text-4xl mb-2">🪐</span>{" "}
              {/* Contoh ikon 3D */}
              Kosong...
            </p>
          </div>
          <p className="text-gray-400 mt-2 text-sm italic">
            (Bayangkan ada objek 3D melayang di sini!)
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-4">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-gray-300 max-w-md mb-8">
          Sepertinya Anda tersesat di luar angkasa. Mari kembali ke orbit!
        </p>

        <Button
          asChild
          className="bg-linear-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
        >
          <Link replace to="/">
            Kembali ke Dashboard Aman
          </Link>
        </Button>
      </div>

      {/* Tailwind CSS keyframes untuk animasi */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes glitch-text-main {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes glitch-1 {
          0% {
            clip-path: inset(0 0 100% 0);
          }
          25% {
            clip-path: inset(10% 0 70% 0);
          }
          50% {
            clip-path: inset(40% 0 40% 0);
          }
          75% {
            clip-path: inset(70% 0 10% 0);
          }
          100% {
            clip-path: inset(0 0 100% 0);
          }
        }
        @keyframes glitch-2 {
          0% {
            clip-path: inset(0 0 100% 0);
          }
          25% {
            clip-path: inset(70% 0 10% 0);
          }
          50% {
            clip-path: inset(40% 0 40% 0);
          }
          75% {
            clip-path: inset(10% 0 70% 0);
          }
          100% {
            clip-path: inset(0 0 100% 0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-glitch-text {
          animation: glitch-text-main 2s infinite alternate;
        }
        .animate-glitch-1 {
          animation: glitch-1 1.5s infinite alternate;
        }
        .animate-glitch-2 {
          animation: glitch-2 1.8s infinite alternate;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
