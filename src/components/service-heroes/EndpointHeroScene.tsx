"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Laptop,
  Lock,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "endpoint-device-management";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

export function EndpointHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: managed laptop */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
      >
        {/* Screen */}
        <div
          className="flex h-[210px] w-[320px] flex-col gap-3 rounded-t-xl border p-4"
          style={{
            backgroundColor: "#050b1a",
            borderColor: hexWithAlpha(accent, 0.45),
            boxShadow: `0 0 38px ${hexWithAlpha(accent, 0.4)}, inset 0 0 0 1px ${hexWithAlpha(accent, 0.08)}`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/55">
              <Laptop className="h-3 w-3" /> MacBook · OPS-014
            </span>
            <span
              className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
              style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent2 }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent2 }}
              />
              Enrolled
            </span>
          </div>

          {/* Lock / shield state */}
          <div
            className="flex items-center gap-3 rounded-lg border p-3"
            style={{
              backgroundColor: hexWithAlpha(accent, 0.08),
              borderColor: hexWithAlpha(accent, 0.3),
            }}
          >
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
              style={{
                backgroundColor: hexWithAlpha(accent, 0.12),
                borderColor: hexWithAlpha(accent, 0.45),
                boxShadow: `0 0 20px ${hexWithAlpha(accent, 0.4)}`,
              }}
            >
              <ShieldCheck className="h-6 w-6" style={{ color: accent }} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[0.7rem] font-semibold text-white">
                Device managed
              </span>
              <span className="text-[0.55rem] text-white/55">
                Compliant · Encrypted · Supervised
              </span>
            </div>
          </div>

          {/* Status grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "Encryption", v: "On" },
              { k: "Screen Lock", v: "5m" },
              { k: "Compliance", v: "100%" },
            ].map((s) => (
              <div
                className="flex flex-col gap-0.5 rounded-md border p-2"
                key={s.k}
                style={{
                  backgroundColor: "#04101c",
                  borderColor: hexWithAlpha(accent, 0.22),
                }}
              >
                <span className="font-mono text-[0.45rem] uppercase tracking-wider text-white/45">
                  {s.k}
                </span>
                <span
                  className="text-[0.7rem] font-semibold"
                  style={{ color: accent2 }}
                >
                  {s.v}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Laptop base */}
        <div
          className="mx-auto h-2.5 w-[360px] rounded-b-xl border-x border-b"
          style={{
            backgroundColor: "#030814",
            borderColor: hexWithAlpha(accent, 0.35),
          }}
        />
      </motion.div>

      {/* Top-left: Device Fleet */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[6%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Laptop className="h-3 w-3" /> Device Fleet
        </span>
        {[
          { name: "OPS-014", os: "macOS 14", online: true, Icon: Laptop },
          { name: "FLD-221", os: "Android 15", online: true, Icon: Smartphone },
          { name: "HR-007", os: "Windows 11", online: false, Icon: Laptop },
          { name: "SLS-103", os: "iOS 18", online: true, Icon: Smartphone },
        ].map((d) => (
          <div className="flex items-center gap-2" key={d.name}>
            <d.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-[0.65rem] font-medium text-white">
                {d.name}
              </span>
              <span className="text-[0.5rem] text-white/55">{d.os}</span>
            </div>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: d.online ? accent2 : hexWithAlpha("#ffffff", 0.25),
              }}
            />
          </div>
        ))}
      </motion.div>

      {/* Top-right: Security Policies */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <ShieldCheck className="h-3 w-3" /> Security Policies
        </span>
        {[
          { k: "Disk encryption", v: "On", active: true },
          { k: "USB ports", v: "Blocked", active: true },
          { k: "Screen lock", v: "5 min", active: true },
          { k: "Sideloading", v: "Off", active: false },
        ].map((p) => (
          <div
            className="flex items-center justify-between text-[0.65rem]"
            key={p.k}
          >
            <span className="text-white/85">{p.k}</span>
            <span className="flex items-center gap-1.5">
              <span
                className="font-medium"
                style={{ color: p.active ? accent2 : "rgba(255,255,255,0.45)" }}
              >
                {p.v}
              </span>
              <span
                className="flex h-3 w-5 items-center rounded-full px-0.5"
                style={{
                  backgroundColor: p.active
                    ? hexWithAlpha(accent, 0.45)
                    : "rgba(255,255,255,0.12)",
                  justifyContent: p.active ? "flex-end" : "flex-start",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.active ? accent : "rgba(255,255,255,0.5)" }}
                />
              </span>
            </span>
          </div>
        ))}
      </motion.div>

      {/* Bottom-left: Remote Actions */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[3%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Cpu className="h-3 w-3" /> Remote Actions
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Lock", Icon: Lock },
            { label: "Wipe", Icon: RefreshCw },
            { label: "Locate", Icon: MapPin },
          ].map((a) => (
            <div
              className="flex flex-col items-center gap-1 rounded-md border py-2"
              key={a.label}
              style={{
                backgroundColor: hexWithAlpha(accent, 0.08),
                borderColor: hexWithAlpha(accent, 0.3),
              }}
            >
              <a.Icon className="h-3.5 w-3.5" style={{ color: accent }} />
              <span className="text-[0.55rem] text-white/85">{a.label}</span>
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-between rounded-md border px-2.5 py-1.5"
          style={{
            backgroundColor: hexWithAlpha(accent, 0.1),
            borderColor: hexWithAlpha(accent, 0.4),
          }}
        >
          <span className="flex items-center gap-1.5 text-[0.6rem] text-white/85">
            <Lock className="h-3 w-3" style={{ color: accent2 }} /> Lock OPS-014?
          </span>
          <span
            className="rounded px-2 py-0.5 text-[0.55rem] font-semibold text-slate-950"
            style={{ backgroundColor: accent }}
          >
            Confirm
          </span>
        </div>
      </motion.div>

      {/* Bottom-right: Patch Status */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <RefreshCw className="h-3 w-3" /> Patch Status
        </span>
        {[
          { os: "Windows", pct: 96 },
          { os: "macOS", pct: 88 },
          { os: "Android", pct: 72 },
          { os: "iOS", pct: 100 },
        ].map((row) => (
          <div className="flex flex-col gap-0.5" key={row.os}>
            <div className="flex items-center justify-between text-[0.6rem]">
              <span className="text-white/85">{row.os}</span>
              <span style={{ color: accent2 }}>{row.pct}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                  width: `${row.pct}%`,
                }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Pedestal glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[78%] h-2 w-[220px] -translate-x-1/2 rounded-full blur-2xl"
        style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
      />
    </div>
  );
}
