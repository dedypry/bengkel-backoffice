import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

type ViewMode = "grid" | "table";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="border border-gray-100">
          <CardHeader className="relative px-5 pb-0 pt-5">
            <Skeleton className="absolute right-3 top-3 h-6 w-20 rounded-full" />
            <div className="mt-2 w-full space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-sm" />
              <Skeleton className="h-3 w-1/2 rounded-sm" />
            </div>
          </CardHeader>
          <CardBody className="space-y-5 px-5 pb-5 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-16 rounded-sm" />
                <Skeleton className="h-6 w-20 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-2.5 w-20 rounded-sm" />
                <Skeleton className="h-6 w-24 rounded-sm" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-sm" />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100">
      <div className="space-y-0 p-2">
        <div className="flex gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1 rounded-sm" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 last:border-none"
          >
            <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
            <Skeleton className="h-10 w-36 shrink-0 rounded-sm" />
            <Skeleton className="hidden h-4 flex-1 rounded-sm sm:block" />
            <Skeleton className="h-4 w-16 rounded-sm" />
            <Skeleton className="hidden h-4 w-24 rounded-sm md:block" />
            <Skeleton className="h-4 w-14 rounded-sm" />
            <Skeleton className="hidden h-6 w-20 rounded-full lg:block" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function TopPartSkeleton({
  viewMode = "table",
}: {
  viewMode?: ViewMode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      {viewMode === "grid" ? <GridSkeleton /> : <TableSkeleton />}
    </div>
  );
}
