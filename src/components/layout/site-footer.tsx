import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

import { Container } from "@/components/ui/container";
import { DotTrail } from "@/components/ui/dot-trail";
import { siteConfig } from "@/config/site";
import { localizeHref, type Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { NewsletterForm } from "./newsletter-form";
import { SocialLinks } from "./social-links";
import { TrustBadges } from "./trust-badges";

type FooterLink = { label: string; href: string };

type FooterCopy = {
  columns: { title: string; links: FooterLink[] }[];
  newsletterTitle: string;
  newsletterText: string;
  noSpam: string;
  tagline: string;
  start: string;
  startNote: string;
  home: string;
  nav: string;
  legal: string;
  privacy: string;
  terms: string;
  rights: string;
  backToTop: string;
};

/**
 * Footer copy. Homepage anchors point at section headings; paths are unprefixed and localized on render.
 * Guide links are plain anchors: with Cache Components a client-side Link would keep the previous guide
 * mounted, and guides share section ids.
 */
const COPY: Localized<FooterCopy> = {
  en: {
    columns: [
      {
        title: "Product",
        links: [
          { label: "How it works", href: "/#workflow-title" },
          { label: "Birdy assistant", href: "/#birdy-title" },
          { label: "Online payments", href: "/#payments-title" },
          { label: "Branded invoices", href: "/#customize-title" },
          { label: "EU e-invoicing", href: "/#einvoice-title" },
          { label: "Pricing", href: "/#pricing-title" },
        ],
      },
      {
        title: "Documentation",
        links: [
          { label: "Create an invoice", href: "/docs/create-an-invoice" },
          { label: "Create an estimate", href: "/docs/create-an-estimate" },
          { label: "Create a proposal", href: "/docs/create-a-proposal" },
          { label: "Create a contract", href: "/docs/create-a-contract" },
          { label: "Manage your account", href: "/docs/manage-your-account" },
        ],
      },
      {
        title: "Help",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "FAQ", href: "/help#faq-title" },
          { label: "Switch to InvoiceBirds", href: "/#migration-title" },
          { label: "Talk to our team", href: siteConfig.links.contact },
        ],
      },
      {
        title: "Explore",
        links: [
          { label: "Why InvoiceBirds", href: "/#comparison-title" },
          { label: "Who it's for", href: "/#audiences-title" },
          { label: "Start for free", href: siteConfig.links.signup },
          { label: "Log in", href: siteConfig.links.login },
        ],
      },
    ],
    newsletterTitle: "Invoicing tips, straight to your inbox.",
    newsletterText: "Practical guides, product updates and e-invoicing news for freelancers and small businesses.",
    noSpam: "No spam, ever. We respect your privacy, and you can unsubscribe at any time.",
    tagline: "Invoices, estimates, proposals, contracts and payments in one place, with Birdy to handle the busywork.",
    start: "Start for free",
    startNote: "Unlimited invoices. No credit card required.",
    home: "home",
    nav: "Footer",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
  fr: {
    columns: [
      {
        title: "Produit",
        links: [
          { label: "Fonctionnement", href: "/#workflow-title" },
          { label: "Assistant Birdy", href: "/#birdy-title" },
          { label: "Paiements en ligne", href: "/#payments-title" },
          { label: "Factures à votre image", href: "/#customize-title" },
          { label: "Facturation électronique", href: "/#einvoice-title" },
          { label: "Tarifs", href: "/#pricing-title" },
        ],
      },
      {
        title: "Documentation",
        links: [
          { label: "Créer une facture", href: "/docs/create-an-invoice" },
          { label: "Créer un devis", href: "/docs/create-an-estimate" },
          { label: "Créer une proposition", href: "/docs/create-a-proposal" },
          { label: "Créer un contrat", href: "/docs/create-a-contract" },
          { label: "Gérer votre compte", href: "/docs/manage-your-account" },
        ],
      },
      {
        title: "Aide",
        links: [
          { label: "Centre d’aide", href: "/help" },
          { label: "FAQ", href: "/help#faq-title" },
          { label: "Passer à InvoiceBirds", href: "/#migration-title" },
          { label: "Contacter notre équipe", href: siteConfig.links.contact },
        ],
      },
      {
        title: "Découvrir",
        links: [
          { label: "Pourquoi InvoiceBirds", href: "/#comparison-title" },
          { label: "Pour qui ?", href: "/#audiences-title" },
          { label: "Commencer gratuitement", href: siteConfig.links.signup },
          { label: "Se connecter", href: siteConfig.links.login },
        ],
      },
    ],
    newsletterTitle: "Des conseils de facturation, directement dans votre boîte mail.",
    newsletterText: "Guides pratiques, nouveautés produit et actualités de la facturation électronique, pour les indépendants et les petites entreprises.",
    noSpam: "Jamais de spam. Nous respectons votre vie privée, et vous pouvez vous désinscrire à tout moment.",
    tagline: "Factures, devis, propositions commerciales, contrats et paiements réunis au même endroit, avec Birdy pour s’occuper des tâches répétitives.",
    start: "Commencer gratuitement",
    startNote: "Factures illimitées. Sans carte bancaire.",
    home: "accueil",
    nav: "Pied de page",
    legal: "Informations légales",
    privacy: "Politique de confidentialité",
    terms: "Conditions d’utilisation",
    rights: "Tous droits réservés.",
    backToTop: "Haut de page",
  },
};

const linkClass = "text-[14.5px] text-[#B8C4D3] transition-colors hover:text-white";

function FooterAnchor({ label, href }: FooterLink) {
  // Same-site page routes use Link; guide pages, external URLs and placeholders use a plain anchor.
  if (href.startsWith("/") && !href.includes("/docs/")) {
    return (
      <Link href={href} className={linkClass}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={linkClass}>
      {label}
    </a>
  );
}

/** Navy footer: newsletter, brand and link columns, then the bottom bar with legal links, socials and badges. */
export async function SiteFooter() {
  const locale = await getLocale();
  const t = COPY[locale];
  const href = (path: string) => localizeHref(locale, path);

  return (
    <footer className="border-t border-white/10 bg-navy text-white">
      <DotTrail />
      <Container className="pt-16 sm:pt-20">
        {/* Newsletter */}
        <div className="flex flex-col gap-8 rounded-3xl bg-white/[0.05] p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          <div className="flex items-start gap-4 sm:items-center sm:gap-5">
            <Image src="/images/bird-wave.webp" alt="" width={181} height={160} className="h-auto w-[60px] shrink-0 sm:w-[76px]" />
            <div>
              <h2 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] sm:text-[26px]">{t.newsletterTitle}</h2>
              <p className="mt-2 max-w-[460px] text-[15px] leading-relaxed text-[#B8C4D3]">{t.newsletterText}</p>
            </div>
          </div>
          <div className="w-full lg:max-w-[460px]">
            <NewsletterForm />
            <p className="mt-3 text-[13px] text-[#8D9BAE]">{t.noSpam}</p>
          </div>
        </div>

        {/* Brand and links */}
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.25fr)_repeat(4,minmax(0,1fr))] lg:gap-10">
          <div className="max-w-[320px]">
            <Link href={href("/")} aria-label={`${siteConfig.name} ${t.home}`} className="inline-block rounded-md">
              <Image src="/images/svgs/invoicebirdslogo-on-navy.svg" alt="" width={188} height={40} className="h-9 w-auto" />
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-[#B8C4D3]">{t.tagline}</p>
            <a
              href={siteConfig.links.signup}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-green px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-green-hover"
            >
              {t.start}
            </a>
            <p className="mt-3 text-[13px] text-[#8D9BAE]">{t.startNote}</p>
            <div className="mt-8">
              <TrustBadges locale={locale} />
            </div>
          </div>

          <nav aria-label={t.nav} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-4">
            {t.columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-semibold tracking-[0.08em] text-white uppercase">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor label={link.label} href={href(link.href)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-6 text-[13.5px] text-[#8D9BAE] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <p>
              &copy; {siteConfig.name}. {t.rights}
            </p>
            <nav aria-label={t.legal}>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                <li>
                  <Link href={href("/privacy")} className="transition-colors hover:text-white">
                    {t.privacy}
                  </Link>
                </li>
                <li>
                  <Link href={href("/terms")} className="transition-colors hover:text-white">
                    {t.terms}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center justify-between gap-6">
            <SocialLinks locale={locale} />
            <a href="#" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              {t.backToTop} <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
      <div aria-hidden="true" className="guide-end" />
    </footer>
  );
}
