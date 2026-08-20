import type { InspectionPartKey } from "./inspection-types";

/** Hitbox overlays tuned for Nissan Silvia S15 (Rocket Bunny) after GLB normalize */
export const PART_INSPECTION_MAP: Record<
  InspectionPartKey,
  {
    labelKey: string;
    position: [number, number, number];
    size: [number, number, number];
  }
> = {
  hood: {
    labelKey: "service.inspection.parts.hood",
    position: [0, 0.62, 1.05],
    size: [1.5, 0.2, 0.85],
  },
  roof: {
    labelKey: "service.inspection.parts.roof",
    position: [0, 1.12, -0.05],
    size: [1.35, 0.1, 1.8],
  },
  trunk: {
    labelKey: "service.inspection.parts.trunk",
    position: [0, 0.62, -1.25],
    size: [1.45, 0.2, 0.75],
  },
  front_bumper: {
    labelKey: "service.inspection.parts.front_bumper",
    position: [0, 0.28, 1.65],
    size: [1.85, 0.3, 0.3],
  },
  rear_bumper: {
    labelKey: "service.inspection.parts.rear_bumper",
    position: [0, 0.28, -1.75],
    size: [1.85, 0.3, 0.3],
  },
  front_left_door: {
    labelKey: "service.inspection.parts.front_left_door",
    position: [-1.05, 0.58, 0.35],
    size: [0.12, 0.42, 0.85],
  },
  front_right_door: {
    labelKey: "service.inspection.parts.front_right_door",
    position: [1.05, 0.58, 0.35],
    size: [0.12, 0.42, 0.85],
  },
  rear_left_door: {
    labelKey: "service.inspection.parts.rear_left_door",
    position: [-1.05, 0.58, -0.45],
    size: [0.12, 0.42, 0.85],
  },
  rear_right_door: {
    labelKey: "service.inspection.parts.rear_right_door",
    position: [1.05, 0.58, -0.45],
    size: [0.12, 0.42, 0.85],
  },
};

export const INSPECTION_PART_KEYS = Object.keys(
  PART_INSPECTION_MAP,
) as InspectionPartKey[];
