"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ServiceModule } from "@/lib/services-config";
import { hexWithAlpha } from "@/lib/services-config";
import { ServiceMiniIllustration } from "./ServiceMiniIllustration";

type ServiceMiniCardProps = {
  module: ServiceModule;
  index: number;
  /** Number badge label (e.g. "01"). */
  badge: string;
  /** CSS positioning. */
  style?: React.CSSProperties;
  /** Hover handler — used by the parent to brighten the matching beam. */
  onHoverChange?: (slug: string | null) => void;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function ServiceMiniCard({
  module,
  index,
  badge,
  style,
  onHoverChange,
}: ServiceMiniCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute hidden lg:block"
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      onMouseEnter={() => onHoverChange?.(module.slug)}
      onMouseLeave={() => onHoverChange?.(null)}
      style={style}
      transition={{ duration: 0.6, ease: EASE, delay: 0.25 + index * 0.08 }}
    >
      <Link
        className="glass-card group relative flex w-[12rem] flex-col gap-2 p-3 transition-transform hover:-translate-y-1"
        data-accent={module.accent}
        href={`/services/${module.slug}`}
        style={{ borderRadius: "1rem" }}
      >
        {/* Number badge */}
        <span
          className="absolute -top-2.5 left-3 flex h-6 w-8 items-center justify-center rounded border text-[0.65rem] font-bold tracking-wider"
          style={{
            backgroundColor: "#040817",
            borderColor: hexWithAlpha(module.hex, 0.4),
            color: module.hex,
          }}
        >
          {badge}
        </span>

        {/* Mini-illustration of the service */}
        <div
          className="aspect-[16/8] w-full overflow-hidden rounded-md border"
          style={{
            backgroundColor: hexWithAlpha(module.hex, 0.04),
            borderColor: hexWithAlpha(module.hex, 0.18),
          }}
        >
          <ServiceMiniIllustration accent={module.hex} accent2={module.hexSecondary} slug={module.slug} />
        </div>

        {/* Title + tagline */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className="grid h-6 w-6 place-items-center rounded border border-white/10 bg-white/5"
              style={{ color: module.hex }}
            >
              <module.Icon className="h-3 w-3" />
            </span>
            <h3 className="text-[0.8rem] font-semibold leading-tight text-white">
              {module.shortName}
            </h3>
          </div>
          <p className="line-clamp-2 text-[0.7rem] leading-4 text-slate-300/85">{module.tagline}</p>
        </div>

        {/* Arrow link */}
        <div
          className="inline-flex items-center gap-1 text-[0.6rem] font-medium uppercase tracking-[0.18em]"
          style={{ color: module.hex }}
        >
          Learn more
          <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </Link>
    </motion.div>
  );
}
