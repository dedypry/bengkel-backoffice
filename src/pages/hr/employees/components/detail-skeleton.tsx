import type { ReactNode } from "react";

import { Card, CardBody, Skeleton } from "@heroui/react";

function SectionCardSkeleton({
  children,
  className = "border border-gray-200 shadow-sm bg-white p-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardBody className="space-y-8">{children}</CardBody>
    </Card>
  );
}

function SectionHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-9 rounded-sm" />
      <Skeleton className="h-4 w-44 rounded-sm" />
    </div>
  );
}

function DataFieldSkeleton({ withIcon = true }: { withIcon?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-2.5 w-24 rounded-sm" />
      <div className="flex items-center gap-3">
        {withIcon ? <Skeleton className="size-4 rounded-sm shrink-0" /> : null}
        <Skeleton className="h-3.5 w-full max-w-[180px] rounded-sm" />
      </div>
    </div>
  );
}

export default function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardBody className="flex flex-col items-center justify-between gap-5 p-5 md:flex-row">
          <div className="flex w-full items-center gap-5">
            <Skeleton className="size-14 shrink-0 rounded-sm" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40 rounded-sm" />
              <Skeleton className="h-3 w-56 rounded-sm" />
            </div>
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <CardBody className="p-0">
              <Skeleton className="h-32 w-full rounded-none" />
              <div className="-mt-16 flex flex-col items-center px-6 pb-8">
                <Skeleton className="size-32 rounded-md border-4 border-white" />
                <div className="mt-4 flex flex-col items-center gap-2">
                  <Skeleton className="h-5 w-44 rounded-sm" />
                  <Skeleton className="h-3 w-52 rounded-sm" />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="mt-5 w-full space-y-5 px-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Skeleton className="mt-1 size-[18px] rounded-sm shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-2.5 w-20 rounded-sm" />
                        <Skeleton className="h-3 w-full rounded-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardBody className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-sm" />
                <Skeleton className="h-3 w-36 rounded-sm" />
              </div>
              <Skeleton className="h-[72px] w-full rounded-md" />
              <Skeleton className="mx-2 h-3 w-full rounded-sm" />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-8 lg:col-span-8">
          <SectionCardSkeleton>
            <SectionHeaderSkeleton />
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 px-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <DataFieldSkeleton key={index} />
              ))}
            </div>
          </SectionCardSkeleton>

          <SectionCardSkeleton>
            <SectionHeaderSkeleton />
            <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <DataFieldSkeleton key={index} withIcon={false} />
              ))}
            </div>
          </SectionCardSkeleton>

          <SectionCardSkeleton className="border border-rose-100/50 bg-rose-50/50 p-4 shadow-sm">
            <SectionHeaderSkeleton />
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 px-4 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <DataFieldSkeleton key={index} withIcon={false} />
              ))}
            </div>
          </SectionCardSkeleton>
        </div>
      </div>
    </div>
  );
}
