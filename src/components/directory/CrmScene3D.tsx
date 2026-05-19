"use client";

import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, type Group, type Mesh } from "three";

const BLUE = "#3b82f6";
const CYAN = "#4fd1ff";
const VIOLET = "#7c82ff";
const TEAL = "#34d8a4";

function Funnel3D() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.2;
  });

  return (
    <Float floatIntensity={0.35} rotationIntensity={0.04} speed={1.1}>
      <group position={[0.1, -0.2, 0]} ref={groupRef} scale={1.05}>
        {/* Top wide section */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[1.1, 0.65, 0.55, 48, 1, true]} />
          <meshStandardMaterial
            color={BLUE}
            emissive={BLUE}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.25}
            side={2}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Middle section */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.65, 0.35, 0.65, 48, 1, true]} />
          <meshStandardMaterial
            color={BLUE}
            emissive={BLUE}
            emissiveIntensity={0.55}
            metalness={0.6}
            roughness={0.25}
            side={2}
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Bottom narrow section */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.35, 0.18, 0.45, 48, 1, true]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.25}
            side={2}
            toneMapped={false}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Spout at bottom */}
        <mesh position={[0, -0.78, 0]}>
          <boxGeometry args={[0.32, 0.18, 0.32]} />
          <meshStandardMaterial
            color={CYAN}
            emissive={CYAN}
            emissiveIntensity={0.85}
            metalness={0.7}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>

        {/* Top opening rim glow */}
        <mesh position={[0, 1.13, 0]}>
          <torusGeometry args={[1.1, 0.025, 12, 64]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} />
        </mesh>

        {/* Bottom rim glow */}
        <mesh position={[0, -0.62, 0]}>
          <torusGeometry args={[0.18, 0.018, 12, 32]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} />
        </mesh>

        {/* Aura around funnel */}
        <mesh>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={BLUE}
            depthWrite={false}
            opacity={0.08}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

function LeadDrops() {
  const meshes = useRef<(Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const phase = ((t * 0.55 + i * 0.7) % 2.4) / 2.4;
      m.position.y = 1.7 - phase * 2.6;
      m.position.x = (i - 1) * 0.2;
      const mat = m.material as { opacity?: number };
      if (mat && typeof mat.opacity !== "undefined") {
        mat.opacity = phase < 0.12 ? phase / 0.12 : phase > 0.88 ? (1 - phase) / 0.12 : 0.95;
      }
    });
  });

  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[0, 1.7, 0]}
          ref={(m) => {
            meshes.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            blending={AdditiveBlending}
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={1.5}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </>
  );
}

function AiBadge() {
  return (
    <Float floatIntensity={0.5} rotationIntensity={0.1} speed={1.4}>
      <group position={[1.7, 1.05, 0.3]}>
        <mesh>
          <boxGeometry args={[0.55, 0.55, 0.18]} />
          <meshStandardMaterial
            color={VIOLET}
            emissive={VIOLET}
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <Text
          anchorX="center"
          anchorY="middle"
          color="#ffffff"
          fontSize={0.18}
          letterSpacing={0.08}
          position={[0, 0, 0.1]}
        >
          AI
        </Text>
        <mesh>
          <sphereGeometry args={[0.65, 24, 24]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={VIOLET}
            depthWrite={false}
            opacity={0.3}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

function CheckmarkBadge() {
  return (
    <Float floatIntensity={0.3} rotationIntensity={0.05} speed={1.2}>
      <group position={[0, -1.05, 0.4]}>
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={1.0}
            metalness={0.7}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.5, 24, 24]} />
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
  );
}

export function CrmScene3D() {
  return (
    <>
      <LeadDrops />
      <Funnel3D />
      <CheckmarkBadge />
      <AiBadge />
    </>
  );
}
