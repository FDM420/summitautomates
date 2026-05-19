"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, type Group, type Mesh } from "three";

const VIOLET = "#7c82ff";
const VIOLET_LIGHT = "#a78bfa";
const TEAL = "#34d8a4";
const CYAN = "#4fd1ff";

function CvDocument() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.18;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
  });

  return (
    <Float floatIntensity={0.4} rotationIntensity={0.05} speed={1.0}>
      <group position={[-0.15, 0.55, 0]} ref={groupRef} scale={1.05}>
        {/* CV paper (tall box) */}
        <RoundedBox args={[1.05, 1.45, 0.08]} radius={0.06} smoothness={3}>
          <meshStandardMaterial
            color="#f8fafc"
            emissive="#ffffff"
            emissiveIntensity={0.08}
            metalness={0.15}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Avatar circle on top of CV */}
        <mesh position={[-0.28, 0.42, 0.05]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={VIOLET}
            emissive={VIOLET}
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.22}
            toneMapped={false}
          />
        </mesh>

        {/* Text lines on CV (small dark boxes) */}
        {[0.05, 0.0, -0.08, -0.16, -0.26, -0.36, -0.46].map((y, i) => (
          <mesh key={y} position={[0.05, y, 0.05]}>
            <boxGeometry args={[0.75 - (i % 2) * 0.12, 0.04, 0.01]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.1} roughness={0.6} />
          </mesh>
        ))}

        {/* Verified checkmark badge */}
        <Float floatIntensity={0.5} rotationIntensity={0.1} speed={1.5}>
          <group position={[0.55, -0.55, 0.18]}>
            <mesh>
              <sphereGeometry args={[0.18, 32, 32]} />
              <meshStandardMaterial
                color={TEAL}
                emissive={TEAL}
                emissiveIntensity={0.95}
                metalness={0.7}
                roughness={0.22}
                toneMapped={false}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.32, 24, 24]} />
              <meshBasicMaterial
                blending={AdditiveBlending}
                color={TEAL}
                depthWrite={false}
                opacity={0.35}
                transparent
              />
            </mesh>
          </group>
        </Float>

        {/* Outer aura */}
        <mesh>
          <sphereGeometry args={[1.45, 32, 32]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={VIOLET}
            depthWrite={false}
            opacity={0.1}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

function PipelineBlocks() {
  const blockRefs = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    blockRefs.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = -1.05 + Math.sin(t * 1.2 + i * 0.8) * 0.05;
    });
  });

  const stages = [
    { color: VIOLET, x: -1.6 },
    { color: VIOLET_LIGHT, x: -0.55 },
    { color: CYAN, x: 0.5 },
    { color: TEAL, x: 1.55 },
  ];

  return (
    <>
      {stages.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, -1.05, 0.6]}
          ref={(m) => {
            blockRefs.current[i] = m;
          }}
        >
          <boxGeometry args={[0.78, 0.36, 0.18]} />
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={i === stages.length - 1 ? 0.9 : 0.55}
            metalness={0.78}
            roughness={0.22}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

export function RecruitmentScene3D() {
  return (
    <>
      <CvDocument />
      <PipelineBlocks />
    </>
  );
}
