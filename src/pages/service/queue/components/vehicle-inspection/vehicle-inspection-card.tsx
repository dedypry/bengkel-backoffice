import type { IWorkOrder } from "@/utils/interfaces/IUser";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { ClipboardCheck, Eye } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { SectionHeader } from "../helper";

import InspectionFullscreenModal from "./inspection-fullscreen-modal";
import InspectionPreviewSkeleton from "./inspection-skeleton";
import { getInspectionFormStatus, getNotOkPartKeys } from "./inspection-types";
import { useVehicleInspectionMock } from "./use-vehicle-inspection-mock";

import { notify } from "@/utils/helpers/notify";

const Car3DPreview = lazy(() => import("./car-3d-preview"));

interface Props {
  workOrder: IWorkOrder;
}

export default function VehicleInspectionCard({ workOrder }: Props) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const { inspection, saveInspection } = useVehicleInspectionMock(workOrder);

  const formStatus = getInspectionFormStatus(inspection);
  const highlightedParts = useMemo(
    () => getNotOkPartKeys(inspection),
    [inspection],
  );

  const readOnly = workOrder.status === "cancel";

  const statusChip = {
    empty: {
      color: "default" as const,
      label: t("service.inspection.status_empty"),
    },
    draft: {
      color: "warning" as const,
      label: t("service.inspection.status_draft"),
    },
    completed: {
      color: "success" as const,
      label: t("service.inspection.status_completed"),
    },
  }[formStatus];

  return (
    <>
      <InspectionFullscreenModal
        inspection={inspection}
        open={openModal}
        readOnly={readOnly}
        onClose={() => setOpenModal(false)}
        onSave={(values) => {
          saveInspection(values);
          notify(t("service.inspection.saved_mock_toast"));
        }}
      />

      <Card>
        <CardBody className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-3">
            <SectionHeader
              icon={<ClipboardCheck size={18} />}
              title={t("service.inspection.title")}
            />
            <Chip color={statusChip.color} size="sm" variant="flat">
              {statusChip.label}
            </Chip>
          </div>

          <button
            className="block w-full text-left"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            <Suspense fallback={<InspectionPreviewSkeleton />}>
              <Car3DPreview
                className="h-44 w-full overflow-hidden rounded-xl bg-secondary-50"
                highlightedParts={highlightedParts}
              />
            </Suspense>
          </button>

          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                {workOrder.vehicle.plate_number}
              </p>
              <p className="text-xs font-semibold text-secondary-600">
                {highlightedParts.length > 0
                  ? t("service.inspection.issue_count", {
                      count: highlightedParts.length,
                    })
                  : t("service.inspection.no_issue")}
              </p>
            </div>
            <Button
              color="primary"
              size="sm"
              startContent={<Eye size={14} />}
              variant="flat"
              onPress={() => setOpenModal(true)}
            >
              {t("service.inspection.open_detail")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
