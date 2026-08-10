import { Card, CardBody, Skeleton } from "@heroui/react";

function TabContentSkeleton() {
  return (
    <div className="flex flex-col gap-2 pt-4">
      <Card className="border border-gray-200 shadow-sm p-4">
        <CardBody className="space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-sm" />
            <Skeleton className="h-4 w-44 rounded-sm" />
          </div>
          <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-2.5 w-24 rounded-sm" />
                <Skeleton className="h-3.5 w-full max-w-[220px] rounded-sm" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-gray-200 shadow-sm p-3">
        <CardBody className="space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-sm" />
            <Skeleton className="h-4 w-52 rounded-sm" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-sm" />
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-sm" />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function CustomerDetailSkeleton() {
  return (
    <div className="space-y-8 pb-20 animate-pulse">
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <CardBody>
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex items-center gap-4 shrink-0">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <Skeleton className="size-24 shrink-0 rounded-full" />
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-col items-center gap-3 md:flex-row">
                <Skeleton className="h-8 w-56 rounded-sm" />
                <Skeleton className="h-6 w-20 rounded-sm" />
              </div>
              <div className="flex flex-col items-center gap-2 md:items-start">
                <Skeleton className="h-3 w-40 rounded-sm" />
                <Skeleton className="h-3 w-52 rounded-sm" />
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-lg" />
              <Skeleton className="h-10 w-36 rounded-lg" />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-4">
        <div className="flex gap-8 border-b border-divider pb-3">
          <Skeleton className="h-5 w-36 rounded-sm" />
          <Skeleton className="h-5 w-32 rounded-sm" />
        </div>
        <TabContentSkeleton />
      </div>
    </div>
  );
}
