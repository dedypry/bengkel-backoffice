import { Card, CardBody, Skeleton } from "@heroui/react";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={index}
          className="border-l-4 border-gray-200 border-y border-r border-primary"
        >
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <Skeleton className="size-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-20 rounded-sm" />
              <Skeleton className="h-7 w-12 rounded-sm" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export function CategoriesTableSkeleton() {
  return (
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
          <Skeleton className="h-10 w-32 shrink-0 rounded-sm" />
          <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-1 rounded-sm" />
          <Skeleton className="h-4 w-10 shrink-0 rounded-sm" />
          <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-20 shrink-0 rounded-sm" />
          <Skeleton className="h-8 w-8 shrink-0 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export default function CategoriesSkeleton() {
  return (
    <>
      <StatsSkeleton />
      <Card>
        <div className="flex flex-col gap-4 px-4 pt-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-md" />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-sm" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
        <CategoriesTableSkeleton />
      </Card>
    </>
  );
}
