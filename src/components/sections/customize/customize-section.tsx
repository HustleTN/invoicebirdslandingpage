import { Container } from "@/components/ui/container";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { CustomizeDemo } from "./customize-demo";

const COPY: Localized<{ eyebrow: string; title: string; lead: string }> = {
  en: {
    eyebrow: "Invoice customization",
    title: "Your brand on every invoice.",
    lead: "Pick a template, set your colors, add your logo, taxes, discounts and signature. Every change shows on the invoice instantly.",
  },
  fr: {
    eyebrow: "Personnalisation des factures",
    title: "Votre marque sur chaque facture.",
    lead: "Choisissez un modèle, définissez vos couleurs, ajoutez votre logo, vos taxes, vos remises et votre signature. Chaque modification s’affiche instantanément sur la facture.",
  },
};

export async function CustomizeSection() {
  const t = COPY[await getLocale()];
  return (
    <section aria-labelledby="customize-title" className="border-t border-line bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container>
        <div className="text-center">
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="customize-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px] mx-auto">
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted">
            {t.lead}
          </p>
        </div>
        <div className="mt-10 lg:mt-7">
          <CustomizeDemo />
        </div>
      </Container>
    </section>
  );
}
