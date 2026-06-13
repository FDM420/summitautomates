export type PlainLanguageSolution = {
  title: string;
  description: string;
  tags: string[];
};

export type FAQItem = {
  question: string;
  answer: string;
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://summitautomates.com";

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "admin@summitautomates.com";

export const siteKeywords = [
  "AI automation services",
  "business automation services",
  "workflow automation company",
  "WhatsApp automation services",
  "AI customer support automation",
  "CRM automation systems",
  "AI voice agent solutions",
  "recruitment automation software",
  "document verification automation",
  "lead management automation",
  "enterprise AI automation",
  "industrial AI automation",
  "custom AI software development",
];

export const plainLanguageSolutions: PlainLanguageSolution[] = [
  {
    title: "Answer customer messages faster",
    description:
      "If your team keeps answering the same questions on WhatsApp or chat, we can build a system that replies instantly, sorts serious inquiries, and sends difficult cases to the right person.",
    tags: ["WhatsApp automation", "AI customer support", "lead qualification"],
  },
  {
    title: "Stop losing leads and follow-ups",
    description:
      "We can automate lead capture, reminders, assignment, and follow-up so potential customers do not get forgotten when your team gets busy.",
    tags: ["Lead management", "CRM automation", "sales follow-up"],
  },
  {
    title: "Reduce hiring and document workload",
    description:
      "We can help screen CVs, organize candidate records, check documents, and move the right people forward without endless manual sorting.",
    tags: ["Recruitment automation", "document verification", "HR workflows"],
  },
  {
    title: "See operations clearly in one place",
    description:
      "Instead of chasing updates from different teams, you get dashboards, reports, and alerts that show what is happening across support, hiring, sales, and operations.",
    tags: ["Operational dashboards", "business reporting", "workflow visibility"],
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "What is AI automation in simple words?",
    answer:
      "AI automation means software handles repeated work for you. It can reply to common questions, move data between systems, sort leads, screen documents, and show reports so your staff spends less time on manual tasks.",
  },
  {
    question: "Do I need technical knowledge to use these systems?",
    answer:
      "No. Most business owners only need to explain the daily problem in plain words. Summit translates that into a workflow, builds the system, and keeps the experience simple for your staff.",
  },
  {
    question: "Will AI replace my staff?",
    answer:
      "Usually no. The goal is to remove repeated work, not remove people. Your team can focus on important calls, approvals, sales conversations, and customer issues while the system handles the routine steps.",
  },
  {
    question: "What kinds of businesses can use these automation services?",
    answer:
      "Any business with repeated messages, paperwork, lead follow-up, hiring tasks, reporting, or internal approvals can benefit. That includes recruitment, immigration, tourism, operations, real estate, support teams, and industrial firms.",
  },
  {
    question: "Can one system handle WhatsApp, leads, calls, and dashboards together?",
    answer:
      "Yes. Summit builds connected systems, so customer messages, AI replies, lead routing, call summaries, documents, and reporting can work together instead of sitting in separate tools.",
  },
  {
    question: "Do you only build chatbots?",
    answer:
      "No. Chatbots are only one small part. Summit also builds CRM workflows, voice agents, recruitment systems, verification flows, dashboards, portals, and full custom business software.",
  },
];