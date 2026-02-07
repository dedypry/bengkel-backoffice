import { Card, CardBody, Skeleton, Divider } from "@heroui/react";

export default function DetailSkeleton() {
  return (
    <div className="space-y-8 pb-20 px-4 max-w-7xl mx-auto animate-pulse">
      {/* Top Navigation Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Identitas Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <CardBody className="p-0">
              <Skeleton className="h-32 w-full" />
              <div className="px-6 pb-8 -mt-16 flex flex-col items-center">
                <Skeleton className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-lg" />
                <div className="mt-4 flex flex-col items-center gap-2">
                  <Skeleton className="h-6 w-40 rounded-lg" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </div>

                <div className="flex gap-2 mt-6">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                <Divider className="my-8 opacity-50" />

                <div className="w-full space-y-6 px-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="size-5 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-2 w-16 rounded-sm" />
                        <Skeleton className="h-3 w-full rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Skeleton className="h-40 w-full rounded-[2rem]" />
        </div>

        {/* RIGHT COLUMN: Data Grid Skeleton */}
        <div className="lg:col-span-8 space-y-8">
          {[...Array(3)].map((_, sectionIdx) => (
            <Card
              key={sectionIdx}
              className="rounded-[2.5rem] border-none shadow-sm bg-white p-6"
            >
              <CardBody className="space-y-8">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-xl" />
                  <Skeleton className="h-4 w-40 rounded-lg" />
                </div>

                <div
                  className={`grid grid-cols-1 ${sectionIdx === 1 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-8 px-4`}
                >
                  {[...Array(sectionIdx === 1 ? 3 : 4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-2 w-20 rounded-sm" />
                      <div className="flex gap-3 items-center">
                        <Skeleton className="size-4 rounded-full" />
                        <Skeleton className="h-4 w-full rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
