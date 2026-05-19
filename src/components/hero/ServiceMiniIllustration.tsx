"use client";

type Props = {
  slug: string;
  accent: string;
  accent2: string;
};

/**
 * Compact SVG illustrations shown inside each service mini-card on the hero.
 * They hint at the deeper product UI on the matching service page.
 */
export function ServiceMiniIllustration({ slug, accent, accent2 }: Props) {
  switch (slug) {
    case "whatsapp-automation":
      return <WhatsappMini accent={accent} accent2={accent2} />;
    case "recruitment-hr-automation":
      return <RecruitmentMini accent={accent} accent2={accent2} />;
    case "crm-ai-marketing-automation":
      return <CrmMini accent={accent} accent2={accent2} />;
    case "document-verification-security-automation":
      return <DocSecMini accent={accent} accent2={accent2} />;
    case "workforce-operations-tracking":
      return <WorkforceMini accent={accent} accent2={accent2} />;
    default:
      return null;
  }
}

function WhatsappMini({ accent, accent2 }: { accent: string; accent2: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#060c1c" height="128" width="256" />
      {/* phone outline */}
      <rect
        fill="#0c1430"
        height="100"
        rx="10"
        ry="10"
        stroke={accent}
        strokeOpacity="0.55"
        strokeWidth="1.5"
        width="58"
        x="16"
        y="14"
      />
      <rect fill={accent} height="2" opacity="0.7" rx="1" width="22" x="34" y="20" />
      {/* incoming bubbles in phone */}
      <rect fill={accent2} height="14" opacity="0.7" rx="5" width="30" x="22" y="32" />
      <rect fill={accent} height="14" opacity="0.85" rx="5" width="38" x="22" y="52" />
      <rect fill={accent2} height="14" opacity="0.55" rx="5" width="26" x="22" y="72" />
      {/* arrows toward team */}
      <path
        d="M 78 50 L 110 50"
        fill="none"
        stroke={accent}
        strokeDasharray="2 3"
        strokeWidth="1.4"
      />
      <path d="M 105 46 L 110 50 L 105 54" fill="none" stroke={accent} strokeWidth="1.4" />
      {/* team inbox panel */}
      <rect
        fill="#0c1430"
        height="80"
        rx="6"
        stroke={accent}
        strokeOpacity="0.4"
        strokeWidth="1"
        width="120"
        x="116"
        y="24"
      />
      <rect fill={accent} height="2" opacity="0.8" rx="1" width="56" x="124" y="32" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="128" cy={48 + i * 14} fill={accent2} opacity={0.75 - i * 0.12} r="3.5" />
          <rect
            fill={accent}
            height="2"
            opacity={0.55 - i * 0.08}
            rx="1"
            width={56 - i * 5}
            x="138"
            y={47 + i * 14}
          />
        </g>
      ))}
    </svg>
  );
}

function RecruitmentMini({ accent, accent2 }: { accent: string; accent2: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#060c1c" height="128" width="256" />
      {/* stacked CV cards */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 3} ${22 + i * 4})`}>
          <rect
            fill="#0c1430"
            height="78"
            rx="5"
            stroke={accent}
            strokeOpacity={0.6 - i * 0.15}
            strokeWidth="1"
            width="60"
          />
          {i === 0 && (
            <>
              <circle cx="14" cy="16" fill={accent2} r="6" />
              <rect fill={accent} height="2" opacity="0.8" rx="1" width="32" x="24" y="13" />
              <rect fill={accent} height="2" opacity="0.55" rx="1" width="22" x="24" y="20" />
              <rect fill={accent} height="2" opacity="0.4" rx="1" width="46" x="8" y="34" />
              <rect fill={accent} height="2" opacity="0.4" rx="1" width="40" x="8" y="42" />
              <rect fill={accent} height="2" opacity="0.4" rx="1" width="48" x="8" y="50" />
              <rect fill={accent} height="2" opacity="0.4" rx="1" width="38" x="8" y="58" />
              <rect fill={accent2} height="6" opacity="0.85" rx="3" width="18" x="8" y="64" />
            </>
          )}
        </g>
      ))}
      {/* pipeline arrows */}
      <path
        d="M 92 64 L 118 64"
        fill="none"
        stroke={accent}
        strokeDasharray="2 3"
        strokeWidth="1.4"
      />
      {/* pipeline cards */}
      {["Applied", "Screening", "Interview", "Hired"].map((label, i) => (
        <g key={label} transform={`translate(${122 + i * 30} ${52})`}>
          <rect
            fill="#0c1430"
            height="24"
            rx="3"
            stroke={accent}
            strokeOpacity="0.55"
            strokeWidth="1"
            width="26"
          />
          <rect
            fill={i === 3 ? accent2 : accent}
            height="2"
            opacity="0.85"
            rx="1"
            width="18"
            x="4"
            y="6"
          />
          <rect
            fill={accent}
            height="2"
            opacity="0.55"
            rx="1"
            width="10"
            x="4"
            y="14"
          />
        </g>
      ))}
    </svg>
  );
}

function CrmMini({ accent, accent2 }: { accent: string; accent2: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#060c1c" height="128" width="256" />
      {/* funnel */}
      <g transform="translate(96 16)">
        <path
          d="M 0 0 L 60 0 L 50 24 L 10 24 Z"
          fill={accent}
          opacity="0.32"
          stroke={accent}
          strokeWidth="1.2"
        />
        <path
          d="M 10 24 L 50 24 L 42 44 L 18 44 Z"
          fill={accent}
          opacity="0.45"
          stroke={accent}
          strokeWidth="1.2"
        />
        <path
          d="M 18 44 L 42 44 L 36 60 L 24 60 Z"
          fill={accent2}
          opacity="0.6"
          stroke={accent2}
          strokeWidth="1.2"
        />
        <rect fill={accent2} height="14" rx="2" width="12" x="24" y="62" />
      </g>
      {/* leads entering top */}
      <g>
        {[110, 132, 154].map((x, i) => (
          <circle cx={x} cy="8" fill={accent2} key={x} opacity={0.85 - i * 0.18} r="3" />
        ))}
      </g>
      {/* kanban left */}
      <g transform="translate(14 20)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${i * 26})`}>
            <rect
              fill="#0c1430"
              height="20"
              rx="3"
              stroke={accent}
              strokeOpacity="0.5"
              strokeWidth="1"
              width="62"
            />
            <circle cx="8" cy="10" fill={accent2} r="3" />
            <rect fill={accent} height="2" opacity="0.7" rx="1" width="40" x="16" y="6" />
            <rect fill={accent} height="2" opacity="0.4" rx="1" width="30" x="16" y="13" />
          </g>
        ))}
      </g>
      {/* analytics right */}
      <g transform="translate(180 20)">
        <rect
          fill="#0c1430"
          height="80"
          rx="3"
          stroke={accent}
          strokeOpacity="0.45"
          strokeWidth="1"
          width="62"
        />
        <rect fill={accent} height="2" opacity="0.8" rx="1" width="30" x="6" y="6" />
        {[20, 14, 28, 18, 32].map((h, i) => (
          <rect
            fill={accent2}
            height={h}
            key={i}
            opacity="0.85"
            rx="1"
            width="6"
            x={8 + i * 11}
            y={68 - h}
          />
        ))}
      </g>
    </svg>
  );
}

function DocSecMini({ accent, accent2 }: { accent: string; accent2: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#060c1c" height="128" width="256" />
      {/* document */}
      <g transform="translate(16 14)">
        <rect
          fill="#0c1430"
          height="100"
          rx="4"
          stroke={accent}
          strokeOpacity="0.55"
          strokeWidth="1"
          width="74"
        />
        <rect fill={accent} height="2" opacity="0.85" rx="1" width="50" x="8" y="10" />
        <rect fill={accent} height="2" opacity="0.55" rx="1" width="58" x="8" y="22" />
        <rect fill={accent} height="2" opacity="0.45" rx="1" width="44" x="8" y="30" />
        <rect fill={accent} height="2" opacity="0.45" rx="1" width="52" x="8" y="38" />
        <rect fill={accent} height="2" opacity="0.45" rx="1" width="40" x="8" y="46" />
        {/* scan sweep */}
        <rect fill={accent2} height="2" opacity="0.9" width="74" y="60" />
        <rect fill={accent2} height="6" opacity="0.18" width="74" y="58" />
        <rect fill={accent2} height="6" opacity="0.85" rx="2" width="32" x="8" y="78" />
      </g>
      {/* shield center */}
      <g transform="translate(110 22)">
        <path
          d="M 22 0 C 36 4 44 4 44 4 L 44 30 C 44 48 32 60 22 64 C 12 60 0 48 0 30 L 0 4 C 0 4 8 4 22 0 Z"
          fill="#1c1308"
          stroke={accent}
          strokeWidth="1.5"
        />
        <path
          d="M 12 32 L 20 40 L 34 24"
          fill="none"
          stroke={accent2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      </g>
      {/* audit log right */}
      <g transform="translate(176 16)">
        <rect
          fill="#0c1430"
          height="92"
          rx="3"
          stroke={accent}
          strokeOpacity="0.45"
          strokeWidth="1"
          width="66"
        />
        <rect fill={accent} height="2" opacity="0.8" rx="1" width="36" x="6" y="8" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(6 ${18 + i * 18})`}>
            <circle cx="3" cy="6" fill={accent2} opacity={0.85 - i * 0.15} r="2.5" />
            <rect
              fill={accent}
              height="2"
              opacity={0.55 - i * 0.08}
              rx="1"
              width={42 - i * 4}
              x="10"
              y="5"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}

function WorkforceMini({ accent, accent2 }: { accent: string; accent2: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#060c1c" height="128" width="256" />
      {/* map */}
      <g transform="translate(14 16)">
        <rect
          fill="#0c1430"
          height="96"
          rx="4"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="1"
          width="130"
        />
        {/* grid */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`v${i}`}
            stroke={accent}
            strokeOpacity="0.18"
            strokeWidth="0.5"
            x1={i * 32}
            x2={i * 32}
            y1="0"
            y2="96"
          />
        ))}
        {[0, 1, 2].map((i) => (
          <line
            key={`h${i}`}
            stroke={accent}
            strokeOpacity="0.18"
            strokeWidth="0.5"
            x1="0"
            x2="130"
            y1={i * 32}
            y2={i * 32}
          />
        ))}
        {/* route */}
        <path
          d="M 18 72 L 44 50 L 72 60 L 102 32"
          fill="none"
          stroke={accent}
          strokeDasharray="3 3"
          strokeWidth="1.5"
        />
        {/* pins */}
        {[
          [18, 72],
          [44, 50],
          [72, 60],
          [102, 32],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} fill={accent2} r="5" />
            <circle cx={x} cy={y} fill={accent2} opacity="0.3" r="9" />
          </g>
        ))}
      </g>
      {/* attendance card */}
      <g transform="translate(154 18)">
        <rect
          fill="#0c1430"
          height="92"
          rx="3"
          stroke={accent}
          strokeOpacity="0.45"
          strokeWidth="1"
          width="88"
        />
        <rect fill={accent} height="2" opacity="0.85" rx="1" width="56" x="8" y="10" />
        <rect fill={accent} height="6" opacity="0.4" rx="1" width="68" x="8" y="22" />
        {/* bars */}
        {[18, 26, 12, 32, 22, 28].map((h, i) => (
          <rect
            fill={accent2}
            height={h}
            key={i}
            opacity="0.85"
            rx="1"
            width="9"
            x={9 + i * 12}
            y={78 - h}
          />
        ))}
      </g>
    </svg>
  );
}
