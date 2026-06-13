import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { siteKeywords, siteUrl } from "@/lib/site-content";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Summit AI Automation Services",
    description:
      "AI automation services for customer support, recruitment, lead management, operations, and business workflows.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} font-[family:var(--font-display)] antialiased`}
      >
        {/* No-flash theme init — runs before paint. Default is light; only
            applies dark when the visitor has explicitly chosen it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
