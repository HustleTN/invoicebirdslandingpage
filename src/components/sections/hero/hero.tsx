
import { Container } from "@/components/ui/container";
import { DotTrail } from "@/components/ui/dot-trail";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { HeroDemo } from "./hero-demo";
import { ReplayDemoButton } from "./replay-demo-button";

const DEMO_ID = "birdy-demo";

const en = {
  eyebrow: "Smart invoicing software for freelancers and small businesses",
  title: ["Smarter invoicing.", "From proposal to paid."],
  lead: "Create unlimited invoices, manage proposals and contracts, and accept online payments. Ask Birdy to prepare the details, or use the builder for full control.",
  start: "Start for free",
  demo: "See Birdy in action",
  reassurance: "No credit card required · Unlimited invoices on every plan",
  birdyPlans: "Birdy included in paid plans.",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: "Logiciel de facturation intelligent pour indépendants et petites entreprises",
    title: ["Facturez plus malin.", "De la proposition au paiement."],
    lead: "Créez des factures en illimité, gérez vos propositions commerciales et vos contrats, et encaissez vos paiements en ligne. Confiez les détails à Birdy ou utilisez l’éditeur pour garder la main.",
    start: "Commencer gratuitement",
    demo: "Voir Birdy en action",
    reassurance: "Sans carte bancaire · Factures illimitées dans toutes les formules",
    birdyPlans: "Birdy inclus dans les formules payantes.",
  },
};

/** Navy hero around the preserved product showcase; the product straddles a navy/white split. */
export async function Hero() {
  const t = COPY[await getLocale()];

  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip bg-white text-white">
      <div className="grid-navy relative isolate bg-navy">
        <DotTrail />
        <div aria-hidden="true" className="guide-start -z-10" />
      <Container className="pt-14 text-center sm:pt-16 md:pt-20">
        <p className="text-sm font-medium text-white/70">{t.eyebrow}</p>

        <h1
          id="hero-title"
          className="mx-auto mt-5 max-w-[980px] text-[38px] leading-[1.06] font-semibold tracking-[-0.045em] sm:text-[56px] sm:tracking-[-0.05em] lg:text-[68px]"
        >
          {t.title[0]}
          <br className="hidden sm:inline" /> {t.title[1]}
        </h1>

        <p className="mx-auto mt-6 max-w-[680px] text-base leading-relaxed text-[#B8C4D3] sm:text-lg">
          {t.lead}
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={siteConfig.links.signup}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green px-5 text-sm font-semibold text-white transition-colors hover:bg-green-hover"
          >
            {t.start}
          </a>
          <ReplayDemoButton
            targetId={DEMO_ID}
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t.demo}
          </ReplayDemoButton>
        </div>
        <p className="mt-4 text-[13px] text-[#B8C4D3]">{t.reassurance}</p>
        <p className="mt-1 text-xs text-white/55">{t.birdyPlans}</p>
      </Container>
      </div>

      {/* The product sits on the seam: navy behind its top half, white behind the rest */}
      <div className="relative pb-10 lg:pb-2">
        <div aria-hidden="true" className="grid-navy absolute inset-x-0 top-0 h-[48%] bg-navy" />
        <Container className="relative pt-12 sm:pt-14">
          <HeroDemo id={DEMO_ID} />
        </Container>
      </div>
    </section>
  );
}
