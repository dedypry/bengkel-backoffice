import { Card, CardBody, Skeleton } from "@heroui/react";

type ViewMode = "grid" | "table";

function HeroSkeleton() {
  return (
    <Card
      className="relative overflow-hidden border-none bg-primary"
      shadow="none"
    >
      <CardBody className="z-10 flex flex-col items-center justify-between gap-8 p-10 md:flex-row">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <Skeleton className="h-28 w-28 rounded-lg bg-white/20" />
          <div className="space-y-3 text-center md:text-left">
            <Skeleton className="mx-auto h-5 w-40 rounded-md bg-white/20 md:mx-0" />
            <Skeleton className="mx-auto h-8 w-56 rounded-md bg-white/20 md:mx-0" />
            <Skeleton className="mx-auto h-4 w-44 rounded-md bg-white/20 md:mx-0" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-28 w-28 rounded-sm bg-white/20" />
          <Skeleton className="h-28 w-28 rounded-sm bg-white/20" />
        </div>
      </CardBody>
    </Card>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="border border-gray-100">
          <CardBody className="space-y-5 p-6">
            <div className="flex items-start justify-between">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <Skeleton className="h-5 w-40 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-lg" />
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
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1 rounded-md" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 last:border-none"
          >
            <Skeleton className="h-10 w-36 shrink-0 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function MechanicsReportSkeleton({
  viewMode = "table",
}: {
  viewMode?: ViewMode;
}) {
  return (
    <div className="space-y-6">
      <HeroSkeleton />
      <Card className="border border-gray-100" shadow="sm">
        <CardBody className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:items-end">
          <Skeleton className="h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-12 rounded-full" />
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
      {viewMode === "grid" ? <GridSkeleton /> : <TableSkeleton />}
    </div>
  );
}
