import type { IMechanicReview, IRatingSummary } from "@/utils/interfaces/IUser";

import dayjs from "dayjs";
import { MessageSquare, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Chip, Skeleton } from "@heroui/react";

import { EmployeeReviewsListSkeleton } from "./employee-reviews-skeleton";

import { CustomPagination } from "@/components/custom-pagination";
import { Rating } from "@/components/rating";
import { http } from "@/utils/libs/axios";
import { formatNumber } from "@/utils/helpers/format";

type RatingFilter = "all" | 1 | 2 | 3 | 4 | 5;

const PAGE_SIZE = 25;
const RATING_FILTERS: RatingFilter[] = ["all", 1, 2, 3, 4, 5];

interface ReviewsResponse {
  data: IMechanicReview[];
  total: number;
  page: number;
  pageSize: number;
  rating_summary: IRatingSummary;
}

interface EmployeeReviewsSectionProps {
  employeeId: number;
  initialSummary?: IRatingSummary | null;
}

export default function EmployeeReviewsSection({
  employeeId,
  initialSummary,
}: EmployeeReviewsSectionProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<IMechanicReview[]>([]);
  const [summary, setSummary] = useState<IRatingSummary | null>(
    initialSummary || null,
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialSummary?.total || 0);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  const fetchReviews = useCallback(async () => {
    if (!employeeId) return;

    setLoading(true);

    try {
      const params: Record<string, number | string> = {
        page,
        pageSize: PAGE_SIZE,
      };

      if (ratingFilter !== "all") {
        params.rating = ratingFilter;
      }

      const { data } = await http.get<ReviewsResponse>(
        `/employees/${employeeId}/reviews`,
        { params },
      );

      setReviews(data.data || []);
      setSummary(data.rating_summary || null);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [employeeId, page, ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRatingFilterChange = (filter: RatingFilter) => {
    setRatingFilter(filter);
    setPage(1);
  };

  if (
    !initialSummary?.total &&
    !loading &&
    total === 0 &&
    ratingFilter === "all"
  ) {
    return null;
  }

  return (
    <Card className="border border-amber-100 bg-amber-50/30 p-4 shadow-sm">
      <CardBody className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-sm bg-amber-100 p-2">
              <Star className="text-amber-500" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase text-gray-500">
                {t("hr.employees.section_reviews")}
              </h4>
              <p className="text-[11px] text-gray-400">
                {t("hr.employees.reviews_count", {
                  count: summary?.total || total,
                })}
              </p>
            </div>
          </div>
          {!loading ? (
            <Chip color="warning" size="sm" variant="flat">
              {t("hr.employees.average_rating")}:{" "}
              {formatNumber(summary?.average || 0)}
            </Chip>
          ) : (
            <Skeleton className="h-6 w-40 rounded-full" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase text-gray-500">
            {t("hr.employees.filter_rating")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {RATING_FILTERS.map((filter) => (
              <Chip
                key={filter}
                className="cursor-pointer h-6 min-h-6"
                classNames={{
                  content: "text-[11px] px-0.5 font-semibold",
                }}
                color={ratingFilter === filter ? "warning" : "default"}
                size="sm"
                variant={ratingFilter === filter ? "solid" : "flat"}
                onClick={() => handleRatingFilterChange(filter)}
              >
                {filter === "all" ? (
                  t("hr.employees.filter_all")
                ) : (
                  <span className="flex items-center gap-0.5">
                    {filter}
                    <Star className="size-2.5" fill="currentColor" />
                  </span>
                )}
              </Chip>
            ))}
          </div>
        </div>

        {loading ? (
          <EmployeeReviewsListSkeleton count={3} />
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Star size={28} />
            <p className="mt-3 text-sm">{t("hr.employees.reviews_empty")}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-amber-100/80 bg-white p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase text-primary">
                        {t("hr.employees.work_order")}:{" "}
                        {review.work_order?.trx_no ||
                          `#${review.work_order_id}`}
                      </p>
                      {review.work_order?.vehicle ? (
                        <p className="text-sm font-semibold text-gray-700">
                          {review.work_order.vehicle.brand}{" "}
                          {review.work_order.vehicle.plate_number}
                        </p>
                      ) : null}
                      {review.work_order?.customer ? (
                        <p className="text-xs text-gray-500">
                          {review.work_order.customer.name}
                        </p>
                      ) : null}
                      <p className="text-[10px] font-bold uppercase text-gray-400">
                        {dayjs(review.created_at).format("DD MMMM YYYY, HH:mm")}
                      </p>
                    </div>

                    <Rating readOnly initialValue={review.rating} />
                  </div>

                  {review.notes ? (
                    <div className="mt-4 flex gap-3 rounded-xl bg-gray-50 p-3">
                      <MessageSquare
                        className="mt-0.5 shrink-0 text-gray-400"
                        size={16}
                      />
                      <p className="text-sm leading-relaxed text-gray-600">
                        {review.notes}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <CustomPagination
              className="w-full border-t border-amber-100/80 pt-2"
              meta={{
                total,
                page,
                pageSize: PAGE_SIZE,
                lastPage: Math.ceil(total / PAGE_SIZE) || 1,
                from: total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1,
                to: Math.min(page * PAGE_SIZE, total),
              }}
              showDesc={false}
              onPageChange={setPage}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
}
