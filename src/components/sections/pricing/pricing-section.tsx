import { Container } from "@/components/ui/container";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { PricingPlans } from "./pricing-plans";

const COPY: Localized<{ eyebrow: string; title: string; lead: string }> = {
  en: {
    eyebrow: "Pricing",
    title: "Unlimited invoices. Clear pricing.",
    lead: "Start free. Upgrade for Birdy, more automation or the complete proposal-to-payment workflow.",
  },
  fr: {
    eyebrow: "Tarifs",
    title: "Factures illimitées. Tarifs transparents.",
    lead: "Commencez gratuitement. Passez à une formule payante pour Birdy, plus d’automatisation ou le parcours complet, de la proposition au paiement.",
  },
};

export async function PricingSection() {
  const t = COPY[await getLocale()];
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="border-t border-line bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container>
        <div className="text-center">
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="pricing-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px] mx-auto">
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted">
            {t.lead}
          </p>
        </div>

        <div className="mt-10">
          <PricingPlans />
        </div>
      </Container>
    </section>
  );
}
