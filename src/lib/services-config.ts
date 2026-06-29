import {
  Clapperboard,
  Code2,
  FileText,
  Laptop,
  LineChart,
  MapPinned,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type ServiceAccent =
  | "teal"
  | "violet"
  | "cyan"
  | "gold"
  | "sky"
  | "indigo"
  | "rose"
  | "emerald"
  | "amber"
  | "fuchsia"
  | "blue";

export type ServiceModule = {
  slug: string;
  shortName: string;
  fullName: string;
  tagline: string;
  blurb: string;
  accent: ServiceAccent;
  /** Hex color for 3D materials and inline styles. Matches the accent. */
  hex: string;
  /** Secondary hex used for gradients and beam endpoints. */
  hexSecondary: string;
  Icon: LucideIcon;
  /** Pentagon orbit angle (radians from positive X axis, CCW). 5 modules evenly spaced. */
  orbitAngle: number;
  /** Pixel-ish radius used in the orbit layout (3D units). */
  orbitRadius: number;
  /** Three pithy capability bullets shown on the directory card. */
  capabilities: [string, string, string];
  /**
   * Optional Spline scene URL (.splinecode). When provided, the directory card uses
   * this Spline scene as its 3D illustration; otherwise it falls back to the procedural
   * Three.js + HTML composition.
   *
   * To get a URL: design a scene at https://spline.design, click "Export" → "Code Export
   * (Web)" → copy the URL ending in `.splinecode`.
   */
  splineUrl?: string;
  /**
   * Optional path to a pre-rendered card image (e.g. /cards/whatsapp.png).
   * When provided, the entire directory card becomes this image with a "View service"
   * overlay button. Highest priority over Spline/procedural.
   *
   * Drop your image at /public/cards/{name}.png and set this to /cards/{name}.png.
   */
  imageUrl?: string;
  /**
   * If your imageUrl includes a "Design Instructions" sidebar on the right (like the
   * ChatGPT-generated mockups), set this to the percentage to crop from the right.
   * E.g. 40 means hide the rightmost 40% of the image.
   * Default 0 (no crop).
   */
  imageCropRight?: number;
};

const TAU = Math.PI * 2;
const ORBIT_COUNT = 11;
const orbit = (i: number) => Math.PI / 2 - (i * TAU) / ORBIT_COUNT;

export const SERVICE_MODULES: ServiceModule[] = [
  {
    slug: "whatsapp-automation",
    shortName: "WhatsApp Automation",
    fullName: "WhatsApp & Communication Automation",
    tagline: "Auto-reply, sort leads, share inbox.",
    blurb:
      "Auto-replies for common questions, voice-note transcription, shared team inbox, and smart routing so serious leads never get lost in a busy chat list.",
    accent: "teal",
    hex: "#5eead4",
    hexSecondary: "#4fd1ff",
    Icon: MessageSquareText,
    orbitAngle: orbit(0),
    orbitRadius: 3.4,
    capabilities: ["AI auto-replies", "Voice transcription", "Shared inbox"],
    // imageUrl: "/cards/whatsapp.png",
    // imageCropRight: 40,
  },
  {
    slug: "recruitment-hr-automation",
    shortName: "Recruitment & HR",
    fullName: "Recruitment & HR Automation",
    tagline: "Screen CVs, track candidates, onboard fast.",
    blurb:
      "AI CV screening, candidate pipeline tracking, interview scheduling, document checks, and onboarding handoff — all in one workflow.",
    accent: "violet",
    hex: "#7c82ff",
    hexSecondary: "#a855f7",
    Icon: UsersRound,
    orbitAngle: orbit(1),
    orbitRadius: 3.4,
    capabilities: ["AI CV screening", "Hiring pipeline", "Onboarding sync"],
    // imageUrl: "/cards/recruitment.png",
    // imageCropRight: 40,
  },
  {
    slug: "crm-ai-marketing-automation",
    shortName: "CRM & AI Marketing",
    fullName: "CRM, Lead Management & AI Marketing",
    tagline: "Capture leads, follow up, run campaigns.",
    blurb:
      "Lead capture and routing, sales follow-up automation, AI content drafts, campaign task automation, and reporting dashboards for sales and marketing.",
    accent: "cyan",
    hex: "#4fd1ff",
    hexSecondary: "#5eead4",
    Icon: TrendingUp,
    orbitAngle: orbit(2),
    orbitRadius: 3.4,
    capabilities: ["Lead routing", "Follow-up reminders", "AI campaign drafts"],
    // imageUrl: "/cards/crm.png",
    // imageCropRight: 40,
  },
  {
    slug: "document-verification-security-automation",
    shortName: "Document & Security",
    fullName: "Document Verification & Security",
    tagline: "OCR, expiry checks, audit trail.",
    blurb:
      "OCR extraction, ID/passport verification, expiry tracking, role-based access control, audit logging, and compliance reporting.",
    accent: "gold",
    hex: "#f5c46b",
    hexSecondary: "#fcd34d",
    Icon: ShieldCheck,
    orbitAngle: orbit(3),
    orbitRadius: 3.4,
    capabilities: ["OCR + verification", "Access control", "Audit trails"],
    // imageUrl: "/cards/docsec.png",
    // imageCropRight: 40,
  },
  {
    slug: "workforce-operations-tracking",
    shortName: "Workforce & Ops",
    fullName: "Workforce & Operations Tracking",
    tagline: "Attendance, GPS, daily reports.",
    blurb:
      "GPS-verified check-ins, shift and overtime tracking, daily operations reports, productivity dashboards, and supervisor alerts in real time.",
    accent: "sky",
    hex: "#60a5fa",
    hexSecondary: "#818cf8",
    Icon: MapPinned,
    orbitAngle: orbit(4),
    orbitRadius: 3.4,
    capabilities: ["GPS attendance", "Shift tracking", "Live dashboards"],
  },
  {
    slug: "endpoint-device-management",
    shortName: "Endpoint & Devices",
    fullName: "Endpoint & Device Management",
    tagline: "Enroll, secure, patch, recover.",
    blurb:
      "Unified mobile and laptop management — device enrollment, security policies, remote wipe, patch automation, app deployment, and a single fleet dashboard across iOS, Android, Windows, and macOS.",
    accent: "indigo",
    hex: "#818cf8",
    hexSecondary: "#6366f1",
    Icon: Laptop,
    orbitAngle: orbit(5),
    orbitRadius: 3.4,
    capabilities: ["MDM + laptop fleet", "Patch automation", "Remote wipe & lock"],
  },
  {
    slug: "forex-trading-automation",
    shortName: "Forex & Trading",
    fullName: "Forex & Trading Automation",
    tagline: "MT5 EAs, indicators, AI bots.",
    blurb:
      "MT4/MT5 integration, custom Expert Advisor development, AI-augmented trading bots, indicator engineering, strategy backtesting, and trading portal dashboards.",
    accent: "rose",
    hex: "#fb7185",
    hexSecondary: "#f43f5e",
    Icon: LineChart,
    orbitAngle: orbit(6),
    orbitRadius: 3.4,
    capabilities: ["Custom MT5 EAs", "AI trading bots", "Strategy backtesting"],
  },
  {
    slug: "ai-voice-agents",
    shortName: "AI Voice Agents",
    fullName: "AI Voice Agents & Call Automation",
    tagline: "Answer and make calls, around the clock.",
    blurb:
      "Human-sounding AI agents that handle inbound and outbound calls — answering FAQs, qualifying leads, booking appointments, and following up — with live-agent handoff, recording, transcription, and QA scoring.",
    accent: "emerald",
    hex: "#34d399",
    hexSecondary: "#10b981",
    Icon: PhoneCall,
    orbitAngle: orbit(7),
    orbitRadius: 3.4,
    capabilities: ["Inbound + outbound calls", "Lead qualification + booking", "Recording + QA scoring"],
  },
  {
    slug: "ai-document-generation",
    shortName: "AI Document Gen",
    fullName: "AI Document & Content Generation",
    tagline: "Plans, proposals, reports — drafted fast.",
    blurb:
      "Generate polished business plans, proposals, reports, and compliance packs from a short brief — structured, on-brand, citation-aware, and export-ready as PDF, with a human review-and-edit loop.",
    accent: "amber",
    hex: "#fbbf24",
    hexSecondary: "#f59e0b",
    Icon: FileText,
    orbitAngle: orbit(8),
    orbitRadius: 3.4,
    capabilities: ["Plans + proposals + reports", "Branded PDF export", "Human review loop"],
  },
  {
    slug: "ai-video-generation",
    shortName: "AI Video & Media",
    fullName: "AI Video & Media Generation",
    tagline: "Short-form video, sourced and produced.",
    blurb:
      "AI-assisted short-form and marketing video — trend sourcing, script-to-video, captions, and brand templates — so social and ad creative ships at scale without a full production team.",
    accent: "fuchsia",
    hex: "#e879f9",
    hexSecondary: "#d946ef",
    Icon: Clapperboard,
    orbitAngle: orbit(9),
    orbitRadius: 3.4,
    capabilities: ["Trend sourcing", "Script-to-video", "Captions + brand kit"],
  },
  {
    slug: "custom-software-development",
    shortName: "Custom Software",
    fullName: "Custom Software, SaaS & Web Development",
    tagline: "Full products: web apps, SaaS, portals.",
    blurb:
      "End-to-end product builds — multi-tenant SaaS, marketplaces, internal tools, dashboards, and websites — designed, built, and shipped to production with the same reliability focus as our automation modules.",
    accent: "blue",
    hex: "#3b82f6",
    hexSecondary: "#2563eb",
    Icon: Code2,
    orbitAngle: orbit(10),
    orbitRadius: 3.4,
    capabilities: ["Web & SaaS apps", "Dashboards + portals", "Production-grade delivery"],
  },
];

export const SERVICE_MODULES_BY_SLUG: Record<string, ServiceModule> = Object.fromEntries(
  SERVICE_MODULES.map((m) => [m.slug, m]),
);

/** Hex utility — apply opacity to a hex color. Returns `rgba(...)`. */
export function hexWithAlpha(hex: string, alpha: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
