import { Card, CardBody, Skeleton } from "@heroui/react";

export default function WODetailSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6 px-4 max-w-7xl animate-pulse">
      {/* 1. HEADER & GRAND TOTAL SKELETON */}
      <Card className="border border-gray-200 shadow-sm bg-white" radius="sm">
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-8 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-48 rounded-sm" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-64 rounded-sm" />
            </div>
            <div className="bg-gray-100 p-8 flex flex-col justify-center items-end min-w-[300px] space-y-2">
              <Skeleton className="h-3 w-32 rounded-sm" />
              <Skeleton className="h-10 w-44 rounded-sm" />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN SKELETON */}
        <div className="lg:col-span-4 space-y-6">
          {/* CUSTOMER & VEHICLE CARD SKELETON */}
          {[1, 2].map((i) => (
            <Card key={i} className="shadow-sm border-none" radius="sm">
              <CardBody className="p-6 space-y-6">
                <Skeleton className="h-5 w-32 rounded-sm" />
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-sm" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full rounded-sm" />
                    <Skeleton className="h-12 w-full rounded-sm" />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* COMPLAINTS SKELETON */}
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-6 space-y-3">
              <Skeleton className="h-5 w-24 rounded-sm" />
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-3/4 rounded-sm" />
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN SKELETON */}
        <div className="lg:col-span-8 space-y-6">
          {/* WORK ITEMS TABLE SKELETON */}
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48 rounded-sm" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-10 rounded-sm" />
                  <Skeleton className="h-10 w-32 rounded-sm" />
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <Skeleton className="h-12 w-full rounded-none" />{" "}
                {/* Header Table */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-center border-b border-gray-100 pb-4"
                  >
                    <Skeleton className="h-8 w-12 rounded-sm" />
                    <Skeleton className="h-8 flex-1 rounded-sm" />
                    <Skeleton className="h-8 w-24 rounded-sm" />
                    <Skeleton className="h-8 w-24 rounded-sm" />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* MECHANICS SKELETON */}
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-6 space-y-6">
              <Skeleton className="h-6 w-40 rounded-sm" />
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

          {/* EDITOR SKELETON */}
          <Card className="shadow-sm border-none" radius="sm">
            <CardBody className="p-8 space-y-4">
              <Skeleton className="h-6 w-56 rounded-sm" />
              <Skeleton className="h-32 w-full rounded-sm" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-44 rounded-sm" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
