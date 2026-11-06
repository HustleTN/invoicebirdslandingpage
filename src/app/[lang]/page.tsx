import type { Metadata } from "next";

import { AudiencesSection } from "@/components/sections/audiences/audiences-section";
import { BirdySection } from "@/components/sections/birdy/birdy-section";
import { ComparisonSection } from "@/components/sections/comparison/comparison-section";
import { CustomizeSection } from "@/components/sections/customize/customize-section";
import { DocsTeaserSection } from "@/components/sections/docs-teaser/docs-teaser-section";
import { EInvoiceBand } from "@/components/sections/einvoice-band/einvoice-band";
import { Hero } from "@/components/sections/hero/hero";
import { MigrationSection } from "@/components/sections/migration/migration-section";
import { PaymentsSection } from "@/components/sections/payments/payments-section";
import { PricingSection } from "@/components/sections/pricing/pricing-section";
import { WorkflowSection } from "@/components/sections/workflow/workflow-section";
import { siteConfig } from "@/config/site";
import { localeAlternates } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: { absolute: siteConfig.title[locale] },
    description: siteConfig.description[locale],
    alternates: localeAlternates(locale, "/"),
  };
}

/** Order and copy follow docs/invoicebirds-homepage-brief.md, §4. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkflowSection />
      <BirdySection />
      <PaymentsSection />
      <CustomizeSection />
      <EInvoiceBand />
      <AudiencesSection />
      <MigrationSection />
      <PricingSection />
      <ComparisonSection />
      <DocsTeaserSection />
    </>
  );
}
