"use client";

import { motion } from "framer-motion";
import { Bell, Eye, FileCheck, Lock, ShieldCheck } from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "document-verification-security-automation";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

export function DocSecurityHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: shield on pedestal */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-[44%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
      >
        <div
          className="relative grid h-28 w-28 place-items-center rounded-full"
          style={{
            background: `radial-gradient(circle, ${hexWithAlpha(accent, 0.35)} 0%, transparent 70%)`,
          }}
        >
          <div
            className="grid h-20 w-20 place-items-center rounded-2xl border"
            style={{
              backgroundColor: hexWithAlpha(accent, 0.08),
              borderColor: hexWithAlpha(accent, 0.45),
              boxShadow: `0 0 32px ${hexWithAlpha(accent, 0.45)}`,
            }}
          >
            <ShieldCheck className="h-10 w-10" style={{ color: accent }} />
          </div>
        </div>
        <div
          className="rounded-full border px-3 py-1 font-mono text-[0.55rem] uppercase tracking-[0.2em]"
          style={{
            backgroundColor: hexWithAlpha(accent, 0.08),
            borderColor: hexWithAlpha(accent, 0.4),
            color: accent2,
          }}
        >
          Secure · Compliant · Automated
        </div>
      </motion.div>

      {/* Top-left: contract / OCR */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[2%] flex w-[15rem] flex-col gap-2 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.22 }}
      >
        <div className="flex items-center justify-between">
          <span
            className="rounded border px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider"
            style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent }}
          >
            OCR
          </span>
          <span className="text-[0.55rem] text-white/55">Employee Agreement</span>
        </div>
        <div className="flex flex-col gap-0.5 rounded-md border bg-[#04101c] p-2 text-[0.55rem] text-white/75" style={{ borderColor: hexWithAlpha(accent, 0.25) }}>
          <div className="flex justify-between"><span>Name</span><span>John Smith</span></div>
          <div className="flex justify-between"><span>Employee ID</span><span>EMP-78452</span></div>
          <div className="flex justify-between"><span>Department</span><span>Operations</span></div>
          <div className="flex justify-between"><span>Date of Joining</span><span>12 May 2024</span></div>
          <div className="flex justify-between"><span>Valid Till</span><span style={{ color: accent2 }}>12 May 2026</span></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.55rem] text-white/55">Extracted</span>
          <span className="text-[0.7rem] font-semibold" style={{ color: accent2 }}>
            100%
          </span>
        </div>
      </motion.div>

      {/* Top-right: Access Control */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[2%] flex w-[15rem] flex-col gap-1.5 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Lock className="h-3 w-3" /> Access Control
        </span>
        {[
          { k: "Staff Access", v: "Active" },
          { k: "Role", v: "Operations Lead" },
          { k: "Permissions", v: "4 Granted" },
          { k: "MFA", v: "Enabled" },
        ].map((row) => (
          <div className="flex items-center justify-between text-[0.65rem]" key={row.k}>
            <span className="text-white/65">{row.k}</span>
            <span className="font-medium" style={{ color: accent2 }}>
              {row.v}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Bottom-left: Audit log */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[1%] flex w-[16rem] flex-col gap-1.5 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Eye className="h-3 w-3" /> Audit Log
        </span>
        {[
          { event: "Document Verified", who: "John Smith", time: "10:24 AM", Icon: FileCheck },
          { event: "Access Granted", who: "Role: Ops Lead", time: "10:25 AM", Icon: Lock },
          { event: "Expiry Alert", who: "Passport", time: "10:30 AM", Icon: Bell },
        ].map((row) => (
          <div className="flex items-center gap-2" key={row.event}>
            <row.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-[0.65rem] font-medium text-white">{row.event}</span>
              <span className="text-[0.5rem] text-white/55">{row.who}</span>
            </div>
            <span className="text-[0.5rem] text-white/45">{row.time}</span>
          </div>
        ))}
      </motion.div>

      {/* Bottom-right: Expiry alerts */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] flex w-[14rem] flex-col gap-1.5 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.46 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <Bell className="h-3 w-3" /> Expiry Alerts
          </span>
          <span
            className="rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
            style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent2 }}
          >
            3
          </span>
        </div>
        {[
          { doc: "Passport", days: 15 },
          { doc: "ID Proof", days: 21 },
          { doc: "Certification", days: 28 },
        ].map((row) => (
          <div className="flex items-center justify-between text-[0.65rem]" key={row.doc}>
            <span className="text-white/85">{row.doc}</span>
            <span style={{ color: accent2 }}>{row.days} days left</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
