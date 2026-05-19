"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, type Group } from "three";

function createSphereNodes(count: number, radius: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const ratio = index / count;
    const inclination = Math.acos(1 - 2 * ratio);
    const azimuth = Math.PI * (1 + Math.sqrt(5)) * index;
    const x = radius * Math.sin(inclination) * Math.cos(azimuth);
    const y = radius * Math.cos(inclination);
    const z = radius * Math.sin(inclination) * Math.sin(azimuth);

    positions[index * 3] = x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;
  }

  return positions;
}

function createRing(radius: number, plane: "x" | "y" | "z") {
  const segments = 96;
  const positions = new Float32Array((segments + 1) * 3);

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const a = Math.cos(angle) * radius;
    const b = Math.sin(angle) * radius;

    if (plane === "x") {
      positions[index * 3] = 0;
      positions[index * 3 + 1] = a;
      positions[index * 3 + 2] = b;
    }

    if (plane === "y") {
      positions[index * 3] = a;
      positions[index * 3 + 1] = 0;
      positions[index * 3 + 2] = b;
    }

    if (plane === "z") {
      positions[index * 3] = a;
      positions[index * 3 + 1] = b;
      positions[index * 3 + 2] = 0;
    }
  }

  return positions;
}

const NODE_POSITIONS = createSphereNodes(84, 1.5);
const OUTER_RING_X = createRing(1.9, "x");
const OUTER_RING_Y = createRing(2.1, "y");
const OUTER_RING_Z = createRing(1.75, "z");

export function NetworkModel() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.16;
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#4fd1ff" transparent opacity={0.08} wireframe />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[NODE_POSITIONS, 3]} />
        </bufferGeometry>
        <pointsMaterial
          blending={AdditiveBlending}
          color="#8bf6ff"
          depthWrite={false}
          opacity={0.95}
          size={0.06}
          sizeAttenuation
          transparent
        />
      </points>

      {[OUTER_RING_X, OUTER_RING_Y, OUTER_RING_Z].map((ring, index) => (
        <lineLoop key={index}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ring, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#4fd1ff" opacity={0.18} transparent />
        </lineLoop>
      ))}

      <mesh scale={0.26}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#7c82ff" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export function NetworkCanvas() {
  return (
    <Canvas camera={{ fov: 42, position: [0, 0, 4.6] }} dpr={[1, 1.6]}>
      <ambientLight intensity={1.1} />
      <pointLight color="#7c82ff" intensity={22} position={[-2.5, -1.5, 2.5]} />
      <pointLight color="#8bf6ff" intensity={26} position={[3, 2.5, 3]} />
      <NetworkModel />
    </Canvas>
  );
}