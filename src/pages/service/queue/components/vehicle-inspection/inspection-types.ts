export type InspectionStatus = "ok" | "not_ok" | "unset";

export type InspectionPartKey =
  | "hood"
  | "roof"
  | "trunk"
  | "front_bumper"
  | "rear_bumper"
  | "front_left_door"
  | "front_right_door"
  | "rear_left_door"
  | "rear_right_door";

export interface InspectionChecklistItem {
  key: string;
  labelKey: string;
  groupKey: string;
  partKey?: InspectionPartKey;
  status: InspectionStatus;
  note?: string;
}

export interface VehicleInspectionMeta {
  customerName: string;
  plateNumber: string;
  inspectedAt: string;
  notes?: string;
}

export interface VehicleInspection {
  workOrderId: number;
  meta: VehicleInspectionMeta;
  items: InspectionChecklistItem[];
  updatedAt: string;
}

export type InspectionFormStatus = "empty" | "draft" | "completed";

export function getInspectionFormStatus(
  inspection: VehicleInspection | null,
): InspectionFormStatus {
  if (!inspection) {
    return "empty";
  }

  const answered = inspection.items.filter((item) => item.status !== "unset");

  if (answered.length === 0) {
    return "empty";
  }

  if (answered.length === inspection.items.length) {
    return "completed";
  }

  return "draft";
}

export function getNotOkPartKeys(
  inspection: VehicleInspection | null,
): InspectionPartKey[] {
  if (!inspection) {
    return [];
  }

  return inspection.items
    .filter((item) => item.status === "not_ok" && item.partKey)
    .map((item) => item.partKey as InspectionPartKey);
}
