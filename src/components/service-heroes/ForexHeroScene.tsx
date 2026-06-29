"use client";

import { motion } from "framer-motion";
import { Activity, Bot, DollarSign, Gauge, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "forex-trading-automation";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

// Candlesticks for the central chart. up = bullish (accent2), down = bearish (accent).
const CANDLES = [
  { x: 14, open: 96, close: 78, high: 70, low: 104, up: true },
  { x: 32, open: 80, close: 90, high: 72, low: 98, up: false },
  { x: 50, open: 88, close: 64, high: 56, low: 96, up: true },
  { x: 68, open: 66, close: 74, high: 58, low: 84, up: false },
  { x: 86, open: 72, close: 48, high: 40, low: 80, up: true },
  { x: 104, open: 50, close: 60, high: 42, low: 70, up: false },
  { x: 122, open: 58, close: 34, high: 26, low: 66, up: true },
];

export function ForexHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: live trading chart panel */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
      >
        <div
          className="flex h-[300px] w-[260px] flex-col gap-3 rounded-2xl border bg-[#04101c] p-4"
          style={{
            borderColor: hexWithAlpha(accent, 0.45),
            boxShadow: `0 0 48px ${hexWithAlpha(accent, 0.4)}`,
          }}
        >
          {/* header: pair + EA running badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <LineChart className="h-3.5 w-3.5" style={{ color: accent }} />
              <span className="text-[0.7rem] font-semibold text-white">EUR / USD</span>
              <span className="font-mono text-[0.5rem] text-white/45">M15</span>
            </div>
            <span
              className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
              style={{
                backgroundColor: hexWithAlpha(accent, 0.1),
                borderColor: hexWithAlpha(accent, 0.4),
                color: accent2,
              }}
            >
              <Bot className="h-2.5 w-2.5" /> EA Running
            </span>
          </div>

          {/* price tag */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-white">1.08642</span>
            <span className="flex items-center gap-0.5 text-[0.6rem] font-medium" style={{ color: accent2 }}>
              <TrendingUp className="h-3 w-3" /> +0.42%
            </span>
          </div>

          {/* chart: candlesticks + uptrend line */}
          <div className="relative flex-1 rounded-lg border bg-[#050b1a]" style={{ borderColor: hexWithAlpha(accent, 0.18) }}>
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 140 140">
              <defs>
                <linearGradient id="fx-trend" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={accent2} stopOpacity="1" />
                </linearGradient>
                <linearGradient id="fx-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={accent2} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={accent2} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* grid lines */}
              {[28, 56, 84, 112].map((y) => (
                <line key={y} stroke={hexWithAlpha(accent, 0.08)} strokeWidth="0.6" x1="0" x2="140" y1={y} y2={y} />
              ))}

              {/* candlesticks */}
              {CANDLES.map((c) => {
                const col = c.up ? accent2 : accent;
                const bodyTop = Math.min(c.open, c.close);
                const bodyH = Math.max(Math.abs(c.close - c.open), 2);
                return (
                  <g key={c.x}>
                    <line stroke={col} strokeWidth="1" x1={c.x} x2={c.x} y1={c.high} y2={c.low} />
                    <rect fill={col} height={bodyH} opacity="0.85" rx="0.8" width="8" x={c.x - 4} y={bodyTop} />
                  </g>
                );
              })}

              {/* uptrend line + fill */}
              <path d="M 4 110 L 36 96 L 70 78 L 104 56 L 134 26 L 134 140 L 4 140 Z" fill="url(#fx-fill)" />
              <path
                d="M 4 110 L 36 96 L 70 78 L 104 56 L 134 26"
                fill="none"
                stroke="url(#fx-trend)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <circle cx="134" cy="26" fill={accent2} r="2.6" />
            </svg>
          </div>

          {/* footer stat row */}
          <div className="flex items-center justify-between text-[0.55rem]">
            <span className="text-white/55">Daily P/L</span>
            <span className="font-semibold" style={{ color: accent2 }}>
              +$1,284.50
            </span>
          </div>
        </div>
      </motion.div>

      {/* Top-left: EA Status */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[6%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Bot className="h-3 w-3" /> EA Status
        </span>
        {[
          { name: "Trend Rider v3", pnl: "+$842.10", up: true },
          { name: "Grid Scalper", pnl: "+$318.40", up: true },
          { name: "Mean Revert", pnl: "-$96.20", up: false },
        ].map((bot) => (
          <div className="flex items-center justify-between" key={bot.name}>
            <span className="flex items-center gap-1.5 text-[0.65rem] text-white/85">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bot.up ? accent2 : accent }} />
              {bot.name}
            </span>
            <span className="text-[0.6rem] font-semibold" style={{ color: bot.up ? accent2 : accent }}>
              {bot.pnl ?? bot.pnl}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Top-right: Indicators */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] w-[15rem] flex-col gap-1.5 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Activity className="h-3 w-3" /> Indicators
        </span>
        {[
          { k: "RSI (14)", v: "62.4", tag: "Bullish" },
          { k: "MACD", v: "+0.0018", tag: "Cross Up" },
          { k: "MA (50)", v: "1.0841", tag: "Above" },
          { k: "ATR", v: "0.0042", tag: "Stable" },
        ].map((row) => (
          <div className="flex items-center justify-between text-[0.65rem]" key={row.k}>
            <span className="text-white/65">{row.k}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white/85">{row.v}</span>
              <span
                className="rounded border px-1.5 py-0.5 text-[0.5rem]"
                style={{
                  backgroundColor: hexWithAlpha(accent, 0.1),
                  borderColor: hexWithAlpha(accent, 0.3),
                  color: accent2,
                }}
              >
                {row.tag}
              </span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Bottom-left: Backtest */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[3%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Gauge className="h-3 w-3" /> Backtest
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-white">73.8%</span>
          <span className="text-[0.55rem] text-white/55">win rate</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { k: "Profit Factor", pct: 84, v: "2.14" },
            { k: "Max Drawdown", pct: 32, v: "8.6%" },
          ].map((row) => (
            <div className="flex flex-col gap-0.5" key={row.k}>
              <div className="flex items-center justify-between text-[0.55rem]">
                <span className="text-white/55">{row.k}</span>
                <span className="font-medium" style={{ color: accent2 }}>
                  {row.v}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: hexWithAlpha(accent, 0.12) }}>
                <div className="h-full rounded-full" style={{ width: `${row.pct}%`, backgroundColor: accent }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom-right: Open Positions */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] w-[16rem] flex-col gap-1.5 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <DollarSign className="h-3 w-3" /> Open Positions
          </span>
          <span className="text-[0.5rem] text-white/45">4 live</span>
        </div>
        {[
          { side: "BUY", pair: "EUR/USD", pips: "+38.2", up: true },
          { side: "SELL", pair: "GBP/JPY", pips: "+12.6", up: true },
          { side: "BUY", pair: "XAU/USD", pips: "-9.4", up: false },
          { side: "SELL", pair: "USD/CAD", pips: "+21.0", up: true },
        ].map((row) => (
          <div className="flex items-center gap-2 text-[0.65rem]" key={row.pair}>
            <span
              className="flex w-9 items-center justify-center rounded px-1 py-0.5 text-[0.5rem] font-semibold"
              style={
                row.side === "BUY"
                  ? { backgroundColor: accent2, color: "#04101c" }
                  : { backgroundColor: hexWithAlpha(accent, 0.18), borderColor: hexWithAlpha(accent, 0.4), color: accent }
              }
            >
              {row.side}
            </span>
            <span className="flex-1 text-white/85">{row.pair}</span>
            <span className="flex items-center gap-0.5 font-medium" style={{ color: row.up ? accent2 : accent }}>
              {row.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {row.pips} pips
            </span>
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
