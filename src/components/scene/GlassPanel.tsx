"use client";

import { Html } from "@react-three/drei";
import { type ReactNode } from "react";
import type { ServiceAccent } from "@/lib/services-config";

type GlassPanelProps = {
  /** World-space position of the panel anchor. */
  position?: [number, number, number];
  /** Accent variant for the glow ring. */
  accent?: ServiceAccent;
  /** Whether the panel exists IN the 3D scene (transform mode) or overlays at the projected screen position. Default false (overlay). */
  inScene?: boolean;
  /** Scale when inScene is true. Default 0.1 (drei <Html transform> uses world units). */
  scale?: number;
  /** Optional rotation tuple for inScene mode. */
  rotation?: [number, number, number];
  /** Optional extra class names on the wrapper. */
  className?: string;
  /** Width style applied to the inner card. Default fits content. */
  width?: number | string;
  children: ReactNode;
};

export function GlassPanel({
  position = [0, 0, 0],
  accent,
  inScene = false,
  scale = 0.1,
  rotation,
  className,
  width,
  children,
}: GlassPanelProps) {
  const dataAccent = accent ?? undefined;
  return (
    <Html
      center
      distanceFactor={inScene ? undefined : 8}
      position={position}
      rotation={rotation}
      transform={inScene}
      scale={inScene ? scale : undefined}
      zIndexRange={[10, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`glass-card pointer-events-auto ${className ?? ""}`}
        data-accent={dataAccent}
        style={{ width: typeof width === "number" ? `${width}px` : width }}
      >
        {children}
      </div>
    </Html>
  );
}
