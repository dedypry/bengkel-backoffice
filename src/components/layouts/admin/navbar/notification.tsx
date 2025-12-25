import { Bell, CheckCircle2, Package, Clock } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // atau dari components/ui/dropdown-menu

export default function NotificationDropdown() {
  // Contoh data notifikasi (nanti bisa diambil dari state/API)
  const notifications = [
    {
      id: 1,
      title: "Servis Selesai",
      desc: "Toyota Avanza B 1234 GHO siap diambil.",
      time: "5 menit lalu",
      icon: <CheckCircle2 className="size-4 text-green-500" />,
      unread: true,
    },
    {
      id: 2,
      title: "Stok Menipis",
      desc: "Oli Shell Helix sisa 2 botol lagi.",
      time: "2 jam lalu",
      icon: <Package className="size-4 text-amber-500" />,
      unread: true,
    },
    {
      id: 3,
      title: "Booking Baru",
      desc: "Pelanggan baru melakukan pendaftaran.",
      time: "1 hari lalu",
      icon: <Clock className="size-4 text-blue-500" />,
      unread: false,
    },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none p-2 hover:bg-slate-100 rounded-full transition-colors">
        <Bell className="size-6 text-slate-600" />
        {/* Dot Notifikasi Merah */}
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="p-4 font-bold flex justify-between items-center">
          Notifikasi
          <span className="text-xs font-normal text-primary cursor-pointer hover:underline">
            Tandai semua dibaca
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-80 overflow-y-auto">
          {notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={`p-4 cursor-pointer flex gap-3 focus:bg-slate-50 border-b last:border-0 ${item.unread ? "bg-blue-50/50" : ""}`}
            >
              <div className="mt-1">{item.icon}</div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold flex justify-between">
                  {item.title}
                  {item.unread && (
                    <span className="h-2 w-2 bg-blue-600 rounded-full" />
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                  {item.time}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <DropdownMenuItem className="p-3 text-center justify-center text-xs font-medium text-slate-500 cursor-pointer">
          Lihat Semua Notifikasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
