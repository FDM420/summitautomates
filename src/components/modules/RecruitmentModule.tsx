"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, type Group, type Mesh } from "three";
import type { ModuleProps } from "./WhatsappModule";

const ACCENT = "#7c82ff";
const ACCENT_2 = "#a855f7";

const PIPELINE_LABELS = ["Shortlisted", "Missing Docs", "Interview", "Selected"] as const;

export function RecruitmentModule({ position = [0, 0, 0], scale = 1, active = true }: ModuleProps) {
  const groupRef = useRef<Group>(null);
  const scannerRef = useRef<Mesh>(null);
  const papersRef = useRef<Group>(null);
  const pipelineRefs = useRef<(Group | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.16;
    }
    if (scannerRef.current) {
      const cycle = active ? 1.6 : 0.6;
      scannerRef.current.position.y = ((t * cycle) % 2.6) - 1.3;
    }
    if (papersRef.current) {
      papersRef.current.rotation.z = Math.sin(t * 0.4) * 0.05;
    }
    pipelineRefs.current.forEach((g, i) => {
      if (!g) return;
      const lift = 0.06 * Math.sin(t * (1 + i * 0.2) + i);
      g.position.y = -0.2 + i * 0.35 + lift;
    });
  });

  return (
    <group position={position} ref={groupRef} scale={scale}>
      {/* CV stack on the left */}
      <group position={[-1.2, 0, 0]} ref={papersRef}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[i * 0.05, i * 0.06 - 0.25, -i * 0.03]}
            rotation={[0, Math.PI / 32, i * 0.02]}
          >
            <boxGeometry args={[0.8, 1.05, 0.02]} />
            <meshStandardMaterial
              color="#0c1230"
              emissive={ACCENT}
              emissiveIntensity={0.35 + i * 0.05}
              metalness={0.55}
              roughness={0.3}
            />
          </mesh>
        ))}
        {/* Field lines on the top paper */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={`row-${i}`} position={[0.2, 0.3 - i * 0.15, 0.02]}>
            <planeGeometry args={[0.55, 0.04]} />
            <meshBasicMaterial color={ACCENT_2} opacity={0.7 - i * 0.12} transparent />
          </mesh>
        ))}
      </group>

      {/* Scanner bar sweeping through the CV area */}
      <mesh position={[-1.2, 0, 0.1]} ref={scannerRef}>
        <planeGeometry args={[1.1, 0.04]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={ACCENT_2}
          depthWrite={false}
          opacity={0.9}
          transparent
        />
      </mesh>
      {/* Scanner glow plane */}
      <mesh position={[-1.2, 0, 0.05]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color={ACCENT}
          depthWrite={false}
          opacity={0.1}
          transparent
        />
      </mesh>

      {/* Pipeline cards on the right */}
      <group position={[0.95, 0, 0]}>
        {PIPELINE_LABELS.map((label, i) => (
          <group
            key={label}
            position={[0, -0.2 + i * 0.35, 0]}
            ref={(g) => {
              pipelineRefs.current[i] = g;
            }}
          >
            <RoundedBox args={[1.05, 0.28, 0.04]} radius={0.07} smoothness={3}>
              <meshStandardMaterial
                color="#0d1432"
                emissive={ACCENT}
                emissiveIntensity={0.35}
                metalness={0.7}
                roughness={0.22}
              />
            </RoundedBox>
            {/* Indicator dot */}
            <mesh position={[-0.42, 0, 0.025]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshBasicMaterial color={ACCENT_2} toneMapped={false} />
            </mesh>
            {/* Faint label bar */}
            <mesh position={[0.1, 0, 0.025]}>
              <planeGeometry args={[0.55, 0.06]} />
              <meshBasicMaterial color={ACCENT} opacity={0.5} transparent />
            </mesh>
          </group>
        ))}
      </group>

      {/* Floating "AI Scan" badge */}
      <Float floatIntensity={0.7} rotationIntensity={0.1} speed={1.3}>
        <group position={[-0.05, 1.35, 0.3]}>
          <RoundedBox args={[0.95, 0.32, 0.04]} radius={0.06} smoothness={3}>
            <meshStandardMaterial
              color="#0e1830"
              emissive={ACCENT}
              emissiveIntensity={0.6}
              metalness={0.7}
              roughness={0.2}
            />
          </RoundedBox>
        </group>
      </Float>
    </group>
  );
}
