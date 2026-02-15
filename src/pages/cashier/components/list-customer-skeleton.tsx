import { Skeleton } from "@heroui/react";

export const OrderListSkeleton = () => {
  // Kita buat array dummy 5 item agar terlihat seperti daftar antrean
  const items = Array.from({ length: 5 });

  return (
    <div className="space-y-3">
      {items.map((_, index) => (
        <div
          key={index}
          className="p-3 rounded-lg border-2 border-transparent bg-slate-50"
        >
          <div className="flex justify-between items-start mb-4">
            {/* Bagian Kiri: Nomor Transaksi, Nama, Harga */}
            <div className="flex flex-col gap-2 w-1/2">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-5 w-2/3 rounded-lg" />
            </div>

            {/* Bagian Kanan: Plat, Model, Tanggal */}
            <div className="flex flex-col items-end gap-2 w-1/3">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-3 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-2/3 rounded-lg mt-2" />
            </div>
          </div>

          {/* Bagian Bawah: Status Badge */}
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
};
