import type { Localized } from "@/lib/i18n";

/**
 * Help Center FAQs, grouped by topic. Facts follow the pricing plans and app settings.
 * UNCONFIRMED (check before launch): the cancellation wording under "Can I upgrade,
 * downgrade and cancel anytime?", and that there is no installable mobile app.
 */
export type Faq = { q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

/** Group ids are the same in every language: they are the #faq-… anchors. */
export const FAQ_GROUPS: Localized<FaqGroup[]> = {
  en: [
    {
      id: "getting-started",
      title: "Getting started",
      items: [
        {
          q: "Is InvoiceBirds free, and what are the limits?",
          a: "Yes. The Free plan lets you create unlimited invoices. Separately, it includes up to 3 clients, 3 saved items and 3 estimates. Professional and Growth remove those limits.",
        },
        {
          q: "Do I need a credit card?",
          a: "No. You can sign up and use the Free plan without a credit card. You only add a payment method if you choose a paid plan.",
        },
        {
          q: "Does InvoiceBirds work on my Mac, PC and mobile device?",
          a: "Yes. InvoiceBirds runs in your web browser, so it works on Mac, Windows PC, tablet and phone with nothing to install. Your documents are the same wherever you sign in.",
        },
        {
          q: "Can I use InvoiceBirds in French?",
          a: "Yes. You can switch the whole app between English and French at any time from the account menu at the bottom of the sidebar.",
        },
        {
          q: "Can I bring my data from another tool?",
          a: "Yes. Import clients, items, services and expenses from a CSV export or spreadsheet, or add them in bulk by hand. On paid plans, our team can guide your move by video call, chat or email.",
        },
      ],
    },
    {
      id: "security",
      title: "Security & privacy",
      items: [
        {
          q: "Are my invoices safe?",
          a: "Your account is protected by your password, and you can add two-factor authentication for an extra check when you sign in. Online card payments are processed by Stripe, and a shared invoice link opens only that invoice.",
        },
        {
          q: "How do I change my password or turn on two-factor authentication?",
          a: "Open Settings, then Profile. Under Change password, enter your current password and a new one of at least 8 characters. Turn on Two-factor authentication on the same tab.",
        },
        {
          q: "Can I delete my account?",
          a: "Yes. Open Settings, then Profile, and use Delete account under Danger zone. This permanently removes your account and its data, so download anything you need first.",
        },
      ],
    },
    {
      id: "billing",
      title: "Plans & billing",
      items: [
        {
          q: "Can I upgrade, downgrade and cancel anytime?",
          a: "Yes. Change your plan whenever you like from Settings, then Billing & Plans, and switch between monthly and yearly billing there too. You can also cancel your paid plan from the same tab.",
        },
        {
          q: "How much do the paid plans cost?",
          a: "Professional is $16 a month, or $96 a year. Growth is $24 a month, or $144 a year. Yearly billing works out at half the monthly price.",
        },
        {
          q: "Can I create proposals and contracts too?",
          a: "Yes. Growth includes proposals and contracts alongside invoicing, so you can manage the client workflow in one workspace.",
        },
        {
          q: "What can Birdy do, and how do requests work?",
          a: "Birdy prepares invoices from your saved clients, services, prices and VAT settings, updates details such as payment terms, and finds overdue balances. Professional includes 250 Birdy requests per month and Growth includes 500. Nothing is sent until you approve it.",
        },
      ],
    },
    {
      id: "using",
      title: "Using InvoiceBirds",
      items: [
        {
          q: "Do I have to use Birdy?",
          a: "No. Create and edit documents directly in the builder whenever you prefer. Birdy is there when you want help with repetitive work.",
        },
        {
          q: "Can my clients pay online?",
          a: "Yes. Connect Stripe, then use Request payment to email an invoice with a Pay now button. Your client pays by card and the payment is recorded for you.",
        },
        {
          q: "Can InvoiceBirds remind clients to pay?",
          a: "Yes. Turn on automatic payment reminders in Settings, then Reminders. Choose up to six messages, from a friendly heads-up before the due date to a final notice after it. Reminders stop as soon as an invoice is paid.",
        },
        {
          q: "Can I use my own logo, colors and fonts?",
          a: "Yes. Add your logo on the Business tab, then choose a template, brand colors and font on the Templates tab. Every new document uses them.",
        },
        {
          q: "Which e-invoice formats are supported?",
          a: "You can export ZUGFeRD / Factur-X, XRechnung and UBL e-invoices, and read incoming invoice files without leaving InvoiceBirds.",
        },
      ],
    },
    {
      id: "support",
      title: "Support",
      items: [
        {
          q: "Who's there when I need help?",
          a: "Everyone can use this Help Center and our step-by-step guides. On paid plans, our team helps by video call, chat or email, and Growth includes priority support.",
        },
        {
          q: "Can someone help me set up my account?",
          a: "Yes. On paid plans, our team can walk you through your settings, templates and import on a video call, or answer questions by chat and email.",
        },
      ],
    },
  ],
  fr: [
    {
      id: "getting-started",
      title: "Bien démarrer",
      items: [
        {
          q: "InvoiceBirds est-il gratuit, et quelles sont les limites ?",
          a: "Oui. La formule Gratuite vous permet de créer des factures en illimité. Elle inclut par ailleurs jusqu’à 3 clients, 3 articles enregistrés et 3 devis. Professional et Growth suppriment ces limites.",
        },
        {
          q: "Ai-je besoin d’une carte bancaire ?",
          a: "Non. Vous pouvez vous inscrire et utiliser la formule Gratuite sans carte bancaire. Vous n’ajoutez un moyen de paiement que si vous choisissez une formule payante.",
        },
        {
          q: "InvoiceBirds fonctionne-t-il sur Mac, PC et mobile ?",
          a: "Oui. InvoiceBirds s’utilise dans votre navigateur web : il fonctionne sur Mac, PC Windows, tablette et téléphone, sans rien installer. Vous retrouvez les mêmes documents partout où vous vous connectez.",
        },
        {
          q: "Puis-je utiliser InvoiceBirds en français ?",
          a: "Oui. Vous pouvez passer toute l’application de l’anglais au français, et inversement, à tout moment depuis le menu du compte, en bas de la barre latérale.",
        },
        {
          q: "Puis-je récupérer mes données depuis un autre outil ?",
          a: "Oui. Importez vos clients, articles, prestations et dépenses depuis un export CSV ou un tableur, ou saisissez-les à la main grâce à l’ajout groupé. Avec les formules payantes, notre équipe peut vous accompagner dans votre migration par appel vidéo, chat ou e-mail.",
        },
      ],
    },
    {
      id: "security",
      title: "Sécurité et confidentialité",
      items: [
        {
          q: "Mes factures sont-elles en sécurité ?",
          a: "Votre compte est protégé par votre mot de passe, et vous pouvez activer l’authentification à deux facteurs pour ajouter une vérification à la connexion. Les paiements par carte en ligne sont traités par Stripe, et un lien de partage de facture n’ouvre que cette facture.",
        },
        {
          q: "Comment changer mon mot de passe ou activer l’authentification à deux facteurs ?",
          a: "Ouvrez Paramètres, puis Profil. Sous Modifier le mot de passe, saisissez votre mot de passe actuel et un nouveau mot de passe d’au moins 8 caractères. Activez l’authentification à deux facteurs dans le même onglet.",
        },
        {
          q: "Puis-je supprimer mon compte ?",
          a: "Oui. Ouvrez Paramètres, puis Profil, et utilisez Supprimer le compte dans la Zone de danger. Votre compte et ses données sont alors définitivement supprimés : téléchargez d’abord tout ce dont vous avez besoin.",
        },
      ],
    },
    {
      id: "billing",
      title: "Formules et facturation",
      items: [
        {
          q: "Puis-je changer de formule ou résilier à tout moment ?",
          a: "Oui. Passez à une formule supérieure ou inférieure quand vous le souhaitez depuis Paramètres, puis Facturation et abonnement, et choisissez au même endroit une facturation mensuelle ou annuelle. Vous pouvez aussi résilier votre formule payante depuis ce même onglet.",
        },
        {
          q: "Combien coûtent les formules payantes ?",
          a: "Professional coûte 16 $ par mois, ou 96 $ par an. Growth coûte 24 $ par mois, ou 144 $ par an. Avec la facturation annuelle, vous payez la moitié du prix mensuel.",
        },
        {
          q: "Puis-je aussi créer des propositions commerciales et des contrats ?",
          a: "Oui. Growth inclut les propositions commerciales et les contrats en plus de la facturation, pour gérer tout votre parcours client dans un seul espace de travail.",
        },
        {
          q: "Que peut faire Birdy, et comment fonctionnent les requêtes ?",
          a: "Birdy prépare vos factures à partir de vos clients, prestations, prix et paramètres de TVA enregistrés, met à jour des informations comme les conditions de paiement et repère les soldes en retard. Professional inclut 250 requêtes Birdy par mois, et Growth en inclut 500. Rien n’est envoyé sans votre accord.",
        },
      ],
    },
    {
      id: "using",
      title: "Utiliser InvoiceBirds",
      items: [
        {
          q: "Suis-je obligé d’utiliser Birdy ?",
          a: "Non. Créez et modifiez vos documents directement dans l’éditeur quand vous le préférez. Birdy est là quand vous voulez de l’aide pour les tâches répétitives.",
        },
        {
          q: "Mes clients peuvent-ils payer en ligne ?",
          a: "Oui. Connectez Stripe, puis utilisez Demander le paiement pour envoyer par e-mail une facture avec un bouton Payer maintenant. Votre client paie par carte et le paiement est enregistré automatiquement.",
        },
        {
          q: "InvoiceBirds peut-il relancer mes clients ?",
          a: "Oui. Activez les relances de paiement automatiques dans Paramètres, puis Relances. Choisissez jusqu’à six messages, d’un rappel aimable avant l’échéance à un dernier avis après celle-ci. Les relances s’arrêtent dès qu’une facture est payée.",
        },
        {
          q: "Puis-je utiliser mon logo, mes couleurs et mes polices ?",
          a: "Oui. Ajoutez votre logo dans l’onglet Entreprise, puis choisissez un modèle, vos couleurs de marque et une police dans l’onglet Modèles. Chaque nouveau document les utilise.",
        },
        {
          q: "Quels formats de facture électronique sont pris en charge ?",
          a: "Vous pouvez exporter des factures électroniques aux formats ZUGFeRD / Factur-X, XRechnung et UBL, et lire les fichiers de factures reçues sans quitter InvoiceBirds.",
        },
      ],
    },
    {
      id: "support",
      title: "Assistance",
      items: [
        {
          q: "Qui est là quand j’ai besoin d’aide ?",
          a: "Tout le monde peut consulter ce Centre d’aide et nos guides pas à pas. Avec les formules payantes, notre équipe vous aide par appel vidéo, chat ou e-mail, et Growth inclut l’assistance prioritaire.",
        },
        {
          q: "Quelqu’un peut-il m’aider à configurer mon compte ?",
          a: "Oui. Avec les formules payantes, notre équipe peut vous guider dans vos paramètres, vos modèles et votre import lors d’un appel vidéo, ou répondre à vos questions par chat et e-mail.",
        },
      ],
    },
  ],
};
