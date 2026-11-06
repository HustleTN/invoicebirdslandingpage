import type { Localized } from "@/lib/i18n";

export const siteConfig = {
  name: "InvoiceBirds",
  title: {
    en: "Smart Invoicing Software for Small Businesses | InvoiceBirds",
    fr: "Logiciel de facturation intelligent pour les petites entreprises | InvoiceBirds",
  } satisfies Localized<string>,
  description: {
    en: "Create unlimited invoices, connect proposals and contracts, and accept online payments. Let Birdy handle the busywork. Start free with InvoiceBirds.",
    fr: "Créez des factures en illimité, reliez propositions commerciales et contrats, et encaissez vos paiements en ligne. Birdy s'occupe des tâches répétitives. Commencez gratuitement avec InvoiceBirds.",
  } satisfies Localized<string>,
  url: "https://invoicebirds.com",
  /** Support and legal contact. */
  email: "help@invoicebirds.com",
  links: {
    // UNRESOLVED: the real sign-up and log-in URLs are not known yet; replace before launch.
    signup: "#",
    login: "#",
    contact: "mailto:help@invoicebirds.com",
    // UNRESOLVED: the newsletter provider's signup endpoint (e.g. a form POST URL). Until it is set,
    // the footer form only shows its thank-you message and nobody is actually subscribed.
    newsletter: "",
  },
  social: [
    { name: "LinkedIn", href: "https://www.linkedin.com/company/invoicebirds" },
    { name: "Instagram", href: "https://www.instagram.com/invoicebirds/" },
    { name: "X", href: "https://x.com/InvoiceBirds" },
    { name: "Facebook", href: "https://www.facebook.com/invoicebirds/" },
  ],
  /** Main navigation; anchors point at homepage section headings. Paths are unprefixed and localized on render. */
  nav: [
    { label: { en: "Product", fr: "Produit" }, href: "/#workflow-title" },
    { label: { en: "Birdy", fr: "Birdy" }, href: "/#birdy-title" },
    { label: { en: "Pricing", fr: "Tarifs" }, href: "/#pricing-title" },
    { label: { en: "Docs", fr: "Documentation" }, href: "/docs" },
    { label: { en: "Help", fr: "Aide" }, href: "/help" },
  ] satisfies { label: Localized<string>; href: string }[],
} as const;
