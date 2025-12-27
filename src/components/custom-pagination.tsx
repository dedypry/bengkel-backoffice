import type { IMeta } from "@/utils/interfaces/IPagination";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
interface Props {
  meta: IMeta;
  onPageChange: (page: number) => void;
}

export function CustomPagination({ meta, onPageChange }: Props) {
  if (!meta) return null;
  // Hitung total halaman (Misal: total 100 / pageSize 10 = 10 halaman)
  const total = Number(meta.total) || 0;
  const pageSize = Number(meta.pageSize) || 10;
  const totalPage = Math.ceil(total / pageSize);

  // Objection.js biasanya pakai index 0, kita konversi ke index 1 untuk UI
  const currentPage = meta.page;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPage - 2) pages.push("ellipsis");
      pages.push(totalPage);
    }

    return pages;
  };

  const handleNavigation = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Keterangan Data */}
      <p className="text-sm text-muted-foreground">
        Menampilkan <span className="font-medium">{meta.from}</span> sampai{" "}
        <span className="font-medium">
          {Math.min((meta.page + 1) * meta.pageSize, meta.total)}
        </span>{" "}
        dari <span className="font-medium">{meta.total}</span> data
      </p>

      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handleNavigation(currentPage - 1);
              }}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  className="cursor-pointer"
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(page as number);
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              className={
                currentPage === totalPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPage) handleNavigation(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
