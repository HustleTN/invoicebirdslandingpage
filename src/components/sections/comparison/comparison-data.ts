import type { Localized } from "@/lib/i18n";

/**
 * "Why InvoiceBirds" comparison: InvoiceBirds vs. other invoicing tools in general.
 * Competitor wording stays qualified ("may", "can", "often") on purpose: it names no tool or price.
 */
export type Row = {
  feature: string;
  /** Our answer: a bold lead, the detail after it, and which plan it's on. */
  lead: string;
  detail: string;
  plan?: string;
  theirs: string;
};

export const ROWS: Localized<Row[]> = {
  en: [
    {
      feature: "Unlimited invoices",
      lead: "Unlimited. Free forever.",
      detail: "No invoice caps, no forced upgrades.",
      theirs: "Free plans may restrict how much you can invoice.",
    },
    {
      feature: "Price for unlimited invoicing",
      lead: "$0/month.",
      detail: "Send as many invoices as you need, at no cost.",
      theirs: "Unlimited invoicing may require a monthly subscription.",
    },
    {
      feature: "Intelligent workspace assistant",
      lead: "Meet Birdy.",
      detail: "Create and edit invoices, track expenses, and get instant business answers.",
      plan: "Professional & Growth",
      theirs: "More manual work, with automation often requiring extra setup.",
    },
    {
      feature: "Unlimited clients & saved items",
      lead: "Every client. Every service. One place.",
      detail: "No limits on paid plans.",
      theirs: "Entry-level plans may limit clients or catalog items.",
    },
    {
      feature: "Proposals & contracts",
      lead: "From first proposal to signed contract.",
      detail: "One connected workflow.",
      plan: "Growth",
      theirs: "May need separate tools, subscriptions, or upgrades.",
    },
    {
      feature: "Online payments",
      lead: "Get paid straight from your invoices.",
      detail: "Stripe-powered payment links on every plan.",
      theirs: "Payment integrations, setup, and availability can vary.",
    },
    {
      feature: "Structured EU e-invoicing",
      lead: "Built for European e-invoicing.",
      detail: "ZUGFeRD, Factur-X, XRechnung & UBL.",
      plan: "All plans",
      theirs: "Format compatibility and country coverage can be limited.",
    },
    {
      feature: "Expenses & reports",
      lead: "Stay on top of every expense.",
      detail: "Free expense tracking, with tax reports on paid plans.",
      theirs: "Advanced reporting may require more expensive plans.",
    },
    {
      feature: "International invoicing",
      lead: "Work across borders with confidence.",
      detail: "Multiple currencies and flexible tax settings.",
      theirs: "Currency and tax options may depend on your plan.",
    },
  ],
  fr: [
    {
      feature: "Factures illimitées",
      lead: "En illimité. Gratuit pour toujours.",
      detail: "Aucun plafond de factures, aucune montée en gamme imposée.",
      theirs: "Les formules gratuites peuvent limiter le volume que vous facturez.",
    },
    {
      feature: "Prix de la facturation illimitée",
      lead: "0 $/mois.",
      detail: "Envoyez autant de factures que nécessaire, sans frais.",
      theirs: "La facturation illimitée peut nécessiter un abonnement mensuel.",
    },
    {
      feature: "Assistant intelligent intégré",
      lead: "Voici Birdy.",
      detail: "Créez et modifiez vos factures, suivez vos dépenses et obtenez des réponses immédiates sur votre activité.",
      plan: "Professional et Growth",
      theirs: "Plus de travail manuel, et une automatisation qui demande souvent une configuration supplémentaire.",
    },
    {
      feature: "Clients et articles enregistrés illimités",
      lead: "Tous vos clients. Toutes vos prestations. Au même endroit.",
      detail: "Sans limite avec les formules payantes.",
      theirs: "Les formules d’entrée de gamme peuvent limiter le nombre de clients ou d’articles du catalogue.",
    },
    {
      feature: "Propositions et contrats",
      lead: "De la première proposition au contrat signé.",
      detail: "Un seul parcours, entièrement connecté.",
      plan: "Growth",
      theirs: "Peut nécessiter des outils séparés, des abonnements supplémentaires ou une formule supérieure.",
    },
    {
      feature: "Paiements en ligne",
      lead: "Soyez payé directement depuis vos factures.",
      detail: "Liens de paiement Stripe dans toutes les formules.",
      theirs: "Les intégrations de paiement, leur configuration et leur disponibilité peuvent varier.",
    },
    {
      feature: "Facturation électronique européenne structurée",
      lead: "Conçu pour la facturation électronique européenne.",
      detail: "ZUGFeRD, Factur-X, XRechnung et UBL.",
      plan: "Toutes les formules",
      theirs: "La compatibilité des formats et la couverture par pays sont parfois limitées.",
    },
    {
      feature: "Dépenses et rapports",
      lead: "Gardez la main sur chaque dépense.",
      detail: "Suivi des dépenses gratuit, rapports fiscaux avec les formules payantes.",
      theirs: "Les rapports avancés peuvent nécessiter des formules plus chères.",
    },
    {
      feature: "Facturation internationale",
      lead: "Travaillez à l’international en toute confiance.",
      detail: "Plusieurs devises et des paramètres de taxes flexibles.",
      theirs: "Les options de devises et de taxes peuvent dépendre de votre formule.",
    },
  ],
};
