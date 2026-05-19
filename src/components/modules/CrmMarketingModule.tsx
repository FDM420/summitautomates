"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Group, type Mesh, MeshBasicMaterial } from "three";
import type { ModuleProps } from "./WhatsappModule";

const ACCENT = "#4fd1ff";
const ACCENT_2 = "#5eead4";

export function CrmMarketingModule({ position = [0, 0, 0], scale = 1, active = true }: ModuleProps) {
  const groupRef = useRef<Group>(null);
  const dropsRef = useRef<Group>(null);
  const dropMats = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5].map(
        () =>
          new MeshBasicMaterial({
            color: ACCENT_2,
            transparent: true,
            opacity: 0.95,
            blending: AdditiveBlending,
            depthWrite: false,
          }),
      ),
    [],
  );
  const barsRef = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.16;
    }
    if (dropsRef.current) {
      const speed = active ? 0.7 : 0.35;
      dropsRef.current.children.forEach((child, i) => {
        const phase = ((t * speed + i * 0.55) % 2.5) / 2.5;
        child.position.y = 1.6 - phase * 2.6;
        const mat = dropMats[i];
        if (mat) {
          mat.opacity = phase < 0.15 ? phase / 0.15 : phase > 0.85 ? (1 - phase) / 0.15 : 0.95;
        }
      });
    }
    barsRef.current.forEach((m, i) => {
      if (!m) return;
      const h = 0.25 + Math.abs(Math.sin(t * 1.2 + i * 0.9)) * 0.6;
      m.scale.y = h;
      m.position.y = -0.95 + h / 2;
    });
  });

  return (
    <group position={position} ref={groupRef} scale={scale}>
      {/* Funnel cone */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.95, 1.7, 32, 1, true]} />
          <meshStandardMaterial
            color="#0c1832"
            emissive={ACCENT}
            emissiveIntensity={0.35}
            metalness={0.5}
            roughness={0.25}
            side={2}
            transparent
            opacity={0.65}
          />
        </mesh>
        {/* Inner cone rim glow */}
        <mesh position={[0, 0.85, 0]}>
          <torusGeometry args={[0.93, 0.025, 8, 64]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <torusGeometry args={[0.18, 0.02, 8, 32]} />
          <meshBasicMaterial color={ACCENT_2} toneMapped={false} />
        </mesh>
      </group>

      {/* Lead drops */}
      <group ref={dropsRef}>
        {dropMats.map((mat, i) => (
          <mesh
            key={i}
            material={mat}
            position={[(i - 2.5) * 0.18, 1.5, 0]}
          >
            <sphereGeometry args={[0.07, 12, 12]} />
          </mesh>
        ))}
      </group>

      {/* Mini analytics bars to the right */}
      <group position={[1.6, 0, 0]}>
        <RoundedBox args={[1.0, 1.5, 0.05]} radius={0.07} smoothness={3}>
          <meshStandardMaterial
            color="#0d1530"
            emissive={ACCENT}
            emissiveIntensity={0.25}
            metalness={0.6}
            roughness={0.3}
          />
        </RoundedBox>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[i * 0.16 - 0.32, -0.4, 0.035]}
            ref={(m) => {
              barsRef.current[i] = m;
            }}
          >
            <boxGeometry args={[0.1, 1, 0.04]} />
            <meshBasicMaterial color={ACCENT_2} toneMapped={false} />
          </mesh>
        ))}
        {/* Top label bar */}
        <mesh position={[0, 0.55, 0.035]}>
          <planeGeometry args={[0.7, 0.08]} />
          <meshBasicMaterial color={ACCENT} opacity={0.6} transparent />
        </mesh>
      </group>

      {/* Kanban mini cards on the left */}
      <group position={[-1.6, 0.05, 0]}>
        {[0, 1, 2].map((i) => (
          <Float floatIntensity={0.45} key={i} rotationIntensity={0.1} speed={0.9 + i * 0.15}>
            <group position={[0, 0.5 - i * 0.5, 0]}>
              <RoundedBox args={[0.95, 0.4, 0.04]} radius={0.06} smoothness={3}>
                <meshStandardMaterial
                  color="#0c1430"
                  emissive={ACCENT}
                  emissiveIntensity={0.4}
                  metalness={0.6}
                  roughness={0.25}
                />
              </RoundedBox>
              <mesh position={[-0.35, 0.07, 0.025]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshBasicMaterial color={ACCENT_2} toneMapped={false} />
              </mesh>
              <mesh position={[0.05, 0.07, 0.025]}>
                <planeGeometry args={[0.5, 0.05]} />
                <meshBasicMaterial color={ACCENT} opacity={0.55} transparent />
              </mesh>
              <mesh position={[0.05, -0.08, 0.025]}>
                <planeGeometry args={[0.55, 0.04]} />
                <meshBasicMaterial color={ACCENT_2} opacity={0.4} transparent />
              </mesh>
            </group>
          </Float>
        ))}
      </group>
    </group>
  );
}
