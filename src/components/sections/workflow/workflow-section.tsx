import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { WorkflowSteps } from "./workflow-steps";

const COPY: Localized<{ eyebrow: string; title: string; lead: string; start: string; included: string; plans: string }> = {
  en: {
    eyebrow: "One connected client workflow",
    title: "Proposals, contracts and invoices. Connected.",
    lead: "Agree on the work, confirm the details and create your invoice without entering the same client information again.",
    start: "Start with the document you need. Keep the next step connected.",
    included: "Proposals and contracts are included with Growth.",
    plans: "See plans",
  },
  fr: {
    eyebrow: "Un parcours client entièrement connecté",
    title: "Propositions, contrats et factures. Tout est lié.",
    lead: "Mettez-vous d’accord sur la mission, validez les détails et créez votre facture sans ressaisir les informations de votre client.",
    start: "Commencez par le document qu’il vous faut. La suite s’enchaîne.",
    included: "Propositions et contrats sont inclus dans la formule Growth.",
    plans: "Voir les formules",
  },
};

export async function WorkflowSection() {
  const t = COPY[await getLocale()];
  return (
    <section aria-labelledby="workflow-title" className="bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container>
        <div className="mx-auto max-w-[720px] text-center lg:mx-0 lg:text-left">
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="workflow-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px] mx-auto lg:mx-0">
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted lg:mx-0">
            {t.lead}
          </p>
        </div>

        <div className="mt-12 lg:mt-10">
          <WorkflowSteps />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl bg-surface px-6 py-5 text-center text-[15px] sm:flex-row sm:justify-between sm:text-left">
          <p className="font-medium">{t.start}</p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-muted sm:justify-start">
            {t.included}
            <a href="#pricing-title" className="inline-flex items-center gap-1 font-semibold text-blue hover:underline">
              {t.plans} <ArrowRight size={15} aria-hidden="true" />
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
