"use client";

import { Float } from "@react-three/drei";
import { type ReactNode } from "react";
import { AdditiveBlending } from "three";

type FloatingIconProps = {
  position?: [number, number, number];
  /** Glow halo color. */
  color?: string;
  /** Halo size. Default 0.45. */
  haloSize?: number;
  /** Halo opacity. Default 0.35. */
  haloOpacity?: number;
  /** Float speed. Default 1.2. */
  speed?: number;
  /** Float rotation intensity. Default 0.4. */
  rotationIntensity?: number;
  /** Float vertical motion intensity. Default 0.6. */
  floatIntensity?: number;
  children: ReactNode;
};

export function FloatingIcon({
  position = [0, 0, 0],
  color = "#5eead4",
  haloSize = 0.45,
  haloOpacity = 0.35,
  speed = 1.2,
  rotationIntensity = 0.4,
  floatIntensity = 0.6,
  children,
}: FloatingIconProps) {
  return (
    <group position={position}>
      <Float
        floatIntensity={floatIntensity}
        rotationIntensity={rotationIntensity}
        speed={speed}
      >
        {children}
      </Float>
      <mesh>
        <sphereGeometry args={[haloSize, 24, 24]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={haloOpacity}
          transparent
        />
      </mesh>
    </group>
  );
}
