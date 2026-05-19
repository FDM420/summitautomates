/**
 * Industry vertical pages — one entry per industry landing page at /industries/[slug].
 * Each industry is a separately-indexable, long-tail SEO page.
 */

export type Industry = {
  slug: string;
  name: string;
  /** Used in <title> + H1 */
  hero: string;
  /** Used in <meta description> */
  metaDescription: string;
  /** Sub-heading paragraph under H1 */
  intro: string;
  /** 4 specific pain points this vertical hits */
  pains: { title: string; description: string }[];
  /** 4 automation outcomes tailored to this vertical */
  outcomes: { title: string; description: string }[];
  /** Which Summit services are most relevant — link slugs */
  relevantServices: string[];
  /** Keywords for the page */
  keywords: string[];
};

export const industries: Industry[] = [
  {
    slug: "recruitment-agencies",
    name: "Recruitment Agencies",
    hero: "AI automation for recruitment agencies",
    metaDescription:
      "Summit builds recruitment automation for agencies — CV screening, candidate pipelines, interview scheduling, document checks, and onboarding handoff in one connected workflow.",
    intro:
      "Recruitment agencies juggle CVs, interviews, document checks, and client updates across spreadsheets and inboxes. Summit replaces that scramble with a connected pipeline — AI screens CVs, scores candidates, books interviews, and pushes shortlists to your client team automatically.",
    pains: [
      {
        title: "Hundreds of CVs every week",
        description:
          "Manual CV review is slow and inconsistent. Junior recruiters spend the day reading PDFs instead of placing candidates.",
      },
      {
        title: "Candidates dropping out of the pipeline",
        description:
          "Without consistent follow-up, strong candidates go quiet. Days between contact reduce the chance of a successful placement.",
      },
      {
        title: "Document checks slow down placements",
        description:
          "ID checks, work permits, and references stack up. Clients want shortlists fast — manual document verification stretches every cycle.",
      },
      {
        title: "Client updates eat the day",
        description:
          "Recruiters spend hours writing status emails to clients about candidate progress instead of running interviews.",
      },
    ],
    outcomes: [
      {
        title: "Auto-screened candidate shortlists",
        description:
          "Every CV gets a match score, skill summary, and seniority bracket. Recruiters open the day to a ranked shortlist, not a slush pile.",
      },
      {
        title: "Always-on candidate nurture",
        description:
          "WhatsApp and email auto-follow-ups keep candidates warm — interview reminders, document requests, and offer updates happen without manual chasing.",
      },
      {
        title: "Document checks in minutes, not days",
        description:
          "OCR extracts ID and certification data, flags expiry, and stores audit trails for compliance. Clients get a clean candidate file at the first interview.",
      },
      {
        title: "Live client dashboards",
        description:
          "Clients can self-serve their pipeline view — candidates per stage, interview slots, and offer status — replacing the daily email update.",
      },
    ],
    relevantServices: [
      "recruitment-hr-automation",
      "document-verification-security-automation",
      "whatsapp-automation",
    ],
    keywords: [
      "recruitment agency automation",
      "AI CV screening for recruiters",
      "recruitment software automation",
      "automated candidate pipeline",
      "agency recruiter AI tools",
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    hero: "AI automation for real estate teams",
    metaDescription:
      "Summit automates lead capture, viewing scheduling, follow-up, and document workflows for real estate agencies — across WhatsApp, CRM, and live dashboards.",
    intro:
      "Real estate is a follow-up business. Leads arrive on portals, agents juggle viewings, and contracts stack up. Summit builds automation that captures every lead, books viewings, nurtures buyers/tenants, and keeps the deal pipeline visible to the broker in real time.",
    pains: [
      {
        title: "Leads from 5+ sources go cold",
        description:
          "Listings on Zillow, agency site, WhatsApp, Facebook — leads land in different inboxes and most go un-replied within an hour.",
      },
      {
        title: "Viewing scheduling is manual chaos",
        description:
          "Agents play phone tag for viewing slots. Buyers drop out when nobody confirms within a few hours.",
      },
      {
        title: "No clarity on the active pipeline",
        description:
          "Brokers can't see what's hot today across the team. Deals slip because nobody owned the next step.",
      },
      {
        title: "Repeat questions burn agent time",
        description:
          "Half the messages are the same: price, area, parking, school zone. Agents type the same reply ten times a day.",
      },
    ],
    outcomes: [
      {
        title: "All leads in one inbox, replied in seconds",
        description:
          "Lead capture from every portal flows into a single team inbox. AI replies to repeat questions and routes serious buyers to the right agent.",
      },
      {
        title: "Auto-scheduled viewings",
        description:
          "Buyers pick a viewing slot from a link. Calendar invites, reminders, and post-viewing follow-up run automatically.",
      },
      {
        title: "Live deal pipeline for the broker",
        description:
          "Kanban board shows every active deal, its stage, the agent, and the next step — broker can see slipping deals before they're lost.",
      },
      {
        title: "Document workflow for contracts",
        description:
          "Lease agreements, ID checks, and deposit confirmations move through a tracked workflow with audit logs.",
      },
    ],
    relevantServices: [
      "whatsapp-automation",
      "crm-ai-marketing-automation",
      "document-verification-security-automation",
    ],
    keywords: [
      "real estate automation",
      "real estate CRM automation",
      "AI for real estate agents",
      "property viewing scheduling automation",
      "real estate WhatsApp automation",
    ],
  },
  {
    slug: "clinics-and-healthcare",
    name: "Clinics & Healthcare",
    hero: "AI automation for clinics and healthcare teams",
    metaDescription:
      "Summit automates appointment booking, reminders, patient document workflows, and live operations dashboards for clinics, dental practices, and outpatient teams.",
    intro:
      "Clinics lose hours to the phone. Patients book, reschedule, and ask the same questions over and over. Summit builds automation that handles bookings on WhatsApp, sends reminders that reduce no-shows, captures patient documents securely, and gives the practice manager a clean daily view.",
    pains: [
      {
        title: "Reception spends the day on the phone",
        description:
          "Half the day is taken by booking, rescheduling, and explaining clinic hours — every call is the same five questions.",
      },
      {
        title: "No-shows cost real money",
        description:
          "Without reliable reminders, missed appointments stack up. Each no-show is lost revenue and a wasted slot.",
      },
      {
        title: "Patient documents in piles",
        description:
          "Insurance forms, ID copies, and prescriptions scatter across paper, WhatsApp, and email. Compliance is a daily worry.",
      },
      {
        title: "No clear view of the day",
        description:
          "Practice manager can't see appointments-vs-capacity, doctor utilization, or the day's revenue without manually compiling.",
      },
    ],
    outcomes: [
      {
        title: "Self-serve WhatsApp booking",
        description:
          "Patients book a slot via WhatsApp menu — the system checks doctor availability, confirms in seconds, and adds to the doctor's calendar.",
      },
      {
        title: "Reminders that cut no-shows",
        description:
          "Auto-reminders on WhatsApp/SMS 24 hours and 2 hours before the appointment, with one-tap confirm/reschedule.",
      },
      {
        title: "Secure document intake",
        description:
          "Patients upload ID/insurance via a private link. OCR extracts the data, files it correctly, and logs an audit trail.",
      },
      {
        title: "Daily clinic dashboard",
        description:
          "Live view of bookings, no-shows, doctor load, and revenue — the practice manager opens the day with one screen.",
      },
    ],
    relevantServices: [
      "whatsapp-automation",
      "document-verification-security-automation",
      "workforce-operations-tracking",
    ],
    keywords: [
      "clinic automation",
      "healthcare WhatsApp booking",
      "AI appointment reminders",
      "clinic management automation",
      "patient document automation",
    ],
  },
  {
    slug: "call-centers",
    name: "Call Centers",
    hero: "AI automation for call centers and BPOs",
    metaDescription:
      "Summit builds AI automation for call centers — auto-replies, ticket routing, agent dashboards, QA scoring, and live operations reporting.",
    intro:
      "Call centers run on volume. Repetitive questions, ticket sorting, and agent supervision eat the day. Summit builds AI that handles tier-1 questions automatically, routes complex tickets to the right agent, and gives floor managers a live operations view of every shift.",
    pains: [
      {
        title: "Tier-1 questions eat 60% of agent time",
        description:
          "Order status, password reset, hours, refund policy — agents repeat the same answers thousands of times a week.",
      },
      {
        title: "Tickets land in the wrong queue",
        description:
          "Without smart routing, billing questions go to support agents and vice versa, doubling resolution time.",
      },
      {
        title: "QA happens too late",
        description:
          "Quality scores arrive a week later by spreadsheet. Bad calls go uncorrected because feedback is delayed.",
      },
      {
        title: "No live view of floor performance",
        description:
          "Floor managers can't see which agents are overloaded, who's idle, or which queues are blowing up — until it's too late.",
      },
    ],
    outcomes: [
      {
        title: "Auto-handling of tier-1 traffic",
        description:
          "AI deflects routine questions on WhatsApp, web chat, and voice — agents only handle escalations and complex cases.",
      },
      {
        title: "Smart ticket routing",
        description:
          "Intent classification sends each ticket to the right queue automatically — billing, technical, churn risk, VIP — at the second it arrives.",
      },
      {
        title: "Real-time QA scoring",
        description:
          "Every call/chat is AI-scored against your QA rubric the moment it ends. Trends, agent coaching, and policy violations surface live.",
      },
      {
        title: "Floor manager dashboard",
        description:
          "Live wallboard with agent status, queue depth, SLA risk, and shift performance — managers act on issues in the moment.",
      },
    ],
    relevantServices: [
      "whatsapp-automation",
      "workforce-operations-tracking",
      "crm-ai-marketing-automation",
    ],
    keywords: [
      "call center automation",
      "BPO automation",
      "AI for contact centers",
      "ticket routing automation",
      "QA scoring AI",
    ],
  },
];

export const industriesBySlug: Record<string, Industry> = Object.fromEntries(
  industries.map((industry) => [industry.slug, industry]),
);
