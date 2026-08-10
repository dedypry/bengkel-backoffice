import { Card, CardBody, Skeleton } from "@heroui/react";

function TableRowsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 mt-4">
      <Skeleton className="h-10 w-full rounded-none" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 items-center border-b border-gray-100 pb-4"
        >
          <Skeleton className="h-8 flex-1 rounded-sm" />
          <Skeleton className="h-8 w-24 rounded-sm" />
          <Skeleton className="h-8 w-16 rounded-sm" />
          <Skeleton className="h-8 w-24 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export default function DetailTabSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <Card>
        <CardBody className="p-6 space-y-6">
          <div className="flex gap-2 justify-end">
            <Skeleton className="h-9 w-24 rounded-sm" />
            <Skeleton className="h-9 w-28 rounded-sm" />
            <Skeleton className="h-9 w-32 rounded-sm" />
          </div>
          <Skeleton className="h-6 w-48 rounded-sm" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24 rounded-sm" />
            <Skeleton className="h-4 w-28 rounded-sm" />
          </div>
          <TableRowsSkeleton rows={3} />
          <div className="flex justify-between pt-2">
            <Skeleton className="h-4 w-20 rounded-sm" />
            <Skeleton className="h-4 w-28 rounded-sm" />
          </div>
          <TableRowsSkeleton rows={2} />
          <div className="flex justify-end mt-5 border-t pt-5">
            <div className="space-y-3 w-64">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <Skeleton className="h-4 w-20 rounded-sm" />
                  <Skeleton className="h-8 w-36 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40 rounded-sm" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32 rounded-sm" />
              <Skeleton className="h-9 w-28 rounded-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-sm"
              >
                <Skeleton className="h-12 w-12 rounded-sm" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-sm" />
                  <Skeleton className="h-3 w-1/2 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-8 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56 rounded-sm" />
            <Skeleton className="h-3 w-72 rounded-sm" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full max-w-2xl rounded-sm" />
          <Skeleton className="h-32 w-full rounded-sm" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-44 rounded-sm" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
