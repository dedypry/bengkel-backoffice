import type { VehicleInspection } from "./inspection-types";

import { useCallback, useMemo, useState } from "react";

import { createDefaultInspection, type WorkOrderSeed } from "./inspection-mock";

const STORAGE_PREFIX = "vehicle-inspection-mock:";

function readStoredInspection(workOrderId: number): VehicleInspection | null {
  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${workOrderId}`);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as VehicleInspection;
  } catch {
    return null;
  }
}

function writeStoredInspection(inspection: VehicleInspection) {
  sessionStorage.setItem(
    `${STORAGE_PREFIX}${inspection.workOrderId}`,
    JSON.stringify(inspection),
  );
}

export function useVehicleInspectionMock(workOrder: WorkOrderSeed) {
  const [inspection, setInspectionState] = useState<VehicleInspection | null>(
    () => readStoredInspection(workOrder.id),
  );

  const defaultInspection = useMemo(
    () => createDefaultInspection(workOrder),
    [workOrder],
  );

  const currentInspection = inspection ?? defaultInspection;

  const saveInspection = useCallback(
    (nextInspection: VehicleInspection) => {
      const payload = {
        ...nextInspection,
        workOrderId: workOrder.id,
        updatedAt: new Date().toISOString(),
      };

      writeStoredInspection(payload);
      setInspectionState(payload);

      return payload;
    },
    [workOrder.id],
  );

  const resetInspection = useCallback(() => {
    sessionStorage.removeItem(`${STORAGE_PREFIX}${workOrder.id}`);
    setInspectionState(null);
  }, [workOrder.id]);

  return {
    inspection: currentInspection,
    hasSavedData: Boolean(inspection),
    saveInspection,
    resetInspection,
  };
}
