"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  KeyRound,
  Languages,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  PenLine,
  Presentation,
  Receipt,
  Search,
  Settings,
  Signature,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";

import { useHref, useLocale } from "@/components/i18n/locale-provider";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";

import { FAQ_GROUPS } from "./faq-data";

/** A guide from /docs without its mockups, so it can come from the server. */
export type HelpGuide = { slug: string; title: string; description: string; category: string; sections: { id: string; title: string }[] };

const GUIDE_ICONS: Record<string, LucideIcon> = {
  "create-an-invoice": FileText,
  "create-an-estimate": ClipboardList,
  "create-a-proposal": Presentation,
  "create-a-contract": PenLine,
  "manage-your-account": Settings,
};

const en = {
  eyebrow: "Help Center",
  title: "How can we help?",
  lead: "Search our guides and answers, or browse by topic. Our team is here if you need a hand.",
  placeholder: "Search for help, e.g. reminders or password",
  searchLabel: "Search the Help Center",
  clear: "Clear search",
  popular: "Popular:",
  popularTerms: ["password", "reminders", "tax", "cancel", "French"],
  results: (count: number) => `${count} results for`,
  quote: (query: string) => `“${query}”`,
  inGuides: "In the guides",
  questions: "Questions",
  /** "Nothing matches yet. Try another word, or [ask our team]." */
  empty: ["Nothing matches yet. Try another word, or ", "ask our team", "."],
  docsEyebrow: "Documentation",
  docsTitle: "Step-by-step guides",
  docsAll: "Browse all documentation",
  docsLead: "Illustrated walkthroughs that follow one real example, Ridgeway Towing & Recovery, from first click to send.",
  steps: (count: number) => `${count} steps`,
  readGuide: "Read the guide",
  accountEyebrow: "Manage my account",
  accountTitle: "Your settings, explained",
  accountGuide: "Read the full guide",
  faqTitle: "Common questions",
  faqTopics: "FAQ topics",
  contactEyebrow: "Still need help?",
  contactTitle: "Talk to a real person.",
  contactLead: "On paid plans, our team helps you set up, switch from another tool and get the most out of InvoiceBirds.",
  contactCta: "Talk to our team",
  photoAlt: "InvoiceBirds support team on headsets",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: "Centre d’aide",
    title: "Comment pouvons-nous vous aider ?",
    lead: "Cherchez dans nos guides et nos réponses, ou parcourez les sujets. Notre équipe est là si vous avez besoin d’un coup de main.",
    placeholder: "Rechercher, par ex. relances ou mot de passe",
    searchLabel: "Rechercher dans le Centre d’aide",
    clear: "Effacer la recherche",
    popular: "Recherches populaires :",
    popularTerms: ["mot de passe", "relances", "TVA", "résilier", "français"],
    results: (count: number) => `${count} ${count > 1 ? "résultats" : "résultat"} pour`,
    quote: (query: string) => `« ${query} »`,
    inGuides: "Dans les guides",
    questions: "Questions",
    empty: ["Aucun résultat pour l’instant. Essayez un autre mot ou ", "écrivez à notre équipe", "."],
    docsEyebrow: "Documentation",
    docsTitle: "Guides pas à pas",
    docsAll: "Parcourir toute la documentation",
    docsLead: "Des tutoriels illustrés qui suivent un exemple concret, Ridgeway Towing & Recovery, du premier clic à l’envoi.",
    steps: (count: number) => `${count} étapes`,
    readGuide: "Lire le guide",
    accountEyebrow: "Gérer mon compte",
    accountTitle: "Vos paramètres, expliqués",
    accountGuide: "Lire le guide complet",
    faqTitle: "Questions fréquentes",
    faqTopics: "Thèmes de la FAQ",
    contactEyebrow: "Toujours besoin d’aide ?",
    contactTitle: "Parlez à une vraie personne.",
    contactLead:
      "Avec les formules payantes, notre équipe vous aide à configurer votre compte, à migrer depuis un autre outil et à tirer le meilleur parti d’InvoiceBirds.",
    contactCta: "Contacter notre équipe",
    photoAlt: "L’équipe d’assistance InvoiceBirds, casque sur les oreilles",
  },
};

/** Common account tasks, each a step of the Manage your account guide. */
const ACCOUNT_TASKS: { id: string; icon: LucideIcon; copy: Localized<{ title: string; text: string }> }[] = [
  {
    id: "business-identity",
    icon: Building2,
    copy: {
      en: { title: "Update your business details", text: "Name, logo, website and email" },
      fr: { title: "Modifier l’identité de l’entreprise", text: "Nom, logo, site web et e-mail" },
    },
  },
  {
    id: "contact-legal",
    icon: MapPin,
    copy: {
      en: { title: "Add your address and VAT ID", text: "The From block on every document" },
      fr: { title: "Ajouter votre adresse et n° de TVA", text: "Le bloc Émetteur de chaque document" },
    },
  },
  {
    id: "document-defaults",
    icon: Receipt,
    copy: {
      en: { title: "Change currency, notes and terms", text: "Defaults for new documents" },
      fr: { title: "Modifier devise, notes et conditions", text: "Valeurs par défaut des nouveaux documents" },
    },
  },
  {
    id: "signature",
    icon: Signature,
    copy: {
      en: { title: "Save your signature", text: "For invoices, estimates and contracts" },
      fr: { title: "Enregistrer votre signature", text: "Pour les factures, devis et contrats" },
    },
  },
  {
    id: "invoice-defaults",
    icon: BadgePercent,
    copy: {
      en: { title: "Set tax rates and numbering", text: "VAT, due dates and prefixes" },
      fr: { title: "Définir taxes et numérotation", text: "TVA, échéances et préfixes" },
    },
  },
  {
    id: "templates",
    icon: Palette,
    copy: {
      en: { title: "Change your template and colors", text: "Layout, brand colors and fonts" },
      fr: { title: "Changer de modèle et de couleurs", text: "Mise en page, couleurs de marque et polices" },
    },
  },
  {
    id: "tax",
    icon: ClipboardList,
    copy: {
      en: { title: "Track taxes and deadlines", text: "Jurisdiction, filing rhythm, reminders" },
      fr: { title: "Suivre taxes et échéances", text: "Juridiction, fréquence de déclaration, rappels" },
    },
  },
  {
    id: "reminders",
    icon: Mail,
    copy: {
      en: { title: "Turn on payment reminders", text: "Automatic follow-ups for unpaid invoices" },
      fr: { title: "Activer les relances de paiement", text: "Relances automatiques des factures impayées" },
    },
  },
  {
    id: "notifications",
    icon: Bell,
    copy: {
      en: { title: "Choose your notifications", text: "Payments, responses and alerts" },
      fr: { title: "Choisir vos notifications", text: "Paiements, réponses et alertes" },
    },
  },
  {
    id: "billing",
    icon: CreditCard,
    copy: {
      en: { title: "Change your plan or payment method", text: "Upgrade, downgrade, monthly or yearly" },
      fr: { title: "Changer de formule ou de moyen de paiement", text: "Monter ou descendre en gamme, au mois ou à l’année" },
    },
  },
  {
    id: "profile-security",
    icon: KeyRound,
    copy: {
      en: { title: "Change your password", text: "And turn on two-factor authentication" },
      fr: { title: "Changer votre mot de passe", text: "Et activer l’authentification à deux facteurs" },
    },
  },
  {
    id: "language",
    icon: Languages,
    copy: {
      en: { title: "Switch to French or English", text: "For the whole app" },
      fr: { title: "Passer au français ou à l’anglais", text: "Pour toute l’application" },
    },
  },
];

const CHANNELS: { icon: LucideIcon; label: Localized<string> }[] = [
  { icon: Video, label: { en: "Video call", fr: "Appel vidéo" } },
  { icon: MessageCircle, label: { en: "Chat", fr: "Chat" } },
  { icon: Mail, label: { en: "Email", fr: "E-mail" } },
];

/** Lowercase, without accents, so "facture" finds "Facturé", and with plain apostrophes and spaces as typed. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u00a0\u202f]/g, " ");

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown size={19} aria-hidden="true" className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <p className="-mt-1 max-w-[680px] pb-5 text-[15px] leading-relaxed text-muted">{a}</p>
    </details>
  );
}

function SectionHeading({ id, eyebrow, title, aside }: { id: string; eyebrow: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-[26px] leading-tight font-semibold tracking-[-0.025em] sm:text-[32px]">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

export function HelpCenter({ guides }: { guides: HelpGuide[] }) {
  const locale = useLocale();
  const href = useHref();
  const t = COPY[locale];
  const faqGroups = FAQ_GROUPS[locale];
  const [query, setQuery] = useState("");
  const q = norm(query.trim());

  // Search runs over guide steps and FAQs together; an empty query shows the browse view.
  const results = useMemo(() => {
    if (!q) return null;
    const steps = guides.flatMap((g) =>
      g.sections.filter((s) => norm(`${s.title} ${g.title}`).includes(q)).map((s) => ({ href: `/docs/${g.slug}#${s.id}`, title: s.title, guide: g.title })),
    );
    const faqs = faqGroups.flatMap((group) => group.items.filter((item) => norm(`${item.q} ${item.a}`).includes(q)));
    return { steps, faqs };
  }, [q, guides, faqGroups]);

  const docGuides = guides.filter((g) => g.category !== "Your account");

  return (
    <div className="bg-white text-navy">
      {/* Search */}
      <section aria-labelledby="help-title" className="border-b border-line bg-surface">
        <Container className="py-14 text-center sm:py-20">
          <p className="text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">{t.eyebrow}</p>
          <h1 id="help-title" className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-[-0.035em] sm:text-[48px]">
            {t.title}
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[17px] leading-relaxed text-muted">
            {t.lead}
          </p>
          <div className="relative mx-auto mt-8 max-w-[620px]">
            <Search size={19} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.placeholder}
              aria-label={t.searchLabel}
              className="h-14 w-full rounded-2xl border border-line bg-white pr-12 pl-12 text-[16px] shadow-[0_10px_30px_rgba(10,37,64,0.06)] outline-none placeholder:text-[#9CA3AF] focus:border-blue focus:ring-4 focus:ring-blue/10 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t.clear}
                className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[14px]">
            <span className="text-muted">{t.popular}</span>
            {t.popularTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="cursor-pointer rounded-full border border-line bg-white px-3 py-1 font-medium text-navy hover:border-[#B9C5D3]"
              >
                {term}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {results ? (
        <Container className="max-w-[880px] py-14">
          <p className="text-[15px] text-muted" aria-live="polite">
            {t.results(results.steps.length + results.faqs.length)} <span className="font-semibold text-navy">{t.quote(query.trim())}</span>
          </p>
          {results.steps.length > 0 && (
            <>
              <h2 className="mt-8 text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">{t.inGuides}</h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {results.steps.map((step) => (
                  <li key={step.href}>
                    <a href={href(step.href)} className="group flex items-center justify-between gap-4 py-4">
                      <span>
                        <span className="block font-semibold">{step.title}</span>
                        <span className="block text-[14px] text-muted">{step.guide}</span>
                      </span>
                      <ArrowRight size={17} className="shrink-0 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          {results.faqs.length > 0 && (
            <>
              <h2 className="mt-10 text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">{t.questions}</h2>
              <div className="mt-3 divide-y divide-line border-y border-line">
                {results.faqs.map((item) => (
                  <FaqItem key={item.q} {...item} />
                ))}
              </div>
            </>
          )}
          {results.steps.length + results.faqs.length === 0 && (
            <p className="mt-6 rounded-2xl bg-surface px-6 py-8 text-center text-[15px] text-muted">
              {t.empty[0]}
              <a href={siteConfig.links.contact} className="font-semibold text-blue hover:underline">
                {t.empty[1]}
              </a>
              {t.empty[2]}
            </p>
          )}
        </Container>
      ) : (
        <>
          {/* Documentation */}
          <section aria-labelledby="help-guides" className="py-16 sm:py-20">
            <Container>
              <SectionHeading
                id="help-guides"
                eyebrow={t.docsEyebrow}
                title={t.docsTitle}
                aside={
                  <a href={href("/docs")} className="inline-flex items-center gap-1.5 font-semibold text-blue hover:underline">
                    <BookOpen size={16} aria-hidden="true" /> {t.docsAll}
                  </a>
                }
              />
              <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-muted">
                {t.docsLead}
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {docGuides.map((guide) => {
                  const Icon = GUIDE_ICONS[guide.slug] ?? FileText;
                  return (
                    <li key={guide.slug}>
                      <a
                        href={href(`/docs/${guide.slug}`)}
                        className="group flex h-full flex-col rounded-2xl border border-line p-5 transition-[border-color,box-shadow] hover:border-[#D3DCE6] hover:shadow-[0_14px_36px_rgba(10,37,64,0.08)]"
                      >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-blue-soft text-blue">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span className="mt-4 text-[17px] font-semibold">{guide.title}</span>
                        <span className="mt-1 text-[14px] text-muted">{t.steps(guide.sections.length)}</span>
                        <span className="mt-auto flex items-center gap-1.5 pt-4 text-[14px] font-semibold">
                          {t.readGuide}
                          <ArrowRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Container>
          </section>

          {/* Manage my account */}
          <section aria-labelledby="help-account" className="border-y border-line bg-surface py-16 sm:py-20">
            <Container>
              <SectionHeading
                id="help-account"
                eyebrow={t.accountEyebrow}
                title={t.accountTitle}
                aside={
                  <a href={href("/docs/manage-your-account")} className="inline-flex items-center gap-1.5 font-semibold text-blue hover:underline">
                    {t.accountGuide} <ArrowRight size={16} aria-hidden="true" />
                  </a>
                }
              />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ACCOUNT_TASKS.map(({ id, icon: Icon, copy }) => (
                  <li key={id}>
                    <a
                      href={href(`/docs/manage-your-account#${id}`)}
                      className="group flex items-center gap-3.5 rounded-xl bg-white p-4 transition-shadow hover:shadow-[0_10px_28px_rgba(10,37,64,0.08)]"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-navy">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{copy[locale].title}</span>
                        <span className="block text-[13.5px] text-muted">{copy[locale].text}</span>
                      </span>
                      <ArrowRight size={16} className="shrink-0 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Container>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-title" className="py-16 sm:py-20">
            <Container className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
              <div>
                <p className="text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">FAQ</p>
                <h2 id="faq-title" className="mt-2 text-[26px] leading-tight font-semibold tracking-[-0.025em] sm:text-[32px]">
                  {t.faqTitle}
                </h2>
                <nav aria-label={t.faqTopics} className="mt-6 hidden lg:block">
                  <ul className="space-y-1 border-l border-line">
                    {faqGroups.map((group) => (
                      <li key={group.id}>
                        <a href={`#faq-${group.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[15px] text-muted hover:border-navy hover:text-navy">
                          {group.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="space-y-10">
                {faqGroups.map((group) => (
                  <div key={group.id} id={`faq-${group.id}`} className="scroll-mt-24">
                    <h3 className="text-[18px] font-semibold">{group.title}</h3>
                    <div className="mt-2 divide-y divide-line border-y border-line">
                      {group.items.map((item) => (
                        <FaqItem key={item.q} {...item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        </>
      )}

      {/* Contact the team */}
      <section aria-labelledby="help-contact" className="pb-20">
        <Container>
          <div className="grid overflow-hidden rounded-3xl bg-navy text-white lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div className="p-8 sm:p-12">
              <p className="text-[13px] font-semibold tracking-[0.08em] text-green uppercase">{t.contactEyebrow}</p>
              <h2 id="help-contact" className="mt-3 text-[28px] leading-tight font-semibold tracking-[-0.025em] sm:text-[34px]">
                {t.contactTitle}
              </h2>
              <p className="mt-4 max-w-[480px] text-[16px] leading-relaxed text-[#B8C4D3]">
                {t.contactLead}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5 text-[14px]">
                {CHANNELS.map(({ icon: Icon, label }) => (
                  <li key={label.en} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5">
                    <Icon size={15} aria-hidden="true" /> {label[locale]}
                  </li>
                ))}
              </ul>
              <a
                href={siteConfig.links.contact}
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-green px-6 text-[15px] font-semibold text-white transition-colors hover:bg-green-hover"
              >
                {t.contactCta}
              </a>
            </div>
            <div className="relative min-h-[260px]">
              <Image src="/images/customer support.jpg" alt={t.photoAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[68%_center]" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
