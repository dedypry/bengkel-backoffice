import { Skeleton } from "@heroui/react";

function ReviewCardSkeleton({ withNotes = true }: { withNotes?: boolean }) {
  return (
    <div className="rounded-2xl border border-amber-100/80 bg-amber-50/20 p-4">
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
        <div className="mt-4 rounded-xl bg-white p-3">
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="mt-2 h-3 w-[80%] rounded-sm" />
        </div>
      ) : null}
    </div>
  );
}

export function MechanicReviewsSummarySkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Skeleton className="h-6 w-36 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  );
}

export function MechanicReviewsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <ReviewCardSkeleton key={index} withNotes={index % 2 === 0} />
      ))}
    </div>
  );
}

export default function MechanicReviewsSkeleton() {
  return (
    <div className="space-y-5">
      <MechanicReviewsSummarySkeleton />
      <MechanicReviewsListSkeleton count={4} />
    </div>
  );
}
