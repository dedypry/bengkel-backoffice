import type { ThreeEvent } from "@react-three/fiber";
import type { InspectionPartKey } from "./inspection-types";

import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";

import { CAR_MODEL_TRANSFORM, CAR_MODEL_URL } from "./car-model-config";
import {
  INSPECTION_PART_KEYS,
  PART_INSPECTION_MAP,
} from "./part-inspection-map";

useGLTF.preload(CAR_MODEL_URL);

interface CarPartProps {
  partKey: InspectionPartKey;
  isHighlighted: boolean;
  isSelected: boolean;
  onSelect?: (partKey: InspectionPartKey) => void;
}

function CarPart({
  partKey,
  isHighlighted,
  isSelected,
  onSelect,
}: CarPartProps) {
  const config = PART_INSPECTION_MAP[partKey];

  const color = isHighlighted ? "#ef4444" : isSelected ? "#2563eb" : "#64748b";

  const opacity = isHighlighted ? 0.55 : isSelected ? 0.45 : 0.12;

  return (
    <mesh
      position={config.position}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect?.(partKey);
      }}
    >
      <boxGeometry args={config.size} />
      <meshStandardMaterial
        transparent
        color={color}
        depthWrite={opacity > 0.2}
        metalness={0.2}
        opacity={opacity}
        roughness={0.5}
      />
    </mesh>
  );
}

function normalizeCarScene(scene: THREE.Object3D) {
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  scene.position.sub(center);

  const longestAxis = Math.max(size.x, size.z);
  const scale =
    longestAxis > 0 ? CAR_MODEL_TRANSFORM.targetLength / longestAxis : 1;

  scene.scale.setScalar(scale);
  scene.rotation.y = CAR_MODEL_TRANSFORM.rotationY;

  scene.updateMatrixWorld(true);

  const groundedBox = new THREE.Box3().setFromObject(scene);

  scene.position.y -= groundedBox.min.y - CAR_MODEL_TRANSFORM.groundOffset;
}

function CarGlbModel() {
  const { scene } = useGLTF(CAR_MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  const normalizedRef = useRef(false);

  useLayoutEffect(() => {
    if (normalizedRef.current) {
      return;
    }

    normalizeCarScene(model);
    normalizedRef.current = true;
  }, [model]);

  return <primitive object={model} />;
}

function CarBodyPlaceholder() {
  return (
    <group>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.8, 0.5, 3.6]} />
        <meshStandardMaterial color="#334155" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.95, -0.15]}>
        <boxGeometry args={[1.55, 0.45, 1.8]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.25}
          roughness={0.55}
        />
      </mesh>
      {(["front_left", "front_right", "rear_left", "rear_right"] as const).map(
        (wheel, index) => {
          const x = wheel.includes("left") ? -0.95 : 0.95;
          const z = wheel.includes("front") ? 1 : -1;

          return (
            <mesh
              key={wheel + index}
              position={[x, 0.18, z]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.28, 0.28, 0.22, 20]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          );
        },
      )}
    </group>
  );
}

interface ModelErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function SceneInvalidate({
  highlightedParts,
  selectedPart,
}: Car3DPreviewProps) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [highlightedParts, selectedPart, invalidate]);

  return null;
}

interface Car3DPreviewProps {
  highlightedParts?: InspectionPartKey[];
  selectedPart?: InspectionPartKey | null;
  onSelectPart?: (partKey: InspectionPartKey) => void;
  className?: string;
}

function CarScene({
  highlightedParts = [],
  selectedPart = null,
  onSelectPart,
}: Car3DPreviewProps) {
  const highlightedSet = useMemo(
    () => new Set(highlightedParts),
    [highlightedParts],
  );

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight castShadow intensity={1.25} position={[5, 8, 6]} />
      <directionalLight intensity={0.35} position={[-4, 3, -4]} />
      <Environment preset="city" />
      <ModelErrorBoundary fallback={<CarBodyPlaceholder />}>
        <Suspense fallback={<CarBodyPlaceholder />}>
          <CarGlbModel />
        </Suspense>
      </ModelErrorBoundary>
      {INSPECTION_PART_KEYS.map((partKey) => (
        <CarPart
          key={partKey}
          isHighlighted={highlightedSet.has(partKey)}
          isSelected={selectedPart === partKey}
          partKey={partKey}
          onSelect={onSelectPart}
        />
      ))}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <OrbitControls
        enablePan={false}
        maxDistance={11}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4.5}
      />
      <SceneInvalidate
        highlightedParts={highlightedParts}
        selectedPart={selectedPart}
      />
    </>
  );
}

export default function Car3DPreview({
  highlightedParts,
  selectedPart,
  onSelectPart,
  className,
}: Car3DPreviewProps) {
  return (
    <div
      className={
        className ||
        "h-full min-h-[180px] w-full overflow-hidden rounded-xl bg-secondary-50"
      }
    >
      <Canvas
        camera={{ fov: 40, position: [5.2, 3.4, 6.2] }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.setClearColor("#f8fafc");
        }}
      >
        <Suspense fallback={null}>
          <CarScene
            highlightedParts={highlightedParts}
            selectedPart={selectedPart}
            onSelectPart={onSelectPart}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
