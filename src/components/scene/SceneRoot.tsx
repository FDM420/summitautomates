"use client";

import { Environment } from "@react-three/drei";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Suspense, type ReactNode } from "react";
import { ACESFilmicToneMapping } from "three";

type SceneRootProps = {
  children: ReactNode;
  /** Camera position [x, y, z]. Default: [0, 0.4, 6]. */
  cameraPosition?: [number, number, number];
  /** Field of view in degrees. Default 42. */
  fov?: number;
  /** Pass-through to Canvas dpr (device pixel ratio clamp). Default [1, 1.8]. */
  dpr?: CanvasProps["dpr"];
  /** Enable postprocessing bloom. Default true. */
  bloom?: boolean;
  /** Override bloom intensity. */
  bloomIntensity?: number;
  /** Apply vignette darkening at corners. Default true (adds cinematic feel). */
  vignette?: boolean;
  /** drei Environment preset for HDRI reflections. Default "city". */
  envPreset?: "city" | "sunset" | "dawn" | "night" | "warehouse" | "studio";
  /** Optional className on the wrapping <Canvas>. */
  className?: string;
};

export function SceneRoot({
  children,
  cameraPosition = [0, 0.4, 6],
  fov = 42,
  dpr = [1, 1.8],
  bloom = true,
  bloomIntensity = 1.1,
  vignette = true,
  envPreset = "city",
  className,
}: SceneRootProps) {
  return (
    <Canvas
      camera={{ fov, position: cameraPosition }}
      className={className}
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
      }}
    >
      <color args={["#040817"]} attach="background" />
      <fog args={["#040817", 8, 26]} attach="fog" />

      {/* Layered lighting rig */}
      <ambientLight intensity={0.35} />
      <pointLight color="#f4dd95" intensity={42} position={[-4.5, -2, 3]} />
      <pointLight color="#e9c878" intensity={48} position={[4.5, 3.5, 3]} />
      <pointLight color="#d4af5a" intensity={22} position={[0, 4.5, -2.5]} />
      {/* Rim light from below for pedestal feel */}
      <pointLight color="#e9c878" intensity={28} position={[0, -3, 1]} />

      <Suspense fallback={null}>
        {/* HDRI environment for glossy reflections (this is the key 3D-look upgrade) */}
        <Environment preset={envPreset} environmentIntensity={0.6} />
        {children}
      </Suspense>

      {bloom ? (
        <EffectComposer>
          <Bloom
            intensity={bloomIntensity}
            luminanceSmoothing={0.6}
            luminanceThreshold={0.15}
            mipmapBlur
          />
          {vignette ? (
            <Vignette blendFunction={BlendFunction.NORMAL} darkness={0.65} eskil={false} offset={0.18} />
          ) : (
            <></>
          )}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
