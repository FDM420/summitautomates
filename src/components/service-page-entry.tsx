"use client";

import dynamic from "next/dynamic";
import type { ServicePageConfig } from "@/lib/service-pages";

const ServiceLandingClient = dynamic(
  () => import("./service-landing-client").then((module) => module.ServiceLandingClient),
  {
    ssr: false,
    loading: () => (
      <main className="section-shell flex min-h-screen items-center justify-center py-24">
        <div className="panel-strong w-full max-w-xl rounded-[2rem] p-8 text-center">
          <p className="mono text-xs uppercase tracking-[0.24em] text-cyan-200/80">Summit AI Automation Services</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">Loading the service...</h1>
        </div>
      </main>
    ),
  },
);

export function ServicePageEntry({
  service,
  relatedServices,
}: {
  service: ServicePageConfig;
  relatedServices: ServicePageConfig[];
}) {
  return <ServiceLandingClient relatedServices={relatedServices} service={service} />;
}