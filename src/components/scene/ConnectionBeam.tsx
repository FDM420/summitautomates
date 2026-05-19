"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  CylinderGeometry,
  type Mesh,
  Quaternion,
  Vector3,
} from "three";

type ConnectionBeamProps = {
  from: [number, number, number];
  to: [number, number, number];
  /** Hex color for beam and packet glow. */
  color: string;
  /** Beam tube radius. Default 0.02. */
  radius?: number;
  /** Beam opacity. Default 0.5. */
  opacity?: number;
  /** Number of packets traveling along the beam. Default 3. */
  packets?: number;
  /** Seconds for a packet to traverse the beam. Default 2.2. */
  speed?: number;
  /** Packet radius. Default 0.06. */
  packetRadius?: number;
  /** Visibility flag — useful for hover/focus highlighting. Default 1. */
  intensity?: number;
};

const UP = new Vector3(0, 1, 0);

export function ConnectionBeam({
  from,
  to,
  color,
  radius = 0.02,
  opacity = 0.5,
  packets = 3,
  speed = 2.2,
  packetRadius = 0.06,
  intensity = 1,
}: ConnectionBeamProps) {
  const fromVec = useMemo(() => new Vector3(...from), [from]);
  const toVec = useMemo(() => new Vector3(...to), [to]);

  const { midpoint, length, quaternion } = useMemo(() => {
    const dir = new Vector3().subVectors(toVec, fromVec);
    const len = dir.length();
    const mid = new Vector3().addVectors(fromVec, toVec).multiplyScalar(0.5);
    const q = new Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
    return { midpoint: mid, length: len, quaternion: q };
  }, [fromVec, toVec]);

  const beamGeometry = useMemo(() => new CylinderGeometry(radius, radius, 1, 6, 1), [radius]);

  const beamRef = useRef<Mesh>(null);
  const packetRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beamRef.current) {
      // gentle breathing on opacity via material; intensity scales it
      const mat = beamRef.current.material as { opacity?: number };
      if (mat && typeof mat.opacity !== "undefined") {
        mat.opacity = opacity * intensity * (0.7 + Math.sin(t * 1.4) * 0.3);
      }
    }
    packetRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const phase = (t / speed + i / packets) % 1;
      mesh.position.lerpVectors(fromVec, toVec, phase);
      const fade = phase < 0.1 ? phase / 0.1 : phase > 0.9 ? (1 - phase) / 0.1 : 1;
      const mat = mesh.material as { opacity?: number };
      if (mat && typeof mat.opacity !== "undefined") {
        mat.opacity = fade * intensity;
      }
      const scale = 0.7 + Math.sin(t * 3 + i) * 0.2;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group>
      <mesh
        geometry={beamGeometry}
        position={midpoint.toArray()}
        quaternion={quaternion}
        ref={beamRef}
        scale={[1, length, 1]}
      >
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={color}
          depthWrite={false}
          opacity={opacity * intensity}
          transparent
        />
      </mesh>
      {Array.from({ length: packets }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            packetRefs.current[i] = m;
          }}
        >
          <sphereGeometry args={[packetRadius, 12, 12]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={color}
            depthWrite={false}
            opacity={intensity}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}
