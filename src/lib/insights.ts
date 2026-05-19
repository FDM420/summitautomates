/**
 * Insight (blog) posts. Used by /insights index + /insights/[slug] pages.
 * Body is hand-written markdown-like sections rendered server-side.
 */

export type InsightSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export type Insight = {
  slug: string;
  title: string;
  /** 1-line dek shown on cards + meta description */
  excerpt: string;
  category: "Playbook" | "Strategy" | "Implementation" | "Case Pattern";
  /** ISO date string */
  publishedAt: string;
  /** Estimated minutes to read */
  readingMinutes: number;
  /** SEO keywords */
  keywords: string[];
  /** Body of the article */
  body: InsightSection[];
};

export const insights: Insight[] = [
  {
    slug: "what-actually-happens-when-you-automate-whatsapp",
    title: "What actually happens when you automate WhatsApp for a business",
    excerpt:
      "A non-technical breakdown of how WhatsApp automation works in practice — from auto-replies to lead routing — and what to expect in the first 30 days.",
    category: "Playbook",
    publishedAt: "2026-05-12",
    readingMinutes: 7,
    keywords: [
      "WhatsApp automation",
      "WhatsApp business AI",
      "WhatsApp auto-reply",
      "customer support automation",
      "lead routing",
    ],
    body: [
      {
        type: "p",
        text: "Most business owners hear 'WhatsApp automation' and picture a bot that replies 'Hi, how can I help you?'. That's the smallest 1% of what it actually is. This guide walks through what a proper WhatsApp automation system does in the real world — and what changes for your team in the first 30 days.",
      },
      {
        type: "h2",
        text: "The five things WhatsApp automation actually handles",
      },
      {
        type: "p",
        text: "When Summit builds a WhatsApp automation system, it sits between your customers and your team. It does five jobs:",
      },
      {
        type: "ul",
        items: [
          "Auto-reply for repeated questions — pricing, hours, location, return policy. The system answers instantly with the right info, every time.",
          "Intent detection — when a customer says 'I want to buy', 'I have a problem', or 'can someone call me', the system knows which it is and acts.",
          "Lead routing — serious inquiries get tagged, scored, and pushed to the right person on your team. No more leads buried in a busy chat list.",
          "Shared team inbox — one view of every conversation, with assignments and internal notes. No more 'who's replying to that customer?' confusion.",
          "Voice note transcription — voice messages get turned into text and routed like any other inquiry, so they don't sit unread.",
        ],
      },
      {
        type: "h2",
        text: "Week 1 — what you actually feel",
      },
      {
        type: "p",
        text: "In the first week, the most obvious change is response speed. Customers who would have waited 4 hours for a reply now get one in seconds. Auto-replies handle around 60–70% of incoming messages without needing human input. Your team gets fewer interruptions and starts focusing on the conversations that actually matter.",
      },
      {
        type: "h2",
        text: "Week 2–4 — what changes for the manager",
      },
      {
        type: "p",
        text: "By week two, the manager view becomes the biggest win. You can see how many leads came in, how many were auto-handled, how many escalated, and which agent handled what. Bottlenecks become visible — maybe one product line is generating 40% of complaints. Without the system, you'd never spot the pattern.",
      },
      {
        type: "callout",
        text: "The goal isn't to remove humans. It's to make sure humans spend their time on the conversations only humans can win.",
      },
      {
        type: "h2",
        text: "What it doesn't do",
      },
      {
        type: "ul",
        items: [
          "It doesn't fake being human. Customers know they're talking to an automated system; the system is just fast and accurate.",
          "It doesn't replace closing conversations. Final negotiation, custom requests, and sensitive cases always reach a human.",
          "It doesn't lock you into one platform. Summit builds systems that connect to your existing CRM, tools, and processes.",
        ],
      },
      {
        type: "h2",
        text: "Next steps",
      },
      {
        type: "p",
        text: "If you're handling repeated questions on WhatsApp, losing leads in busy chat lists, or wishing you had a manager view of customer conversations — start with a discovery call. We map your current flow, propose what to automate, and quote the rollout.",
      },
    ],
  },
  {
    slug: "ai-cv-screening-without-bias-what-actually-works",
    title: "AI CV screening without bias — what actually works",
    excerpt:
      "How serious recruitment automation handles CV screening at scale without introducing the bias problems that early AI hiring tools were rightly criticized for.",
    category: "Strategy",
    publishedAt: "2026-05-06",
    readingMinutes: 9,
    keywords: [
      "AI CV screening",
      "bias-free recruitment AI",
      "automated candidate scoring",
      "recruitment automation ethics",
      "fair hiring AI",
    ],
    body: [
      {
        type: "p",
        text: "Recruitment AI got a bad reputation in the late 2010s for good reasons — early tools learned from biased historical hiring data and made the bias worse. The technology has moved on, but the question is reasonable: how do you actually do AI CV screening at scale without re-introducing those problems?",
      },
      {
        type: "h2",
        text: "The bias problem in one paragraph",
      },
      {
        type: "p",
        text: "Old systems trained on years of past hiring decisions. If a company had historically hired more men, the model learned that male-coded signals (Ivy League schools, certain hobbies) correlated with 'good hire'. The model didn't know it was being unfair — it was just optimizing for what its training data told it 'good' looked like. The fix isn't to abandon AI; it's to be deliberate about what the model is allowed to see and how it scores.",
      },
      {
        type: "h2",
        text: "What modern, defensible CV screening looks like",
      },
      {
        type: "h3",
        text: "1. Score against the job, not the person",
      },
      {
        type: "p",
        text: "A defensible system scores a CV against the specific requirements of the open role — skills, seniority bracket, qualifications, location. It doesn't try to predict 'is this person a good fit' from soft signals. The output is a transparent match score with the contributing factors visible.",
      },
      {
        type: "h3",
        text: "2. Blind-on-demand fields",
      },
      {
        type: "p",
        text: "Name, age, address, photo, school name — these get masked when scoring. The recruiter can see them when reviewing the candidate, but the AI doesn't use them. This is the single biggest lever against introducing bias.",
      },
      {
        type: "h3",
        text: "3. Auditable decisions",
      },
      {
        type: "p",
        text: "Every score is explainable. 'Match score 87 because: 5 years backend experience matches required 4+, AWS certification matches required cloud experience, location matches required hybrid setup.' If you can't audit the reason, you can't defend the decision.",
      },
      {
        type: "h3",
        text: "4. Human gate, always",
      },
      {
        type: "p",
        text: "AI proposes shortlists. Humans reject, advance, or override every decision. The AI never auto-rejects without a human review. This is non-negotiable.",
      },
      {
        type: "callout",
        text: "AI CV screening should compress a recruiter's day from 'read 200 CVs' to 'review 30 ranked shortlists, override where needed.' That's the only honest version of the tool.",
      },
      {
        type: "h2",
        text: "What we build at Summit",
      },
      {
        type: "ul",
        items: [
          "Match scoring against role-specific requirements only — no historical hiring data, no soft-signal predictions.",
          "Blind-on-demand fields for protected attributes during AI scoring.",
          "Full audit trail for every score — visible contributing factors, retained for compliance.",
          "Recruiter override is one click; the system learns from the override pattern, not from biased history.",
        ],
      },
      {
        type: "h2",
        text: "Not the right fit for everyone",
      },
      {
        type: "p",
        text: "AI CV screening pays off when you're handling 50+ CVs per role per week. Below that, manual review by a good recruiter beats any system. Above it, the system frees up real recruiter hours for the conversations that actually matter — interviews, offers, and candidate care.",
      },
    ],
  },
  {
    slug: "the-five-week-rollout-pattern-for-automation-projects",
    title: "The 5-week rollout pattern for automation projects",
    excerpt:
      "Most failed automation projects fail in the same way — too much scope, too late a launch. This is the lean rollout pattern that ships value in week two.",
    category: "Implementation",
    publishedAt: "2026-04-28",
    readingMinutes: 6,
    keywords: [
      "automation project rollout",
      "AI project implementation",
      "phased automation rollout",
      "MVP automation",
      "business workflow automation",
    ],
    body: [
      {
        type: "p",
        text: "Most automation projects that fail share one cause: they tried to automate everything at once, didn't ship anything for 3 months, and lost stakeholder confidence before the system went live. The pattern that works is the opposite — narrow first, ship fast, expand from a working base.",
      },
      {
        type: "h2",
        text: "Week 1 — Discovery & one workflow",
      },
      {
        type: "p",
        text: "Pick one workflow. Not three, not 'all of customer support'. One. Something like 'auto-reply to pricing questions on WhatsApp' or 'AI-screen incoming CVs for the senior engineer role'. Map the current manual process step by step. Identify the exact decision rules. Spec the integrations needed.",
      },
      {
        type: "h2",
        text: "Week 2 — Build & test",
      },
      {
        type: "p",
        text: "Build the chosen workflow. End-to-end. Integrated. Tested with real (anonymized) production data. By end of week 2, you have a system that handles the chosen scenario correctly — but it's running in shadow mode, not live.",
      },
      {
        type: "h2",
        text: "Week 3 — Live with safety net",
      },
      {
        type: "p",
        text: "Turn it on for real traffic, but with a human reviewing every output for the first week. The team validates the system is making correct decisions before the safety net comes off. Tune any edge cases that emerge.",
      },
      {
        type: "h2",
        text: "Week 4 — Autonomy + dashboard",
      },
      {
        type: "p",
        text: "Remove the human review for the cases the system handles well. Keep humans on the edge cases. Ship the manager dashboard showing volume handled, escalations, error rate, and time saved. This is where stakeholders start asking 'what else can we automate?'.",
      },
      {
        type: "h2",
        text: "Week 5 — Expand from the working base",
      },
      {
        type: "p",
        text: "With one workflow live, working, and measurable — you've earned the right to add the next. Pick the next workflow, repeat the cycle. After 5 such cycles, you have 5 automated workflows, each working, each measurable, each adding value.",
      },
      {
        type: "callout",
        text: "The companies that win at automation aren't the ones who plan biggest. They're the ones who ship something working in week 2 and keep that pace.",
      },
      {
        type: "h2",
        text: "What kills this pattern",
      },
      {
        type: "ul",
        items: [
          "Scope creep in week 1 — 'let's add CRM integration too'. Don't. Ship one workflow first.",
          "Skipping week 3 — going straight to live without a human review week. The first edge case kills stakeholder trust.",
          "No dashboard in week 4 — if leadership can't see the value, they won't fund the next phase.",
          "Treating week 5 as 'project done'. The whole point is that week 5 is the start of the next cycle.",
        ],
      },
    ],
  },
];

export const insightsBySlug: Record<string, Insight> = Object.fromEntries(
  insights.map((insight) => [insight.slug, insight]),
);
