"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { hexWithAlpha, SERVICE_MODULES, type ServiceModule } from "@/lib/services-config";
import { OrbitCardIcon } from "./OrbitCardIcon";

/**
 * 5 service cards arranged on a horizontal 3D circle (carousel).
 * The carousel rotates -72° per step, pausing ~1s at each card so it sits
 * at the "spotlight" front position, then continues to the next.
 *
 * The optional `center` slot is rendered as a flat plane at translateZ(0)
 * inside the SAME preserve-3d context as the orbiting cards. That gives
 * proper 3D occlusion — cards in front of the hub appear on top of it,
 * cards behind get partially hidden by the hub. True holographic depth.
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
      className="pointer-events-none absolute inset-0 grid place-items-center"
      style={{ perspective: "1100px" }}
    >
      <div
        className="relative h-0 w-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Center plane (the brain/hub) — flat at z=0, doesn't rotate.
            Lives inside the same preserve-3d context so cards orbit
            around AND through its z plane. */}
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
                <OrbitCard badge={`0${i + 1}`} module={module} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrbitCard({ module, badge }: { module: ServiceModule; badge: string }) {
  return (
    <Link
      className="glass-card pointer-events-auto block w-[12rem] -translate-x-1/2 -translate-y-1/2 p-3 transition-transform hover:scale-[1.04]"
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
