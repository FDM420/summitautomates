export type ServiceProofMetric = {
  label: string;
  value: string;
};

export type ServiceProofBar = {
  label: string;
  value: number;
};

export type ServiceProofBlock = {
  eyebrow: string;
  title: string;
  summary: string;
  outcomes: string[];
  metrics: ServiceProofMetric[];
  bars: ServiceProofBar[];
  activity: string[];
};

export const serviceProofs: Record<string, ServiceProofBlock[]> = {
  "whatsapp-automation": [
    {
      eyebrow: "Case Pattern",
      title: "Shared WhatsApp inbox for an inquiry-heavy service desk.",
      summary:
        "A common Summit engagement is centralizing inbound WhatsApp traffic so repeated questions stop consuming staff time and serious inquiries reach the correct team faster.",
      outcomes: [
        "Common pricing and document questions are answered instantly with approved replies.",
        "High-intent leads are tagged, scored, and routed to the right sales owner.",
        "Supervisors can see unresolved chats and response gaps in one view.",
      ],
      metrics: [
        { label: "First reply coverage", value: "88%" },
        { label: "Qualified leads / day", value: "17" },
        { label: "Missed urgent chats", value: "0" },
      ],
      bars: [
        { label: "Auto replies", value: 84 },
        { label: "Lead routing", value: 79 },
        { label: "Follow-up closure", value: 77 },
      ],
      activity: [
        "New WhatsApp inquiry classified as sales lead and pushed into CRM.",
        "Voice note converted to text and attached to the account timeline.",
        "Supervisor alert created for a delayed support conversation.",
      ],
    },
    {
      eyebrow: "Live Snapshot",
      title: "Operator view for sales, support, and escalation handling.",
      summary:
        "This style of proof block shows buyers what a live communication control layer feels like without exposing real client data.",
      outcomes: [
        "Sales, support, and management work from one shared operational surface.",
        "Routing logic separates hot leads from general questions automatically.",
        "Daily management reports highlight response speed and unresolved volume.",
      ],
      metrics: [
        { label: "Open chats", value: "42" },
        { label: "Human handoffs", value: "09" },
        { label: "Same-day closures", value: "31" },
      ],
      bars: [
        { label: "Inbox visibility", value: 96 },
        { label: "Escalation speed", value: 73 },
        { label: "Manager reporting", value: 91 },
      ],
      activity: [
        "Lead scoring updated automatically after customer budget reply.",
        "Team handoff timestamp recorded for manager review.",
        "End-of-day WhatsApp summary prepared for operations lead.",
      ],
    },
  ],
  "recruitment-hr-automation": [
    {
      eyebrow: "Case Pattern",
      title: "Candidate screening workflow for a fast-moving hiring desk.",
      summary:
        "A typical recruitment project removes manual CV sorting, flags missing documents earlier, and gives hiring managers a clearer shortlist pipeline.",
      outcomes: [
        "Recruiters see stronger candidates first instead of reading every CV from scratch.",
        "Missing IDs, expired documents, and incomplete records are caught earlier.",
        "Interview and onboarding steps continue inside one structured system.",
      ],
      metrics: [
        { label: "Shortlist speed", value: "Same day" },
        { label: "Docs flagged", value: "07" },
        { label: "Interview slots filled", value: "06" },
      ],
      bars: [
        { label: "CV sorting", value: 87 },
        { label: "Document checks", value: 74 },
        { label: "Pipeline visibility", value: 93 },
      ],
      activity: [
        "Candidate profile promoted from intake to shortlist queue.",
        "Expired passport copy flagged before interview scheduling.",
        "Hiring manager dashboard updated with new approval request.",
      ],
    },
    {
      eyebrow: "Live Snapshot",
      title: "Recruiter board for intake, screening, and onboarding follow-through.",
      summary:
        "This mock control view shows how Summit packages CV review, document readiness, and hiring status into one operator experience.",
      outcomes: [
        "Recruiters know which applicants are ready, blocked, or pending action.",
        "Operations teams receive onboarding steps without restarting data collection.",
        "Leadership gets a simpler picture of hiring bottlenecks and throughput.",
      ],
      metrics: [
        { label: "New applicants", value: "46" },
        { label: "Shortlisted", value: "14" },
        { label: "Offers active", value: "05" },
      ],
      bars: [
        { label: "Stage tracking", value: 89 },
        { label: "Manager visibility", value: 94 },
        { label: "Onboarding readiness", value: 71 },
      ],
      activity: [
        "Interview reminder sent to shortlisted candidate automatically.",
        "Onboarding checklist prepared after offer acceptance.",
        "Missing bank detail reminder triggered before joining date.",
      ],
    },
  ],
  "crm-ai-marketing-automation": [
    {
      eyebrow: "Case Pattern",
      title: "Lead capture and follow-up automation for a sales-driven team.",
      summary:
        "A frequent Summit outcome is bringing leads from forms, chats, and campaigns into one CRM process with clear ownership and next actions.",
      outcomes: [
        "Leads stop sitting in spreadsheets, inboxes, and chat threads.",
        "Sales owners receive automatic reminders instead of relying on memory.",
        "Marketing and sales activity can be reviewed together in one dashboard.",
      ],
      metrics: [
        { label: "New leads / day", value: "31" },
        { label: "Overdue follow-ups", value: "11" },
        { label: "Campaign drafts ready", value: "18" },
      ],
      bars: [
        { label: "Lead capture", value: 91 },
        { label: "Follow-up ownership", value: 78 },
        { label: "Campaign coordination", value: 69 },
      ],
      activity: [
        "Website lead assigned automatically by region and service line.",
        "Sales reminder created after inactivity threshold was reached.",
        "New campaign caption draft generated for marketing review.",
      ],
    },
    {
      eyebrow: "Live Snapshot",
      title: "Pipeline and campaign visibility for owners and managers.",
      summary:
        "This proof block demonstrates what it looks like when CRM movement, follow-up discipline, and AI-assisted content planning are visible in one operating layer.",
      outcomes: [
        "Managers can see which leads are stalled and which campaigns are creating pipeline.",
        "Sales and marketing teams stop requesting updates from multiple tools.",
        "Content production becomes more consistent without removing human review.",
      ],
      metrics: [
        { label: "Open deals", value: "19" },
        { label: "Reply rate", value: "87%" },
        { label: "Saved hours / week", value: "16h" },
      ],
      bars: [
        { label: "Pipeline visibility", value: 88 },
        { label: "Conversion tracking", value: 77 },
        { label: "Content throughput", value: 76 },
      ],
      activity: [
        "Weekly funnel report queued for leadership review.",
        "Missed follow-up list sent to the sales lead.",
        "High-performing campaign source highlighted in dashboard summary.",
      ],
    },
  ],
  "document-verification-security-automation": [
    {
      eyebrow: "Case Pattern",
      title: "Verification and access-control workflow for sensitive records.",
      summary:
        "This kind of project reduces manual document review, surfaces missing or expired records earlier, and adds clearer control over who can view or change sensitive information.",
      outcomes: [
        "OCR and validation rules reduce repeated checking work for staff.",
        "Missing files and expiry risks surface before they cause downstream delays.",
        "Managers gain a cleaner audit trail across sensitive actions and approvals.",
      ],
      metrics: [
        { label: "Files reviewed / day", value: "63" },
        { label: "Missing items", value: "11" },
        { label: "High-risk flags", value: "02" },
      ],
      bars: [
        { label: "OCR success", value: 84 },
        { label: "Validation coverage", value: 78 },
        { label: "Audit visibility", value: 96 },
      ],
      activity: [
        "Passport number extracted and matched to the correct profile.",
        "Expired document routed into the exception queue automatically.",
        "Sensitive file access recorded with full timestamp and actor ID.",
      ],
    },
    {
      eyebrow: "Live Snapshot",
      title: "Manager view for compliance exceptions and secure approvals.",
      summary:
        "This panel simulates the kind of proof a buyer expects: outcomes, control signals, and a visible audit-style activity stream without exposing client data.",
      outcomes: [
        "Supervisors can review blocked actions and unresolved risks from one board.",
        "Approval flows stay clearer because security and document logic share one system.",
        "Audit and compliance reporting becomes easier to explain to leadership.",
      ],
      metrics: [
        { label: "Audit events", value: "29" },
        { label: "Blocked attempts", value: "04" },
        { label: "Resolved flags", value: "21" },
      ],
      bars: [
        { label: "Policy checks", value: 91 },
        { label: "Alert response", value: 72 },
        { label: "Exception closure", value: 69 },
      ],
      activity: [
        "Unauthorized export attempt escalated to supervisor review.",
        "Role change logged for a protected document group.",
        "Weekly compliance summary prepared for operations management.",
      ],
    },
  ],
  "workforce-operations-tracking": [
    {
      eyebrow: "Case Pattern",
      title: "Attendance and shift monitoring across active operations teams.",
      summary:
        "A common Summit delivery here is giving managers one place to verify attendance, flag shift issues, and see daily operations status without chasing updates manually.",
      outcomes: [
        "Attendance and location checks become easier to verify day by day.",
        "Late arrivals, overtime patterns, and missing reports are surfaced earlier.",
        "Managers receive simpler daily summaries instead of compiling them by hand.",
      ],
      metrics: [
        { label: "Checked in", value: "87" },
        { label: "Late staff", value: "06" },
        { label: "Open tasks", value: "22" },
      ],
      bars: [
        { label: "Check-in completion", value: 93 },
        { label: "Verification rate", value: 84 },
        { label: "Issue response", value: 66 },
      ],
      activity: [
        "Morning shift headcount synced into the operations board.",
        "GPS exception flagged for a field check-in outside the approved zone.",
        "Delayed site activity escalated to the supervisor queue.",
      ],
    },
    {
      eyebrow: "Live Snapshot",
      title: "Supervisor dashboard for daily visibility and end-of-day reporting.",
      summary:
        "This proof block shows how workforce monitoring, exception handling, and management reporting can be presented as one live operational surface.",
      outcomes: [
        "Leaders get faster visibility into attendance, productivity, and unresolved issues.",
        "Coverage gaps and overtime risks are easier to spot before they become payroll problems.",
        "Field and office teams can still use a simple daily process while management gets deeper visibility.",
      ],
      metrics: [
        { label: "Teams tracked", value: "14" },
        { label: "Reports / day", value: "14" },
        { label: "Overtime alerts", value: "03" },
      ],
      bars: [
        { label: "Roster visibility", value: 96 },
        { label: "Coverage control", value: 88 },
        { label: "Reporting readiness", value: 95 },
      ],
      activity: [
        "Daily shift summary delivered to operations leadership.",
        "Coverage gap detected and replacement worker assigned.",
        "Weekly attendance trend exported for payroll review.",
      ],
    },
  ],
};