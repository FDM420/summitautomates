import type { FAQItem } from "./site-content";

export type ServiceMetric = {
  label: string;
  value: string;
};

export type ServiceBar = {
  label: string;
  value: number;
};

export type ServiceMode = {
  label: string;
  summary: string;
  pipeline: string[];
  activePipelineIndex: number;
  metrics: ServiceMetric[];
  bars: ServiceBar[];
  activity: string[];
};

export type ServicePoint = {
  title: string;
  description: string;
};

export type ServiceExplainerCard = {
  type: "inputs" | "process" | "outputs" | "benefits";
  title: string;
  description: string;
  bullets: string[];
};

export type ServicePageConfig = {
  slug: string;
  navTitle: string;
  cardTitle: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  heroTitle: string;
  heroDescription: string;
  heroTags: string[];
  heroStats: ServiceMetric[];
  problemCards: ServicePoint[];
  explainerCards: ServiceExplainerCard[];
  workflowSteps: ServicePoint[];
  deliverables: string[];
  industries: string[];
  faqs: FAQItem[];
  contactFocus: string;
  relatedSlugs: string[];
  liveModes: ServiceMode[];
};

export const servicePages: ServicePageConfig[] = [
  {
    slug: "whatsapp-automation",
    navTitle: "WhatsApp Automation",
    cardTitle: "WhatsApp Automation Services",
    seoTitle: "WhatsApp Automation Services for Customer Support, Lead Handling, and Shared Inbox Workflows",
    metaDescription:
      "Summit builds WhatsApp automation systems that reply faster, sort serious leads, transcribe voice notes, share conversations with teams, and keep customer handling organized.",
    keywords: [
      "WhatsApp automation services",
      "WhatsApp Business API automation",
      "shared WhatsApp inbox",
      "AI WhatsApp chatbot",
      "WhatsApp lead qualification",
      "customer support automation",
    ],
    heroTitle: "WhatsApp automation services that help your team reply faster and miss fewer leads.",
    heroDescription:
      "If your business gets too many WhatsApp messages, repeated questions, or late follow-ups, we can build a system that replies automatically, sorts serious inquiries, and sends the right chat to the right staff member.",
    heroTags: [
      "Auto replies for common questions",
      "Shared team inbox",
      "Lead sorting and routing",
      "Voice note transcription",
    ],
    heroStats: [
      { label: "Reply coverage", value: "24/7" },
      { label: "Inbox view", value: "1" },
      { label: "Lead routing", value: "Live" },
    ],
    problemCards: [
      {
        title: "Too many messages to answer manually",
        description:
          "The system can handle common questions first, so your team only spends time on the conversations that need a human response.",
      },
      {
        title: "Important chats get lost",
        description:
          "Serious leads and urgent support requests can be tagged, prioritized, and routed automatically instead of getting buried in a long chat list.",
      },
      {
        title: "Different staff reply differently",
        description:
          "You can standardize replies, qualification questions, and follow-up steps so customers get a cleaner experience.",
      },
      {
        title: "Managers cannot see what is happening",
        description:
          "Dashboards and logs show how many chats were handled, where leads were sent, and which issues still need attention.",
      },
    ],
    explainerCards: [
      {
        type: "inputs",
        title: "What usually comes into this workflow",
        description:
          "This service starts with the messages and lead details your team is already receiving every day.",
        bullets: [
          "WhatsApp chats, voice notes, repeated customer questions, and missed-call follow-up.",
          "Lead details such as service interest, budget range, location, and urgency.",
          "Existing tools like shared inboxes, spreadsheets, CRM records, or staff phones.",
        ],
      },
      {
        type: "process",
        title: "How the system processes those messages",
        description:
          "The workflow reads the message, understands the request, and decides whether to answer, qualify, or hand it to a person.",
        bullets: [
          "Voice notes can be transcribed into text so teams do not need to listen to every message manually.",
          "AI can classify the conversation as support, sales, booking, or escalation.",
          "Rules route serious inquiries into the right queue, staff member, or CRM stage automatically.",
        ],
      },
      {
        type: "outputs",
        title: "What your team gets back",
        description:
          "Instead of one long chat stream, your team gets a cleaner operating view with clear next actions.",
        bullets: [
          "A shared inbox with tagged conversations and cleaner handoff between staff.",
          "Qualified leads, follow-up tasks, and escalation alerts instead of buried chats.",
          "Management reporting that shows reply speed, unresolved chats, and lead routing volume.",
        ],
      },
      {
        type: "benefits",
        title: "Why buyers usually want it",
        description:
          "The value is not just a chatbot. It is better response control, fewer missed leads, and less admin work.",
        bullets: [
          "Customers get faster first replies without waiting for staff to be free.",
          "Sales teams stop losing high-intent inquiries in a noisy inbox.",
          "Managers get clearer visibility into what is handled automatically and what still needs people.",
        ],
      },
    ],
    workflowSteps: [
      {
        title: "Receive the message",
        description: "The system connects to WhatsApp and captures every message, voice note, and inquiry in one place.",
      },
      {
        title: "Understand the request",
        description:
          "AI can identify whether the message is a support issue, a sales lead, a booking inquiry, or a repeated question.",
      },
      {
        title: "Take the next step automatically",
        description:
          "The chat can be answered, tagged, routed to a team member, or pushed into a CRM workflow without manual copying.",
      },
      {
        title: "Track the result",
        description:
          "Managers get visibility through shared inboxes, live activity, and simple reporting.",
      },
    ],
    deliverables: [
      "WhatsApp Business API automation",
      "AI auto replies for common questions",
      "Shared team inbox and team assignment",
      "Lead qualification and follow-up triggers",
      "Voice note transcription and summaries",
      "CRM sync and reporting dashboards",
    ],
    industries: ["Immigration", "Travel", "Real estate", "Support teams", "Sales teams", "Service businesses"],
    faqs: [
      {
        question: "Can WhatsApp automation still send chats to my staff?",
        answer:
          "Yes. Automation handles the first step, but important chats can still go straight to a real team member when needed.",
      },
      {
        question: "Can it work for leads and support at the same time?",
        answer:
          "Yes. The same system can sort sales inquiries, support questions, and booking requests using different workflows.",
      },
      {
        question: "Do I need a big team to use it?",
        answer:
          "No. Small teams benefit a lot because automation reduces repeated replies and keeps work organized.",
      },
    ],
    contactFocus: "WhatsApp and communication automation",
    relatedSlugs: ["crm-ai-marketing-automation", "recruitment-hr-automation", "document-verification-security-automation"],
    liveModes: [
      {
        label: "Inbox",
        summary: "See new chats, voice notes, and customer questions arrive in one shared operational view.",
        pipeline: ["Customer Message", "AI Reply", "Shared Inbox", "Team Review", "Report"],
        activePipelineIndex: 1,
        metrics: [
          { label: "New chats", value: "42" },
          { label: "AI replied", value: "71%" },
          { label: "Pending human", value: "09" },
        ],
        bars: [
          { label: "First replies", value: 88 },
          { label: "Lead tagging", value: 74 },
          { label: "Escalations", value: 39 },
        ],
        activity: [
          "Voice note converted to text and tagged as sales inquiry",
          "Pricing question answered automatically with approved reply",
          "Urgent support chat routed to supervisor inbox",
        ],
      },
      {
        label: "Qualification",
        summary: "Ask simple questions automatically and sort serious leads from casual inquiries.",
        pipeline: ["New Lead", "Question Flow", "AI Scoring", "CRM Entry", "Follow-up Queue"],
        activePipelineIndex: 2,
        metrics: [
          { label: "Qualified today", value: "17" },
          { label: "Follow-up due", value: "06" },
          { label: "Saved staff hours", value: "5.3" },
        ],
        bars: [
          { label: "Lead capture", value: 92 },
          { label: "Question completion", value: 68 },
          { label: "CRM sync", value: 95 },
        ],
        activity: [
          "Lead budget captured and pushed into CRM pipeline",
          "Location requirement matched to the correct sales team",
          "Follow-up reminder created for tomorrow morning",
        ],
      },
      {
        label: "Reporting",
        summary: "Managers can track response speed, lead quality, and unresolved conversations in one simple view.",
        pipeline: ["Chats", "Tags", "Team Actions", "Dashboard", "Management Report"],
        activePipelineIndex: 4,
        metrics: [
          { label: "Avg reply", value: "1.6m" },
          { label: "Resolved", value: "84%" },
          { label: "Open issues", value: "11" },
        ],
        bars: [
          { label: "Response speed", value: 84 },
          { label: "Resolution rate", value: 79 },
          { label: "Lead handoff", value: 87 },
        ],
        activity: [
          "Daily report sent to operations manager",
          "Three unresolved chats highlighted for same-day action",
          "Top inquiry topics grouped for marketing team review",
        ],
      },
    ],
  },
  {
    slug: "recruitment-hr-automation",
    navTitle: "Recruitment Automation",
    cardTitle: "Recruitment & HR Automation Services",
    seoTitle: "Recruitment Automation Services for CV Screening, Candidate Tracking, and Hiring Workflows",
    metaDescription:
      "Summit builds recruitment automation systems that screen CVs, organize candidates, verify documents, schedule follow-up steps, and simplify hiring workflows for busy teams.",
    keywords: [
      "recruitment automation services",
      "AI CV screening",
      "candidate management system",
      "hiring workflow automation",
      "HR automation services",
      "recruitment CRM",
    ],
    heroTitle: "Recruitment automation services that reduce manual screening and speed up hiring.",
    heroDescription:
      "If your team spends too much time sorting CVs, checking documents, and chasing candidates, we can build a hiring system that keeps everything organized and moves the right people forward faster.",
    heroTags: [
      "CV screening support",
      "Candidate tracking",
      "Interview workflow automation",
      "Onboarding coordination",
    ],
    heroStats: [
      { label: "CV intake", value: "Auto" },
      { label: "Hiring stages", value: "Tracked" },
      { label: "Shortlist speed", value: "Faster" },
    ],
    problemCards: [
      {
        title: "Too many CVs to review manually",
        description:
          "The system can sort applicants by role fit, experience, documents, or missing information before a recruiter opens the file.",
      },
      {
        title: "Candidates disappear between steps",
        description:
          "Each applicant can move through a clear pipeline with reminders, notes, interview status, and next actions.",
      },
      {
        title: "Hiring data is spread everywhere",
        description:
          "Instead of checking WhatsApp, spreadsheets, folders, and email separately, the system keeps the candidate journey together.",
      },
      {
        title: "Onboarding starts too late",
        description:
          "The same system can continue from hiring into document checks, onboarding tasks, and staff records.",
      },
    ],
    explainerCards: [
      {
        type: "inputs",
        title: "What usually comes into this workflow",
        description:
          "Recruitment automation starts with the candidate information your team already collects manually.",
        bullets: [
          "CVs, application forms, interview notes, recruiter comments, and candidate contact details.",
          "Supporting documents such as passports, licenses, certificates, or missing-file requests.",
          "Job role requirements, shortlist criteria, interview status, and onboarding tasks.",
        ],
      },
      {
        type: "process",
        title: "How the system processes those applications",
        description:
          "The workflow organizes the intake, checks what is missing, and moves stronger candidates forward with less manual sorting.",
        bullets: [
          "CV details can be structured automatically so recruiters see role fit and missing information faster.",
          "The system can flag missing or expired candidate documents before the hiring process gets delayed.",
          "Interview reminders, recruiter queues, and approval steps can be triggered from one pipeline.",
        ],
      },
      {
        type: "outputs",
        title: "What your team gets back",
        description:
          "Your team gets a hiring board that is easier to act on, not just another list of applicants.",
        bullets: [
          "A clearer shortlist, review queue, and candidate status view across every stage.",
          "Alerts for incomplete files, missing documents, or blocked onboarding steps.",
          "A handoff from hiring into onboarding without restarting the data collection process.",
        ],
      },
      {
        type: "benefits",
        title: "Why buyers usually want it",
        description:
          "The main benefit is faster, cleaner hiring without recruiters drowning in admin work.",
        bullets: [
          "Recruiters spend less time manually sorting CVs and chasing candidates for basics.",
          "Hiring managers see pipeline movement earlier instead of waiting for manual updates.",
          "Teams reduce delays caused by missing documents, missed reminders, and messy handoffs.",
        ],
      },
    ],
    workflowSteps: [
      {
        title: "Collect the candidate data",
        description: "CVs, forms, and documents are collected in one structured intake system.",
      },
      {
        title: "Sort and flag candidates",
        description:
          "The system helps identify strong candidates, incomplete applications, and missing documents for the recruiter.",
      },
      {
        title: "Move the right people forward",
        description:
          "Interview steps, document requests, and recruiter notes can all be tracked in a single workflow.",
      },
      {
        title: "Track the final decision",
        description:
          "Managers can see who is shortlisted, pending, rejected, hired, or waiting for onboarding tasks.",
      },
    ],
    deliverables: [
      "AI CV screening support",
      "Candidate pipeline dashboards",
      "Interview and follow-up workflows",
      "Recruitment CRM and status tracking",
      "Document collection and verification steps",
      "Onboarding coordination and reports",
    ],
    industries: ["Recruitment firms", "HR departments", "Immigration", "Healthcare staffing", "Hospitality", "Operations teams"],
    faqs: [
      {
        question: "Does AI make the hiring decision?",
        answer:
          "No. It helps sort, flag, and organize candidates faster. Final hiring decisions still stay with your team.",
      },
      {
        question: "Can the system track interviews and documents too?",
        answer:
          "Yes. Recruitment automation can cover CV intake, interviews, verification, and onboarding tasks in one process.",
      },
      {
        question: "Is this useful for small recruitment teams?",
        answer:
          "Yes. Small teams often get the biggest benefit because they save time on screening and follow-up.",
      },
    ],
    contactFocus: "Recruitment and HR automation",
    relatedSlugs: ["document-verification-security-automation", "whatsapp-automation", "crm-ai-marketing-automation"],
    liveModes: [
      {
        label: "Intake",
        summary: "See candidates enter the system with CVs, roles, and application status already organized.",
        pipeline: ["CV Received", "Role Match", "Recruiter Queue", "Interview Step", "Decision"],
        activePipelineIndex: 1,
        metrics: [
          { label: "New applicants", value: "46" },
          { label: "Role matches", value: "29" },
          { label: "Missing docs", value: "08" },
        ],
        bars: [
          { label: "CV parsing", value: 83 },
          { label: "Role matching", value: 76 },
          { label: "Recruiter review", value: 58 },
        ],
        activity: [
          "Candidate tagged for customer support role",
          "Missing passport copy flagged before interview stage",
          "Senior recruiter queue updated with priority applicant",
        ],
      },
      {
        label: "Pipeline",
        summary: "Move from screening to interview and approval with clear stage control.",
        pipeline: ["Screened", "Shortlisted", "Interviewed", "Verified", "Hired"],
        activePipelineIndex: 2,
        metrics: [
          { label: "Shortlisted", value: "14" },
          { label: "Interviews today", value: "06" },
          { label: "Ready to hire", value: "04" },
        ],
        bars: [
          { label: "Shortlist quality", value: 72 },
          { label: "Interview completion", value: 81 },
          { label: "Approval speed", value: 63 },
        ],
        activity: [
          "Interview reminder sent automatically to candidate",
          "Recruiter notes added to shortlisted profile",
          "Manager approval request created for final stage",
        ],
      },
      {
        label: "Onboarding",
        summary: "The same workflow can continue after hiring so onboarding does not start from zero.",
        pipeline: ["Offer Sent", "Docs Received", "Checks Complete", "Welcome Tasks", "Joined"],
        activePipelineIndex: 4,
        metrics: [
          { label: "Offers active", value: "05" },
          { label: "Checks complete", value: "03" },
          { label: "Joining this week", value: "02" },
        ],
        bars: [
          { label: "Offer response", value: 67 },
          { label: "Document completion", value: 78 },
          { label: "Onboarding progress", value: 71 },
        ],
        activity: [
          "Medical form requested automatically after offer acceptance",
          "Employee portal credentials queued for new joiner",
          "HR dashboard updated with onboarding completion status",
        ],
      },
    ],
  },
  {
    slug: "crm-ai-marketing-automation",
    navTitle: "CRM & AI Marketing",
    cardTitle: "CRM, Lead Management & AI Marketing Automation",
    seoTitle: "CRM Automation, Lead Management, and AI Marketing Automation Services",
    metaDescription:
      "Summit builds CRM automation systems that capture leads, assign follow-ups, send reminders, automate campaign tasks, and support AI marketing and social media workflows.",
    keywords: [
      "CRM automation services",
      "lead management automation",
      "sales follow-up automation",
      "AI marketing automation",
      "social media automation services",
      "campaign management automation",
    ],
    heroTitle: "CRM and AI marketing automation services that keep leads moving and campaigns organized.",
    heroDescription:
      "If leads are getting missed, follow-up is inconsistent, or marketing content takes too much time, we can build one system that captures interest, assigns next steps, and supports your outreach pipeline.",
    heroTags: [
      "Lead capture and assignment",
      "Follow-up reminders",
      "Pipeline dashboards",
      "AI marketing content support",
    ],
    heroStats: [
      { label: "Lead visibility", value: "Live" },
      { label: "Follow-up", value: "Tracked" },
      { label: "Campaign tasks", value: "Automated" },
    ],
    problemCards: [
      {
        title: "Leads are forgotten",
        description:
          "The system can capture leads, assign them immediately, and create reminders so your team stops losing opportunities.",
      },
      {
        title: "Sales teams do follow-up differently",
        description:
          "CRM automation helps standardize what happens after a lead comes in, from first contact to conversion tracking.",
      },
      {
        title: "Marketing content is slow to produce",
        description:
          "AI can support social captions, campaign drafts, content planning, and routine marketing tasks so your team works faster.",
      },
      {
        title: "Managers do not know pipeline status",
        description:
          "Dashboards can show which leads are new, which need follow-up, and where deals are getting stuck.",
      },
    ],
    explainerCards: [
      {
        type: "inputs",
        title: "What usually comes into this workflow",
        description:
          "This service begins with the sales and marketing signals you already generate across different channels.",
        bullets: [
          "Website forms, WhatsApp inquiries, campaign responses, manual lead entry, and call outcomes.",
          "Sales notes, service interest, source data, and follow-up dates that teams currently track by hand.",
          "Marketing requests such as captions, campaign drafts, content themes, or response summaries.",
        ],
      },
      {
        type: "process",
        title: "How the system processes those leads and requests",
        description:
          "The workflow captures the lead, assigns ownership, and keeps follow-up moving without relying on memory.",
        bullets: [
          "Leads can be tagged, scored, and routed to the correct owner or pipeline stage automatically.",
          "Reminder logic keeps follow-up from going stale when staff are busy.",
          "AI can support campaign planning, draft content, and group sales objections into reusable marketing insight.",
        ],
      },
      {
        type: "outputs",
        title: "What your team gets back",
        description:
          "Instead of leads and campaign tasks living in separate tools, your team gets one clearer operating view.",
        bullets: [
          "A CRM pipeline with visible ownership, next actions, and overdue follow-up signals.",
          "Reporting on pipeline movement, response times, and where deals are stalling.",
          "A cleaner content task queue for captions, drafts, and campaign support work.",
        ],
      },
      {
        type: "benefits",
        title: "Why buyers usually want it",
        description:
          "The core value is fewer lost opportunities and more consistent commercial execution.",
        bullets: [
          "Leads stop falling through the cracks between forms, chat apps, and spreadsheets.",
          "Sales teams follow a more repeatable process instead of each person working differently.",
          "Owners and managers get clearer visibility into what marketing activity is actually feeding the pipeline.",
        ],
      },
    ],
    workflowSteps: [
      {
        title: "Capture the lead",
        description: "Leads can come from forms, WhatsApp, calls, campaigns, or manual entry and still land in one system.",
      },
      {
        title: "Assign the next action",
        description:
          "The CRM can tag the lead, route it to a person or team, and set reminders automatically.",
      },
      {
        title: "Support sales and marketing",
        description:
          "The same setup can help your team with follow-up messages, content drafts, campaign tracking, and pipeline reporting.",
      },
      {
        title: "Measure the outcome",
        description:
          "Managers can see conversions, response quality, campaign activity, and missed follow-up steps clearly.",
      },
    ],
    deliverables: [
      "CRM pipeline automation",
      "Lead capture and routing",
      "Sales follow-up reminders",
      "AI content and caption generation support",
      "Campaign task automation",
      "Reporting dashboards for sales and marketing",
    ],
    industries: ["Sales teams", "Real estate", "Consultancy", "Travel", "Service businesses", "Marketing teams"],
    faqs: [
      {
        question: "Is this only for large sales teams?",
        answer:
          "No. Small businesses often need CRM automation the most because manual follow-up is hard to maintain consistently.",
      },
      {
        question: "Can AI help with marketing without replacing my team?",
        answer:
          "Yes. AI can prepare drafts, captions, and ideas, while your team reviews and approves what gets published.",
      },
      {
        question: "Can the CRM connect to WhatsApp or forms?",
        answer:
          "Yes. Leads from forms, chats, and other channels can be pushed into one follow-up workflow.",
      },
    ],
    contactFocus: "CRM, lead management, and AI marketing automation",
    relatedSlugs: ["whatsapp-automation", "workforce-operations-tracking", "recruitment-hr-automation"],
    liveModes: [
      {
        label: "Lead Flow",
        summary: "New leads enter the CRM, get tagged, and move into a clear next-step queue automatically.",
        pipeline: ["Lead Source", "CRM Capture", "AI Scoring", "Sales Queue", "Follow-up"],
        activePipelineIndex: 2,
        metrics: [
          { label: "New leads", value: "31" },
          { label: "Sales assigned", value: "24" },
          { label: "Due today", value: "11" },
        ],
        bars: [
          { label: "Capture rate", value: 91 },
          { label: "Lead routing", value: 86 },
          { label: "Follow-up completion", value: 59 },
        ],
        activity: [
          "Website form lead pushed into consultant queue",
          "High-value inquiry highlighted for same-day callback",
          "Follow-up reminder created for uncontacted lead",
        ],
      },
      {
        label: "Campaigns",
        summary: "See campaign tasks, social media drafts, and response themes in one marketing operations view.",
        pipeline: ["Campaign Idea", "AI Draft", "Review", "Publish", "Engagement Log"],
        activePipelineIndex: 3,
        metrics: [
          { label: "Drafts ready", value: "18" },
          { label: "Approved", value: "09" },
          { label: "Queued posts", value: "06" },
        ],
        bars: [
          { label: "Caption generation", value: 82 },
          { label: "Approval workflow", value: 71 },
          { label: "Posting readiness", value: 64 },
        ],
        activity: [
          "Caption and hashtag draft prepared for new campaign",
          "Sales objections grouped into new content topic list",
          "Engagement report sent to marketing manager",
        ],
      },
      {
        label: "Reporting",
        summary: "Managers can see sales progress and marketing activity without chasing updates from multiple tools.",
        pipeline: ["Lead Data", "Sales Actions", "Campaign Data", "Dashboard", "Decision"],
        activePipelineIndex: 4,
        metrics: [
          { label: "Response time", value: "2.4h" },
          { label: "Open deals", value: "19" },
          { label: "Content requests", value: "07" },
        ],
        bars: [
          { label: "Pipeline visibility", value: 88 },
          { label: "Conversion tracking", value: 77 },
          { label: "Campaign coordination", value: 69 },
        ],
        activity: [
          "Weekly funnel report prepared for management review",
          "Missed follow-up list sent to sales lead",
          "Campaign content backlog highlighted for action",
        ],
      },
    ],
  },
  {
    slug: "document-verification-security-automation",
    navTitle: "Document Verification & Security",
    cardTitle: "Document Verification, Security & Access Control Automation",
    seoTitle: "Document Verification, Security Monitoring, and Access Control Automation Services",
    metaDescription:
      "Summit builds document verification, security monitoring, and access control systems for OCR extraction, expiry tracking, compliance checks, audit trails, and staff access management.",
    keywords: [
      "document verification automation",
      "OCR document extraction",
      "access control automation",
      "security monitoring systems",
      "audit trail software",
      "compliance automation services",
    ],
    heroTitle: "Document verification and security automation that reduces checking work and improves control.",
    heroDescription:
      "If your team spends too much time checking IDs, passport copies, expiry dates, permissions, or staff access, we can build a system that flags problems early and keeps records organized.",
    heroTags: [
      "OCR and data extraction",
      "Missing document alerts",
      "Expiry and compliance checks",
      "Access logs and audit trails",
    ],
    heroStats: [
      { label: "Checks", value: "Automated" },
      { label: "Logs", value: "Tracked" },
      { label: "Alerts", value: "Live" },
    ],
    problemCards: [
      {
        title: "Documents take too long to review",
        description:
          "The system can read files, extract important details, and highlight missing information before a staff member manually checks everything.",
      },
      {
        title: "Expiry dates get missed",
        description:
          "You can track expiry dates and renewal issues automatically instead of relying on memory or scattered notes.",
      },
      {
        title: "Access is not controlled clearly",
        description:
          "We can build role-based access and monitoring flows so the right people see the right data and actions are logged.",
      },
      {
        title: "Compliance checks are inconsistent",
        description:
          "Rules can be applied in the same way each time, with alerts, logs, and review queues for exceptions.",
      },
    ],
    explainerCards: [
      {
        type: "inputs",
        title: "What usually comes into this workflow",
        description:
          "This service starts with the documents, expiry dates, and access actions your team currently checks manually.",
        bullets: [
          "Passport scans, IDs, forms, certificates, compliance files, and supporting case documents.",
          "Key fields such as expiry dates, missing pages, document type, and matching reference numbers.",
          "Access requests, user actions, export attempts, and approval events that need logging.",
        ],
      },
      {
        type: "process",
        title: "How the system processes files and exceptions",
        description:
          "The workflow reads the record, checks it against rules, and flags anything that needs human review.",
        bullets: [
          "OCR can extract document details so teams do not have to type or scan every field manually.",
          "Validation rules can detect missing files, mismatched fields, and expired documents early.",
          "Role-based controls and access logging record who viewed, changed, approved, or exported sensitive data.",
        ],
      },
      {
        type: "outputs",
        title: "What your team gets back",
        description:
          "Your team receives a review-ready queue instead of a folder full of files and uncertain checks.",
        bullets: [
          "Expiry alerts, missing-document notifications, and exception queues that are easier to act on.",
          "Structured records with extracted fields, status updates, and audit history.",
          "Manager views showing blocked access, unresolved compliance flags, and pending approvals.",
        ],
      },
      {
        type: "benefits",
        title: "Why buyers usually want it",
        description:
          "The value is better control with less manual checking and fewer missed risks.",
        bullets: [
          "Teams spend less time reading every file line by line just to find obvious issues.",
          "Expired documents and missing records are surfaced before they create downstream problems.",
          "Compliance and security reviews become easier to explain because the audit trail is already there.",
        ],
      },
    ],
    workflowSteps: [
      {
        title: "Collect the file or access request",
        description: "Documents or user actions are captured in a controlled system instead of being handled informally.",
      },
      {
        title: "Run checks automatically",
        description: "OCR, validation rules, expiry logic, and access policies help catch issues quickly.",
      },
      {
        title: "Flag exceptions",
        description: "Missing documents, mismatched data, expired items, or blocked actions are pushed into a review queue.",
      },
      {
        title: "Keep a clear audit trail",
        description: "Managers can see what was checked, who accessed what, and what decisions were made.",
      },
    ],
    deliverables: [
      "OCR extraction and categorization",
      "Passport and ID verification workflows",
      "Expiry date and missing document alerts",
      "Role-based access control layers",
      "Security monitoring and activity logs",
      "Compliance reporting and audit trails",
    ],
    industries: ["Immigration", "HR", "Operations", "Compliance teams", "Consultancy", "Enterprise back office"],
    faqs: [
      {
        question: "Can the system still let a human approve documents?",
        answer:
          "Yes. Automation flags issues and prepares the review, but a human can still approve final decisions.",
      },
      {
        question: "Can it track who opened or changed something?",
        answer:
          "Yes. Access control and audit logs can record important actions for security and accountability.",
      },
      {
        question: "Is this only for large companies?",
        answer:
          "No. Any business handling important documents or controlled access can benefit from clearer checks and logs.",
      },
    ],
    contactFocus: "Document verification and security automation",
    relatedSlugs: ["recruitment-hr-automation", "workforce-operations-tracking", "whatsapp-automation"],
    liveModes: [
      {
        label: "Verification",
        summary: "Documents are checked for completeness, readable data, and obvious mismatches before manual review.",
        pipeline: ["Document Upload", "OCR Read", "Rule Check", "Review Queue", "Approved Record"],
        activePipelineIndex: 2,
        metrics: [
          { label: "Files today", value: "63" },
          { label: "Missing items", value: "11" },
          { label: "Ready to review", value: "34" },
        ],
        bars: [
          { label: "OCR success", value: 84 },
          { label: "Field validation", value: 78 },
          { label: "Review readiness", value: 61 },
        ],
        activity: [
          "Passport number extracted and matched to applicant record",
          "Expired document flagged before case review",
          "Missing backside image added to correction queue",
        ],
      },
      {
        label: "Access Control",
        summary: "User roles and approval rules help limit who can view, edit, or export sensitive data.",
        pipeline: ["User Login", "Role Check", "Access Decision", "Activity Log", "Manager Alert"],
        activePipelineIndex: 3,
        metrics: [
          { label: "Blocked attempts", value: "04" },
          { label: "Role updates", value: "07" },
          { label: "Audit events", value: "29" },
        ],
        bars: [
          { label: "Policy checks", value: 91 },
          { label: "Access logging", value: 96 },
          { label: "Alert delivery", value: 72 },
        ],
        activity: [
          "File export blocked for non-authorized user",
          "Supervisor notified of sensitive record access",
          "Role change logged with timestamp and actor ID",
        ],
      },
      {
        label: "Compliance",
        summary: "Managers can review exceptions, risks, and completion status through one control view.",
        pipeline: ["Data Review", "Risk Flags", "Supervisor Action", "Dashboard", "Audit Report"],
        activePipelineIndex: 4,
        metrics: [
          { label: "Open flags", value: "13" },
          { label: "Resolved", value: "21" },
          { label: "High risk", value: "02" },
        ],
        bars: [
          { label: "Exception handling", value: 73 },
          { label: "Compliance visibility", value: 88 },
          { label: "Closure speed", value: 69 },
        ],
        activity: [
          "Weekly compliance report prepared automatically",
          "Two unresolved access issues escalated to admin",
          "Expiry risk list pushed to operations dashboard",
        ],
      },
    ],
  },
  {
    slug: "workforce-operations-tracking",
    navTitle: "Workforce & Operations Tracking",
    cardTitle: "Workforce, Attendance & Operations Tracking Automation",
    seoTitle: "Workforce Attendance, Operations Tracking, and Performance Automation Services",
    metaDescription:
      "Summit builds workforce and operations tracking systems for attendance, GPS verification, shift management, productivity monitoring, daily reporting, and operational dashboards.",
    keywords: [
      "workforce tracking automation",
      "attendance automation",
      "GPS attendance verification",
      "operations tracking dashboard",
      "employee productivity monitoring",
      "shift management automation",
    ],
    heroTitle: "Workforce and operations tracking services that show who is working, what is pending, and where action is needed.",
    heroDescription:
      "If attendance is unclear, shifts are hard to monitor, or managers struggle to see what teams are doing day to day, we can build one system that tracks activity and produces clear reports.",
    heroTags: [
      "Attendance and shift tracking",
      "GPS and location checks",
      "Daily operations reports",
      "Productivity dashboards",
    ],
    heroStats: [
      { label: "Attendance", value: "Verified" },
      { label: "Reports", value: "Daily" },
      { label: "Visibility", value: "Live" },
    ],
    problemCards: [
      {
        title: "Managers do not know who is actually present",
        description:
          "Attendance, GPS checks, or face-based verification can make presence tracking more reliable.",
      },
      {
        title: "Shifts and overtime are messy",
        description:
          "The system can organize schedules, track extra hours, and make it easier to review attendance records.",
      },
      {
        title: "Daily updates are inconsistent",
        description:
          "Instead of chasing teams for status, you can collect and view operations data in one reporting flow.",
      },
      {
        title: "Leaders cannot see team performance clearly",
        description:
          "Dashboards can show trends, late arrivals, missed check-ins, shift load, and operational throughput.",
      },
    ],
    explainerCards: [
      {
        type: "inputs",
        title: "What usually comes into this workflow",
        description:
          "This service starts with the attendance and daily operations data teams already produce.",
        bullets: [
          "Check-ins, shift rosters, GPS or location events, overtime records, and basic staff updates.",
          "Daily task reports, field status updates, issue flags, and supervisor notes.",
          "Existing spreadsheets, paper logs, or separate tools used to track workforce activity.",
        ],
      },
      {
        type: "process",
        title: "How the system processes daily activity",
        description:
          "The workflow compares what was planned with what actually happened and highlights anything that needs attention.",
        bullets: [
          "Attendance can be verified against schedule, location, or check-in rules automatically.",
          "The system can flag late arrivals, missing check-ins, unusual patterns, or incomplete daily reports.",
          "Operations events are grouped into clearer manager queues so issues are not buried until the end of the day.",
        ],
      },
      {
        type: "outputs",
        title: "What your team gets back",
        description:
          "Managers receive a live operations picture instead of chasing updates across different people and tools.",
        bullets: [
          "Attendance dashboards, overtime alerts, and supervisor-ready exception lists.",
          "Daily summaries that show who checked in, what tasks are pending, and where delays appeared.",
          "Trend reporting for payroll, workforce planning, and operations review.",
        ],
      },
      {
        type: "benefits",
        title: "Why buyers usually want it",
        description:
          "The service helps leaders manage teams with less guesswork and less manual reporting overhead.",
        bullets: [
          "Supervisors catch attendance and execution issues earlier instead of hearing about them later.",
          "Operations teams spend less time preparing manual daily summaries and exception reports.",
          "Management gets a more reliable picture of workforce performance and coverage.",
        ],
      },
    ],
    workflowSteps: [
      {
        title: "Track attendance and activity",
        description: "Staff check-ins, shifts, location, or task updates are captured in one operational system.",
      },
      {
        title: "Apply simple rules",
        description:
          "The platform can identify late arrivals, missed check-ins, unusual patterns, overtime, or incomplete daily reports.",
      },
      {
        title: "Notify the right manager",
        description:
          "Important issues can be routed to supervisors before they become a bigger operational problem.",
      },
      {
        title: "Review the daily picture",
        description:
          "Operations leaders get a cleaner view of attendance, productivity, and exceptions.",
      },
    ],
    deliverables: [
      "Attendance and check-in workflows",
      "GPS or location verification logic",
      "Shift and overtime tracking",
      "Employee productivity dashboards",
      "Daily operations reporting",
      "Supervisor alerts and management summaries",
    ],
    industries: ["Field teams", "Operations departments", "Security teams", "Warehousing", "Service businesses", "Enterprise operations"],
    faqs: [
      {
        question: "Can this work for both office and field teams?",
        answer:
          "Yes. Office teams may use standard check-ins while field teams can use location-aware or mobile-based verification.",
      },
      {
        question: "Can managers get simple daily reports?",
        answer:
          "Yes. The system can generate summaries for attendance, delays, missing reports, and workload across teams.",
      },
      {
        question: "Does it have to be complicated for staff?",
        answer:
          "No. The best setup is simple for staff and detailed for managers, so people only do the minimum actions needed.",
      },
    ],
    contactFocus: "Workforce attendance and operations tracking",
    relatedSlugs: ["document-verification-security-automation", "crm-ai-marketing-automation", "whatsapp-automation"],
    liveModes: [
      {
        label: "Attendance",
        summary: "Track staff presence and shift start status through one operational control view.",
        pipeline: ["Check-in", "Location Match", "Shift Status", "Supervisor View", "Daily Summary"],
        activePipelineIndex: 2,
        metrics: [
          { label: "Checked in", value: "87" },
          { label: "Late", value: "06" },
          { label: "Unverified", value: "03" },
        ],
        bars: [
          { label: "Check-in completion", value: 93 },
          { label: "Verification rate", value: 84 },
          { label: "Schedule match", value: 77 },
        ],
        activity: [
          "Morning shift attendance completed for branch A",
          "One mobile check-in flagged outside approved zone",
          "Late arrival summary shared with supervisor",
        ],
      },
      {
        label: "Operations",
        summary: "Combine field updates, daily workload, and issue flags into a cleaner live operations board.",
        pipeline: ["Field Update", "Task Status", "Issue Flag", "Manager Queue", "Resolution"],
        activePipelineIndex: 3,
        metrics: [
          { label: "Open tasks", value: "22" },
          { label: "Issue flags", value: "05" },
          { label: "Resolved today", value: "14" },
        ],
        bars: [
          { label: "Task reporting", value: 79 },
          { label: "Issue response", value: 66 },
          { label: "Supervisor action", value: 74 },
        ],
        activity: [
          "Field team submitted daily completion status",
          "Supervisor notified about delayed site activity",
          "Operations dashboard updated for end-of-day review",
        ],
      },
      {
        label: "Performance",
        summary: "Turn daily activity into management visibility without building reports manually.",
        pipeline: ["Attendance Data", "Work Data", "Trend View", "Dashboard", "Manager Decision"],
        activePipelineIndex: 4,
        metrics: [
          { label: "Productivity score", value: "81" },
          { label: "Missed updates", value: "04" },
          { label: "Overtime alerts", value: "03" },
        ],
        bars: [
          { label: "Daily visibility", value: 87 },
          { label: "Trend tracking", value: 76 },
          { label: "Action readiness", value: 72 },
        ],
        activity: [
          "Weekly attendance trend exported for payroll review",
          "High overtime pattern flagged for supervisor follow-up",
          "Operations summary prepared for management meeting",
        ],
      },
    ],
  },
  {
    slug: "endpoint-device-management",
    navTitle: "Endpoint & Device Management",
    cardTitle: "Endpoint & Device Management",
    seoTitle:
      "Endpoint & Device Management Services for Mobile, Laptop, and Desktop Fleets",
    metaDescription:
      "Summit builds unified endpoint and device management systems — MDM for phones and tablets, laptop and desktop management, patch automation, security policies, remote support, and live fleet dashboards.",
    keywords: [
      "endpoint management services",
      "mobile device management MDM",
      "unified endpoint management UEM",
      "laptop fleet management",
      "remote device management",
      "device security automation",
      "patch management automation",
    ],
    heroTitle:
      "Endpoint and device management that runs your whole fleet from one screen.",
    heroDescription:
      "Phones, tablets, laptops, and desktops — Summit builds a single management layer that enrols devices, pushes security policies, automates patches, deploys apps, locks or wipes lost units, and gives IT a live fleet dashboard.",
    heroTags: [
      "MDM for iOS and Android",
      "Laptop & desktop management",
      "Patch automation",
      "Remote wipe and lock",
      "App deployment",
    ],
    heroStats: [
      { label: "Devices managed", value: "All" },
      { label: "Fleet view", value: "Live" },
      { label: "Patch policy", value: "Auto" },
    ],
    problemCards: [
      {
        title: "Devices outside IT's view",
        description:
          "Staff phones, BYOD laptops, and field tablets sit outside any management layer — IT can't see them, can't patch them, and can't recover them if lost.",
      },
      {
        title: "Manual patches and app updates",
        description:
          "Patches and app rollouts happen one device at a time. Critical security updates lag for weeks. IT spends days on manual maintenance.",
      },
      {
        title: "Lost or stolen devices",
        description:
          "When a device leaves the company, there's no fast way to wipe corporate data, revoke access, or lock the unit remotely.",
      },
      {
        title: "Compliance reports take days",
        description:
          "When audit time comes, IT manually compiles which devices have which OS version, which patches are applied, and which staff have what access.",
      },
    ],
    explainerCards: [
      {
        type: "inputs",
        title: "What goes into this workflow",
        description:
          "Every device your team uses — issued, BYOD, mobile, or laptop — gets enrolled into one management layer.",
        bullets: [
          "Company-issued and BYOD phones, tablets, laptops, and desktops across iOS, Android, Windows, and macOS.",
          "Existing identity provider (Azure AD / Google Workspace / Okta) for staff authentication.",
          "Security policies — passwords, encryption, app whitelists, network restrictions.",
        ],
      },
      {
        type: "process",
        title: "How the system processes those devices",
        description:
          "The MDM/UEM layer enrols each device, applies policy, watches state, and acts on issues automatically.",
        bullets: [
          "Devices enrol via QR code, email link, or zero-touch programs (Apple ABM, Android Enterprise, Windows Autopilot).",
          "Policies push automatically — passcodes, encryption, app installs, network configs, restrictions.",
          "Patch automation rolls OS and app updates on a schedule with staged rollout and rollback.",
        ],
      },
      {
        type: "outputs",
        title: "What IT gets back",
        description:
          "Instead of chasing devices one at a time, IT operates from a single fleet view with automation handling the routine.",
        bullets: [
          "A live fleet dashboard — every device, its OS, patches applied, last check-in, assigned user.",
          "Compliance reports ready in seconds for audits, regulators, or executive review.",
          "One-click actions — push update, lock screen, wipe data, restrict app — across any number of devices.",
        ],
      },
      {
        type: "benefits",
        title: "Why teams want this",
        description:
          "Endpoint management is a force-multiplier for small IT teams and a compliance floor for larger ones.",
        bullets: [
          "IT spends time on incidents, not on manual patching and app rollouts.",
          "Lost or stolen devices are wiped and locked within minutes — corporate data stays safe.",
          "Compliance evidence is automatic — no scramble during ISO, SOC 2, HIPAA audits.",
        ],
      },
    ],
    workflowSteps: [
      {
        title: "Enrol the device",
        description:
          "New devices enrol via QR code, email link, or zero-touch programs. BYOD devices use a containerized profile.",
      },
      {
        title: "Apply policy automatically",
        description:
          "Encryption, passcode rules, app whitelists, network configs, and security restrictions push to every device.",
      },
      {
        title: "Watch and patch",
        description:
          "The system monitors device state and pushes OS / app patches automatically on a staged schedule.",
      },
      {
        title: "Act on issues",
        description:
          "Lost device? Wipe or lock from the dashboard. Compliance drift? Auto-remediate. Audit incoming? Reports ready.",
      },
    ],
    deliverables: [
      "MDM (Mobile Device Management) for iOS and Android",
      "UEM (Unified Endpoint Management) for laptops and desktops",
      "Zero-touch enrollment workflows",
      "Patch automation with staged rollout",
      "Remote wipe, lock, and locate",
      "App deployment and license management",
      "Live fleet compliance dashboard",
    ],
    industries: [
      "IT services",
      "BPO and call centers",
      "Healthcare clinics",
      "Field services",
      "Retail chains",
      "Education",
    ],
    faqs: [
      {
        question: "Does this work for both company-issued and BYOD devices?",
        answer:
          "Yes. Company-issued devices get full management; BYOD devices use a containerized work profile so personal data stays separate.",
      },
      {
        question: "What OSes do you support?",
        answer:
          "iOS, iPadOS, Android, Windows, and macOS. ChromeOS available on request.",
      },
      {
        question: "Can it integrate with our existing identity provider?",
        answer:
          "Yes. Azure AD, Google Workspace, Okta, Jamf Connect, and most major SAML/OIDC providers are supported.",
      },
    ],
    contactFocus: "endpoint and device management",
    relatedSlugs: [
      "document-verification-security-automation",
      "workforce-operations-tracking",
      "whatsapp-automation",
    ],
    liveModes: [
      {
        label: "Fleet view",
        summary:
          "See every device, who's using it, what OS, what patches, last check-in time, and compliance state.",
        pipeline: ["Enrolment", "Policy Push", "Live State", "Patch Cycle", "Compliance Log"],
        activePipelineIndex: 2,
        metrics: [
          { label: "Devices live", value: "248" },
          { label: "Compliant", value: "96%" },
          { label: "Pending action", value: "10" },
        ],
        bars: [
          { label: "OS up-to-date", value: 92 },
          { label: "Encryption applied", value: 100 },
          { label: "App compliance", value: 88 },
        ],
        activity: [
          "iPhone-194 enrolled via zero-touch and policy applied in 38 seconds",
          "Laptop-072 patched to latest macOS with staged rollout completing overnight",
          "Tablet-039 reported lost — remote wipe completed in 11 seconds",
        ],
      },
      {
        label: "Patch cycle",
        summary:
          "Stage critical patches across pilot → broad rollout → all devices with automated rollback on failure.",
        pipeline: ["Patch Available", "Pilot Group", "Broad Rollout", "All Devices", "Verified"],
        activePipelineIndex: 3,
        metrics: [
          { label: "This cycle", value: "186" },
          { label: "Pilot passed", value: "100%" },
          { label: "Rollback events", value: "0" },
        ],
        bars: [
          { label: "Patch coverage", value: 94 },
          { label: "Pilot success", value: 100 },
          { label: "Rollback rate", value: 4 },
        ],
        activity: [
          "macOS security patch deployed to 12 pilot devices — verified clean",
          "Broad rollout started — 186 devices in queue",
          "iOS app update applied silently to all enrolled phones",
        ],
      },
      {
        label: "Compliance audit",
        summary:
          "Compliance evidence is generated continuously and exportable for ISO, SOC 2, HIPAA, or internal review.",
        pipeline: ["State Capture", "Policy Match", "Drift Detection", "Remediation", "Audit Pack"],
        activePipelineIndex: 4,
        metrics: [
          { label: "Audit ready", value: "Yes" },
          { label: "Drift events", value: "3" },
          { label: "Auto-remediated", value: "3" },
        ],
        bars: [
          { label: "Policy adherence", value: 96 },
          { label: "Encryption", value: 100 },
          { label: "Audit log integrity", value: 100 },
        ],
        activity: [
          "Quarterly compliance pack generated and exported as PDF",
          "Drift detected — passcode policy auto-reapplied to 2 devices",
          "Audit log archived with tamper-proof hash",
        ],
      },
    ],
  },
  {
    slug: "forex-trading-automation",
    navTitle: "Forex & Trading Automation",
    cardTitle: "Forex & Trading Automation",
    seoTitle:
      "Forex & Trading Automation Services — MT5 EAs, AI Bots, Custom Indicators, Trading Portals",
    metaDescription:
      "Summit builds forex and trading automation systems — MT4/MT5 Expert Advisors, AI-augmented trading bots, custom indicators, strategy backtesting, and trader portal dashboards.",
    keywords: [
      "forex trading automation",
      "MT5 expert advisor development",
      "MT4 EA development",
      "AI trading bots",
      "custom MT5 indicators",
      "trading strategy automation",
      "forex portal development",
      "algorithmic trading systems",
    ],
    heroTitle:
      "Forex and trading automation — custom MT5 EAs, AI bots, indicators, and trader portals.",
    heroDescription:
      "Whether you're running a single strategy or a multi-account trading desk, Summit builds the automation layer — MT4/MT5 Expert Advisors, AI-augmented bots, custom indicators, strategy backtesting, risk controls, and a trader portal you can offer your community.",
    heroTags: [
      "MT4/MT5 Expert Advisors",
      "AI trading bots",
      "Custom indicators",
      "Strategy backtesting",
      "Trader portal dashboards",
    ],
    heroStats: [
      { label: "MT5 EAs", value: "Custom" },
      { label: "Backtest engine", value: "Built-in" },
      { label: "Portal multi-acct", value: "Live" },
    ],
    problemCards: [
      {
        title: "Manual trading missing the move",
        description:
          "Strategy is solid on paper but execution is human-paced. Setups appear, candles close, and the entry is gone before you click.",
      },
      {
        title: "Off-the-shelf bots that don't fit",
        description:
          "Marketplace EAs are generic, opaque, and impossible to tune. You can't see why a trade was taken or adjust the logic for your edge.",
      },
      {
        title: "No portal for clients or signal subscribers",
        description:
          "If you run signals or copy-trade for a community, there's no clean place to manage subscribers, deliver signals, and show live performance.",
      },
      {
        title: "Strategies never properly backtested",
        description:
          "Without a real backtest infrastructure, strategies go live on hope. Drawdowns surprise you. Edge cases blow up real money.",
      },
    ],
    explainerCards: [
      {
        type: "inputs",
        title: "What goes into this workflow",
        description:
          "Your strategy logic, your risk rules, your market data feeds, and your broker account stack — wired together cleanly.",
        bullets: [
          "Strategy rules in plain English or pseudocode — entry, exit, position sizing, risk caps.",
          "Broker account(s) on MT4, MT5, cTrader, or a similar trading platform.",
          "Market data feeds, news APIs, and any external signals you want to factor in.",
        ],
      },
      {
        type: "process",
        title: "How the system processes those signals",
        description:
          "The EA or bot executes your strategy 24/5, with risk controls baked in and a transparent log of every decision.",
        bullets: [
          "MT5 Expert Advisor (or external bot) monitors symbols, evaluates conditions, and fires trades within strategy bounds.",
          "AI/ML layer (optional) augments rule-based logic with pattern recognition, regime detection, or risk scoring.",
          "Risk controls enforce daily loss limits, position size caps, drawdown circuit breakers, and news-event blackouts.",
        ],
      },
      {
        type: "outputs",
        title: "What you get back",
        description:
          "Automated execution, clean performance reports, and an optional portal for your traders or signal subscribers.",
        bullets: [
          "24/5 automated execution across multiple accounts and symbols.",
          "Full audit log of every trade decision — entry reason, indicator state, risk score.",
          "A trader portal with live performance, equity curve, drawdown chart, and trade history.",
        ],
      },
      {
        type: "benefits",
        title: "Why traders and desks want this",
        description:
          "Speed, consistency, scale — and a portal that turns your edge into a community asset.",
        bullets: [
          "Strategies execute the instant the setup forms — no missed moves due to human latency.",
          "Risk rules run unconditionally — emotion and fatigue don't override the plan.",
          "If you run signals, a clean portal replaces ad-hoc Telegram channels with verified, transparent performance.",
        ],
      },
    ],
    workflowSteps: [
      {
        title: "Codify the strategy",
        description:
          "We translate your trading rules into a precise EA spec — entries, exits, position sizing, risk caps, news blackouts.",
      },
      {
        title: "Build the MT5 EA (or external bot)",
        description:
          "Custom MQL5 development with optional AI/ML augmentation. Indicators, signal generators, risk modules, all built clean.",
      },
      {
        title: "Backtest and tune",
        description:
          "Strategy tested across years of historical data on multiple symbols. Walk-forward analysis. Edge case handling.",
      },
      {
        title: "Deploy and monitor",
        description:
          "Live deployment on broker accounts with a monitoring layer. Performance, drawdown, and risk alerts in real time.",
      },
    ],
    deliverables: [
      "Custom MT4/MT5 Expert Advisor development",
      "AI-augmented trading bots (Python + MT5 bridge)",
      "Custom indicator development",
      "Strategy backtesting and walk-forward analysis",
      "Risk management modules (daily caps, drawdown circuit breakers)",
      "Trader portal with live performance and equity curves",
      "Multi-account / signal copy infrastructure",
    ],
    industries: [
      "Retail traders",
      "Prop trading firms",
      "Signal providers",
      "Investment advisors",
      "Trading communities",
      "Fintech startups",
    ],
    faqs: [
      {
        question: "Do you build for MT4 or MT5?",
        answer:
          "Both. We strongly recommend MT5 for new strategies (better backtesting, more symbols, native multi-asset support) but build MT4 EAs when broker support requires it.",
      },
      {
        question: "Can you augment my strategy with AI?",
        answer:
          "Yes. We commonly add AI layers for pattern recognition, market regime classification, and risk scoring — but only where it measurably improves a strategy that's already sound.",
      },
      {
        question: "Will you write strategies for me?",
        answer:
          "We don't invent strategies — we automate yours. If you have an edge worth automating, we'll codify, backtest, and deploy it. We're engineers, not signal sellers.",
      },
      {
        question: "Can you build a portal for my signal subscribers?",
        answer:
          "Yes. Subscriber management, signal delivery, live performance dashboards, copy-trade infrastructure, and Stripe billing if you charge.",
      },
    ],
    contactFocus: "forex and trading automation",
    relatedSlugs: [
      "crm-ai-marketing-automation",
      "endpoint-device-management",
      "document-verification-security-automation",
    ],
    liveModes: [
      {
        label: "Live EA",
        summary:
          "Strategy running on live accounts — see signal evaluation, entry firing, and risk-checks happening in real time.",
        pipeline: ["Market Tick", "Indicator Update", "Signal Eval", "Risk Check", "Trade Fired"],
        activePipelineIndex: 3,
        metrics: [
          { label: "Trades today", value: "14" },
          { label: "Win rate (rolling)", value: "62%" },
          { label: "Max drawdown", value: "3.1%" },
        ],
        bars: [
          { label: "Strategy adherence", value: 100 },
          { label: "Risk-cap utilisation", value: 38 },
          { label: "Latency to fill", value: 92 },
        ],
        activity: [
          "EURUSD setup detected — entry fired at 1.0842 with 35-pip stop and 70-pip target",
          "Daily loss cap at 50% utilisation — new entries paused on this account",
          "News-blackout window engaged — all symbols flat ahead of FOMC",
        ],
      },
      {
        label: "Backtest",
        summary:
          "Walk-forward backtest across 5 years and 8 symbols — equity curve, drawdown, and per-symbol breakdown.",
        pipeline: ["Historical Data", "Strategy Run", "Walk-Forward", "Equity Curve", "Report"],
        activePipelineIndex: 4,
        metrics: [
          { label: "Years tested", value: "5" },
          { label: "Sharpe", value: "1.84" },
          { label: "Max DD", value: "8.2%" },
        ],
        bars: [
          { label: "Profit factor", value: 86 },
          { label: "Win rate", value: 58 },
          { label: "Trade quality", value: 81 },
        ],
        activity: [
          "Walk-forward window 8/12 completed — out-of-sample Sharpe 1.71",
          "GBPJPY contribution analysed — strategy adds 0.31 to portfolio Sharpe",
          "Backtest report exported as PDF + CSV for review",
        ],
      },
      {
        label: "Trader portal",
        summary:
          "Signal subscribers see live performance, equity curve, and copy-trade their account to the strategy.",
        pipeline: ["Subscriber Joins", "Account Linked", "Copy Engaged", "Live Performance", "Monthly Report"],
        activePipelineIndex: 3,
        metrics: [
          { label: "Active subscribers", value: "124" },
          { label: "Linked accounts", value: "98" },
          { label: "Avg uptime", value: "99.4%" },
        ],
        bars: [
          { label: "Copy adherence", value: 98 },
          { label: "Subscriber retention", value: 87 },
          { label: "Portal uptime", value: 99 },
        ],
        activity: [
          "New subscriber linked broker account — copy-trade engaged within 90 seconds",
          "Monthly performance email sent to 124 subscribers — opened by 89%",
          "Strategy paused on stop-out at one subscriber's broker — auto-alert sent",
        ],
      },
    ],
  },
];

export const servicePageMap = Object.fromEntries(servicePages.map((service) => [service.slug, service])) as Record<
  string,
  ServicePageConfig
>;