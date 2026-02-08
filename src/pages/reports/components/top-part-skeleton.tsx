import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export default function TopPartSkeleton() {
  return (
    <div className="space-y-10 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="w-48 h-8 rounded-sm" />
        <Skeleton className="w-96 h-4 rounded-sm" />
      </div>

      {/* Grid Skeleton (6 Items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="p-4 shadow-none border border-gray-100">
            <CardHeader className="flex flex-col items-start px-4 pt-6 relative">
              {/* Floating Rank Indicator Skeleton */}
              <div className="absolute top-0 right-2">
                <Skeleton className="rounded-full w-20 h-6" />
              </div>

              <div className="text-start mt-2 w-full space-y-2">
                <Skeleton className="w-3/4 h-5 rounded-sm" />
                <Skeleton className="w-1/2 h-3 rounded-sm" />
              </div>
            </CardHeader>

            <CardBody className="space-y-6">
              {/* Metrics Skeleton */}
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Skeleton className="w-16 h-2 rounded-sm" />
                  <Skeleton className="w-24 h-6 rounded-sm" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-20 h-2 rounded-sm" />
                  <Skeleton className="w-32 h-6 rounded-sm" />
                </div>
              </div>

              {/* Stock Section Skeleton */}
              <div className="p-2 rounded-sm border border-gray-50 bg-gray-50/30">
                <div className="flex gap-4 items-center">
                  <Skeleton className="size-11 rounded-sm" />
                  <div className="space-y-2">
                    <Skeleton className="w-20 h-2 rounded-sm" />
                    <Skeleton className="w-14 h-5 rounded-sm" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
