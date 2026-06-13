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
 * The optional `center` slot (the AI hub) is rendered at translateZ(0)
 * INSIDE the same preserve-3d context as the cards, giving true 3D
 * occlusion: cards orbit around and pass behind the hub. This is the
 * desktop/tablet experience only — phones render a separate flat hero
 * (hub + swipeable card row) in HeroSection, so this 3D rig never runs on
 * the mobile GPUs that were prone to z-fighting flicker.
 *
 * The whole rig is authored at desktop size and scaled down responsively
 * via the `.orbit-rig` class (see globals.css), so it never overflows
 * its container.
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
      <div
        className="relative h-0 w-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Center plane (the hub) — flat at z=0 but INSIDE the same
            preserve-3d context as the cards, so the carousel orbits around
            AND passes behind it for true holographic depth. The hub disc's
            opaque centre occludes back-half cards (they "emerge from behind
            the wheel" at the rim). */}
        {center ? (
          <div
            className="pointer-events-none absolute left-0 top-0"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(0px)" }}
          >
            {center}
          </div>
        ) : null}

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
                  transformStyle: "preserve-3d",
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
          backgroundColor: "var(--surface)",
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
          className="grid h-5 w-5 place-items-center rounded border border-hair bg-overlay"
          style={{ color: module.hex }}
        >
          <module.Icon className="h-3 w-3" />
        </span>
        <h3 className="text-[0.75rem] font-semibold leading-tight text-ink">
          {module.shortName}
        </h3>
      </div>
      <p className="mt-1 line-clamp-2 text-[0.65rem] leading-4 text-muted">
        {module.tagline}
      </p>
    </Link>
  );
}
