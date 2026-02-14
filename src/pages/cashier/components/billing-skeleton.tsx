import { Card, CardHeader, CardBody, Skeleton, Divider } from "@heroui/react";

export const BillingSkeleton = () => {
  return (
    <div className="w-full md:w-2/3 overflow-y-auto">
      <Card className="h-full">
        {/* Header Skeleton */}
        <CardHeader>
          <div className="flex justify-between items-center w-full border-b border-gray-500 pb-5">
            <div className="space-y-2 w-1/2">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-3 w-1/3 rounded-lg" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-10 rounded-md" />
              </div>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>
        </CardHeader>

        <CardBody className="flex-1 flex flex-col gap-6">
          {/* Info Pelanggan Skeleton */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-sm bg-slate-50">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Ringkasan Biaya Skeleton */}
          <div className="space-y-4 border-t pt-5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-lg" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>

            <Divider className="my-4 border-dashed" />

            {/* Total Akhir Skeleton */}
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>

          {/* Payment Method Skeleton Area */}
          <div className="mt-auto space-y-3">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </CardBody>

        {/* Footer Button Skeleton */}
        <div className="p-4">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </Card>
    </div>
  );
};
