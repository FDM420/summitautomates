"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { hexWithAlpha, SERVICE_MODULES, type ServiceModule } from "@/lib/services-config";
import { OrbitCardIcon } from "./OrbitCardIcon";

/**
 * Spotlight + side-preview carousel (Cover Flow style).
 *
 * Unlike a rotating ring (where every card is bolted to one spinning wheel and
 * therefore sweeps THROUGH the centre), here the centre is a FIXED position.
 * One card is locked dead-centre; the next/prev cards sit as small, dimmed,
 * angled previews on the sides. An `active` index advances on a timer, and each
 * card animates to its slot — so the centre never moves, cards just swap into it.
 *
 * Slots are keyed by the card's circular offset from `active`:
 *   0  → centre (full size, facing forward)
 *  ±1  → side preview (smaller, angled, dimmed)
 *  ±2  → far preview (smaller still, fainter)
 *  ±3  → hidden (parked off to the side; transition disabled so it can wrap
 *        from one side to the other invisibly).
 *
 * Paused when scrolled out of view (battery / low-end GPUs) and while the centre
 * card is hovered or focused (so it can be read and clicked).
 */

const N = SERVICE_MODULES.length;
const STEP_MS = 2600;
const HALF = Math.floor(N / 2);

type Slot = { x: number; z: number; ry: number; scale: number; opacity: number; zi: number };

function slotFor(offset: number, compact: boolean): Slot {
  if (compact) {
    // Narrow phones: keep every card inside the viewport. Centre card at full
    // size, small angled peeks on each side, and far cards parked close + hidden
    // so they can never push the page wider than the screen (no h-scroll).
    switch (offset) {
      case 0:
        return { x: 0, z: 30, ry: 0, scale: 1, opacity: 1, zi: 50 };
      case -1:
        return { x: -112, z: -55, ry: 26, scale: 0.64, opacity: 0.42, zi: 40 };
      case 1:
        return { x: 112, z: -55, ry: -26, scale: 0.64, opacity: 0.42, zi: 40 };
      default:
        return {
          x: offset < 0 ? -150 : 150,
          z: -90,
          ry: offset < 0 ? 32 : -32,
          scale: 0.55,
          opacity: 0,
          zi: 0,
        };
    }
  }
  switch (offset) {
    case 0:
      return { x: 0, z: 80, ry: 0, scale: 1.28, opacity: 1, zi: 50 };
    case -1:
      return { x: -205, z: 0, ry: 34, scale: 1, opacity: 0.92, zi: 40 };
    case 1:
      return { x: 205, z: 0, ry: -34, scale: 1, opacity: 0.92, zi: 40 };
    case -2:
      return { x: -330, z: -90, ry: 44, scale: 0.74, opacity: 0.4, zi: 30 };
    case 2:
      return { x: 330, z: -90, ry: -44, scale: 0.74, opacity: 0.4, zi: 30 };
    default:
      return {
        x: offset < 0 ? -420 : 420,
        z: -160,
        ry: offset < 0 ? 52 : -52,
        scale: 0.6,
        opacity: 0,
        zi: 0,
      };
  }
}

export function OrbitalCards({ center }: { radius?: number; center?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [compact, setCompact] = useState(false);

  // Pause when the hero scrolls out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Narrow phones use a compact layout so cards never overflow the screen.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const m = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);

  // Advance the spotlight while visible and not hovered.
  useEffect(() => {
    if (!inView || hovered) return;
    const id = setInterval(() => setActive((a) => (a + 1) % N), STEP_MS);
    return () => clearInterval(id);
  }, [inView, hovered]);

  return (
    <div
      className="pointer-events-none absolute inset-0 grid place-items-center"
      ref={rootRef}
      style={{ perspective: "1200px" }}
    >
      <div className="relative h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
        {/* AI hub — dead centre, behind the cards. */}
        {center ? (
          <div
            className="pointer-events-none absolute left-0 top-0"
            style={{ transform: "translateZ(-1px)" }}
          >
            {center}
          </div>
        ) : null}

        {/* Spotlight + previews */}
        {SERVICE_MODULES.map((module, i) => {
          let offset = (((i - active) % N) + N) % N; // 0..N-1
          if (offset > HALF) offset -= N; // -HALF..HALF
          const s = slotFor(offset, compact);
          const isCenter = offset === 0;
          const parked = Math.abs(offset) === HALF; // hidden wrap slot → no transition

          return (
            <div
              className="absolute left-0 top-0"
              key={module.slug}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                transform: `translateX(${s.x}px) translateZ(${s.z}px) rotateY(${s.ry}deg) scale(${s.scale})`,
                opacity: s.opacity,
                zIndex: s.zi,
                pointerEvents: isCenter ? "auto" : "none",
                transition: parked
                  ? "none"
                  : "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <OrbitCard active={isCenter} module={module} onHoverChange={setHovered} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrbitCard({
  module,
  active,
  onHoverChange,
}: {
  module: ServiceModule;
  active: boolean;
  onHoverChange?: (hovered: boolean) => void;
}) {
  return (
    <Link
      aria-hidden={active ? undefined : true}
      className="glass-card pointer-events-auto block w-[12rem] -translate-x-1/2 -translate-y-1/2 p-3 transition-transform hover:scale-[1.04]"
      data-accent={module.accent}
      href={`/services/${module.slug}`}
      onBlur={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      style={{ borderRadius: "0.95rem" }}
      tabIndex={active ? undefined : -1}
    >
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
        <h3 className="text-[0.75rem] font-semibold leading-tight text-gold-200">
          {module.shortName}
        </h3>
      </div>
      <p className="mt-1 line-clamp-2 text-[0.65rem] leading-4 text-gold-200/75">
        {module.tagline}
      </p>
    </Link>
  );
}
