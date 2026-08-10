import { Skeleton } from "@heroui/react";

function ReviewCardSkeleton({ withNotes = true }: { withNotes?: boolean }) {
  return (
    <div className="rounded-2xl border border-amber-100/80 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-40 rounded-sm" />
          <Skeleton className="h-4 w-56 rounded-sm" />
          <Skeleton className="h-3 w-32 rounded-sm" />
          <Skeleton className="h-2.5 w-36 rounded-sm" />
        </div>
        <Skeleton className="h-5 w-24 shrink-0 rounded-sm" />
      </div>
      {withNotes ? (
        <div className="mt-4 rounded-xl bg-gray-50 p-3">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="mt-2 h-3 w-[80%] rounded-sm" />
        </div>
      ) : null}
    </div>
  );
}

export function EmployeeReviewsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ReviewCardSkeleton key={index} withNotes={index % 2 === 0} />
      ))}
    </div>
  );
}

export default function EmployeeReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-sm" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded-sm" />
            <Skeleton className="h-2.5 w-20 rounded-sm" />
          </div>
        </div>
        <Skeleton className="h-6 w-40 rounded-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded-sm" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-12 rounded-full" />
          ))}
        </div>
      </div>

      <EmployeeReviewsListSkeleton count={3} />
    </div>
  );
}
