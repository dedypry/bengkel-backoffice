import { Card, CardBody, Divider, Skeleton } from "@heroui/react";

export const ProductListSkeleton = () => {
  // Membuat 4 item dummy untuk loading state
  const items = Array.from({ length: 4 });

  return (
    <div className="flex flex-col gap-3">
      {items.map((_, index) => (
        <Card
          key={index}
          className="border-2 border-transparent bg-content1"
          shadow="sm"
        >
          <CardBody className="p-4">
            {/* Bagian Atas: Kategori, Nama, Harga */}
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 space-y-2">
                {/* Skeleton Kategori */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded-lg" />
                </div>
                {/* Skeleton Nama Produk */}
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                {/* Skeleton Kode Produk */}
                <Skeleton className="h-3 w-1/4 rounded-lg" />
              </div>

              <div className="text-right space-y-1">
                {/* Skeleton Harga */}
                <Skeleton className="h-5 w-24 rounded-lg" />
                {/* Skeleton UOM */}
                <Skeleton className="h-3 w-12 rounded-lg ml-auto" />
              </div>
            </div>

            <Divider className="my-3 opacity-50" />

            {/* Bagian Bawah: Chips */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* Skeleton Chip Stok */}
                <Skeleton className="h-6 w-20 rounded-full" />
                {/* Skeleton Chip Lokasi */}
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
