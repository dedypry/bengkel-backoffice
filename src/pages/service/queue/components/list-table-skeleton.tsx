import { Skeleton } from "@heroui/react";

export function QueueCellSkeleton({ columnKey }: { columnKey: string }) {
  switch (columnKey) {
    case "estimasi":
      return (
        <div className="mx-auto flex w-[140px] flex-col items-center gap-1 rounded-lg border border-default-200 bg-default-100 px-2 py-2">
          <Skeleton className="h-2.5 w-16 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      );
    case "pelanggan":
      return (
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-36 max-w-full rounded-md" />
        </div>
      );
    case "priority":
      return <Skeleton className="mx-auto h-6 w-16 rounded-full" />;
    case "priority_mech":
      return (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      );
    case "tanggal":
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-3.5 w-28 rounded-md" />
        </div>
      );
    case "mechanic":
      return <Skeleton className="h-7 w-24 rounded-full" />;
    case "status":
      return (
        <div className="mx-auto flex flex-col items-center gap-1.5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      );
    case "aksi":
      return (
        <div className="ml-auto flex items-center justify-end gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      );
    default:
      return <Skeleton className="h-8 w-full rounded-md" />;
  }
}

export function createQueueSkeletonItems(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `queue-skeleton-${index}`,
  }));
}
