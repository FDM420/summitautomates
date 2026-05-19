"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  type Group,
  Line,
  LineBasicMaterial,
  type Mesh,
} from "three";

const BLUE = "#3b82f6";
const CYAN = "#4fd1ff";
const SKY = "#60a5fa";

const ROUTE_POINTS: [number, number][] = [
  [-1.0, -0.45],
  [-0.45, -0.18],
  [0.05, -0.35],
  [0.55, -0.05],
  [0.95, 0.25],
];

function MapPlatform() {
  const groupRef = useRef<Group>(null);
  const pinRefs = useRef<(Mesh | null)[]>([]);

  const routeLine = useMemo(() => {
    const positions: number[] = [];
    ROUTE_POINTS.forEach(([x, z]) => {
      positions.push(x, 0.02, z);
    });
    const geom = new BufferGeometry();
    geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
    const mat = new LineBasicMaterial({
      color: CYAN,
      transparent: true,
      opacity: 0.95,
      toneMapped: false,
    });
    return new Line(geom, mat);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    pinRefs.current.forEach((pin, i) => {
      if (!pin) return;
      pin.position.y = 0.12 + Math.abs(Math.sin(t * 1.2 + i * 0.6)) * 0.06;
    });
  });

  return (
    <group position={[0.4, -0.5, 0]} ref={groupRef} rotation={[-Math.PI / 2.6, 0, -Math.PI / 14]}>
      {/* Map base plane */}
      <mesh>
        <planeGeometry args={[2.6, 1.85]} />
        <meshStandardMaterial
          color="#06112a"
          emissive={BLUE}
          emissiveIntensity={0.15}
          metalness={0.5}
          roughness={0.55}
        />
      </mesh>

      {/* Wireframe grid overlay */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[2.6, 1.85, 14, 10]} />
        <meshBasicMaterial color={CYAN} opacity={0.35} transparent wireframe />
      </mesh>

      {/* Animated route line */}
      <primitive object={routeLine} position={[0, 0, 0.015]} />


      {/* Route dot markers */}
      {ROUTE_POINTS.map(([x, z], i) => (
        <group key={`route-${i}`} position={[x, 0.04, z]}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={CYAN} toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial
              blending={AdditiveBlending}
              color={CYAN}
              depthWrite={false}
              opacity={0.45}
              transparent
            />
          </mesh>
        </group>
      ))}

      {/* Active pins (rising slightly) */}
      {[
        [-0.45, -0.18],
        [0.55, -0.05],
        [0.95, 0.25],
      ].map(([x, z], i) => (
        <mesh
          key={`pin-${i}`}
          position={[x, 0.12, z]}
          ref={(m) => {
            pinRefs.current[i] = m;
          }}
        >
          <cylinderGeometry args={[0.07, 0.07, 0.14, 12]} />
          <meshStandardMaterial
            color={SKY}
            emissive={SKY}
            emissiveIntensity={1.1}
            metalness={0.7}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function LocationPin3D() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <Float floatIntensity={0.4} rotationIntensity={0.05} speed={1.4}>
      <group position={[1.55, 0.8, 0.5]} ref={groupRef} scale={1.55}>
        {/* Pin head (sphere) */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.5, 48, 48]} />
          <meshStandardMaterial
            color={BLUE}
            emissive={BLUE}
            emissiveIntensity={0.7}
            metalness={0.85}
            roughness={0.18}
            toneMapped={false}
          />
        </mesh>
        {/* Pin point (cone, point down) */}
        <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.44, 1.05, 48]} />
          <meshStandardMaterial
            color={BLUE}
            emissive={BLUE}
            emissiveIntensity={0.6}
            metalness={0.85}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        {/* White center circle (the "hole" inside the pin) */}
        <mesh position={[0, 0.55, 0.51]}>
          <circleGeometry args={[0.18, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
            toneMapped={false}
          />
        </mesh>
        {/* Inner hole shadow ring */}
        <mesh position={[0, 0.55, 0.5]}>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color="#0a1b3d" />
        </mesh>
        {/* Top-left highlight (specular shine) */}
        <mesh position={[-0.18, 0.78, 0.34]} rotation={[Math.PI / 4, 0.3, 0]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color="#ffffff"
            depthWrite={false}
            opacity={0.85}
            toneMapped={false}
            transparent
          />
        </mesh>
        {/* Outer aura */}
        <mesh>
          <sphereGeometry args={[1.05, 32, 32]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={CYAN}
            depthWrite={false}
            opacity={0.22}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

export function WorkforceScene3D() {
  return (
    <>
      <MapPlatform />
      <LocationPin3D />
    </>
  );
}
