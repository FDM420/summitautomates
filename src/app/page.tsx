import { CommandCenterEntry } from "@/components/command-center-entry";
import { contactEmail, faqItems, siteUrl } from "@/lib/site-content";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: "Summit AI Automation Services",
      url: siteUrl,
      email: contactEmail,
      description:
        "Summit AI Automation Services builds practical AI automation systems for customer communication, lead handling, recruitment, document verification, reporting, and day-to-day business operations.",
      areaServed: "Worldwide",
      serviceType: [
        "AI automation services",
        "WhatsApp automation",
        "CRM automation",
        "recruitment automation",
        "AI voice agents",
        "business workflow automation",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        type="application/ld+json"
      />
      <CommandCenterEntry />
    </>
  );
}
