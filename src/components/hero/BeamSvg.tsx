"use client";

import { SERVICE_MODULES } from "@/lib/services-config";

type Point = { x: number; y: number };

const HUB: Point = { x: 50, y: 50 };

const ENDPOINTS: Point[] = [
  { x: 50, y: 8 },
  { x: 86, y: 36 },
  { x: 86, y: 80 },
  { x: 14, y: 80 },
  { x: 14, y: 36 },
];

function path(from: Point, to: Point) {
  // gentle quadratic curve toward the midpoint, biased slightly outward
  const midX = (from.x + to.x) / 2 + (to.x - from.x) * 0.06;
  const midY = (from.y + to.y) / 2 + (to.y - from.y) * 0.05 - 4;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}

type BeamSvgProps = {
  /** Slug to highlight; brightens its beam and dims the rest. */
  focusedSlug?: string | null;
};

export function BeamSvg({ focusedSlug }: BeamSvgProps) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <filter height="200%" id="beam-glow" width="200%" x="-50%" y="-50%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {SERVICE_MODULES.map((m) => (
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={`beam-grad-${m.slug}`}
            key={m.slug}
            x1={HUB.x}
            x2={ENDPOINTS[SERVICE_MODULES.indexOf(m)]?.x ?? 50}
            y1={HUB.y}
            y2={ENDPOINTS[SERVICE_MODULES.indexOf(m)]?.y ?? 50}
          >
            <stop offset="0%" stopColor="#4fd1ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor={m.hex} stopOpacity="0.95" />
          </linearGradient>
        ))}
      </defs>

      {SERVICE_MODULES.map((m, i) => {
        const target = ENDPOINTS[i];
        if (!target) return null;
        const isFocused = focusedSlug === m.slug;
        const dim = focusedSlug !== null && focusedSlug !== undefined && !isFocused;
        const d = path(HUB, target);
        return (
          <g key={m.slug} style={{ opacity: dim ? 0.32 : 1, transition: "opacity 0.3s ease" }}>
            {/* underglow */}
            <path
              d={d}
              fill="none"
              filter="url(#beam-glow)"
              stroke={m.hex}
              strokeOpacity={isFocused ? 0.55 : 0.32}
              strokeWidth="0.9"
            />
            {/* solid line */}
            <path
              d={d}
              fill="none"
              stroke={`url(#beam-grad-${m.slug})`}
              strokeDasharray="0.8 1.2"
              strokeLinecap="round"
              strokeWidth="0.35"
            >
              <animate
                attributeName="stroke-dashoffset"
                dur={isFocused ? "1.4s" : "2.4s"}
                from="0"
                repeatCount="indefinite"
                to="-12"
              />
            </path>
            {/* anchor dots */}
            <circle cx={HUB.x} cy={HUB.y} fill={m.hex} r="0.4" />
            <circle cx={target.x} cy={target.y} fill={m.hex} r="0.6" />
          </g>
        );
      })}
    </svg>
  );
}

export const HERO_ENDPOINTS = ENDPOINTS;
