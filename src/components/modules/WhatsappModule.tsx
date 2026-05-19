"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Group, type Mesh, MeshBasicMaterial } from "three";

export type ModuleProps = {
  position?: [number, number, number];
  scale?: number;
  /** When true, animations run more energetic. */
  active?: boolean;
};

const ACCENT = "#5eead4";
const ACCENT_2 = "#4fd1ff";

export function WhatsappModule({ position = [0, 0, 0], scale = 1, active = true }: ModuleProps) {
  const groupRef = useRef<Group>(null);
  const bubblesRef = useRef<Group>(null);
  const waveRefs = useRef<(Mesh | null)[]>([]);

  const bubbleMaterials = useMemo(
    () =>
      [0, 1, 2, 3, 4].map(
        () =>
          new MeshBasicMaterial({
            color: ACCENT,
            transparent: true,
            opacity: 0.9,
            blending: AdditiveBlending,
            depthWrite: false,
          }),
      ),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.22) * 0.18;
    }
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((child, i) => {
        const speed = active ? 0.45 : 0.22;
        const phase = ((t * speed + i * 0.55) % 3.6) / 3.6;
        child.position.y = -1.3 + phase * 2.8;
        const mat = bubbleMaterials[i];
        if (mat) {
          mat.opacity = phase < 0.12 ? phase / 0.12 : phase > 0.88 ? (1 - phase) / 0.12 : 0.85;
        }
      });
    }
    waveRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const energy = active ? 0.55 : 0.25;
      const h = 0.18 + Math.abs(Math.sin(t * 5 + i * 0.6)) * energy;
      mesh.scale.y = h;
      mesh.position.y = -1.65 + h / 2;
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Phone frame */}
      <Float floatIntensity={0.4} rotationIntensity={0.1} speed={0.9}>
        <group position={[0.85, 0.1, 0]}>
          <RoundedBox args={[1.0, 1.85, 0.08]} radius={0.12} smoothness={4}>
            <meshStandardMaterial
              color="#0a1224"
              emissive={ACCENT_2}
              emissiveIntensity={0.4}
              metalness={0.65}
              roughness={0.25}
            />
          </RoundedBox>
          {/* Screen */}
          <mesh position={[0, 0, 0.041]}>
            <planeGeometry args={[0.86, 1.6]} />
            <meshBasicMaterial
              color="#04101c"
              transparent
              opacity={0.95}
            />
          </mesh>
          {/* Glow rim */}
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[1.3, 2.15]} />
            <meshBasicMaterial
              blending={AdditiveBlending}
              color={ACCENT}
              depthWrite={false}
              opacity={0.18}
              transparent
            />
          </mesh>
          {/* In-screen rows */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.45 - i * 0.35, 0.05]}>
              <planeGeometry args={[0.68, 0.18]} />
              <meshBasicMaterial color={ACCENT_2} opacity={0.5 - i * 0.12} transparent />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Drifting chat bubbles from the left */}
      <group ref={bubblesRef} position={[-1.1, 0, 0]}>
        {bubbleMaterials.map((mat, i) => (
          <mesh key={i} material={mat} position={[(i % 2) * 0.18 - 0.1, -1.3, (i % 3) * 0.05]}>
            <planeGeometry args={[0.42 - (i % 2) * 0.06, 0.22]} />
          </mesh>
        ))}
      </group>

      {/* Voice waveform bars under */}
      <group position={[-1.1, -1.65, 0.2]}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            position={[i * 0.16 - 0.4, 0, 0]}
            ref={(m) => {
              waveRefs.current[i] = m;
            }}
          >
            <boxGeometry args={[0.07, 1, 0.07]} />
            <meshBasicMaterial color={ACCENT} toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Inbox tag floating above */}
      <Float floatIntensity={0.7} rotationIntensity={0.1} speed={1.4}>
        <group position={[-0.4, 1.45, 0.4]}>
          <RoundedBox args={[1.2, 0.4, 0.05]} radius={0.08} smoothness={3}>
            <meshStandardMaterial
              color="#0e1830"
              emissive={ACCENT}
              emissiveIntensity={0.45}
              metalness={0.7}
              roughness={0.2}
            />
          </RoundedBox>
        </group>
      </Float>
    </group>
  );
}
