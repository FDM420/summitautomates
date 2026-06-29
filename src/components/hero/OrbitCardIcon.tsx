"use client";

import { SERVICE_MODULES_BY_SLUG } from "@/lib/services-config";

/**
 * Tiny built-in animated SVGs (~50 lines each) for each service.
 * Pure SMIL + CSS keyframes inside the SVG — no JS animation library.
 * Services without a bespoke SVG fall back to their lucide icon (see default).
 */
export function OrbitCardIcon({ slug }: { slug: string }) {
  switch (slug) {
    case "whatsapp-automation":
      return <WhatsappIcon />;
    case "recruitment-hr-automation":
      return <RecruitmentIcon />;
    case "crm-ai-marketing-automation":
      return <CrmIcon />;
    case "document-verification-security-automation":
      return <DocSecIcon />;
    case "workforce-operations-tracking":
      return <WorkforceIcon />;
    case "endpoint-device-management":
      return <EndpointIcon />;
    case "forex-trading-automation":
      return <ForexIcon />;
    default: {
      const mod = SERVICE_MODULES_BY_SLUG[slug];
      if (!mod) return null;
      const Icon = mod.Icon;
      return (
        <div className="flex h-full w-full items-center justify-center" style={{ color: mod.hex }}>
          <Icon className="h-8 w-8" />
        </div>
      );
    }
  }
}

function WhatsappIcon() {
  return (
    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 80">
      <defs>
        <linearGradient id="wa-mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1ea052" />
          <stop offset="100%" stopColor="#25d366" />
        </linearGradient>
      </defs>
      <rect fill="url(#wa-mini-bg)" height="80" rx="6" width="160" />
      {/* dashed beam */}
      <path d="M 28 40 Q 80 18 132 40" fill="none" stroke="#fff" strokeDasharray="3 3" strokeOpacity="0.6" strokeWidth="1.5">
        <animate attributeName="stroke-dashoffset" dur="1.6s" from="0" repeatCount="indefinite" to="-12" />
      </path>
      <path d="M 28 40 Q 80 62 132 40" fill="none" stroke="#fff" strokeDasharray="3 3" strokeOpacity="0.6" strokeWidth="1.5">
        <animate attributeName="stroke-dashoffset" dur="1.6s" from="0" repeatCount="indefinite" to="-12" />
      </path>
      {/* chat bubble traveling */}
      <g>
        <rect fill="#fff" height="10" rx="2" stroke="#1ea052" strokeWidth="1.2" width="14" x="-7" y="-5" />
        <line stroke="#1ea052" strokeLinecap="round" strokeWidth="1" x1="-3" x2="3" y1="-2" y2="-2" />
        <line stroke="#1ea052" strokeLinecap="round" strokeWidth="1" x1="-3" x2="1" y1="1" y2="1" />
        <animateMotion dur="2.6s" path="M 28 40 Q 80 18 132 40" repeatCount="indefinite" />
        <animate attributeName="opacity" dur="2.6s" keyTimes="0;0.1;0.9;1" repeatCount="indefinite" values="0;1;1;0" />
      </g>
      {/* tag */}
      <g>
        <rect fill="#ffc107" height="10" rx="2" stroke="#fff" strokeWidth="1" width="14" x="-7" y="-5" />
        <circle cx="-3" cy="-1" fill="#fff" r="1" />
        <line stroke="#fff" strokeLinecap="round" strokeWidth="1" x1="0" x2="4" y1="-1" y2="-1" />
        <animateMotion begin="1.3s" dur="2.6s" path="M 28 40 Q 80 62 132 40" repeatCount="indefinite" />
        <animate attributeName="opacity" begin="1.3s" dur="2.6s" keyTimes="0;0.1;0.9;1" repeatCount="indefinite" values="0;1;1;0" />
      </g>
      {/* nodes */}
      <g>
        <circle cx="28" cy="40" fill="#fff" r="8" />
        <path d="M 23 36 L 33 36 L 33 44 L 28 47 L 23 44 Z" fill="#1ea052" />
      </g>
      <g>
        <circle cx="132" cy="40" fill="#fff" r="8" />
        <circle cx="129" cy="38" fill="#1ea052" r="1.6" />
        <circle cx="135" cy="38" fill="#1ea052" r="1.6" />
        <path d="M 127 42 Q 132 46 137 42" fill="none" stroke="#1ea052" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function RecruitmentIcon() {
  return (
    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 80">
      <defs>
        <linearGradient id="rc-mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#5b21b6" />
          <stop offset="100%" stopColor="#7c82ff" />
        </linearGradient>
      </defs>
      <rect fill="url(#rc-mini-bg)" height="80" rx="6" width="160" />
      {/* scanner line moving down */}
      <rect fill="#a78bfa" height="2" opacity="0.85" width="36" x="22" y="20">
        <animate attributeName="y" dur="1.6s" repeatCount="indefinite" values="14;50;14" />
      </rect>
      {/* CV stack */}
      <g transform="translate(28 18)">
        <rect fill="#fff" height="42" rx="2" stroke="#5b21b6" strokeWidth="0.8" width="24" />
        <circle cx="6" cy="8" fill="#5b21b6" r="2.5" />
        <line stroke="#5b21b6" strokeLinecap="round" strokeWidth="1" x1="11" x2="20" y1="7" y2="7" />
        <line stroke="#5b21b6" strokeLinecap="round" strokeWidth="1" x1="11" x2="17" y1="10" y2="10" />
        <line stroke="#5b21b6" strokeLinecap="round" strokeWidth="1" x1="4" x2="20" y1="20" y2="20" />
        <line stroke="#5b21b6" strokeLinecap="round" strokeWidth="1" x1="4" x2="20" y1="25" y2="25" />
        <line stroke="#5b21b6" strokeLinecap="round" strokeWidth="1" x1="4" x2="16" y1="30" y2="30" />
      </g>
      {/* pipeline arrows */}
      <path d="M 56 40 L 70 40" fill="none" stroke="#fff" strokeDasharray="3 3" strokeOpacity="0.7" strokeWidth="1.4">
        <animate attributeName="stroke-dashoffset" dur="1.4s" from="0" repeatCount="indefinite" to="-12" />
      </path>
      {/* pipeline cards */}
      {[78, 100, 122].map((x, i) => (
        <g key={x} transform={`translate(${x} 28)`}>
          <rect fill="#fff" height="24" rx="2" stroke="#5b21b6" strokeOpacity="0.5" strokeWidth="0.8" width="14" />
          <rect fill={i === 2 ? "#34d8a4" : "#a78bfa"} height="1.5" opacity="0.85" rx="0.5" width="9" x="2.5" y="5" />
          <rect fill="#5b21b6" height="1.2" opacity="0.45" rx="0.5" width="6" x="2.5" y="9" />
          <rect fill="#5b21b6" height="1.2" opacity="0.45" rx="0.5" width="8" x="2.5" y="13" />
          {i === 2 && (
            <circle cx="11" cy="5" fill="#34d8a4" r="2">
              <animate attributeName="r" dur="1.4s" repeatCount="indefinite" values="2;2.6;2" />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}

function CrmIcon() {
  return (
    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 80">
      <defs>
        <linearGradient id="cm-mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect fill="url(#cm-mini-bg)" height="80" rx="6" width="160" />
      {/* funnel */}
      <g transform="translate(64 14)">
        <path d="M 0 0 L 32 0 L 26 12 L 6 12 Z" fill="#fff" opacity="0.85" stroke="#fff" strokeWidth="1" />
        <path d="M 6 12 L 26 12 L 22 24 L 10 24 Z" fill="#fff" opacity="0.7" stroke="#fff" strokeWidth="1" />
        <path d="M 10 24 L 22 24 L 19 38 L 13 38 Z" fill="#22c55e" opacity="0.95" stroke="#fff" strokeWidth="1" />
        <rect fill="#22c55e" height="6" rx="1" width="6" x="13" y="40" />
      </g>
      {/* lead avatars dropping in */}
      {[
        { x: 70, delay: 0 },
        { x: 80, delay: 0.5 },
        { x: 90, delay: 1 },
      ].map((d) => (
        <circle cx={d.x} fill="#22c55e" key={d.x} r="2.5">
          <animate attributeName="cy" begin={`${d.delay}s`} dur="1.8s" repeatCount="indefinite" values="2;12;2" />
          <animate attributeName="opacity" begin={`${d.delay}s`} dur="1.8s" keyTimes="0;0.1;0.9;1" repeatCount="indefinite" values="0;1;1;0" />
        </circle>
      ))}
      {/* lead list left */}
      <g transform="translate(8 18)">
        <rect fill="#fff" height="44" rx="2" width="36" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${i * 14})`}>
            <circle cx="6" cy="8" fill="#075985" r="2.5" />
            <line stroke="#075985" strokeLinecap="round" strokeWidth="1.4" x1="11" x2="32" y1="7" y2="7" />
            <line stroke="#075985" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="1" x1="11" x2="24" y1="10" y2="10" />
          </g>
        ))}
      </g>
      {/* analytics right */}
      <g transform="translate(116 18)">
        <rect fill="#fff" height="44" rx="2" width="38" />
        <line stroke="#075985" strokeOpacity="0.4" strokeWidth="0.6" x1="0" x2="38" y1="34" y2="34" />
        <polyline fill="none" points="2,30 10,22 18,26 26,16 36,10" stroke="#22c55e" strokeWidth="2" />
        <circle cx="36" cy="10" fill="#22c55e" r="1.5">
          <animate attributeName="r" dur="1.4s" repeatCount="indefinite" values="1.5;2.5;1.5" />
        </circle>
      </g>
    </svg>
  );
}

function DocSecIcon() {
  return (
    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 80">
      <defs>
        <linearGradient id="ds-mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#f5c46b" />
        </linearGradient>
      </defs>
      <rect fill="url(#ds-mini-bg)" height="80" rx="6" width="160" />
      {/* doc */}
      <g transform="translate(20 18)">
        <rect fill="#fff" height="44" rx="2" width="32" />
        <line stroke="#92400e" strokeLinecap="round" strokeWidth="1.2" x1="4" x2="28" y1="6" y2="6" />
        <line stroke="#92400e" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="1" x1="4" x2="24" y1="11" y2="11" />
        <line stroke="#92400e" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="1" x1="4" x2="26" y1="16" y2="16" />
        <line stroke="#92400e" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="1" x1="4" x2="20" y1="21" y2="21" />
        <line stroke="#92400e" strokeLinecap="round" strokeOpacity="0.5" strokeWidth="1" x1="4" x2="26" y1="26" y2="26" />
        {/* scan sweep */}
        <rect fill="#fbbf24" height="1.5" width="32" y="14">
          <animate attributeName="y" dur="1.6s" repeatCount="indefinite" values="2;42;2" />
        </rect>
        {/* OCR badge */}
        <rect fill="#fbbf24" height="6" rx="1" width="14" x="4" y="34" />
      </g>
      {/* arrow */}
      <path d="M 56 40 L 76 40" fill="none" stroke="#fff" strokeDasharray="3 3" strokeOpacity="0.7" strokeWidth="1.4">
        <animate attributeName="stroke-dashoffset" dur="1.4s" from="0" repeatCount="indefinite" to="-12" />
      </path>
      {/* shield with check */}
      <g transform="translate(96 14)">
        <path d="M 16 0 C 22 2 28 2 28 2 L 28 22 C 28 36 22 46 16 50 C 10 46 4 36 4 22 L 4 2 C 4 2 10 2 16 0 Z" fill="#fff" stroke="#92400e" strokeWidth="1" />
        <polyline fill="none" points="9,22 14,28 22,17" stroke="#22c55e" strokeLinejoin="round" strokeWidth="3" />
        <circle cx="16" cy="25" fill="none" opacity="0.45" r="22" stroke="#fff" strokeWidth="0.5">
          <animate attributeName="r" dur="1.8s" repeatCount="indefinite" values="22;28;22" />
          <animate attributeName="opacity" dur="1.8s" repeatCount="indefinite" values="0.45;0;0.45" />
        </circle>
      </g>
    </svg>
  );
}

function WorkforceIcon() {
  return (
    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 80">
      <defs>
        <linearGradient id="wf-mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect fill="url(#wf-mini-bg)" height="80" rx="6" width="160" />
      {/* map plane */}
      <g transform="translate(14 14)">
        <rect fill="#fff" height="52" rx="2" width="78" />
        {[0, 1, 2].map((i) => (
          <line key={`v${i}`} stroke="#1e3a8a" strokeOpacity="0.2" strokeWidth="0.5" x1={20 + i * 20} x2={20 + i * 20} y1="0" y2="52" />
        ))}
        {[0, 1].map((i) => (
          <line key={`h${i}`} stroke="#1e3a8a" strokeOpacity="0.2" strokeWidth="0.5" x1="0" x2="78" y1={18 + i * 18} y2={18 + i * 18} />
        ))}
        {/* route */}
        <path d="M 10 42 L 26 28 L 46 36 L 68 16" fill="none" stroke="#fbbf24" strokeDasharray="3 2" strokeWidth="1.4">
          <animate attributeName="stroke-dashoffset" dur="1.6s" from="0" repeatCount="indefinite" to="-10" />
        </path>
        {/* pins (pulsing) */}
        {[
          [10, 42],
          [26, 28],
          [46, 36],
          [68, 16],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} fill="#fbbf24" opacity="0.4" r="4">
              <animate attributeName="r" begin={`${i * 0.3}s`} dur="1.6s" repeatCount="indefinite" values="3;6;3" />
              <animate attributeName="opacity" begin={`${i * 0.3}s`} dur="1.6s" repeatCount="indefinite" values="0.4;0;0.4" />
            </circle>
            <circle cx={x} cy={y} fill="#fbbf24" r="2" />
          </g>
        ))}
      </g>
      {/* attendance bars */}
      <g transform="translate(102 14)">
        <rect fill="#fff" height="52" rx="2" width="46" />
        <rect fill="#1e3a8a" height="1.5" opacity="0.8" rx="0.5" width="22" x="4" y="6" />
        {[28, 18, 38, 22, 32, 42].map((h, i) => (
          <rect fill="#60a5fa" height={h} key={i} width="4" x={5 + i * 6} y={48 - h} />
        ))}
      </g>
    </svg>
  );
}

function EndpointIcon() {
  return (
    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 80">
      <defs>
        <linearGradient id="ep-mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#3730a3" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect fill="url(#ep-mini-bg)" height="80" rx="6" width="160" />
      {/* Laptop body */}
      <g transform="translate(58 18)">
        <rect fill="#fff" height="26" rx="2" width="44" />
        <rect fill="#a5b4fc" height="20" rx="1" width="38" x="3" y="3" />
        {/* Screen sweep */}
        <rect fill="#fff" height="20" opacity="0.35" rx="1" width="6" x="3" y="3">
          <animate attributeName="x" dur="2.4s" repeatCount="indefinite" values="3;35;3" />
        </rect>
        {/* Base */}
        <path d="M -2 28 L 46 28 L 50 32 L -6 32 Z" fill="#fff" />
      </g>
      {/* Phone */}
      <g transform="translate(20 22)">
        <rect fill="#fff" height="36" rx="3" stroke="#3730a3" strokeWidth="0.8" width="20" />
        <rect fill="#818cf8" height="26" rx="1" width="16" x="2" y="4" />
        <circle cx="10" cy="33" fill="#3730a3" r="1.2" />
      </g>
      {/* Sync pulse between phone & laptop */}
      <circle cx="46" cy="40" fill="#fff" r="2">
        <animate attributeName="cx" dur="1.6s" repeatCount="indefinite" values="40;58;40" />
        <animate attributeName="opacity" dur="1.6s" repeatCount="indefinite" values="0;1;0" />
      </circle>
      {/* Shield check on right */}
      <g transform="translate(122 22)">
        <path d="M 10 0 L 18 3 L 18 18 C 18 26 14 32 10 36 C 6 32 2 26 2 18 L 2 3 Z" fill="#fff" stroke="#3730a3" strokeWidth="0.8" />
        <polyline fill="none" points="6,16 9,20 14,12" stroke="#22c55e" strokeLinejoin="round" strokeWidth="2" />
      </g>
    </svg>
  );
}

function ForexIcon() {
  return (
    <svg className="h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 160 80">
      <defs>
        <linearGradient id="fx-mini-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <rect fill="url(#fx-mini-bg)" height="80" rx="6" width="160" />
      {/* Candlestick chart */}
      <g transform="translate(14 14)">
        <rect fill="#fff" height="52" rx="2" width="78" />
        <line stroke="#9f1239" strokeOpacity="0.2" strokeWidth="0.5" x1="0" x2="78" y1="36" y2="36" />
        <line stroke="#9f1239" strokeOpacity="0.2" strokeWidth="0.5" x1="0" x2="78" y1="22" y2="22" />
        {/* Candles — green up, red down */}
        <line stroke="#22c55e" strokeWidth="1" x1="8" x2="8" y1="14" y2="44" />
        <rect fill="#22c55e" height="10" width="4" x="6" y="26" />
        <line stroke="#ef4444" strokeWidth="1" x1="18" x2="18" y1="18" y2="42" />
        <rect fill="#ef4444" height="8" width="4" x="16" y="22" />
        <line stroke="#22c55e" strokeWidth="1" x1="28" x2="28" y1="12" y2="36" />
        <rect fill="#22c55e" height="12" width="4" x="26" y="18" />
        <line stroke="#22c55e" strokeWidth="1" x1="38" x2="38" y1="10" y2="30" />
        <rect fill="#22c55e" height="10" width="4" x="36" y="14" />
        <line stroke="#ef4444" strokeWidth="1" x1="48" x2="48" y1="14" y2="32" />
        <rect fill="#ef4444" height="6" width="4" x="46" y="18" />
        <line stroke="#22c55e" strokeWidth="1" x1="58" x2="58" y1="8" y2="28" />
        <rect fill="#22c55e" height="12" width="4" x="56" y="10" />
        <line stroke="#22c55e" strokeWidth="1" x1="68" x2="68" y1="6" y2="24" />
        <rect fill="#22c55e" height="10" width="4" x="66" y="8" />
        {/* Trend line */}
        <polyline fill="none" points="6,34 18,30 28,24 38,20 48,22 58,16 68,10" stroke="#9f1239" strokeWidth="1.2" />
        <circle cx="68" cy="10" fill="#9f1239" r="1.6">
          <animate attributeName="r" dur="1.4s" repeatCount="indefinite" values="1.4;2.5;1.4" />
        </circle>
      </g>
      {/* Bot signal panel */}
      <g transform="translate(102 14)">
        <rect fill="#fff" height="52" rx="2" width="46" />
        <text fill="#9f1239" fontFamily="Inter, Arial, sans-serif" fontSize="6" fontWeight="900" letterSpacing="1" x="4" y="10">EA-LIVE</text>
        <circle cx="40" cy="8" fill="#22c55e" r="2">
          <animate attributeName="opacity" dur="1.2s" repeatCount="indefinite" values="0.4;1;0.4" />
        </circle>
        {/* Bars */}
        <rect fill="#fb7185" height="3" rx="1" width="16" x="4" y="16" />
        <rect fill="#fb7185" height="3" opacity="0.6" rx="1" width="24" x="4" y="22" />
        <rect fill="#fb7185" height="3" opacity="0.45" rx="1" width="20" x="4" y="28" />
        {/* Buy/sell arrow */}
        <path d="M 12 38 L 12 46 M 9 41 L 12 38 L 15 41" fill="none" stroke="#22c55e" strokeLinecap="round" strokeWidth="1.5" />
        <text fill="#22c55e" fontFamily="Inter, Arial, sans-serif" fontSize="5" fontWeight="900" x="20" y="44">BUY</text>
      </g>
    </svg>
  );
}
