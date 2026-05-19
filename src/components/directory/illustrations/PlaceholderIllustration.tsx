"use client";

import type { LucideIcon } from "lucide-react";
import { hexWithAlpha } from "@/lib/services-config";

type Props = {
  Icon: LucideIcon;
  accent: string;
  accent2: string;
};

export function PlaceholderIllustration({ Icon, accent, accent2 }: Props) {
  return (
    <div className="relative grid h-full min-h-[420px] w-full place-items-center p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(ellipse at center, ${hexWithAlpha(accent, 0.32)} 0%, transparent 70%)` }}
      />
      <div
        className="grid h-32 w-32 place-items-center rounded-3xl"
        style={{
          background: `linear-gradient(160deg, ${hexWithAlpha(accent, 0.85)}, ${hexWithAlpha(accent2, 0.85)})`,
          boxShadow: `0 0 60px ${hexWithAlpha(accent, 0.5)}, 0 20px 50px rgba(0,0,0,0.5), inset 0 -10px 24px rgba(0,0,0,0.32), inset 0 8px 14px rgba(255,255,255,0.18)`,
        }}
      >
        <Icon className="h-14 w-14 text-white" strokeWidth={1.5} />
      </div>
      <p className="absolute bottom-6 text-center font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/40">
        Detailed visual in build
      </p>
    </div>
  );
}
