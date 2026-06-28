"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, type Group, type Mesh } from "three";

type HubCoreProps = {
  /** Overall scale. Default 1. */
  size?: number;
  /** Display the "AI" label on the core. Default true. */
  showLabel?: boolean;
  /** Override the label text. */
  label?: string;
};

export function HubCore({ size = 1, showLabel = true, label = "AI" }: HubCoreProps) {
  const coreGroup = useRef<Group>(null);
  const coreInner = useRef<Mesh>(null);
  const pedestalRing = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreGroup.current) {
      coreGroup.current.rotation.y += delta * 0.22;
    }
    if (coreInner.current) {
      const s = 1 + Math.sin(t * 1.1) * 0.05;
      coreInner.current.scale.setScalar(s);
    }
    if (pedestalRing.current) {
      const mat = pedestalRing.current.material as { opacity?: number };
      if (mat && typeof mat.opacity !== "undefined") {
        mat.opacity = 0.7 + Math.sin(t * 1.6) * 0.25;
      }
    }
  });

  return (
    <group scale={size}>
      {/* Pedestal base disc */}
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[1.45, 1.65, 0.2, 80]} />
        <meshStandardMaterial
          color="#040a18"
          emissive="#1c3568"
          emissiveIntensity={0.55}
          metalness={0.75}
          roughness={0.32}
        />
      </mesh>

      {/* Pedestal top trim ring */}
      <mesh position={[0, -0.95, 0]} ref={pedestalRing} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.45, 0.025, 12, 96]} />
        <meshBasicMaterial color="#e9c878" depthWrite={false} toneMapped={false} transparent />
      </mesh>

      {/* Soft halo above pedestal */}
      <mesh position={[0, -0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.7, 64]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#e9c878"
          depthWrite={false}
          opacity={0.22}
          side={2}
          transparent
        />
      </mesh>

      {/* Light beams shooting upward from pedestal edge */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.45;
        const z = Math.sin(angle) * 1.45;
        return (
          <mesh key={i} position={[x, -0.4, z]}>
            <cylinderGeometry args={[0.03, 0.005, 1.2, 8]} />
            <meshBasicMaterial
              blending={AdditiveBlending}
              color="#e9c878"
              depthWrite={false}
              opacity={0.55}
              transparent
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Hexagonal AI core */}
      <group position={[0, 0.05, 0]} ref={coreGroup}>
        <mesh ref={coreInner}>
          <cylinderGeometry args={[0.62, 0.62, 0.78, 6]} />
          <meshStandardMaterial
            color="#0c1632"
            emissive="#e9c878"
            emissiveIntensity={1.7}
            metalness={0.85}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        {/* Wireframe overlay for crisp hex edges */}
        <mesh>
          <cylinderGeometry args={[0.62, 0.62, 0.78, 6]} />
          <meshBasicMaterial
            color="#d4af5a"
            opacity={0.55}
            toneMapped={false}
            transparent
            wireframe
          />
        </mesh>

        {/* Top and bottom hex face accents */}
        <mesh position={[0, 0.39, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.012, 6]} />
          <meshBasicMaterial color="#f4dd95" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.39, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.012, 6]} />
          <meshBasicMaterial color="#f4dd95" toneMapped={false} />
        </mesh>
      </group>

      {/* "AI" label */}
      {showLabel ? (
        <Text
          anchorX="center"
          anchorY="middle"
          color="#ffffff"
          fontSize={0.36}
          letterSpacing={0.08}
          position={[0, 0.05, 0.66]}
        >
          {label}
        </Text>
      ) : null}

      {/* Outer faint glow */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          color="#e9c878"
          depthWrite={false}
          opacity={0.06}
          transparent
        />
      </mesh>
    </group>
  );
}
