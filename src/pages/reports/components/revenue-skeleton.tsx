import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border shadow-sm">
          <CardBody className="flex flex-row items-center gap-4 p-5">
            <Skeleton className="size-12 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-2.5 w-24 rounded-sm" />
              <Skeleton className="h-6 w-28 max-w-full rounded-sm" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function ChartCardSkeleton() {
  return (
    <Card className="border border-primary-100 bg-white/90 shadow-sm">
      <CardHeader className="flex items-center justify-between px-6 pb-0 pt-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-sm" />
            <Skeleton className="h-3 w-52 rounded-sm" />
          </div>
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </CardHeader>
      <CardBody className="px-6 pb-6 pt-4">
        <Skeleton className="h-56 w-full rounded-2xl" />
      </CardBody>
    </Card>
  );
}

function SourceCardSkeleton() {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm lg:col-span-2">
      <CardHeader className="flex items-center gap-3 px-6 pb-0 pt-6">
        <Skeleton className="size-9 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 rounded-sm" />
          <Skeleton className="h-3 w-56 rounded-sm" />
        </div>
      </CardHeader>
      <CardBody className="space-y-6 px-6 py-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-sm" />
                <Skeleton className="h-3 w-24 rounded-sm" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function TargetCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-violet-100 bg-violet-50/60 shadow-sm">
      <CardHeader className="flex items-center gap-3 px-6 pb-0 pt-6">
        <Skeleton className="size-9 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded-sm" />
          <Skeleton className="h-3 w-24 rounded-sm" />
        </div>
      </CardHeader>
      <CardBody className="space-y-4 px-6 py-5">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </CardBody>
    </Card>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <Skeleton className="h-8 w-1.5 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 rounded-sm" />
          <Skeleton className="h-3 w-64 rounded-sm" />
        </div>
      </div>
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </Card>
      <Card className="overflow-hidden border border-gray-100">
        <div className="space-y-0 p-2">
          <div className="flex gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 flex-1 rounded-sm" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 last:border-none"
            >
              <Skeleton className="h-10 w-28 shrink-0 rounded-sm" />
              <Skeleton className="h-10 w-36 shrink-0 rounded-sm" />
              <Skeleton className="h-10 flex-1 rounded-sm" />
              <Skeleton className="h-10 w-32 shrink-0 rounded-sm" />
              <Skeleton className="size-8 shrink-0 rounded-md" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function RevenueSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <StatCardsSkeleton />
      <ChartCardSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SourceCardSkeleton />
        <TargetCardSkeleton />
      </div>
      <TransactionsSkeleton />
    </div>
  );
}
