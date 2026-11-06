import { Container } from "@/components/ui/container";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { FormatExplorer } from "./format-explorer";

const en = {
  eyebrow: "European e-invoicing",
  title: "EU e-invoicing, without the complexity.",
  lead: "Create structured e-invoices in supported European formats, import supplier invoices and keep everything organized in one workspace.",
  benefits: [
    { title: "Multiple formats, one workspace", text: "Export supported European e-invoice formats without switching tools." },
    { title: "Import supplier invoices", text: "Bring structured incoming invoices into InvoiceBirds." },
    { title: "Built for easier administration", text: "Keep invoice details organized and ready to review." },
  ],
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: "Facturation électronique européenne",
    title: "La facturation électronique européenne, en toute simplicité.",
    lead: "Créez des factures électroniques structurées dans les formats européens pris en charge, importez vos factures fournisseurs et gardez tout organisé dans un seul espace de travail.",
    benefits: [
      { title: "Plusieurs formats, un seul espace", text: "Exportez vos factures électroniques dans les formats européens pris en charge, sans changer d’outil." },
      { title: "Importez vos factures fournisseurs", text: "Intégrez vos factures entrantes structurées dans InvoiceBirds." },
      { title: "Une gestion administrative allégée", text: "Gardez les détails de vos factures organisés et prêts à être vérifiés." },
    ],
  },
};

/**
 * European e-invoicing with a clickable format explorer. File export and
 * import only: nothing here claims network delivery or certification.
 * No CTA until an e-invoicing page exists to link to.
 */
export async function EInvoiceBand() {
  const t = COPY[await getLocale()];
  return (
    <section aria-labelledby="einvoice-title" className="border-t border-line bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-center lg:gap-14 xl:gap-16">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="einvoice-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px]">
            {t.title}
          </h2>
          <p className="mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted">
            {t.lead}
          </p>
          <dl className="mt-8 space-y-5">
            {t.benefits.map((benefit) => (
              <div key={benefit.title}>
                <dt className="font-semibold">{benefit.title}</dt>
                <dd className="mt-1 text-[15px] text-muted">{benefit.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0 sm:pb-10">
          <FormatExplorer />
        </div>
      </Container>
    </section>
  );
}
