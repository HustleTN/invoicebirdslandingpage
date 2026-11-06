import type { Localized } from "@/lib/i18n";

/**
 * Plan content as supplied (31 Oct 2026), condensed for the homepage cards.
 * UNRESOLVED before launch: validate caps, features and prices against the
 * live checkout/plan configuration.
 */
export type Billing = "monthly" | "yearly";

export type Plan = {
  id: "free" | "professional" | "growth";
  name: string;
  badge?: string;
  description: string;
  /** Price per month for each billing period, in USD. */
  price: Record<Billing, number>;
  /** Total charged once a year on yearly billing. */
  billedYearly?: number;
  /** Monthly Birdy allowance; absent on Free. */
  birdyRequests?: number;
  /** Shown as a bar above the feature list instead of a first bullet. */
  includesAbove?: string;
  cta: string;
  note?: string;
  /** Features; `strong` ones are emphasised. */
  features: { text: string; strong?: boolean }[];
};

const list = (...items: (string | [string, true])[]) =>
  items.map((item) => (typeof item === "string" ? { text: item } : { text: item[0], strong: true }));

/** Prices and allowances, the same in every language. */
const NUMBERS = {
  free: { price: { monthly: 0, yearly: 0 } },
  professional: { price: { monthly: 16, yearly: 8 }, billedYearly: 96, birdyRequests: 250 },
  growth: { price: { monthly: 24, yearly: 12 }, billedYearly: 144, birdyRequests: 500 },
} satisfies Record<Plan["id"], Pick<Plan, "price" | "billedYearly" | "birdyRequests">>;

export const PLANS: Localized<Plan[]> = {
  en: [
    {
      id: "free",
      name: "Free",
      description: "For getting started.",
      ...NUMBERS.free,
      cta: "Start for free",
      note: "No credit card required.",
      features: list(
        "Unlimited invoices",
        "3 clients, 3 saved items and 3 estimates",
        "Supported e-invoice exports",
        "Online payments via Stripe",
        "Expense tracking",
        "InvoiceBirds branding",
      ),
    },
    {
      id: "professional",
      name: "Professional",
      badge: "Best for Invoicing",
      description: "For freelancers and businesses that want smarter invoicing, less admin, and more control over their finances.",
      ...NUMBERS.professional,
      includesAbove: "Everything in Free, plus",
      cta: "Start Professional",
      features: list(
        ["Prepare and edit invoices with Birdy", true],
        "Unlimited estimates, clients and items",
        "Online payments and automatic reminders",
        "Custom templates and tax labels",
        "Expense management and tax reports",
        "Remove InvoiceBirds branding",
      ),
    },
    {
      id: "growth",
      name: "Growth",
      badge: "Full Client Workflow",
      description:
        "For growing businesses that want to manage proposals, contracts, invoicing, payments, and financial performance in one place.",
      ...NUMBERS.growth,
      includesAbove: "Everything in Professional, plus",
      cta: "Choose Growth",
      features: list(
        ["Proposals clients accept online", true],
        ["Contracts with online signatures", true],
        "Turn proposals into contracts and invoices",
        "Track documents from sent to signed",
        "Advanced analytics and tax insights",
        "Bulk editing and priority support",
      ),
    },
  ],
  fr: [
    {
      id: "free",
      name: "Gratuit",
      description: "Pour bien démarrer.",
      ...NUMBERS.free,
      cta: "Commencer gratuitement",
      note: "Aucune carte bancaire requise.",
      features: list(
        "Factures illimitées",
        "3 clients, 3 articles enregistrés et 3 devis",
        "Export aux formats de facture électronique pris en charge",
        "Paiements en ligne via Stripe",
        "Suivi des dépenses",
        "Mention InvoiceBirds sur vos documents",
      ),
    },
    {
      id: "professional",
      name: "Professional",
      badge: "Idéal pour facturer",
      description:
        "Pour les indépendants et les entreprises qui veulent une facturation plus intelligente, moins de tâches administratives et une meilleure maîtrise de leurs finances.",
      ...NUMBERS.professional,
      includesAbove: "Toute la formule Gratuite, plus :",
      cta: "Choisir Professional",
      features: list(
        ["Préparez et modifiez vos factures avec Birdy", true],
        "Devis, clients et articles illimités",
        "Paiements en ligne et relances automatiques",
        "Modèles personnalisés et libellés de taxes",
        "Gestion des dépenses et rapports fiscaux",
        "Retirez la mention InvoiceBirds",
      ),
    },
    {
      id: "growth",
      name: "Growth",
      badge: "Parcours client complet",
      description:
        "Pour les entreprises en croissance qui veulent gérer propositions commerciales, contrats, facturation, paiements et performance financière au même endroit.",
      ...NUMBERS.growth,
      includesAbove: "Toute la formule Professional, plus :",
      cta: "Choisir Growth",
      features: list(
        ["Propositions acceptées en ligne par vos clients", true],
        ["Contrats avec signature en ligne", true],
        "Transformez vos propositions en contrats et en factures",
        "Suivez vos documents, de l’envoi à la signature",
        "Analyses avancées et indicateurs fiscaux",
        "Modification groupée et assistance prioritaire",
      ),
    },
  ],
};
