import { Card, CardBody, Skeleton } from "@heroui/react";

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border border-slate-200 shadow-sm">
          <CardBody className="flex flex-row items-center gap-4 p-5">
            <Skeleton className="size-12 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-24 rounded-sm" />
              <Skeleton className="h-7 w-20 rounded-sm" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function RevenueChartSkeleton() {
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
      <CardBody className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 rounded-sm" />
              <Skeleton className="h-3 w-28 rounded-sm" />
            </div>
          </div>
          <div className="space-y-2 text-right">
            <Skeleton className="ml-auto h-8 w-32 rounded-sm" />
            <Skeleton className="ml-auto h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-14 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </CardBody>
    </Card>
  );
}

function ServiceQueueSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-0">
        <Skeleton className="h-10 w-full rounded-none" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-4"
          >
            <Skeleton className="h-10 w-24 rounded-sm" />
            <Skeleton className="h-10 flex-1 rounded-sm" />
            <Skeleton className="h-8 w-28 rounded-sm" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card className="overflow-hidden border border-slate-200 shadow-sm">
      <CardBody className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-sm" />
              <Skeleton className="h-3 w-24 rounded-sm" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2 rounded-2xl bg-default-50 p-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-sm" />
                <Skeleton className="h-3 w-1/2 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <StatsGridSkeleton />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <RevenueChartSkeleton />

          <section>
            <div className="mb-4 flex items-center justify-between px-1">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 rounded-sm" />
                <Skeleton className="h-3 w-56 rounded-sm" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <ServiceQueueSkeleton />
          </section>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <SidebarCardSkeleton rows={3} />
          <SidebarCardSkeleton rows={4} />
        </div>
      </div>
    </>
  );
}
