import type { InspectionPartKey, VehicleInspection } from "./inspection-types";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { ClipboardCheck, Save } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import InspectionChecklistForm from "./inspection-checklist-form";
import InspectionPreviewSkeleton from "./inspection-skeleton";
import { getNotOkPartKeys } from "./inspection-types";

const Car3DPreview = lazy(() => import("./car-3d-preview"));

const inspectionPartKeySchema = z
  .enum([
    "hood",
    "roof",
    "trunk",
    "front_bumper",
    "rear_bumper",
    "front_left_door",
    "front_right_door",
    "rear_left_door",
    "rear_right_door",
  ])
  .optional();

const inspectionSchema = z.object({
  workOrderId: z.number(),
  updatedAt: z.string(),
  meta: z.object({
    customerName: z.string().min(1),
    plateNumber: z.string().min(1),
    inspectedAt: z.string().min(1),
    notes: z.string().optional(),
  }),
  items: z.array(
    z.object({
      key: z.string(),
      labelKey: z.string(),
      groupKey: z.string(),
      partKey: inspectionPartKeySchema,
      status: z.enum(["ok", "not_ok", "unset"]),
      note: z.string().optional(),
    }),
  ),
}) satisfies z.ZodType<VehicleInspection>;

interface Props {
  open: boolean;
  inspection: VehicleInspection;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (inspection: VehicleInspection) => void;
}

export default function InspectionFullscreenModal({
  open,
  inspection,
  readOnly = false,
  onClose,
  onSave,
}: Props) {
  const { t } = useTranslation();
  const [selectedPart, setSelectedPart] = useState<InspectionPartKey | null>(
    null,
  );

  const form = useForm<VehicleInspection>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: inspection,
  });

  useEffect(() => {
    if (open) {
      form.reset(inspection);
      setSelectedPart(null);
    }
  }, [open, inspection, form]);

  const watchedInspection = form.watch();
  const highlightedParts = useMemo(
    () => getNotOkPartKeys(watchedInspection),
    [watchedInspection],
  );

  function handleSubmit(values: VehicleInspection) {
    onSave(values);
    onClose();
  }

  return (
    <Modal
      backdrop="blur"
      isOpen={open}
      scrollBehavior="inside"
      size="full"
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex items-center gap-3 border-b border-secondary-100">
              <div className="rounded-lg bg-primary-50 p-2 text-primary">
                <ClipboardCheck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase text-secondary-700">
                  {t("service.inspection.modal_title")}
                </span>
                <span className="text-xs font-medium text-secondary-400">
                  {t("service.inspection.modal_subtitle")}
                </span>
              </div>
            </ModalHeader>

            <ModalBody className="py-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="xl:col-span-5">
                  <div className="sticky top-0 space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-secondary-500">
                      {t("service.inspection.preview_3d")}
                    </p>
                    <Suspense fallback={<InspectionPreviewSkeleton />}>
                      <Car3DPreview
                        className="h-[280px] w-full overflow-hidden rounded-xl bg-secondary-50 md:h-[420px]"
                        highlightedParts={highlightedParts}
                        selectedPart={selectedPart}
                        onSelectPart={setSelectedPart}
                      />
                    </Suspense>
                    <p className="text-xs text-secondary-400">
                      {t("service.inspection.preview_hint")}
                    </p>
                  </div>
                </div>

                <div className="xl:col-span-7">
                  <FormProvider {...form}>
                    <form
                      className="space-y-4"
                      id="vehicle-inspection-form"
                      onSubmit={form.handleSubmit(handleSubmit)}
                    >
                      <InspectionChecklistForm
                        disabled={readOnly}
                        highlightedPart={selectedPart}
                        onSelectItem={(partKey) =>
                          setSelectedPart(partKey || null)
                        }
                      />
                    </form>
                  </FormProvider>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="border-t border-secondary-100">
              <Button variant="light" onPress={close}>
                {t("common.cancel")}
              </Button>
              {!readOnly ? (
                <Button
                  color="primary"
                  form="vehicle-inspection-form"
                  startContent={<Save size={16} />}
                  type="submit"
                >
                  {t("service.inspection.save_mock")}
                </Button>
              ) : null}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
