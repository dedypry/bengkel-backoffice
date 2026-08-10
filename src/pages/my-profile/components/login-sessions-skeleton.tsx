import { Card, CardBody, Skeleton } from "@heroui/react";

function SessionCardSkeleton() {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <Skeleton className="size-11 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-4 w-36 rounded-sm" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-3 w-24 rounded-sm" />
                <Skeleton className="h-3 w-40 rounded-sm" />
                <Skeleton className="h-3 w-32 rounded-sm" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </CardBody>
    </Card>
  );
}

export default function LoginSessionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl space-y-2">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-4/5 rounded-sm" />
        </div>
        <Skeleton className="h-8 w-44 rounded-md" />
      </div>

      <div className="scrollbar-modern max-h-[420px] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SessionCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
