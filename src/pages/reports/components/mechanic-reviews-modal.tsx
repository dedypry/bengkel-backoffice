import type { IMechanicReview, IRatingSummary } from "@/utils/interfaces/IUser";

import dayjs from "dayjs";
import { MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@heroui/react";

import { Rating } from "@/components/rating";
import { http } from "@/utils/libs/axios";
import { formatNumber } from "@/utils/helpers/format";

interface MechanicReviewsModalProps {
  open: boolean;
  mechanicId: number | null;
  mechanicName?: string;
  onClose: () => void;
}

export default function MechanicReviewsModal({
  open,
  mechanicId,
  mechanicName,
  onClose,
}: MechanicReviewsModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<IMechanicReview[]>([]);
  const [summary, setSummary] = useState<IRatingSummary | null>(null);

  useEffect(() => {
    if (!open || !mechanicId) {
      return;
    }

    setLoading(true);
    http
      .get(`/employees/${mechanicId}`)
      .then(({ data }) => {
        setReviews(data.reviews || []);
        setSummary(data.rating_summary || null);
      })
      .finally(() => setLoading(false));
  }, [open, mechanicId]);

  const handleClose = () => {
    setReviews([]);
    setSummary(null);
    onClose();
  };

  return (
    <Modal isOpen={open} scrollBehavior="inside" size="2xl" onClose={handleClose}>
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
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner color="primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Star size={32} />
              <p className="mt-3 text-sm">{t("reports.mechanics.reviews_empty")}</p>
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

              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-amber-100/80 bg-amber-50/20 p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase text-primary">
                          {t("reports.mechanics.work_order")}:{" "}
                          {review.work_order?.trx_no || `#${review.work_order_id}`}
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
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
