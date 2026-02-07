import type { IMeta } from "@/utils/interfaces/IPagination";

import { Pagination } from "@heroui/react";

interface Props {
  meta: IMeta;
  onPageChange: (page: number) => void;
  showDesc?: boolean;
  showTotal?: boolean;
  className?: string;
}

export function CustomPagination({
  meta,
  onPageChange,
  showDesc = true,
  showTotal = false,
  className,
}: Props) {
  if (!meta) return null;
  if (meta.total === 0) return null;

  // Hitung total halaman
  const totalItems = Number(meta.total) || 0;
  const pageSize = Number(meta.pageSize) || 10;
  const totalPage = Math.ceil(totalItems / pageSize);

  // Pastikan currentPage adalah index 1 untuk HeroUI
  const currentPage = meta.page;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 ${className}`}
    >
      {/* Bagian Deskripsi */}
      <div className="flex flex-col gap-1">
        {showDesc && (
          <p className="text-tiny sm:text-small font-semibold text-gray-500">
            Total Data {meta.total}
            {/* Menampilkan{" "}
            <span className="font-bold text-default-700">{meta.from}</span>{" "}
            sampai{" "}
            <span className="font-bold text-default-700">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-default-700">{totalItems}</span>{" "}
            data */}
          </p>
        )}
        {showTotal && !showDesc && (
          <p className="text-small text-default-500">Total {totalItems} data</p>
        )}
      </div>

      {/* Komponen Pagination HeroUI */}
      <Pagination
        isCompact
        showControls
        showShadow
        classNames={{
          wrapper: "gap-1",
          item: "w-8 h-8 text-small rounded-lg",
          prev: "w-8 h-8 rounded-lg",
          next: "w-8 h-8 rounded-lg",
          cursor: "bg-primary shadow-primary/30 text-white font-bold",
        }}
        color="primary"
        page={currentPage}
        total={totalPage}
        onChange={(page) => onPageChange(page)}
      />
    </div>
  );
}
