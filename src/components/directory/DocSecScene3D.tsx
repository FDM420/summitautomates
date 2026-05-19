"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, ExtrudeGeometry, type Group, Shape } from "three";

const TEAL = "#34d8a4";
const CYAN = "#4fd1ff";
const SLATE = "#475569";

function shieldShape(): Shape {
  const s = new Shape();
  const w = 0.7;
  s.moveTo(0, 1);
  s.bezierCurveTo(w, 1, w, 0.4, w * 0.95, 0);
  s.bezierCurveTo(w * 0.9, -0.4, w * 0.5, -0.95, 0, -1.05);
  s.bezierCurveTo(-w * 0.5, -0.95, -w * 0.9, -0.4, -w * 0.95, 0);
  s.bezierCurveTo(-w, 0.4, -w, 1, 0, 1);
  return s;
}

function Shield3D() {
  const groupRef = useRef<Group>(null);
  const geom = useMemo(() => {
    const shape = shieldShape();
    const g = new ExtrudeGeometry(shape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    g.center();
    return g;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.18;
  });

  return (
    <Float floatIntensity={0.4} rotationIntensity={0.04} speed={1.1}>
      <group position={[0, 0.1, 0]} ref={groupRef} scale={0.95}>
        {/* Shield body */}
        <mesh geometry={geom}>
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.7}
            metalness={0.85}
            roughness={0.22}
            toneMapped={false}
          />
        </mesh>
        {/* Checkmark — using boxes (two angled blocks) */}
        <group position={[-0.18, 0.05, 0.32]} rotation={[0, 0, -Math.PI / 4]}>
          <mesh>
            <boxGeometry args={[0.12, 0.55, 0.12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              metalness={0.4}
              roughness={0.25}
              toneMapped={false}
            />
          </mesh>
        </group>
        <group position={[0.16, 0.12, 0.32]} rotation={[0, 0, Math.PI / 5]}>
          <mesh>
            <boxGeometry args={[0.12, 0.85, 0.12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
              metalness={0.4}
              roughness={0.25}
              toneMapped={false}
            />
          </mesh>
        </group>
        {/* Outer aura */}
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={TEAL}
            depthWrite={false}
            opacity={0.16}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

function Padlock3D() {
  return (
    <Float floatIntensity={0.5} rotationIntensity={0.08} speed={1.3}>
      <group position={[1.45, -0.25, 0.4]} scale={0.65}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.9, 0.8, 0.4]} />
          <meshStandardMaterial
            color={SLATE}
            emissive="#1e293b"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        {/* Shackle */}
        <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.07, 16, 24, Math.PI]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
        {/* Keyhole */}
        <mesh position={[0, -0.05, 0.21]}>
          <circleGeometry args={[0.13, 24]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
      </group>
    </Float>
  );
}

function OcrDocument3D() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.04;
  });

  return (
    <Float floatIntensity={0.3} rotationIntensity={0.04} speed={1.0}>
      <group position={[-1.45, 0.2, 0.4]} ref={groupRef} rotation={[0, 0.2, -0.08]}>
        {/* Document page */}
        <mesh>
          <boxGeometry args={[0.95, 1.3, 0.04]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.5} />
        </mesh>
        {/* Lines of text on the document (small dark planes) */}
        {[0.45, 0.35, 0.25, 0.15, 0.05, -0.05, -0.15, -0.25, -0.4].map((y, i) => (
          <mesh key={y} position={[0, y, 0.025]}>
            <planeGeometry args={[0.7 - (i % 3) * 0.1, 0.04]} />
            <meshBasicMaterial color="#cbd5e1" />
          </mesh>
        ))}
        {/* OCR label */}
        <mesh position={[0, -0.55, 0.03]}>
          <planeGeometry args={[0.32, 0.14]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
        {/* Glow */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[1.3, 1.6]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={CYAN}
            depthWrite={false}
            opacity={0.18}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

export function DocSecScene3D() {
  return (
    <>
      <OcrDocument3D />
      <Shield3D />
      <Padlock3D />
    </>
  );
}
