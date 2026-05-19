"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { hexWithAlpha, type ServiceModule } from "@/lib/services-config";

const EASE = [0.22, 1, 0.36, 1] as const;

export type ImageServiceCardProps = {
  module: ServiceModule;
  /** Public path of the image, e.g. "/cards/whatsapp.png". */
  imageUrl: string;
  /** Percentage to crop from the right edge (for ChatGPT mockups with sidebar). */
  cropRightPercent?: number;
  index: number;
};

export function ImageServiceCard({
  module,
  imageUrl,
  cropRightPercent = 0,
  index,
}: ImageServiceCardProps) {
  const visibleWidthPercent = 100 - cropRightPercent;
  // Scale the image so the visible portion fills 100% of the container width.
  const imgScale = 100 / visibleWidthPercent;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="group relative isolate overflow-hidden rounded-[2rem] border bg-[#070b1c] transition-all duration-500 hover:-translate-y-1"
      data-accent={module.accent}
      initial={{ opacity: 0, y: 24 }}
      style={{
        borderColor: hexWithAlpha(module.hex, 0.3),
        boxShadow: `0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Luminous border glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${hexWithAlpha(module.hex, 0.55)}, transparent 35%, ${hexWithAlpha(module.hexSecondary, 0.5)})`,
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {/* Image container with optional right crop */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 h-full"
          style={{ width: `${imgScale * 100}%` }}
        >
          <Image
            alt={`${module.fullName} — service preview`}
            className="object-cover object-left"
            fill
            priority={index === 0}
            sizes="100vw"
            src={imageUrl}
          />
        </div>
        {/* Subtle gradient fade at bottom for button readability */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#040817] via-[rgba(4,8,23,0.5)] to-transparent" />

        {/* "View service" CTA overlay */}
        <Link
          className="group/btn absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:gap-3"
          href={`/services/${module.slug}`}
          style={{
            background: `linear-gradient(120deg, ${hexWithAlpha(module.hex, 0.95)}, ${hexWithAlpha(module.hexSecondary, 0.95)})`,
            boxShadow: `0 18px 40px ${hexWithAlpha(module.hex, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.2)`,
          }}
        >
          View service
          <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-0.5" />
        </Link>

        {/* Hidden screen-reader description */}
        <span className="sr-only">
          {module.fullName}. {module.blurb}. {module.capabilities.join(", ")}.
        </span>
      </div>
    </motion.article>
  );
}
