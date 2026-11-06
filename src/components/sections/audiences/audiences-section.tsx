import Image from "next/image";

import { Container } from "@/components/ui/container";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const COPY: Localized<{ eyebrow: string; title: string; lead: string }> = {
  en: {
    eyebrow: "Who it's for",
    title: "Made for the way you work.",
    lead: "Simple invoicing for freelancers, agencies, consultants and small businesses.",
  },
  fr: {
    eyebrow: "Pour qui",
    title: "Pensé pour votre façon de travailler.",
    lead: "Une facturation simple pour les indépendants, les agences, les consultants et les petites entreprises.",
  },
};

const AUDIENCES: { image: string; position: string; copy: Localized<{ title: string; description: string; alt: string }> }[] = [
  {
    image: "/images/freelancerwoman.jpg",
    position: "object-[62%_center]",
    copy: {
      en: {
        title: "Freelancers",
        description: "Send professional invoices without losing time to admin.",
        alt: "A freelancer smiling as she works on her laptop at home",
      },
      fr: {
        title: "Indépendants",
        description: "Envoyez des factures professionnelles sans perdre de temps en tâches administratives.",
        alt: "Une indépendante souriante travaille sur son ordinateur portable, chez elle",
      },
    },
  },
  {
    image: "/images/agencies.jpg",
    position: "object-center",
    copy: {
      en: {
        title: "Agencies & studios",
        description: "Keep proposals, contracts and client billing connected.",
        alt: "An agency team reviewing work together around laptops and notes",
      },
      fr: {
        title: "Agences et studios",
        description: "Reliez propositions commerciales, contrats et facturation client.",
        alt: "Une équipe d’agence passe un projet en revue autour d’ordinateurs portables et de notes",
      },
    },
  },
  {
    image: "/images/consultants.jpg",
    position: "object-[55%_center]",
    copy: {
      en: {
        title: "Consultants",
        description: "Invoice project fees and ongoing work with less repetition.",
        alt: "Two consultants in suits talking outside an office building",
      },
      fr: {
        title: "Consultants",
        description: "Facturez vos honoraires de projet et vos missions récurrentes sans tout ressaisir.",
        alt: "Deux consultants en costume discutent devant un immeuble de bureaux",
      },
    },
  },
  {
    image: "/images/smallbusinessowner.jpg",
    position: "object-[40%_center]",
    copy: {
      en: {
        title: "Small businesses",
        description: "Quote the job, send the invoice and track payment.",
        alt: "A smiling bakery owner with arms crossed in his shop",
      },
      fr: {
        title: "Petites entreprises",
        description: "Faites le devis, envoyez la facture et suivez le paiement.",
        alt: "Un boulanger souriant, bras croisés, dans sa boutique",
      },
    },
  },
];

export async function AudiencesSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section aria-labelledby="audiences-title" className="border-t border-line bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container>
        <div className="text-center">
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="audiences-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px] mx-auto">
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted">
            {t.lead}
          </p>
        </div>

        <ul className="mt-12 grid gap-x-6 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {AUDIENCES.map(({ image, position, copy }) => {
            const audience = copy[locale];
            return (
              <li key={image} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface sm:aspect-[4/5]">
                  <Image
                    src={image}
                    alt={audience.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className={`object-cover ${position} transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{audience.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{audience.description}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
