import Link from "next/link";
import { ArrowRight, BookOpen, CircleHelp, Headset, Settings, type LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { DotTrail } from "@/components/ui/dot-trail";
import { siteConfig } from "@/config/site";
import { localizeHref, type Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const COPY: Localized<{ eyebrow: string; title: string; lead: string; cta: string }> = {
  en: {
    eyebrow: "Help & guides",
    title: "Answers whenever you need them.",
    lead: "Clear documentation, quick answers and real people, all in one Help Center.",
    cta: "Visit the Help Center",
  },
  fr: {
    eyebrow: "Aide et guides",
    title: "Des réponses, dès que vous en avez besoin.",
    lead: "Une documentation claire, des réponses rapides et de vraies personnes, réunies dans un seul Centre d’aide.",
    cta: "Accéder au Centre d’aide",
  },
};

/** The ways to get help, each a door into the Help Center, the docs or the team. */
const PATHS: { icon: LucideIcon; href: string; external?: boolean; copy: Localized<{ title: string; text: string; cta: string }> }[] = [
  {
    icon: BookOpen,
    href: "/docs",
    copy: {
      en: {
        title: "Documentation",
        text: "Step-by-step guides for invoices, estimates, proposals and contracts.",
        cta: "Read the guides",
      },
      fr: {
        title: "Documentation",
        text: "Des guides pas à pas pour les factures, devis, propositions commerciales et contrats.",
        cta: "Lire les guides",
      },
    },
  },
  {
    icon: Settings,
    href: "/docs/manage-your-account",
    copy: {
      en: {
        title: "Manage your account",
        text: "Business details, tax, templates, reminders, billing and security.",
        cta: "See account help",
      },
      fr: {
        title: "Gérer votre compte",
        text: "Informations de l’entreprise, taxes, modèles, relances, facturation et sécurité.",
        cta: "Voir l’aide sur le compte",
      },
    },
  },
  {
    icon: CircleHelp,
    href: "/help#faq-title",
    copy: {
      en: {
        title: "FAQ",
        text: "Quick answers about plans, payments, security and getting started.",
        cta: "Browse questions",
      },
      fr: {
        title: "FAQ",
        text: "Des réponses rapides sur les formules, les paiements, la sécurité et la prise en main.",
        cta: "Parcourir les questions",
      },
    },
  },
  {
    icon: Headset,
    href: siteConfig.links.contact,
    external: true,
    copy: {
      en: {
        title: "Talk to our team",
        text: "On paid plans, we help by video call, chat or email.",
        cta: "Get in touch",
      },
      fr: {
        title: "Contacter notre équipe",
        text: "Avec les formules payantes, nous vous aidons par appel vidéo, chat ou e-mail.",
        cta: "Nous écrire",
      },
    },
  },
];

/** A closing help band on navy: the Help Center, then the four ways in as an outlined grid. */
export async function DocsTeaserSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  return (
    <section aria-labelledby="docs-teaser-title" className="bg-navy py-20 sm:py-24 lg:py-30 text-white">
      <DotTrail />
      <Container>
        <div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[720px]">
              <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-green">{t.eyebrow}</p>
              <h2 id="docs-teaser-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px]">
                {t.title}
              </h2>
              <p className="mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-[#C9D6E6]">
                {t.lead}
              </p>
            </div>
            <Link
              href={localizeHref(locale, "/help")}
              className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-lg bg-green px-6 text-[15px] font-semibold text-white transition-colors hover:bg-green-hover lg:self-auto"
            >
              {t.cta}
            </Link>
          </div>

          <ul className="mt-10 grid overflow-hidden rounded-2xl border border-white/10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {PATHS.map(({ icon: Icon, href, external, copy }) => {
              const { title, text, cta } = copy[locale];
              const body = (
                <>
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="mt-4 block text-[17px] font-semibold">{title}</span>
                  <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[#C9D6E6]">{text}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-[14px] font-semibold">
                    {cta}
                    <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </>
              );
              const className = "group flex h-full flex-col px-6 py-7 transition-colors hover:bg-white/5 sm:px-8";
              return (
                <li key={title} className="border-white/10 max-sm:[&:not(:first-child)]:border-t sm:odd:border-r sm:[&:nth-child(n+3)]:border-t lg:border-r lg:last:border-r-0 lg:[&:nth-child(n+3)]:border-t-0">
                  {external ? (
                    <a href={href} className={className}>
                      {body}
                    </a>
                  ) : (
                    <Link href={localizeHref(locale, href)} className={className}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
