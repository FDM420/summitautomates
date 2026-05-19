"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  type Group,
  Line,
  LineBasicMaterial,
  type Mesh,
  Vector3,
} from "three";
import type { ModuleProps } from "./WhatsappModule";

const ACCENT = "#60a5fa";
const ACCENT_2 = "#818cf8";

const PIN_POSITIONS: [number, number][] = [
  [-0.55, -0.35],
  [-0.2, 0.15],
  [0.25, -0.05],
  [0.55, 0.3],
];

export function WorkforceModule({ position = [0, 0, 0], scale = 1, active = true }: ModuleProps) {
  const groupRef = useRef<Group>(null);
  const pinRefs = useRef<(Group | null)[]>([]);
  const barsRef = useRef<(Mesh | null)[]>([]);

  // Build the route polyline once
  const routeLine = useMemo(() => {
    const pts = PIN_POSITIONS.map(([x, z]) => new Vector3(x, 0.02, z));
    const geom = new BufferGeometry().setFromPoints(pts);
    const mat = new LineBasicMaterial({
      color: ACCENT,
      transparent: true,
      opacity: 0.85,
    });
    return new Line(geom, mat);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.16) * 0.16;
    pinRefs.current.forEach((g, i) => {
      if (!g) return;
      const energy = active ? 1.4 : 0.6;
      const lift = 0.06 + Math.abs(Math.sin(t * energy + i * 1.2)) * 0.18;
      g.position.y = 0.05 + lift;
    });
    barsRef.current.forEach((m, i) => {
      if (!m) return;
      const h = 0.2 + Math.abs(Math.sin(t * 0.9 + i * 0.7)) * 0.55;
      m.scale.y = h;
      m.position.y = -0.05 + h / 2;
    });
  });

  return (
    <group position={position} ref={groupRef} scale={scale}>
      {/* Map plane */}
      <group position={[-0.4, -0.05, 0]} rotation={[-Math.PI / 3.4, 0, 0]}>
        <mesh>
          <planeGeometry args={[1.85, 1.4, 8, 6]} />
          <meshStandardMaterial
            color="#091224"
            emissive={ACCENT}
            emissiveIntensity={0.18}
            metalness={0.4}
            roughness={0.45}
            wireframe={false}
          />
        </mesh>
        {/* Wireframe overlay */}
        <mesh>
          <planeGeometry args={[1.85, 1.4, 12, 8]} />
          <meshBasicMaterial color={ACCENT} opacity={0.3} transparent wireframe />
        </mesh>
        {/* Route line */}
        <primitive object={routeLine} />
        {/* Pins */}
        {PIN_POSITIONS.map(([x, z], i) => (
          <group key={i} position={[x, 0, z]} ref={(g) => { pinRefs.current[i] = g; }}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.08, 0.22, 12]} />
              <meshStandardMaterial
                color="#0c1530"
                emissive={ACCENT}
                emissiveIntensity={0.6}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color="#0c1530"
                emissive={ACCENT_2}
                emissiveIntensity={1.0}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={ACCENT}
                depthWrite={false}
                opacity={0.4}
                transparent
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Attendance / report card on the right */}
      <group position={[1.5, 0.1, 0]}>
        <RoundedBox args={[1.05, 1.5, 0.05]} radius={0.07} smoothness={3}>
          <meshStandardMaterial
            color="#0e1832"
            emissive={ACCENT}
            emissiveIntensity={0.3}
            metalness={0.65}
            roughness={0.28}
          />
        </RoundedBox>
        {/* Header line */}
        <mesh position={[0, 0.55, 0.035]}>
          <planeGeometry args={[0.7, 0.07]} />
          <meshBasicMaterial color={ACCENT} opacity={0.7} transparent />
        </mesh>
        {/* Mini bar chart */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            position={[i * 0.14 - 0.36, -0.05, 0.035]}
            ref={(m) => {
              barsRef.current[i] = m;
            }}
          >
            <boxGeometry args={[0.085, 1, 0.04]} />
            <meshBasicMaterial color={ACCENT_2} toneMapped={false} />
          </mesh>
        ))}
        {/* Footer line */}
        <mesh position={[0, -0.55, 0.035]}>
          <planeGeometry args={[0.78, 0.06]} />
          <meshBasicMaterial color={ACCENT} opacity={0.4} transparent />
        </mesh>
      </group>

      {/* Floating GPS tag */}
      <Float floatIntensity={0.6} rotationIntensity={0.1} speed={1.3}>
        <group position={[-0.05, 1.0, 0.4]}>
          <RoundedBox args={[1.0, 0.32, 0.04]} radius={0.06} smoothness={3}>
            <meshStandardMaterial
              color="#0e1832"
              emissive={ACCENT}
              emissiveIntensity={0.55}
              metalness={0.7}
              roughness={0.2}
            />
          </RoundedBox>
        </group>
      </Float>
    </group>
  );
}
