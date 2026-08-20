/** Nissan Silvia S15 Rocket Bunny — Sketchfab by Ddiaz Design */
export const CAR_MODEL_URL = "/models/nissan-silvia-s15.glb";

export const CAR_MODEL_SKETCHFAB =
  "https://sketchfab.com/3d-models/2014-rocket-bunny-nissan-silvia-s15-sema-build-b4ff35e673ed47ce952097af29de75ed";

export const CAR_MODEL_TRANSFORM = {
  /** Normalize longest axis (X/Z) to this length in scene units */
  targetLength: 4.4,
  /** Y rotation after centering — tune if model faces wrong direction */
  rotationY: Math.PI,
  /** Lift model so wheels sit on ground plane */
  groundOffset: 0,
};
