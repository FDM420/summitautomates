"use client";

import { SERVICE_MODULES_BY_SLUG } from "@/lib/services-config";
import { AiDocumentHeroScene } from "./AiDocumentHeroScene";
import { AiVideoHeroScene } from "./AiVideoHeroScene";
import { AiVoiceAgentsHeroScene } from "./AiVoiceAgentsHeroScene";
import { CrmMarketingHeroScene } from "./CrmMarketingHeroScene";
import { CustomSoftwareHeroScene } from "./CustomSoftwareHeroScene";
import { DocSecurityHeroScene } from "./DocSecurityHeroScene";
import { EndpointHeroScene } from "./EndpointHeroScene";
import { ForexHeroScene } from "./ForexHeroScene";
import { RecruitmentHeroScene } from "./RecruitmentHeroScene";
import { ServiceHeroShell } from "./ServiceHeroShell";
import { WhatsappHeroScene } from "./WhatsappHeroScene";
import { WorkforceHeroScene } from "./WorkforceHeroScene";

type Stat = { value: string; label: string };

const STATS_BY_SLUG: Record<string, Stat[]> = {
  "whatsapp-automation": [
    { value: "24/7", label: "Reply coverage" },
    { value: "1", label: "Shared inbox" },
    { value: "100%", label: "Automated triage" },
    { value: "2x+", label: "Faster response" },
  ],
  "recruitment-hr-automation": [
    { value: "70%", label: "Faster time to hire" },
    { value: "95%", label: "Screening accuracy" },
    { value: "60%", label: "Reduced workload" },
    { value: "100%", label: "Compliance covered" },
  ],
  "crm-ai-marketing-automation": [
    { value: "Live", label: "Lead visibility" },
    { value: "Tracked", label: "Follow-up flow" },
    { value: "$4.28M", label: "Pipeline value" },
    { value: "98%", label: "AI automation" },
  ],
  "document-verification-security-automation": [
    { value: "500K+", label: "Documents verified" },
    { value: "99.5%", label: "Extraction accuracy" },
    { value: "98%", label: "Expiry alerts on time" },
    { value: "100%", label: "Audit trail coverage" },
  ],
  "workforce-operations-tracking": [
    { value: "Verified", label: "GPS attendance" },
    { value: "Daily", label: "Operations reports" },
    { value: "Live", label: "Manager visibility" },
    { value: "+12%", label: "Productivity lift" },
  ],
  "ai-voice-agents": [
    { value: "24/7", label: "Call coverage" },
    { value: "100%", label: "Calls recorded" },
    { value: "Auto", label: "QA scoring" },
    { value: "2x+", label: "Calls handled" },
  ],
  "ai-document-generation": [
    { value: "Minutes", label: "Draft turnaround" },
    { value: "PDF", label: "Branded export" },
    { value: "100%", label: "Human reviewed" },
    { value: "Cited", label: "Source aware" },
  ],
  "ai-video-generation": [
    { value: "Daily", label: "Trend sourcing" },
    { value: "Auto", label: "Captions" },
    { value: "Brand", label: "Templated" },
    { value: "10x", label: "More output" },
  ],
  "custom-software-development": [
    { value: "Full-stack", label: "Web & SaaS" },
    { value: "Prod", label: "Shipped live" },
    { value: "CI/CD", label: "Automated deploy" },
    { value: "Live", label: "Dashboards" },
  ],
  "endpoint-device-management": [
    { value: "All OS", label: "iOS·Android·Win·mac" },
    { value: "Remote", label: "Lock & wipe" },
    { value: "Auto", label: "Patching" },
    { value: "1", label: "Fleet dashboard" },
  ],
  "forex-trading-automation": [
    { value: "MT4/5", label: "Integration" },
    { value: "24/5", label: "Bot uptime" },
    { value: "Tested", label: "Backtested strategies" },
    { value: "Live", label: "Portfolio view" },
  ],
};

function PickScene({ slug }: { slug: string }) {
  switch (slug) {
    case "whatsapp-automation":
      return <WhatsappHeroScene />;
    case "recruitment-hr-automation":
      return <RecruitmentHeroScene />;
    case "crm-ai-marketing-automation":
      return <CrmMarketingHeroScene />;
    case "document-verification-security-automation":
      return <DocSecurityHeroScene />;
    case "workforce-operations-tracking":
      return <WorkforceHeroScene />;
    case "ai-voice-agents":
      return <AiVoiceAgentsHeroScene />;
    case "ai-document-generation":
      return <AiDocumentHeroScene />;
    case "ai-video-generation":
      return <AiVideoHeroScene />;
    case "custom-software-development":
      return <CustomSoftwareHeroScene />;
    case "endpoint-device-management":
      return <EndpointHeroScene />;
    case "forex-trading-automation":
      return <ForexHeroScene />;
    default:
      return null;
  }
}

type ServiceHeroProps = {
  slug: string;
  title?: string;
  description?: string;
};

export function ServiceHero({ slug, title, description }: ServiceHeroProps) {
  const svc = SERVICE_MODULES_BY_SLUG[slug];
  if (!svc) return null;
  return (
    <ServiceHeroShell
      description={description}
      module={svc}
      primaryCta={{ label: "Book a Discovery Call", href: "#contact" }}
      scene={<PickScene slug={slug} />}
      secondaryCta={{ label: "View Workflow", href: "#workflow" }}
      stats={STATS_BY_SLUG[slug]}
      title={title}
    />
  );
}
