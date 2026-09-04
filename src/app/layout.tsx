import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { contactEmail, siteKeywords, siteUrl, whatsappNumber } from "@/lib/site-content";
import { FloatingContactButtons } from "@/components/shared/FloatingContactButtons";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Summit AI Automation Services | AI Automation Services for Business Operations",
  description:
    "Summit AI Automation Services helps businesses automate customer support, WhatsApp communication, lead follow-up, recruitment, document checks, reporting, and daily operations with clear, practical AI systems.",
  applicationName: "Summit AI Automation Services",
  keywords: siteKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Summit AI Automation Services | AI Automation Services for Business Operations",
    description:
      "Clear, business-focused AI automation for customer handling, lead management, recruitment, operations, dashboards, and workflow systems.",
    siteName: "Summit AI Automation Services",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Summit AI Automation — AI Automation, Workflow Automation, Digital Transformation, Custom Software & Smart Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Summit AI Automation Services",
    description:
      "AI automation services for customer support, recruitment, lead management, operations, and business workflows.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#organization`,
  name: "Summit Automates",
  legalName: "Summit Systems (Private) Limited",
  alternateName: "Summit AI Automation Services",
  url: siteUrl,
  logo: `${siteUrl}/summit-logo-gold.png`,
  image: `${siteUrl}/about/office.jpg`,
  description:
    "Summit Automates builds practical AI automation systems for customer communication (WhatsApp), recruitment and HR, CRM and marketing, document verification and security, workforce and operations, AI voice agents, and custom software.",
  email: contactEmail,
  telephone: `+${whatsappNumber}`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Building 65, CBT Tower, Executive Block, Gulberg Greens",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    addressCountry: "PK",
  },
  areaServed: [
    { "@type": "Country", name: "Pakistan" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Australia" },
  ],
  knowsAbout: [
    "AI automation",
    "Workflow automation",
    "Digital transformation",
    "Smart business systems",
    "CRM and ERP automation",
    "WhatsApp automation",
    "CRM and lead management",
    "Recruitment and HR automation",
    "Document verification and security",
    "Workforce and operations tracking",
    "AI voice agents",
    "Custom software development",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: `+${whatsappNumber}`,
    email: contactEmail,
    contactType: "customer service",
    availableLanguage: ["en", "ur"],
  },
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Summit AI Automation Services",
  alternateName: "Summit Automates",
  url: siteUrl,
  description:
    "AI automation, workflow automation, digital transformation, custom software, and smart systems for business operations.",
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="dark" lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint to avoid a flash.
            Default theme is set here and in the <html data-theme> above. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('summit.theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
          type="application/ld+json"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} font-[family:var(--font-display)] antialiased`}
      >
        {children}
        <FloatingContactButtons />
      </body>
    </html>
  );
}
