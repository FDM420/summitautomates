"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Brain,
  CandlestickChart,
  CircleDot,
  LineChart,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Float, Podium, ServiceHeroCardShell } from "./hero-card-shared";

export function ForexServiceHeroCard() {
  return (
    <ServiceHeroCardShell
      accent="rose"
      ctaLabel="Book a Discovery Call"
      description="Whether you're running a single strategy or a multi-account trading desk, Summit builds the automation layer — MT4/MT5 Expert Advisors, AI-augmented bots, custom indicators, strategy backtesting, risk controls, and a trader portal."
      discoveryLine="Open the full service page and discovery path."
      features={[
        { icon: <Bot className="h-5 w-5" />, label: "MT4/MT5 Expert Advisors" },
        { icon: <Brain className="h-5 w-5" />, label: "AI-augmented trading bots" },
        { icon: <Target className="h-5 w-5" />, label: "Backtest & risk controls" },
      ]}
      metrics={[
        { icon: <TrendingUp className="h-6 w-6" />, label: "Live EAs", value: "Custom" },
        { icon: <Activity className="h-6 w-6" />, label: "Win rate", value: "62%" },
      ]}
      scene={<ForexScene />}
      statusLabel="Open"
      title="Forex & Trading Automation Services"
    />
  );
}

/* ---------------------------------------
   SCENE — MT5 chart + EA panel + equity curve + trade ticket
--------------------------------------- */

function ForexScene() {
  return (
    <>
      {/* Big MT5 candlestick chart — centerpiece */}
      <Float amplitude={10} className="left-1/2 top-[3%] -translate-x-1/2 [transform:translateZ(60px)]" delay={0}>
        <MT5Chart />
      </Float>

      {/* EA Status panel — top-left */}
      <Float amplitude={6} className="left-[1%] top-[8%] [transform:translateZ(95px)_rotateY(-8deg)]" delay={1.3}>
        <EAStatusPanel />
      </Float>

      {/* Trade ticket — top-right (small floating) */}
      <Float amplitude={5} className="right-[2%] top-[6%] [transform:translateZ(115px)_rotateY(8deg)]" delay={2.5}>
        <TradeTicket />
      </Float>

      {/* Equity curve card — bottom-left */}
      <Float amplitude={7} className="left-[1%] top-[44%] [transform:translateZ(85px)_rotateY(-6deg)]" delay={0.7}>
        <EquityCurveCard />
      </Float>

      {/* Risk/indicator card — bottom-right */}
      <Float amplitude={6} className="right-[1%] top-[44%] [transform:translateZ(90px)_rotateY(6deg)]" delay={2.0}>
        <IndicatorCard />
      </Float>

      {/* Podium */}
      <Podium accent="rose" />
    </>
  );
}

/* ============================================================
   MT5 CHART (centerpiece) — candlesticks + trend line + scan
   ============================================================ */
function MT5Chart() {
  // Candle data — [open, high, low, close] per candle (smaller = lower in chart)
  // 0 = top, 100 = bottom (we'll flip on render)
  const candles: { o: number; h: number; l: number; c: number; up: boolean }[] = [
    { o: 70, h: 62, l: 78, c: 65, up: true },
    { o: 65, h: 60, l: 72, c: 62, up: true },
    { o: 62, h: 64, l: 70, c: 67, up: false },
    { o: 67, h: 55, l: 70, c: 58, up: true },
    { o: 58, h: 52, l: 62, c: 54, up: true },
    { o: 54, h: 56, l: 60, c: 58, up: false },
    { o: 58, h: 45, l: 60, c: 48, up: true },
    { o: 48, h: 40, l: 52, c: 42, up: true },
    { o: 42, h: 44, l: 48, c: 46, up: false },
    { o: 46, h: 30, l: 48, c: 34, up: true },
    { o: 34, h: 28, l: 40, c: 30, up: true },
    { o: 30, h: 22, l: 36, c: 25, up: true },
  ];

  return (
    <div className="w-[320px] rounded-[14px] border border-rose-400/30 bg-[#11091a] p-3 shadow-[0_22px_55px_rgba(251,113,133,0.38)]">
      {/* Chart header */}
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black text-white">EURUSD</span>
          <span className="rounded bg-rose-500/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-rose-200">
            H1
          </span>
          <span className="font-mono text-[10px] text-emerald-300">
            1.08420
          </span>
          <span className="text-[9px] text-emerald-300">+0.18%</span>
        </div>
        <CandlestickChart className="h-3.5 w-3.5 text-rose-300" />
      </div>

      {/* Chart body */}
      <div className="relative mt-2 h-[150px] overflow-hidden rounded border border-white/5 bg-gradient-to-b from-[#1a0e22] to-[#0a0512]">
        {/* Horizontal gridlines */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 300 150"
        >
          <line stroke="rgba(251,113,133,0.08)" strokeDasharray="2 4" strokeWidth="0.5" x1="0" x2="300" y1="30" y2="30" />
          <line stroke="rgba(251,113,133,0.08)" strokeDasharray="2 4" strokeWidth="0.5" x1="0" x2="300" y1="60" y2="60" />
          <line stroke="rgba(251,113,133,0.08)" strokeDasharray="2 4" strokeWidth="0.5" x1="0" x2="300" y1="90" y2="90" />
          <line stroke="rgba(251,113,133,0.08)" strokeDasharray="2 4" strokeWidth="0.5" x1="0" x2="300" y1="120" y2="120" />

          {/* Candlesticks */}
          {candles.map((candle, i) => {
            const x = 18 + i * 22;
            const wickTop = candle.h * 1.5;
            const wickBottom = candle.l * 1.5;
            const bodyTop = (candle.up ? candle.c : candle.o) * 1.5;
            const bodyBottom = (candle.up ? candle.o : candle.c) * 1.5;
            const color = candle.up ? "#22c55e" : "#ef4444";
            return (
              <g key={i}>
                {/* Wick */}
                <line stroke={color} strokeWidth="1" x1={x} x2={x} y1={wickTop} y2={wickBottom} />
                {/* Body */}
                <rect
                  fill={color}
                  height={Math.max(bodyBottom - bodyTop, 2)}
                  width="8"
                  x={x - 4}
                  y={bodyTop}
                />
              </g>
            );
          })}

          {/* Trend line connecting closes */}
          <polyline
            fill="none"
            points={candles
              .map((c, i) => `${18 + i * 22},${c.c * 1.5}`)
              .join(" ")}
            stroke="#fb7185"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />

          {/* Current price line + tag */}
          <line
            stroke="#fb7185"
            strokeDasharray="3 3"
            strokeWidth="1"
            x1="0"
            x2="300"
            y1={candles[candles.length - 1].c * 1.5}
            y2={candles[candles.length - 1].c * 1.5}
          />
        </svg>

        {/* Entry marker (BUY arrow at last candle) */}
        <div className="absolute right-3 top-4 flex items-center gap-1 rounded border border-emerald-400/50 bg-emerald-500/25 px-1.5 py-0.5 text-[8px] font-bold text-emerald-200 shadow-[0_0_10px_rgba(52,211,153,0.7)]">
          <ArrowUpRight className="h-2.5 w-2.5" />
          BUY · 1.0842
        </div>

        {/* Scanning sweep */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-rose-300/70 to-transparent shadow-[0_0_8px_rgba(251,113,133,0.85)]" />
      </div>

      {/* Footer indicators */}
      <div className="mt-2 flex items-center justify-between text-[8px] font-mono uppercase">
        <div className="flex items-center gap-2">
          <span className="text-rose-200">MA-50</span>
          <span className="text-emerald-300">RSI 62</span>
          <span className="text-amber-300">MACD ↑</span>
        </div>
        <span className="flex items-center gap-1 text-emerald-300">
          <CircleDot className="h-2 w-2 animate-pulse" />
          LIVE
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   EA STATUS PANEL — running EA with strategy details
   ============================================================ */
function EAStatusPanel() {
  return (
    <div className="w-[180px] rounded-2xl border border-rose-400/30 bg-[#11091a]/95 p-3.5 shadow-[0_20px_45px_rgba(251,113,133,0.38)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bot className="h-4 w-4 text-rose-300" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
            EA Active
          </span>
        </div>
        <span className="flex items-center gap-1 rounded border border-emerald-400/40 bg-emerald-500/15 px-1.5 py-0.5 text-[8px] font-bold text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          LIVE
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <div className="text-[9px] text-slate-400">Strategy</div>
          <div className="text-xs font-bold text-white">London Reversal v2.1</div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded border border-white/10 bg-white/[0.04] p-1.5">
            <div className="text-[8px] text-slate-400">Trades</div>
            <div className="text-sm font-bold text-white">14</div>
          </div>
          <div className="rounded border border-emerald-400/25 bg-emerald-500/10 p-1.5">
            <div className="text-[8px] text-emerald-300/85">P&L</div>
            <div className="text-sm font-bold text-emerald-300">+$1,284</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[8px] text-slate-400">
            <span>Risk used</span>
            <span className="text-amber-300">38%</span>
          </div>
          <div className="mt-1 h-1 rounded-full bg-white/10">
            <div className="h-1 w-[38%] rounded-full bg-gradient-to-r from-amber-400 to-rose-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TRADE TICKET — small floating trade execution badge
   ============================================================ */
function TradeTicket() {
  return (
    <div className="w-[140px] rounded-xl border border-emerald-400/40 bg-gradient-to-b from-emerald-500/15 via-[#11091a]/95 to-[#11091a]/95 p-3 shadow-[0_18px_40px_rgba(52,211,153,0.35)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-emerald-400/20 pb-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
          Trade Filled
        </span>
        <Zap className="h-3 w-3 text-emerald-300" />
      </div>

      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400">Symbol</span>
          <span className="font-mono text-xs font-bold text-white">EURUSD</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400">Side</span>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-300">
            <ArrowUpRight className="h-2.5 w-2.5" />
            BUY
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400">Entry</span>
          <span className="font-mono text-xs text-white">1.0842</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-400">SL · TP</span>
          <span className="font-mono text-[9px] text-slate-300">
            <span className="text-rose-300">.0807</span> · <span className="text-emerald-300">.0912</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EQUITY CURVE CARD — rising line chart with stats
   ============================================================ */
function EquityCurveCard() {
  return (
    <div className="w-[200px] rounded-2xl border border-rose-400/30 bg-[#11091a]/95 p-3.5 shadow-[0_20px_45px_rgba(251,113,133,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
            Equity curve
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-white">$28,420</span>
            <span className="text-[9px] font-bold text-emerald-300">+18.4%</span>
          </div>
        </div>
        <LineChart className="h-3.5 w-3.5 text-rose-300" />
      </div>

      <svg className="mt-3 h-[58px] w-full" fill="none" viewBox="0 0 180 60">
        <defs>
          <linearGradient id="fx-line" x1="0" x2="1">
            <stop stopColor="#fb7185" />
            <stop offset="1" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="fx-fill" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="rgba(251,113,133,0.4)" />
            <stop offset="1" stopColor="rgba(251,113,133,0)" />
          </linearGradient>
        </defs>
        <path
          d="M 0 52 L 20 48 L 38 50 L 58 42 L 78 38 L 98 30 L 118 28 L 138 18 L 158 14 L 180 8 L 180 60 L 0 60 Z"
          fill="url(#fx-fill)"
        />
        <path
          d="M 0 52 L 20 48 L 38 50 L 58 42 L 78 38 L 98 30 L 118 28 L 138 18 L 158 14 L 180 8"
          stroke="url(#fx-line)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        {[
          [20, 48],
          [78, 38],
          [138, 18],
          [180, 8],
        ].map(([x, y]) => (
          <circle
            cx={x}
            cy={y}
            fill="#f43f5e"
            key={`${x}-${y}`}
            r="2.5"
            style={{ filter: "drop-shadow(0 0 4px rgba(244,63,94,0.95))" }}
          />
        ))}
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[8px] uppercase tracking-wider">
        <div className="rounded border border-white/10 bg-white/[0.04] py-1">
          <div className="text-[10px] font-bold text-white">62%</div>
          <div className="text-slate-400">Win</div>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.04] py-1">
          <div className="text-[10px] font-bold text-white">1.84</div>
          <div className="text-slate-400">Sharpe</div>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.04] py-1">
          <div className="text-[10px] font-bold text-rose-300">3.1%</div>
          <div className="text-slate-400">DD</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INDICATOR CARD — custom indicators with bars + signals
   ============================================================ */
function IndicatorCard() {
  const indicators = [
    { name: "RSI (14)", value: 62, tone: "emerald", signal: "Long" },
    { name: "MACD", value: 78, tone: "emerald", signal: "Buy" },
    { name: "ATR (20)", value: 48, tone: "amber", signal: "Mid" },
    { name: "Stoch", value: 88, tone: "rose", signal: "Overbought" },
  ];
  return (
    <div className="w-[200px] rounded-2xl border border-rose-400/30 bg-[#11091a]/95 p-3.5 shadow-[0_20px_45px_rgba(251,113,133,0.32)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
          Indicators
        </div>
        <Brain className="h-3.5 w-3.5 text-rose-300" />
      </div>

      <div className="mt-3 space-y-2.5">
        {indicators.map((ind) => {
          const barColor =
            ind.tone === "emerald"
              ? "bg-emerald-400"
              : ind.tone === "amber"
                ? "bg-amber-400"
                : "bg-rose-400";
          const textColor =
            ind.tone === "emerald"
              ? "text-emerald-300"
              : ind.tone === "amber"
                ? "text-amber-300"
                : "text-rose-300";
          return (
            <div key={ind.name}>
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-mono text-slate-200">{ind.name}</span>
                <span className={`font-bold ${textColor}`}>{ind.signal}</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-white/8">
                <div
                  className={`h-1 rounded-full shadow-[0_0_6px_currentColor] ${barColor}`}
                  style={{ width: `${ind.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[9px]">
        <span className="flex items-center gap-1 text-emerald-300">
          <ArrowUpRight className="h-2.5 w-2.5" />
          Net signal: Long
        </span>
        <span className="text-slate-400">62%</span>
      </div>

      {/* Reference unused icon to keep import set tidy */}
      <ArrowDownRight aria-hidden className="hidden" />
    </div>
  );
}
