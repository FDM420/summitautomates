"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { hexWithAlpha, SERVICE_MODULES, type ServiceModule } from "@/lib/services-config";
import { OrbitCardIcon } from "./OrbitCardIcon";

/**
 * Service cards arranged on a horizontal 3D circle (carousel).
 * The carousel rotates one step per card, pausing at the "spotlight"
 * front position, then continues to the next.
 *
 * The optional `center` slot is rendered as a flat layer UNDERNEATH the
 * carousel, deliberately OUTSIDE the preserve-3d context. Cards in the
 * front half of the orbit paint over it; cards in the back half disappear
 * via backface-visibility (their face points away from the camera). This
 * keeps the "cards pass behind the hub" depth effect without any card
 * plane ever geometrically intersecting the hub plane — plane intersection
 * inside preserve-3d is what caused z-fighting flicker on mobile GPUs.
 *
 * The whole rig is authored at desktop size and scaled down responsively
 * via the `.orbit-rig` class (see globals.css), so it never overflows
 * small viewports.
 */
export function OrbitalCards({
  radius = 280,
  center,
}: {
  radius?: number;
  center?: ReactNode;
}) {
  return (
    <div
      className="orbit-rig pointer-events-none absolute inset-0 grid place-items-center"
      style={{ perspective: "1100px" }}
    >
      {/* Center layer (the hub) — flat, non-3D, painted below the cards. */}
      {center ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2">
          {center}
        </div>
      ) : null}

      <div
        className="relative h-0 w-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Orbiting cards */}
        <div
          className="absolute left-0 top-0"
          style={{
            transformStyle: "preserve-3d",
            animation: "carousel-rotate 21s cubic-bezier(0.45, 0, 0.55, 1) infinite",
          }}
        >
          {SERVICE_MODULES.map((module, i) => {
            const angle = (i / SERVICE_MODULES.length) * 360;
            return (
              <div
                className="absolute left-0 top-0"
                key={module.slug}
                style={{
                  backfaceVisibility: "hidden",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                <OrbitCard
                  badge={`0${i + 1}`}
                  className="w-[12rem] -translate-x-1/2 -translate-y-1/2"
                  module={module}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact service card. Used on the 3D orbit (desktop/tablet) and reused
 * by the mobile hero's swipeable card row — pass sizing/positioning via
 * `className`.
 */
export function OrbitCard({
  module,
  badge,
  className = "",
}: {
  module: ServiceModule;
  badge: string;
  className?: string;
}) {
  return (
    <Link
      className={`glass-card pointer-events-auto block p-3 transition-transform hover:scale-[1.04] ${className}`}
      data-accent={module.accent}
      href={`/services/${module.slug}`}
      style={{ borderRadius: "0.95rem" }}
    >
      {/* Number badge */}
      <span
        className="absolute -top-2.5 left-3 flex h-5 w-7 items-center justify-center rounded border text-[0.6rem] font-bold tracking-wider"
        style={{
          backgroundColor: "#040817",
          borderColor: hexWithAlpha(module.hex, 0.45),
          color: module.hex,
        }}
      >
        {badge}
      </span>

      {/* Small animated SVG illustration (SMIL + CSS, all built-in) */}
      <div
        className="aspect-[16/8] w-full overflow-hidden rounded-md"
        style={{
          backgroundColor: hexWithAlpha(module.hex, 0.06),
          border: `1px solid ${hexWithAlpha(module.hex, 0.22)}`,
        }}
      >
        <OrbitCardIcon slug={module.slug} />
      </div>

      {/* Title + tagline */}
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="grid h-5 w-5 place-items-center rounded border border-white/10 bg-white/5"
          style={{ color: module.hex }}
        >
          <module.Icon className="h-3 w-3" />
        </span>
        <h3 className="text-[0.75rem] font-semibold leading-tight text-white">
          {module.shortName}
        </h3>
      </div>
      <p className="mt-1 line-clamp-2 text-[0.65rem] leading-4 text-slate-300/80">
        {module.tagline}
      </p>
    </Link>
  );
}
