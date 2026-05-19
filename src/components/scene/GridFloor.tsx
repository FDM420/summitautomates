"use client";

import { useMemo } from "react";
import { Float32BufferAttribute } from "three";

type GridFloorProps = {
  /** Half-extent in scene units. Total grid spans 2*size. Default 12. */
  size?: number;
  /** Lines per axis. Default 28. */
  divisions?: number;
  /** Y position. Default -2. */
  y?: number;
  /** Line color. Default cyan-ish. */
  color?: string;
  /** Base opacity (gets fogged at the edges naturally). Default 0.32. */
  opacity?: number;
};

export function GridFloor({
  size = 12,
  divisions = 28,
  y = -2,
  color = "#3b82f6",
  opacity = 0.32,
}: GridFloorProps) {
  const positions = useMemo(() => {
    const step = (size * 2) / divisions;
    const verts: number[] = [];
    for (let i = 0; i <= divisions; i += 1) {
      const a = -size + i * step;
      // line parallel to X
      verts.push(-size, 0, a, size, 0, a);
      // line parallel to Z
      verts.push(a, 0, -size, a, 0, size);
    }
    const attr = new Float32BufferAttribute(verts, 3);
    return attr;
  }, [size, divisions]);

  return (
    <lineSegments position={[0, y, 0]}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positions} />
      </bufferGeometry>
      <lineBasicMaterial color={color} opacity={opacity} transparent depthWrite={false} />
    </lineSegments>
  );
}
