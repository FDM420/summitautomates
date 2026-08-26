import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageEntry } from "@/components/service-page-entry";
import { servicePageMap, servicePages } from "@/lib/service-pages";
import { contactEmail, siteUrl } from "@/lib/site-content";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePageMap[slug];

  if (!service) {
    return {};
  }

  return {
    title: `${service.seoTitle} | Summit AI Automation Services`,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.seoTitle} | Summit AI Automation Services`,
      description: service.metaDescription,
      url: `${siteUrl}/services/${service.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.cardTitle} | Summit AI Automation Services`,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = servicePageMap[slug];

  if (!service) {
    notFound();
  }

  const relatedServices = service.relatedSlugs.map((relatedSlug) => servicePageMap[relatedSlug]).filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `${service.cardTitle} | Summit AI Automation Services`,
        serviceType: service.cardTitle,
        description: service.metaDescription,
        provider: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "Summit AI Automation Services",
          legalName: "Summit Systems (Pvt) Ltd",
          url: siteUrl,
          email: contactEmail,
        },
        areaServed: "Worldwide",
        url: `${siteUrl}/services/${service.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
          {
            "@type": "ListItem",
            position: 3,
            name: service.cardTitle,
            item: `${siteUrl}/services/${service.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
        type="application/ld+json"
      />
      <ServicePageEntry relatedServices={relatedServices} service={service} />
    </>
  );
}