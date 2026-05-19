"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Group, type Mesh, Shape } from "three";
import type { ModuleProps } from "./WhatsappModule";

const ACCENT = "#f5c46b";
const ACCENT_2 = "#fcd34d";

function makeShieldShape(): Shape {
  const s = new Shape();
  // shield silhouette — top wide, curved bottom point
  const w = 0.7;
  s.moveTo(0, 1);
  s.bezierCurveTo(w, 1, w, 0.4, w * 0.95, 0);
  s.bezierCurveTo(w * 0.9, -0.4, w * 0.5, -0.95, 0, -1.05);
  s.bezierCurveTo(-w * 0.5, -0.95, -w * 0.9, -0.4, -w * 0.95, 0);
  s.bezierCurveTo(-w, 0.4, -w, 1, 0, 1);
  return s;
}

export function DocSecurityModule({ position = [0, 0, 0], scale = 1, active = true }: ModuleProps) {
  const groupRef = useRef<Group>(null);
  const shieldRef = useRef<Group>(null);
  const scannerRef = useRef<Mesh>(null);
  const ringRefs = useRef<(Mesh | null)[]>([]);
  const auditRefs = useRef<(Group | null)[]>([]);

  const shieldShape = useMemo(() => makeShieldShape(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.14;
    if (shieldRef.current) {
      const s = 1 + Math.sin(t * 1.1) * 0.04;
      shieldRef.current.scale.setScalar(s);
    }
    ringRefs.current.forEach((m, i) => {
      if (!m) return;
      const cycle = ((t * (active ? 0.55 : 0.3) + i * 0.45) % 1.6) / 1.6;
      const r = 0.85 + cycle * 1.1;
      m.scale.setScalar(r);
      const mat = m.material as { opacity?: number };
      if (mat && typeof mat.opacity !== "undefined") {
        mat.opacity = (1 - cycle) * 0.55;
      }
    });
    if (scannerRef.current) {
      const cycle = active ? 1.0 : 0.4;
      scannerRef.current.position.y = ((t * cycle) % 1.6) - 0.85;
    }
    auditRefs.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = -0.85 + i * 0.22 + Math.sin(t * 1.1 + i) * 0.03;
    });
  });

  return (
    <group position={position} ref={groupRef} scale={scale}>
      {/* Center shield */}
      <group position={[0, 0.15, 0]} ref={shieldRef}>
        <mesh>
          <extrudeGeometry args={[shieldShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.04, bevelSegments: 4 }]} />
          <meshStandardMaterial
            color="#1c1308"
            emissive={ACCENT}
            emissiveIntensity={0.55}
            metalness={0.85}
            roughness={0.18}
          />
        </mesh>
        {/* Lock dot on shield */}
        <mesh position={[0, 0.1, 0.18]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color="#11161c"
            emissive={ACCENT_2}
            emissiveIntensity={1.0}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Concentric rings expanding */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.15, -0.05]} ref={(m) => { ringRefs.current[i] = m; }}>
          <torusGeometry args={[0.95, 0.015, 8, 64]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ACCENT}
            depthWrite={false}
            opacity={0.55}
            transparent
          />
        </mesh>
      ))}

      {/* Document plane to the left being scanned */}
      <group position={[-1.5, 0.1, 0]}>
        <mesh>
          <planeGeometry args={[0.9, 1.3]} />
          <meshStandardMaterial
            color="#0c1230"
            emissive={ACCENT}
            emissiveIntensity={0.25}
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>
        {/* Field lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 0.5 - i * 0.18, 0.01]}>
            <planeGeometry args={[0.66 - (i % 2) * 0.1, 0.045]} />
            <meshBasicMaterial color={ACCENT_2} opacity={0.6 - i * 0.08} transparent />
          </mesh>
        ))}
        {/* Scanner sweep */}
        <mesh position={[0, 0, 0.02]} ref={scannerRef}>
          <planeGeometry args={[1.0, 0.05]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={ACCENT_2}
            depthWrite={false}
            opacity={0.95}
            transparent
          />
        </mesh>
      </group>

      {/* Audit trail blocks on the right */}
      <group position={[1.45, 0, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group
            key={i}
            position={[0, -0.85 + i * 0.22, 0]}
            ref={(g) => { auditRefs.current[i] = g; }}
          >
            <RoundedBox args={[0.85, 0.16, 0.06]} radius={0.04} smoothness={3}>
              <meshStandardMaterial
                color="#1a1208"
                emissive={ACCENT}
                emissiveIntensity={0.4 - i * 0.05}
                metalness={0.7}
                roughness={0.25}
              />
            </RoundedBox>
            <mesh position={[-0.32, 0, 0.04]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color={ACCENT_2} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <Float floatIntensity={0.5} rotationIntensity={0.1} speed={1.2}>
          <group position={[0, 0.55, 0.2]}>
            <RoundedBox args={[0.9, 0.32, 0.05]} radius={0.06} smoothness={3}>
              <meshStandardMaterial
                color="#1c1308"
                emissive={ACCENT}
                emissiveIntensity={0.6}
                metalness={0.7}
                roughness={0.2}
              />
            </RoundedBox>
          </group>
        </Float>
      </group>
    </group>
  );
}
