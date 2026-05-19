"use client";

import { hexWithAlpha } from "@/lib/services-config";

type HoloPedestalProps = {
  /** Bottom position of the pedestal as % from top of container. Default 70. */
  topPercent?: number;
  /** Primary glow color. */
  accent: string;
  /** Secondary glow color. */
  accent2?: string;
  /** Width of pedestal as % of container. Default 78. */
  widthPercent?: number;
};

/**
 * Renders a holographic 3D-style podium at the bottom of its parent container.
 * Uses CSS ellipses + radial gradients + light beams to fake real 3D pedestal feel.
 * Parent must be position: relative.
 */
export function HoloPedestal({
  topPercent = 70,
  accent,
  accent2 = "#4fd1ff",
  widthPercent = 78,
}: HoloPedestalProps) {
  const accentDim = hexWithAlpha(accent, 0.65);
  const accentSoft = hexWithAlpha(accent, 0.22);
  const accent2Soft = hexWithAlpha(accent2, 0.45);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 -translate-x-1/2"
      style={{ top: `${topPercent}%`, width: `${widthPercent}%`, height: "30%" }}
    >
      {/* Outer floor halo */}
      <div
        className="absolute left-1/2 top-[18%] h-[180%] w-[120%] -translate-x-1/2 rounded-[50%] blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, ${accentSoft} 0%, transparent 70%)`,
        }}
      />

      {/* Concentric platform rings (from largest at bottom to smallest at top) */}
      {[0, 1, 2].map((i) => {
        const widthScale = 1 - i * 0.12;
        const heightOffset = i * 6;
        const opacity = 0.4 + i * 0.18;
        return (
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border"
            key={i}
            style={{
              top: `${20 + heightOffset}%`,
              width: `${100 * widthScale}%`,
              height: `${16 + i * 1.5}%`,
              borderColor: hexWithAlpha(accent2, opacity),
              borderWidth: i === 2 ? 2 : 1,
              boxShadow: `0 0 ${24 - i * 4}px ${hexWithAlpha(accent2, 0.5 - i * 0.08)}, inset 0 0 ${10 - i * 2}px ${hexWithAlpha(accent2, 0.3)}`,
            }}
          />
        );
      })}

      {/* Top platform surface (brightest ring — this is the "floor" the objects sit on) */}
      <div
        className="absolute left-1/2 top-[18%] h-[6%] w-[78%] -translate-x-1/2 rounded-[50%]"
        style={{
          background: `radial-gradient(ellipse at center, ${accent2Soft} 0%, ${hexWithAlpha(accent, 0.15)} 60%, transparent 100%)`,
          boxShadow: `0 0 40px ${hexWithAlpha(accent2, 0.55)}, inset 0 1px 0 ${hexWithAlpha("#ffffff", 0.18)}`,
        }}
      />
      {/* Bright top ring edge */}
      <div
        className="absolute left-1/2 top-[19%] h-[3%] w-[78%] -translate-x-1/2 rounded-[50%] border-2"
        style={{
          borderColor: accentDim,
          boxShadow: `0 0 22px ${hexWithAlpha(accent2, 0.7)}`,
          background: `linear-gradient(180deg, ${hexWithAlpha(accent2, 0.18)}, transparent)`,
        }}
      />

      {/* Light beams rising from edge (8 around the perimeter) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI;
        const x = 50 + Math.cos(angle) * 39;
        return (
          <span
            className="absolute bottom-[78%] block w-[2px] rounded-full"
            key={i}
            style={{
              left: `${x}%`,
              height: "40%",
              background: `linear-gradient(to top, ${hexWithAlpha(accent2, 0.65)}, transparent)`,
              boxShadow: `0 0 8px ${hexWithAlpha(accent2, 0.7)}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}

      {/* Center bright spot */}
      <div
        className="absolute left-1/2 top-[19%] h-2 w-[40%] -translate-x-1/2 rounded-full"
        style={{
          background: accent2,
          boxShadow: `0 0 30px ${accent2}, 0 0 60px ${hexWithAlpha(accent2, 0.6)}`,
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}
