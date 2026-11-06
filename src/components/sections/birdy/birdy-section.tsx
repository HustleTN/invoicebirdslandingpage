
import { Container } from "@/components/ui/container";
import { DotTrail } from "@/components/ui/dot-trail";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { BirdyDemo } from "./birdy-demo";

const COPY: Localized<{ eyebrow: string; title: string; lead: string; control: string; start: string; included: string }> = {
  en: {
    eyebrow: "Meet Birdy",
    title: "Your invoicing assistant, right inside InvoiceBirds.",
    lead: "Ask Birdy to prepare invoices, check what’s overdue, log expenses, or give you a quick view of how the month is going, all without leaving your workspace.",
    control: "Birdy helps with the busywork. You stay in control before anything gets sent.",
    start: "Start for free",
    included: "Birdy included in paid plans.",
  },
  fr: {
    eyebrow: "Découvrez Birdy",
    title: "Votre assistant de facturation, directement dans InvoiceBirds.",
    lead: "Demandez à Birdy de préparer vos factures, de repérer les retards de paiement, d’enregistrer vos dépenses ou de faire le point sur votre mois, sans quitter votre espace de travail.",
    control: "Birdy s’occupe des tâches répétitives. Rien n’est envoyé sans votre accord.",
    start: "Commencer gratuitement",
    included: "Birdy est inclus dans les formules payantes.",
  },
};

export async function BirdySection() {
  const t = COPY[await getLocale()];
  return (
    <section aria-labelledby="birdy-title" className="bg-navy py-20 sm:py-24 lg:py-30 text-white">
      <DotTrail />
      <Container>
        <BirdyDemo
          intro={
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center rounded-full bg-blue px-3.5 py-1.5 text-[13px] font-semibold text-white">{t.eyebrow}</p>
              <h2 id="birdy-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px] mx-auto lg:mx-0">
                {t.title}
              </h2>
              <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-[#B8C4D3] lg:mx-0">
                {t.lead}
              </p>
              <p className="mx-auto mt-4 max-w-[640px] text-[15px] text-white lg:mx-0">
                {t.control}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href={siteConfig.links.signup}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-green px-5 text-sm font-semibold text-white transition-colors hover:bg-green-hover"
                >
                  {t.start}
                </a>
                <p className="text-[13px] text-[#B8C4D3]">{t.included}</p>
              </div>
            </div>
          }
        />
      </Container>
    </section>
  );
}
