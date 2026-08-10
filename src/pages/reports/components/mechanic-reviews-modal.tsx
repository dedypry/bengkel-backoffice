import type { IMechanicReview, IRatingSummary } from "@/utils/interfaces/IUser";

import dayjs from "dayjs";
import { MessageSquare, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";

import MechanicReviewsSkeleton, {
  MechanicReviewsListSkeleton,
} from "./mechanic-reviews-skeleton";

import { Rating } from "@/components/rating";
import { http } from "@/utils/libs/axios";
import { formatNumber } from "@/utils/helpers/format";

interface MechanicReviewsModalProps {
  open: boolean;
  mechanicId: number | null;
  mechanicName?: string;
  onClose: () => void;
}

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

export default function MechanicReviewsModal({
  open,
  mechanicId,
  mechanicName,
  onClose,
}: MechanicReviewsModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviews, setReviews] = useState<IMechanicReview[]>([]);
  const [summary, setSummary] = useState<IRatingSummary | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchReviews = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (!mechanicId) return;

      const params: Record<string, number | string> = {
        page: pageNum,
        pageSize: PAGE_SIZE,
      };

      if (ratingFilter !== "all") {
        params.rating = ratingFilter;
      }

      const { data } = await http.get<ReviewsResponse>(
        `/employees/${mechanicId}/reviews`,
        { params },
      );

      setReviews((prev) =>
        reset ? data.data : [...prev, ...(data.data || [])],
      );
      setSummary(data.rating_summary || null);
      setHasMore(pageNum * PAGE_SIZE < (data.total || 0));
      setPage(pageNum);
    },
    [mechanicId, ratingFilter],
  );

  useEffect(() => {
    if (!open || !mechanicId) return;

    setLoading(true);
    setReviews([]);
    setPage(1);
    fetchReviews(1, true).finally(() => setLoading(false));
  }, [open, mechanicId, ratingFilter, fetchReviews]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMore) return;

    setLoadingMore(true);
    try {
      await fetchReviews(page + 1, false);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchReviews, hasMore, loading, loadingMore, page]);

  useEffect(() => {
    const root = scrollRef.current;
    const target = loadMoreRef.current;

    if (!open || !root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root, threshold: 0.1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [open, loadMore, reviews.length]);

  const handleClose = () => {
    setReviews([]);
    setSummary(null);
    setPage(1);
    setHasMore(false);
    setRatingFilter("all");
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      scrollBehavior="inside"
      size="2xl"
      onClose={handleClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Star className="text-warning" size={18} />
            <span>{t("reports.mechanics.reviews_modal_title")}</span>
          </div>
          {mechanicName ? (
            <p className="text-sm font-normal text-gray-500">{mechanicName}</p>
          ) : null}
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="mb-4 flex flex-wrap gap-1.5">
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
                onClick={() => setRatingFilter(filter)}
              >
                {filter === "all" ? (
                  t("reports.mechanics.filter_all")
                ) : (
                  <span className="flex items-center gap-0.5">
                    {filter}
                    <Star className="size-2.5" fill="currentColor" />
                  </span>
                )}
              </Chip>
            ))}
          </div>

          {loading ? (
            <MechanicReviewsSkeleton />
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Star size={32} />
              <p className="mt-3 text-sm">
                {t("reports.mechanics.reviews_empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Chip color="warning" size="sm" variant="flat">
                  {t("reports.mechanics.average_rating")}:{" "}
                  {formatNumber(summary?.average || 0)}
                </Chip>
                <Chip size="sm" variant="flat">
                  {t("reports.mechanics.reviews_count", {
                    count: summary?.total || reviews.length,
                  })}
                </Chip>
              </div>

              <div
                ref={scrollRef}
                className="max-h-[55vh] space-y-3 overflow-y-auto pr-1"
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-amber-100/80 bg-amber-50/20 p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase text-primary">
                          {t("reports.mechanics.work_order")}:{" "}
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
                          {dayjs(review.created_at).format(
                            "DD MMMM YYYY, HH:mm",
                          )}
                        </p>
                      </div>

                      <Rating readOnly initialValue={review.rating} />
                    </div>

                    {review.notes ? (
                      <div className="mt-4 flex gap-3 rounded-xl bg-white p-3">
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

                <div ref={loadMoreRef} className="py-1">
                  {loadingMore ? (
                    <MechanicReviewsListSkeleton count={2} />
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
