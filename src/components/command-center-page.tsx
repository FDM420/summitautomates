"use client";

import { ContactFlow } from "./contact-flow";
import { BeforeAfterSection } from "./sections/BeforeAfterSection";
import { HeroSection } from "./sections/HeroSection";
import { HowSummitWorksSection } from "./sections/HowSummitWorksSection";
import { IndustriesSection } from "./sections/IndustriesSection";
import { ServiceDirectorySection } from "./sections/ServiceDirectorySection";
import { SiteFooter } from "./shared/SiteFooter";
import { SiteHeader } from "./shared/SiteHeader";

export function CommandCenterPage() {
  return (
    <div className="relative">
      <SiteHeader />

      <main className="relative z-10 pb-12 sm:pb-16">
        <HeroSection />
        <ServiceDirectorySection />
        <HowSummitWorksSection />
        <IndustriesSection />
        <BeforeAfterSection />
        <ContactFlow
          description="Send a few sentences about the workflow you'd like to automate. We'll come back with a tailored plan."
          eyebrow="Book A Discovery Call"
          title="Tell us what's slow, messy, or manual today."
        />
      </main>

      <SiteFooter />
    </div>
  );
}
