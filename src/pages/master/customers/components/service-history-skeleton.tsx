import { Skeleton, TableCell, TableRow } from "@heroui/react";

export function renderServiceHistorySkeletonRows(count = 5) {
  return Array.from({ length: count }, (_, index) => (
    <TableRow key={`service-skeleton-${index}`}>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24 rounded-sm" />
          <Skeleton className="h-3 w-28 rounded-sm" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-20 rounded-sm" />
          <Skeleton className="h-3 w-40 max-w-full rounded-sm" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full max-w-[180px] rounded-sm" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <Skeleton className="h-4 w-24 rounded-sm" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-center">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-1">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  ));
}
