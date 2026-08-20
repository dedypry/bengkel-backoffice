import type {
  InspectionChecklistItem,
  VehicleInspection,
  VehicleInspectionMeta,
} from "./inspection-types";

export interface WorkOrderSeed {
  id: number;
  customer?: { name?: string };
  vehicle?: { plate_number?: string };
}

export const DEFAULT_INSPECTION_ITEMS: Omit<
  InspectionChecklistItem,
  "status" | "note"
>[] = [
  {
    key: "engine_oil",
    labelKey: "service.inspection.items.engine_oil",
    groupKey: "service.inspection.groups.engine",
    partKey: "hood",
  },
  {
    key: "brake_fluid",
    labelKey: "service.inspection.items.brake_fluid",
    groupKey: "service.inspection.groups.engine",
    partKey: "front_bumper",
  },
  {
    key: "radiator",
    labelKey: "service.inspection.items.radiator",
    groupKey: "service.inspection.groups.engine",
    partKey: "hood",
  },
  {
    key: "battery",
    labelKey: "service.inspection.items.battery",
    groupKey: "service.inspection.groups.electrical",
    partKey: "hood",
  },
  {
    key: "alternator",
    labelKey: "service.inspection.items.alternator",
    groupKey: "service.inspection.groups.electrical",
    partKey: "hood",
  },
  {
    key: "ac_filter",
    labelKey: "service.inspection.items.ac_filter",
    groupKey: "service.inspection.groups.electrical",
    partKey: "hood",
  },
  {
    key: "air_filter",
    labelKey: "service.inspection.items.air_filter",
    groupKey: "service.inspection.groups.undercarriage",
    partKey: "front_bumper",
  },
  {
    key: "shock_absorber",
    labelKey: "service.inspection.items.shock_absorber",
    groupKey: "service.inspection.groups.undercarriage",
    partKey: "front_left_door",
  },
  {
    key: "tire",
    labelKey: "service.inspection.items.tire",
    groupKey: "service.inspection.groups.undercarriage",
    partKey: "front_right_door",
  },
  {
    key: "brake_pad",
    labelKey: "service.inspection.items.brake_pad",
    groupKey: "service.inspection.groups.undercarriage",
    partKey: "rear_left_door",
  },
  {
    key: "chemical",
    labelKey: "service.inspection.items.chemical",
    groupKey: "service.inspection.groups.chemical",
    partKey: "trunk",
  },
  {
    key: "body_condition",
    labelKey: "service.inspection.items.body_condition",
    groupKey: "service.inspection.groups.body",
    partKey: "roof",
  },
];

export function buildDefaultInspectionMeta(
  workOrder: Pick<WorkOrderSeed, "customer" | "vehicle">,
): VehicleInspectionMeta {
  return {
    customerName: workOrder.customer?.name || "",
    plateNumber: workOrder.vehicle?.plate_number || "",
    inspectedAt: new Date().toISOString().slice(0, 10),
    notes: "",
  };
}

export function createDefaultInspection(
  workOrder: WorkOrderSeed,
): VehicleInspection {
  return {
    workOrderId: workOrder.id,
    meta: buildDefaultInspectionMeta(workOrder),
    items: DEFAULT_INSPECTION_ITEMS.map((item) => ({
      ...item,
      status: "unset",
      note: "",
    })),
    updatedAt: new Date().toISOString(),
  };
}
