"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { AdditiveBlending, type Group, MathUtils, Vector3 } from "three";
import { SERVICE_MODULES, type ServiceModule } from "@/lib/services-config";
import { ConnectionBeam } from "./scene/ConnectionBeam";
import { FloatingIcon } from "./scene/FloatingIcon";
import { GridFloor } from "./scene/GridFloor";
import { HubCore } from "./scene/HubCore";

type CommandCenterSceneProps = {
  /** Slug of the focused service. When set, that service's beam brightens and others dim. */
  focusedSlug?: string | null;
  /** Hide the grid floor (useful for embedded contexts). */
  hideGrid?: boolean;
  /** Multiplier on overall scale to fit different containers. Default 1. */
  scale?: number;
};

const FLAT_ORBIT_OFFSET_Z = 0.15;

function modulePosition(module: ServiceModule): [number, number, number] {
  const x = Math.cos(module.orbitAngle) * module.orbitRadius;
  const y = Math.sin(module.orbitAngle) * module.orbitRadius * 0.55;
  return [x, y, FLAT_ORBIT_OFFSET_Z];
}

function ModuleSlot({
  module,
  focused,
  onPointerEnter,
  onPointerLeave,
}: {
  module: ServiceModule;
  focused: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const position = useMemo(() => modulePosition(module), [module]);
  const groupRef = useRef<Group>(null);
  const targetLift = useRef(0);
  const currentLift = useRef(0);

  useFrame((_, delta) => {
    targetLift.current = focused ? 0.22 : 0;
    currentLift.current = MathUtils.lerp(currentLift.current, targetLift.current, Math.min(1, delta * 6));
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + currentLift.current;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerEnter();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onPointerLeave();
      }}
      position={position}
    >
      <FloatingIcon
        color={module.hex}
        floatIntensity={0.45}
        haloOpacity={focused ? 0.55 : 0.32}
        haloSize={0.55}
        rotationIntensity={0.35}
        speed={1.1}
      >
        <mesh>
          <icosahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color={module.hex}
            emissive={module.hex}
            emissiveIntensity={focused ? 1.8 : 1.1}
            metalness={0.6}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
      </FloatingIcon>

      <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 32]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={module.hex}
          depthWrite={false}
          opacity={focused ? 0.55 : 0.3}
          transparent
        />
      </mesh>
    </group>
  );
}

function AmbientCamera({ groupRef }: { groupRef: React.RefObject<Group | null> }) {
  const tmpVec = useRef(new Vector3());
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    tmpVec.current.set(Math.sin(t * 0.18) * 0.4, Math.cos(t * 0.13) * 0.2, 0);
    groupRef.current.position.lerp(tmpVec.current, 0.04);
  });
  return null;
}

export function CommandCenterScene({
  focusedSlug = null,
  hideGrid = false,
  scale = 1,
}: CommandCenterSceneProps) {
  const sceneRef = useRef<Group>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeSlug = hoveredSlug ?? focusedSlug;

  return (
    <group ref={sceneRef} scale={scale}>
      <AmbientCamera groupRef={sceneRef} />
      {!hideGrid ? <GridFloor /> : null}
      <HubCore />

      {SERVICE_MODULES.map((module) => {
        const target = modulePosition(module);
        const isFocused = activeSlug === module.slug;
        const dim = activeSlug !== null && !isFocused;
        return (
          <group key={module.slug}>
            <ConnectionBeam
              color={module.hex}
              from={[0, 0, 0]}
              intensity={dim ? 0.35 : isFocused ? 1.3 : 0.9}
              packets={isFocused ? 5 : 3}
              speed={isFocused ? 1.6 : 2.4}
              to={target}
            />
            <ModuleSlot
              focused={isFocused}
              module={module}
              onPointerEnter={() => setHoveredSlug(module.slug)}
              onPointerLeave={() =>
                setHoveredSlug((curr) => (curr === module.slug ? null : curr))
              }
            />
          </group>
        );
      })}
    </group>
  );
}
