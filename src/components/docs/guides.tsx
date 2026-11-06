import type { ReactNode } from "react";

import type { Locale, Localized } from "@/lib/i18n";

import {
  BuilderMock,
  ClientMock,
  DesignMock,
  EmailMock,
  EstimateSetupMock,
  ItemsMock,
  LogoMock,
  NotesMock,
  PaymentMock,
  SendMock,
  SetupMock,
  ShareLinkMock,
  SignatureMock,
  TaxesMock,
  TermsMock,
} from "./mocks";
import {
  ProposalArrangeMock,
  ProposalBuilderMock,
  ProposalCoverMock,
  ProposalDeliverablesMock,
  ProposalDesignMock,
  ProposalPricingMock,
  ProposalScopeMock,
  ProposalSendMock,
  ProposalSummaryMock,
  ProposalTermsMock,
  ProposalTimelineMock,
} from "./proposal-mocks";
import {
  ContractArrangeMock,
  ContractBuilderMock,
  ContractCoverMock,
  ContractPartiesMock,
  ContractScheduleMock,
  ContractSendMock,
  ContractServicesMock,
  ContractSignaturesMock,
  ContractTermsMock,
} from "./contract-mocks";
import {
  BillingMock,
  BusinessIdentityMock,
  ContactLegalMock,
  DocumentDefaultsMock,
  InvoiceDefaultsMock,
  LanguageMock,
  NotificationsMock,
  ProfileSecurityMock,
  RemindersMock,
  SettingsTabsMock,
  SignatureDefaultMock,
  TaxSettingsMock,
  TemplatesMock,
} from "./settings-mocks";

export type GuideSection = { id: string; title: string; intro: string; steps: string[]; tip?: string; mock: ReactNode };

export type Guide = {
  slug: string;
  /** Sidebar and page title. */
  title: string;
  /** Breadcrumb group. */
  group: string;
  /** Sidebar heading the guide is listed under. A stable key; show it through `CATEGORY_LABELS`. */
  category: "Create documents" | "Your account";
  description: string;
  intro: string;
  sections: GuideSection[];
};

export const CATEGORY_LABELS: Localized<Record<Guide["category"], string>> = {
  en: { "Create documents": "Create documents", "Your account": "Your account" },
  fr: { "Create documents": "Créer des documents", "Your account": "Votre compte" },
};

/* Mockups are shared by both languages; they localize their own labels. */

const invoiceMocks = {
  builder: <BuilderMock />,
  "business-identity": <LogoMock />,
  client: <ClientMock />,
  setup: <SetupMock />,
  items: <ItemsMock />,
  taxes: <TaxesMock />,
  design: <DesignMock />,
  "payment-methods": <PaymentMock />,
  notes: <NotesMock />,
  terms: <TermsMock />,
  signature: <SignatureMock />,
  send: <SendMock />,
  "send-by-email": <EmailMock />,
  "request-payment": <EmailMock payment />,
  "share-link": <ShareLinkMock />,
};

const invoice: Localized<Guide> = {
  en: {
    slug: "create-an-invoice",
    title: "Create an invoice",
    group: "Invoices",
    category: "Create documents",
    description: "A step-by-step guide to creating, customizing and sending an invoice in InvoiceBirds.",
    intro:
      "Build a complete, branded invoice, then send it, request payment or share a link. This guide follows Ridgeway Towing & Recovery invoicing their client Harbour Logistics.",
    sections: [
      {
        id: "builder",
        title: "Meet the invoice builder",
        intro:
          "Every invoice is built in one screen. The list on the left walks you through each part, the invoice in the middle updates as you go, and the action bar lets you preview, download and send.",
        steps: [
          "Open Invoices and select Create, then Invoice.",
          "Work down the Build your invoice list. Each section fills one part of the invoice.",
          "Watch Ready to send fill up as the essentials are completed.",
        ],
        tip: "You can complete the sections in any order. The invoice saves as you work.",
        mock: invoiceMocks.builder,
      },
      {
        id: "business-identity",
        title: "Add your business details and logo",
        intro: "Your business name, phone and address come from Settings, so you only enter them once. Add a logo to make the invoice yours.",
        steps: [
          "Open Business Identity.",
          "Select Upload logo and choose a PNG, JPG or WebP file, ideally 512 × 512 or larger.",
          "Check your business details. To change them everywhere, edit them in Settings.",
        ],
        tip: "A logo changed here applies only to this invoice. Use default switches back to your business logo.",
        mock: invoiceMocks["business-identity"],
      },
      {
        id: "client",
        title: "Choose your client",
        intro: "Pick a saved client to fill everything in one tap, or enter a new client by hand and save them for next time.",
        steps: [
          "Open Client Details.",
          "Tap Select a saved client, search by name, and choose the client.",
          "For a new client, type their name, email and address, then select Save to my clients.",
        ],
        tip: "Saving a client doesn't change this invoice. The invoice saves on its own.",
        mock: invoiceMocks.client,
      },
      {
        id: "setup",
        title: "Set the number, dates and currency",
        intro: "Invoice Setup controls the invoice number, issue and due dates, payment terms and currency.",
        steps: [
          "Open Invoice Setup and check the invoice number.",
          "Choose payment terms such as Net 15. The due date updates for you.",
          "Pick the currency, and turn on Show currency code to print it next to the total.",
        ],
        mock: invoiceMocks.setup,
      },
      {
        id: "items",
        title: "Add items and services",
        intro: "Line items are edited directly on the invoice, so what you type is exactly what your client sees.",
        steps: ["Select Add additional item on the invoice.", "Type the description, then the quantity and rate.", "The amount, subtotal and total calculate automatically."],
        tip: "Click any cell on the invoice to change it later.",
        mock: invoiceMocks.items,
      },
      {
        id: "taxes",
        title: "Apply taxes and discounts",
        intro: "Add the taxes your business charges and apply a discount when you need one. Totals update straight away.",
        steps: [
          "Open Taxes & Discounts and select Add tax.",
          "To discount the invoice, enter a value, choose Percent or a fixed amount, and select Apply discount.",
          "Check the totals on the invoice.",
        ],
        tip: "Set your usual tax in Invoice Defaults so it's added to every new invoice.",
        mock: invoiceMocks.taxes,
      },
      {
        id: "design",
        title: "Customize the design",
        intro: "Match the invoice to your brand with a template, colors, corners, font and item table style.",
        steps: ["Open Design from the top of the builder.", "Choose a template, then a color pair.", "Adjust the corners, font and item table until it looks right."],
        mock: invoiceMocks.design,
      },
      {
        id: "payment-methods",
        title: "Add payment methods",
        intro: "Tell your client how to pay. Bank details and PayPal can be shown in a Payment details block on the invoice.",
        steps: [
          "Open Payment Methods and expand Bank Transfer.",
          "Enter your bank name, account number and SWIFT/BIC.",
          "Turn on Show on invoice. Select Save as business default to reuse these details.",
        ],
        mock: invoiceMocks["payment-methods"],
      },
      {
        id: "notes",
        title: "Write a note to your client",
        intro: "A short, friendly note appears at the bottom of the invoice.",
        steps: ["Open Notes.", "Type your message in Note to client.", "Turn off Show on invoice to hide it from the preview and PDF."],
        mock: invoiceMocks.notes,
      },
      {
        id: "terms",
        title: "Add terms and conditions",
        intro: "Spell out payment terms, late fees or your refund policy.",
        steps: ["Open Terms & Conditions.", "Type your terms.", "They appear on the invoice and in the PDF."],
        mock: invoiceMocks.terms,
      },
      {
        id: "signature",
        title: "Sign the invoice",
        intro: "Draw or upload a signature to authorize the invoice.",
        steps: ["Open Signature and choose Draw or Upload.", "Sign in the box.", "Select Apply signature."],
        mock: invoiceMocks.signature,
      },
      {
        id: "send",
        title: "Preview, download and send",
        intro: "When everything looks right, preview the invoice and download a PDF. The arrow next to Send gives you three ways to get it to your client.",
        steps: [
          "Select Preview to see exactly what your client will receive.",
          "Select PDF to download a copy.",
          "Select the arrow next to Send and choose Send by email, Request payment or Copy share link.",
        ],
        tip: "Duplicate copies this invoice, and Template saves it as a starting point for future invoices.",
        mock: invoiceMocks.send,
      },
      {
        id: "send-by-email",
        title: "Send by email",
        intro: "Email the invoice straight from InvoiceBirds. The PDF is generated automatically and attached when you send.",
        steps: [
          "Select Send by email, or press ⌘ + Enter.",
          "Enter your client's email in To. Add anyone else in CC, separated by commas.",
          "Check the subject and message, then select Send invoice. Its status changes to Sent.",
        ],
        tip: "Send invoice stays greyed out until there's an email address in To.",
        mock: invoiceMocks["send-by-email"],
      },
      {
        id: "request-payment",
        title: "Request payment by card",
        intro: "Request payment emails the invoice with a secure Pay now button, so your client can pay online by card. The PDF is attached too.",
        steps: [
          "Select Request payment.",
          "Enter your client's email in To, and add anyone else in CC.",
          "Check the subject and message, then select Send payment request.",
        ],
        tip: "Card payments go straight to your connected Stripe account.",
        mock: invoiceMocks["request-payment"],
      },
      {
        id: "share-link",
        title: "Share a link",
        intro: "Prefer to send the invoice yourself? Copy a link and paste it into a text, chat or your own email.",
        steps: ["Select Copy share link.", "Select Copy link.", "Paste the link anywhere you talk to your client."],
        tip: "Anyone with the link can view the invoice. No account needed.",
        mock: invoiceMocks["share-link"],
      },
    ],
  },
  fr: {
    slug: "create-an-invoice",
    title: "Créer une facture",
    group: "Factures",
    category: "Create documents",
    description: "Un guide pas à pas pour créer, personnaliser et envoyer une facture avec InvoiceBirds.",
    intro:
      "Créez une facture complète à vos couleurs, puis envoyez-la, demandez le paiement ou partagez un lien. Ce guide suit Ridgeway Towing & Recovery, qui facture son client Harbour Logistics.",
    sections: [
      {
        id: "builder",
        title: "Découvrir l’éditeur de facture",
        intro:
          "Chaque facture se crée sur un seul écran. La liste de gauche vous guide d’une partie à l’autre, la facture au centre se met à jour au fil de votre saisie, et la barre d’actions vous permet de prévisualiser, télécharger et envoyer.",
        steps: [
          "Ouvrez « Factures », sélectionnez « Créer », puis « Facture ».",
          "Suivez la liste « Créez votre facture » de haut en bas. Chaque section remplit une partie de la facture.",
          "La jauge « Prêt à l’envoi » se remplit à mesure que vous complétez l’essentiel.",
        ],
        tip: "Vous pouvez remplir les sections dans l’ordre de votre choix. La facture est enregistrée au fur et à mesure.",
        mock: invoiceMocks.builder,
      },
      {
        id: "business-identity",
        title: "Ajouter les informations de l’entreprise et le logo",
        intro:
          "Le nom, le téléphone et l’adresse de votre entreprise proviennent des paramètres : vous ne les saisissez qu’une fois. Ajoutez un logo pour une facture à votre image.",
        steps: [
          "Ouvrez « Identité de l’entreprise ».",
          "Sélectionnez « Importer un logo » et choisissez un fichier PNG, JPG ou WebP, idéalement de 512 × 512 pixels ou plus.",
          "Vérifiez les informations de votre entreprise. Pour les modifier partout, changez-les dans les paramètres.",
        ],
        tip: "Un logo modifié ici ne s’applique qu’à cette facture. « Par défaut » rétablit le logo de votre entreprise.",
        mock: invoiceMocks["business-identity"],
      },
      {
        id: "client",
        title: "Choisir votre client",
        intro: "Sélectionnez un client enregistré pour tout remplir en un clic, ou saisissez un nouveau client à la main et enregistrez-le pour la prochaine fois.",
        steps: [
          "Ouvrez « Coordonnées du client ».",
          "Appuyez sur « Sélectionner un client enregistré », recherchez-le par son nom et choisissez-le.",
          "Pour un nouveau client, saisissez son nom, son e-mail et son adresse, puis sélectionnez « Enregistrer dans mes clients ».",
        ],
        tip: "Enregistrer un client ne modifie pas cette facture. La facture s’enregistre d’elle-même.",
        mock: invoiceMocks.client,
      },
      {
        id: "setup",
        title: "Définir le numéro, les dates et la devise",
        intro: "La section « Configuration de la facture » définit le numéro de facture, les dates d’émission et d’échéance, les conditions de paiement et la devise.",
        steps: [
          "Ouvrez « Configuration de la facture » et vérifiez le numéro de facture.",
          "Choisissez des conditions de paiement, par exemple « 15 jours net ». La date d’échéance se met à jour automatiquement.",
          "Choisissez la devise, puis activez « Afficher le code de la devise » pour l’indiquer à côté du total.",
        ],
        mock: invoiceMocks.setup,
      },
      {
        id: "items",
        title: "Ajouter des articles et des prestations",
        intro: "Les lignes se modifient directement sur la facture : ce que vous saisissez est exactement ce que voit votre client.",
        steps: [
          "Sélectionnez « Ajouter un article » sur la facture.",
          "Saisissez la désignation, puis la quantité et le prix unitaire.",
          "Le montant, le sous-total et le total se calculent automatiquement.",
        ],
        tip: "Cliquez sur n’importe quelle cellule de la facture pour la modifier par la suite.",
        mock: invoiceMocks.items,
      },
      {
        id: "taxes",
        title: "Appliquer des taxes et des remises",
        intro: "Ajoutez les taxes que vous facturez et appliquez une remise si besoin. Les totaux se mettent à jour immédiatement.",
        steps: [
          "Ouvrez « Taxes et remises » et sélectionnez « Ajouter une taxe ».",
          "Pour accorder une remise sur la facture, saisissez une valeur, choisissez « Pourcentage » ou un montant fixe, puis sélectionnez « Appliquer la remise ».",
          "Vérifiez les totaux sur la facture.",
        ],
        tip: "Définissez votre taxe habituelle dans les paramètres, onglet « Factures » : elle sera ajoutée à chaque nouvelle facture.",
        mock: invoiceMocks.taxes,
      },
      {
        id: "design",
        title: "Personnaliser le design",
        intro: "Adaptez la facture à votre marque : modèle, couleurs, coins, police et style du tableau des articles.",
        steps: [
          "Ouvrez « Design » en haut de l’éditeur.",
          "Choisissez un modèle, puis une paire de couleurs.",
          "Ajustez les coins, la police et le tableau des articles jusqu’à obtenir le rendu souhaité.",
        ],
        mock: invoiceMocks.design,
      },
      {
        id: "payment-methods",
        title: "Ajouter des moyens de paiement",
        intro: "Indiquez à votre client comment vous payer. Vos coordonnées bancaires et PayPal peuvent figurer dans un bloc « Informations de paiement » sur la facture.",
        steps: [
          "Ouvrez « Moyens de paiement » et dépliez « Virement bancaire ».",
          "Saisissez le nom de votre banque, votre numéro de compte et votre code SWIFT/BIC.",
          "Activez « Afficher sur la facture ». Sélectionnez « Enregistrer par défaut » pour réutiliser ces informations.",
        ],
        mock: invoiceMocks["payment-methods"],
      },
      {
        id: "notes",
        title: "Rédiger une note pour votre client",
        intro: "Une note courte et chaleureuse apparaît en bas de la facture.",
        steps: [
          "Ouvrez « Notes ».",
          "Saisissez votre message dans « Note au client ».",
          "Désactivez « Afficher sur la facture » pour la masquer dans l’aperçu et le PDF.",
        ],
        mock: invoiceMocks.notes,
      },
      {
        id: "terms",
        title: "Ajouter des conditions générales",
        intro: "Précisez vos conditions de paiement, vos pénalités de retard ou votre politique de remboursement.",
        steps: ["Ouvrez « Conditions générales ».", "Saisissez vos conditions.", "Elles apparaissent sur la facture et dans le PDF."],
        mock: invoiceMocks.terms,
      },
      {
        id: "signature",
        title: "Signer la facture",
        intro: "Dessinez ou importez une signature pour valider la facture.",
        steps: ["Ouvrez « Signature » et choisissez « Dessiner » ou « Importer ».", "Signez dans le cadre.", "Sélectionnez « Appliquer la signature »."],
        mock: invoiceMocks.signature,
      },
      {
        id: "send",
        title: "Prévisualiser, télécharger et envoyer",
        intro:
          "Quand tout est prêt, prévisualisez la facture et téléchargez un PDF. La flèche à côté de « Envoyer » vous propose trois façons de la transmettre à votre client.",
        steps: [
          "Sélectionnez « Aperçu » pour voir exactement ce que recevra votre client.",
          "Sélectionnez « PDF » pour en télécharger une copie.",
          "Sélectionnez la flèche à côté de « Envoyer » et choisissez « Envoyer par e-mail », « Demander le paiement » ou « Copier le lien de partage ».",
        ],
        tip: "« Dupliquer » crée une copie de cette facture, et « Modèle » l’enregistre comme point de départ pour vos prochaines factures.",
        mock: invoiceMocks.send,
      },
      {
        id: "send-by-email",
        title: "Envoyer par e-mail",
        intro: "Envoyez la facture par e-mail directement depuis InvoiceBirds. Le PDF est généré automatiquement et joint à l’envoi.",
        steps: [
          "Sélectionnez « Envoyer par e-mail » ou appuyez sur ⌘ + Entrée.",
          "Saisissez l’e-mail de votre client dans « À ». Ajoutez d’autres destinataires dans « Cc », séparés par des virgules.",
          "Vérifiez l’objet et le message, puis sélectionnez « Envoyer la facture ». Son statut passe à « Envoyée ».",
        ],
        tip: "Le bouton « Envoyer la facture » reste grisé tant que le champ « À » ne contient aucune adresse e-mail.",
        mock: invoiceMocks["send-by-email"],
      },
      {
        id: "request-payment",
        title: "Demander un paiement par carte",
        intro:
          "« Demander le paiement » envoie la facture par e-mail avec un bouton « Payer maintenant » sécurisé : votre client peut ainsi payer en ligne par carte. Le PDF est également joint.",
        steps: [
          "Sélectionnez « Demander le paiement ».",
          "Saisissez l’e-mail de votre client dans « À » et ajoutez d’autres destinataires dans « Cc ».",
          "Vérifiez l’objet et le message, puis sélectionnez « Envoyer la demande de paiement ».",
        ],
        tip: "Les paiements par carte sont versés directement sur votre compte Stripe connecté.",
        mock: invoiceMocks["request-payment"],
      },
      {
        id: "share-link",
        title: "Partager un lien",
        intro: "Vous préférez envoyer la facture vous-même ? Copiez un lien et collez-le dans un SMS, une messagerie ou votre propre e-mail.",
        steps: ["Sélectionnez « Copier le lien de partage ».", "Sélectionnez « Copier le lien ».", "Collez le lien là où vous échangez avec votre client."],
        tip: "Toute personne disposant du lien peut consulter la facture, sans avoir besoin de compte.",
        mock: invoiceMocks["share-link"],
      },
    ],
  },
};

const estimateMocks = {
  builder: <BuilderMock kind="estimate" />,
  "business-identity": <LogoMock kind="estimate" />,
  client: <ClientMock kind="estimate" />,
  setup: <EstimateSetupMock />,
  items: <ItemsMock kind="estimate" />,
  taxes: <TaxesMock kind="estimate" />,
  design: <DesignMock kind="estimate" />,
  notes: <NotesMock kind="estimate" />,
  terms: <TermsMock kind="estimate" />,
  signature: <SignatureMock kind="estimate" />,
  send: <SendMock kind="estimate" />,
};

const estimate: Localized<Guide> = {
  en: {
    slug: "create-an-estimate",
    title: "Create an estimate",
    group: "Estimates",
    category: "Create documents",
    description: "A step-by-step guide to creating, customizing and sending an estimate in InvoiceBirds.",
    intro: "Quote a job in eleven short steps. This guide follows Ridgeway Towing & Recovery estimating a recovery job for their client Harbour Logistics.",
    sections: [
      {
        id: "builder",
        title: "Meet the estimate builder",
        intro:
          "Estimates are built in the same screen as invoices. The list on the left walks you through each part, the estimate in the middle updates as you go, and the action bar lets you preview, download and send.",
        steps: [
          "Open Estimates and select Create, then Estimate.",
          "Work down the Build your estimate list. Each section fills one part of the estimate.",
          "Ready to send lists what's still needed: choose a client, add the client email and add a priced item.",
        ],
        tip: "You can complete the sections in any order. The estimate saves as you work.",
        mock: estimateMocks.builder,
      },
      {
        id: "business-identity",
        title: "Add your business details and logo",
        intro: "Your business name, phone and address come from Settings, so you only enter them once. Add a logo to make the estimate yours.",
        steps: [
          "Open Business Identity.",
          "Select Upload logo and choose a PNG, JPG or WebP file, ideally 512 × 512 or larger.",
          "Check your business details. To change them everywhere, edit them in Settings.",
        ],
        tip: "A logo changed here applies only to this estimate. Use default switches back to your business logo.",
        mock: estimateMocks["business-identity"],
      },
      {
        id: "client",
        title: "Choose your client",
        intro: "Pick a saved client to fill everything in one tap, or enter a new client by hand and save them for next time.",
        steps: [
          "Open Client Details.",
          "Tap Select a saved client, search by name, and choose the client.",
          "For a new client, type their name, email and address, then select Save to my clients.",
        ],
        tip: "Add the client's email now so the estimate is ready to send.",
        mock: estimateMocks.client,
      },
      {
        id: "setup",
        title: "Set the number, dates and currency",
        intro: "Estimate Setup controls the estimate number, the issue date, how long the estimate is valid and the currency.",
        steps: [
          "Open Estimate Setup and check the estimate number.",
          "Set Valid until to the last day your price stands.",
          "Pick the currency, and turn on Show currency code to print it next to the total.",
        ],
        mock: estimateMocks.setup,
      },
      {
        id: "items",
        title: "Add items and services",
        intro: "Line items are edited directly on the estimate, so what you type is exactly what your client sees.",
        steps: ["Select Add additional item on the estimate.", "Type the description, then the quantity and rate.", "The amount, subtotal and total calculate automatically."],
        tip: "Add at least one priced item. It's one of the checks in Ready to send.",
        mock: estimateMocks.items,
      },
      {
        id: "taxes",
        title: "Apply taxes and discounts",
        intro: "Add the taxes your business charges and apply a discount when you need one. Totals update straight away.",
        steps: [
          "Open Taxes & Discounts and select Add tax.",
          "To discount the estimate, enter a value, choose Percent or a fixed amount, and select Apply discount.",
          "Check the totals on the estimate.",
        ],
        mock: estimateMocks.taxes,
      },
      {
        id: "design",
        title: "Customize the design",
        intro: "Match the estimate to your brand with a template, colors, corners, font and item table style.",
        steps: ["Open Design from the top of the builder.", "Choose a template, then a color pair.", "Adjust the corners, font and item table until it looks right."],
        mock: estimateMocks.design,
      },
      {
        id: "notes",
        title: "Write a note to your client",
        intro: "A short, friendly note appears at the bottom of the estimate.",
        steps: ["Open Notes.", "Type your message in Note to client.", "Turn off Show on estimate to hide it from the preview and PDF."],
        mock: estimateMocks.notes,
      },
      {
        id: "terms",
        title: "Add terms and conditions",
        intro: "Explain how long the price stands and what's included.",
        steps: ["Open Terms & Conditions.", "Type your terms.", "They appear on the estimate and in the PDF."],
        mock: estimateMocks.terms,
      },
      {
        id: "signature",
        title: "Sign the estimate",
        intro: "Draw or upload a signature to authorize the estimate.",
        steps: ["Open Signature and choose Draw or Upload.", "Sign in the box.", "Select Apply signature."],
        mock: estimateMocks.signature,
      },
      {
        id: "send",
        title: "Preview, download and send",
        intro: "When everything looks right, preview the estimate, download a PDF, or send it to your client by email.",
        steps: [
          "Select Preview to see exactly what your client will receive.",
          "Select PDF to download a copy.",
          "Select Send to email the estimate. Its status changes to Sent.",
        ],
        tip: "Once your client approves, convert the estimate into an invoice with its items intact.",
        mock: estimateMocks.send,
      },
    ],
  },
  fr: {
    slug: "create-an-estimate",
    title: "Créer un devis",
    group: "Devis",
    category: "Create documents",
    description: "Un guide pas à pas pour créer, personnaliser et envoyer un devis avec InvoiceBirds.",
    intro: "Chiffrez une intervention en onze étapes rapides. Ce guide suit Ridgeway Towing & Recovery, qui établit le devis d’un dépannage pour son client Harbour Logistics.",
    sections: [
      {
        id: "builder",
        title: "Découvrir l’éditeur de devis",
        intro:
          "Les devis se créent sur le même écran que les factures. La liste de gauche vous guide d’une partie à l’autre, le devis au centre se met à jour au fil de votre saisie, et la barre d’actions vous permet de prévisualiser, télécharger et envoyer.",
        steps: [
          "Ouvrez « Devis », sélectionnez « Créer », puis « Devis ».",
          "Suivez la liste « Créez votre devis » de haut en bas. Chaque section remplit une partie du devis.",
          "« Prêt à l’envoi » indique ce qu’il reste à faire : choisir un client, ajouter l’e-mail du client et ajouter un article avec un prix.",
        ],
        tip: "Vous pouvez remplir les sections dans l’ordre de votre choix. Le devis est enregistré au fur et à mesure.",
        mock: estimateMocks.builder,
      },
      {
        id: "business-identity",
        title: "Ajouter les informations de l’entreprise et le logo",
        intro:
          "Le nom, le téléphone et l’adresse de votre entreprise proviennent des paramètres : vous ne les saisissez qu’une fois. Ajoutez un logo pour un devis à votre image.",
        steps: [
          "Ouvrez « Identité de l’entreprise ».",
          "Sélectionnez « Importer un logo » et choisissez un fichier PNG, JPG ou WebP, idéalement de 512 × 512 pixels ou plus.",
          "Vérifiez les informations de votre entreprise. Pour les modifier partout, changez-les dans les paramètres.",
        ],
        tip: "Un logo modifié ici ne s’applique qu’à ce devis. « Par défaut » rétablit le logo de votre entreprise.",
        mock: estimateMocks["business-identity"],
      },
      {
        id: "client",
        title: "Choisir votre client",
        intro: "Sélectionnez un client enregistré pour tout remplir en un clic, ou saisissez un nouveau client à la main et enregistrez-le pour la prochaine fois.",
        steps: [
          "Ouvrez « Coordonnées du client ».",
          "Appuyez sur « Sélectionner un client enregistré », recherchez-le par son nom et choisissez-le.",
          "Pour un nouveau client, saisissez son nom, son e-mail et son adresse, puis sélectionnez « Enregistrer dans mes clients ».",
        ],
        tip: "Ajoutez dès maintenant l’e-mail du client pour que le devis soit prêt à être envoyé.",
        mock: estimateMocks.client,
      },
      {
        id: "setup",
        title: "Définir le numéro, les dates et la devise",
        intro: "La section « Configuration du devis » définit le numéro du devis, la date d’émission, la durée de validité du devis et la devise.",
        steps: [
          "Ouvrez « Configuration du devis » et vérifiez le numéro du devis.",
          "Dans « Valable jusqu’au », indiquez le dernier jour où votre prix est garanti.",
          "Choisissez la devise, puis activez « Afficher le code de la devise » pour l’indiquer à côté du total.",
        ],
        mock: estimateMocks.setup,
      },
      {
        id: "items",
        title: "Ajouter des articles et des prestations",
        intro: "Les lignes se modifient directement sur le devis : ce que vous saisissez est exactement ce que voit votre client.",
        steps: [
          "Sélectionnez « Ajouter un article » sur le devis.",
          "Saisissez la désignation, puis la quantité et le prix unitaire.",
          "Le montant, le sous-total et le total se calculent automatiquement.",
        ],
        tip: "Ajoutez au moins un article avec un prix. C’est l’une des vérifications de « Prêt à l’envoi ».",
        mock: estimateMocks.items,
      },
      {
        id: "taxes",
        title: "Appliquer des taxes et des remises",
        intro: "Ajoutez les taxes que vous facturez et appliquez une remise si besoin. Les totaux se mettent à jour immédiatement.",
        steps: [
          "Ouvrez « Taxes et remises » et sélectionnez « Ajouter une taxe ».",
          "Pour accorder une remise sur le devis, saisissez une valeur, choisissez « Pourcentage » ou un montant fixe, puis sélectionnez « Appliquer la remise ».",
          "Vérifiez les totaux sur le devis.",
        ],
        mock: estimateMocks.taxes,
      },
      {
        id: "design",
        title: "Personnaliser le design",
        intro: "Adaptez le devis à votre marque : modèle, couleurs, coins, police et style du tableau des articles.",
        steps: [
          "Ouvrez « Design » en haut de l’éditeur.",
          "Choisissez un modèle, puis une paire de couleurs.",
          "Ajustez les coins, la police et le tableau des articles jusqu’à obtenir le rendu souhaité.",
        ],
        mock: estimateMocks.design,
      },
      {
        id: "notes",
        title: "Rédiger une note pour votre client",
        intro: "Une note courte et chaleureuse apparaît en bas du devis.",
        steps: ["Ouvrez « Notes ».", "Saisissez votre message dans « Note au client ».", "Désactivez « Afficher sur le devis » pour la masquer dans l’aperçu et le PDF."],
        mock: estimateMocks.notes,
      },
      {
        id: "terms",
        title: "Ajouter des conditions générales",
        intro: "Indiquez combien de temps le prix reste valable et ce qu’il comprend.",
        steps: ["Ouvrez « Conditions générales ».", "Saisissez vos conditions.", "Elles apparaissent sur le devis et dans le PDF."],
        mock: estimateMocks.terms,
      },
      {
        id: "signature",
        title: "Signer le devis",
        intro: "Dessinez ou importez une signature pour valider le devis.",
        steps: ["Ouvrez « Signature » et choisissez « Dessiner » ou « Importer ».", "Signez dans le cadre.", "Sélectionnez « Appliquer la signature »."],
        mock: estimateMocks.signature,
      },
      {
        id: "send",
        title: "Prévisualiser, télécharger et envoyer",
        intro: "Quand tout est prêt, prévisualisez le devis, téléchargez un PDF ou envoyez-le par e-mail à votre client.",
        steps: [
          "Sélectionnez « Aperçu » pour voir exactement ce que recevra votre client.",
          "Sélectionnez « PDF » pour en télécharger une copie.",
          "Sélectionnez « Envoyer » pour envoyer le devis par e-mail. Son statut passe à « Envoyé ».",
        ],
        tip: "Une fois le devis accepté par votre client, convertissez-le en facture : tous ses articles sont repris.",
        mock: estimateMocks.send,
      },
    ],
  },
};

const proposalMocks = {
  builder: <ProposalBuilderMock />,
  design: <ProposalDesignMock />,
  cover: <ProposalCoverMock />,
  summary: <ProposalSummaryMock />,
  scope: <ProposalScopeMock />,
  deliverables: <ProposalDeliverablesMock />,
  timeline: <ProposalTimelineMock />,
  pricing: <ProposalPricingMock />,
  terms: <ProposalTermsMock />,
  arrange: <ProposalArrangeMock />,
  send: <ProposalSendMock />,
};

const proposal: Localized<Guide> = {
  en: {
    slug: "create-a-proposal",
    title: "Create a proposal",
    group: "Proposals",
    category: "Create documents",
    description: "A step-by-step guide to writing, designing and sending a proposal in InvoiceBirds.",
    intro: "Win the work before you invoice it. This guide follows Ridgeway Towing & Recovery proposing a year of fleet recovery cover to Harbour Logistics.",
    sections: [
      {
        id: "builder",
        title: "Meet the proposal builder",
        intro:
          "A proposal is written directly on the page. The list on the left jumps to each section, Ready to send tracks the essentials, and the action bar lets you preview, download and send.",
        steps: [
          "Open Proposals and select Create, then Proposal.",
          "Select a section in Build your proposal to jump to it on the page.",
          "Work through Ready to send: a title, a client, a summary, the scope, a deliverable and a price.",
        ],
        tip: "Use the zoom controls beside the page to zoom in, zoom out or fit the whole proposal on screen.",
        mock: proposalMocks.builder,
      },
      {
        id: "design",
        title: "Customize the design",
        intro: "Design works just like it does for invoices: choose a template, a color pair, corners and a font.",
        steps: [
          "Select Design at the top of the list.",
          "Choose a template, then a color pair. Primary, Secondary and Accent update to match.",
          "Pick Sharp, Soft or Rounded corners and choose a font.",
        ],
        mock: proposalMocks.design,
      },
      {
        id: "cover",
        title: "Add a title and client",
        intro: "The cover is the top of the proposal: your logo and business details, the proposal title, who it's prepared for and the date.",
        steps: [
          "Select Cover.",
          "Click Proposal Title on the page and type a clear, specific title.",
          "Click Client Name and choose a saved client.",
        ],
        tip: "Your logo, business name and contact details come from Settings, so you only enter them once.",
        mock: proposalMocks.cover,
      },
      {
        id: "summary",
        title: "Write the executive summary",
        intro: "In a few sentences, explain the client's goal, your approach, and why you're the right partner.",
        steps: ["Select Summary.", "Click the Executive Summary section and type.", "Use the toolbar for headings, bold, italics and lists."],
        tip: "Lead with the outcome the client cares about, such as a faster response or lower costs.",
        mock: proposalMocks.summary,
      },
      {
        id: "scope",
        title: "Describe the scope of work",
        intro: "Set clear expectations: what's included, and just as important, what isn't.",
        steps: ["Select Scope of Work.", "Choose the bullet list in the toolbar.", "List what's included, then add an Out of scope line."],
        mock: proposalMocks.scope,
      },
      {
        id: "deliverables",
        title: "List the deliverables",
        intro: "Deliverables are the concrete things your client receives. Each one is numbered on the proposal.",
        steps: ["Select Deliverables.", "Select Add deliverable.", "Type a name and a short description. Repeat for each deliverable."],
        mock: proposalMocks.deliverables,
      },
      {
        id: "timeline",
        title: "Plan the timeline",
        intro: "Break the work into phases so your client knows what happens when.",
        steps: ["Select Timeline.", "Select Add phase.", "Name the phase and set its dates. Repeat for each phase."],
        mock: proposalMocks.timeline,
      },
      {
        id: "pricing",
        title: "Set your price",
        intro: "Price the work as a fixed total, at an hourly rate, or itemized line by line.",
        steps: [
          "Select Pricing.",
          "Choose Fixed, Hourly or Itemized.",
          "Enter the amount. The total at the bottom of the Investment section updates as you type.",
        ],
        tip: "Fixed suits ongoing contracts like this one. Itemized is clearer when the price has several parts.",
        mock: proposalMocks.pricing,
      },
      {
        id: "terms",
        title: "Add terms and sign",
        intro: "Close the proposal with your terms and conditions, above your authorized signature.",
        steps: [
          "Select Terms & Signature.",
          "Type your terms, such as the contract length, billing and notice period.",
          "Check the signature block: your signature, name, business and the date.",
        ],
        mock: proposalMocks.terms,
      },
      {
        id: "arrange",
        title: "Reorder or remove sections",
        intro: "Every proposal is different. Move sections into the order that tells your story best, and remove the ones you don't need.",
        steps: [
          "Click a section on the page to select it.",
          "Use the up and down arrows below it to move it.",
          "Select × to remove a section you don't need.",
        ],
        tip: "The list on the left always follows the order on the page.",
        mock: proposalMocks.arrange,
      },
      {
        id: "send",
        title: "Preview, download and send",
        intro: "When everything looks right, preview the proposal, download a PDF, or send it to your client.",
        steps: [
          "Select Preview to see exactly what your client will receive.",
          "Select PDF to download a copy.",
          "Select Send to email the proposal. Its status changes to Sent.",
        ],
        tip: "Duplicate copies this proposal, a quick start for similar clients.",
        mock: proposalMocks.send,
      },
    ],
  },
  fr: {
    slug: "create-a-proposal",
    title: "Créer une proposition commerciale",
    group: "Propositions",
    category: "Create documents",
    description: "Un guide pas à pas pour rédiger, mettre en forme et envoyer une proposition commerciale avec InvoiceBirds.",
    intro:
      "Décrochez la mission avant de la facturer. Ce guide suit Ridgeway Towing & Recovery, qui propose à Harbour Logistics un an d’assistance dépannage pour sa flotte de véhicules.",
    sections: [
      {
        id: "builder",
        title: "Découvrir l’éditeur de proposition",
        intro:
          "Une proposition se rédige directement sur la page. La liste de gauche mène à chaque section, « Prêt à l’envoi » suit l’essentiel, et la barre d’actions vous permet de prévisualiser, télécharger et envoyer.",
        steps: [
          "Ouvrez « Propositions », sélectionnez « Créer », puis « Proposition ».",
          "Sélectionnez une section dans « Créez votre proposition » pour l’atteindre sur la page.",
          "Complétez « Prêt à l’envoi » : un titre, un client, une synthèse, le périmètre, un livrable et un prix.",
        ],
        tip: "Les commandes de zoom à côté de la page permettent d’agrandir, de réduire ou d’afficher toute la proposition à l’écran.",
        mock: proposalMocks.builder,
      },
      {
        id: "design",
        title: "Personnaliser le design",
        intro: "Le design se règle comme pour les factures : choisissez un modèle, une paire de couleurs, des coins et une police.",
        steps: [
          "Sélectionnez « Design » en haut de la liste.",
          "Choisissez un modèle, puis une paire de couleurs. « Principale », « Secondaire » et « Accent » s’adaptent en conséquence.",
          "Choisissez des coins « Droits », « Doux » ou « Arrondis », puis une police.",
        ],
        mock: proposalMocks.design,
      },
      {
        id: "cover",
        title: "Ajouter un titre et un client",
        intro:
          "La couverture forme le haut de la proposition : votre logo et les informations de votre entreprise, le titre de la proposition, son destinataire et la date.",
        steps: [
          "Sélectionnez « Couverture ».",
          "Cliquez sur « Titre de la proposition » sur la page et saisissez un titre clair et précis.",
          "Cliquez sur « Nom du client » et choisissez un client enregistré.",
        ],
        tip: "Votre logo, le nom de votre entreprise et vos coordonnées proviennent des paramètres : vous ne les saisissez qu’une fois.",
        mock: proposalMocks.cover,
      },
      {
        id: "summary",
        title: "Rédiger la synthèse",
        intro: "En quelques phrases, présentez l’objectif du client, votre approche et ce qui fait de vous le bon partenaire.",
        steps: [
          "Sélectionnez « Synthèse ».",
          "Cliquez dans la section « Synthèse » et saisissez votre texte.",
          "Utilisez la barre d’outils pour les titres, le gras, l’italique et les listes.",
        ],
        tip: "Commencez par le résultat qui compte pour le client, par exemple des interventions plus rapides ou des coûts réduits.",
        mock: proposalMocks.summary,
      },
      {
        id: "scope",
        title: "Décrire le périmètre des travaux",
        intro: "Fixez des attentes claires : ce qui est inclus et, tout aussi important, ce qui ne l’est pas.",
        steps: [
          "Sélectionnez « Périmètre ».",
          "Choisissez la liste à puces dans la barre d’outils.",
          "Listez ce qui est inclus, puis ajoutez une ligne « Hors périmètre ».",
        ],
        mock: proposalMocks.scope,
      },
      {
        id: "deliverables",
        title: "Lister les livrables",
        intro: "Les livrables sont les éléments concrets que reçoit votre client. Chacun est numéroté dans la proposition.",
        steps: ["Sélectionnez « Livrables ».", "Sélectionnez « Ajouter un livrable ».", "Saisissez un nom et une courte description. Recommencez pour chaque livrable."],
        mock: proposalMocks.deliverables,
      },
      {
        id: "timeline",
        title: "Planifier le calendrier",
        intro: "Découpez le travail en phases pour que votre client sache ce qui se passe, et quand.",
        steps: ["Sélectionnez « Calendrier ».", "Sélectionnez « Ajouter une phase ».", "Nommez la phase et définissez ses dates. Recommencez pour chaque phase."],
        mock: proposalMocks.timeline,
      },
      {
        id: "pricing",
        title: "Fixer votre prix",
        intro: "Proposez un prix forfaitaire, un taux horaire ou un prix détaillé ligne par ligne.",
        steps: [
          "Sélectionnez « Tarification ».",
          "Choisissez « Forfait », « À l’heure » ou « Détaillé ».",
          "Saisissez le montant. Le total en bas de la section « Investissement » se met à jour pendant la saisie.",
        ],
        tip: "« Forfait » convient aux contrats récurrents comme celui-ci. « Détaillé » est plus clair quand le prix comporte plusieurs postes.",
        mock: proposalMocks.pricing,
      },
      {
        id: "terms",
        title: "Ajouter les conditions et signer",
        intro: "Terminez la proposition par vos conditions générales, au-dessus de votre signature autorisée.",
        steps: [
          "Sélectionnez « Conditions et signature ».",
          "Saisissez vos conditions, par exemple la durée du contrat, la facturation et le préavis.",
          "Vérifiez le bloc de signature : votre signature, votre nom, votre entreprise et la date.",
        ],
        mock: proposalMocks.terms,
      },
      {
        id: "arrange",
        title: "Réorganiser ou supprimer des sections",
        intro:
          "Chaque proposition est différente. Placez les sections dans l’ordre qui sert le mieux votre propos, et supprimez celles dont vous n’avez pas besoin.",
        steps: [
          "Cliquez sur une section de la page pour la sélectionner.",
          "Utilisez les flèches haut et bas situées en dessous pour la déplacer.",
          "Sélectionnez × pour supprimer une section inutile.",
        ],
        tip: "La liste de gauche suit toujours l’ordre de la page.",
        mock: proposalMocks.arrange,
      },
      {
        id: "send",
        title: "Prévisualiser, télécharger et envoyer",
        intro: "Quand tout est prêt, prévisualisez la proposition, téléchargez un PDF ou envoyez-la à votre client.",
        steps: [
          "Sélectionnez « Aperçu » pour voir exactement ce que recevra votre client.",
          "Sélectionnez « PDF » pour en télécharger une copie.",
          "Sélectionnez « Envoyer » pour envoyer la proposition par e-mail. Son statut passe à « Envoyée ».",
        ],
        tip: "« Dupliquer » crée une copie de cette proposition : un point de départ rapide pour des clients similaires.",
        mock: proposalMocks.send,
      },
    ],
  },
};

const contractMocks = {
  builder: <ContractBuilderMock />,
  design: <ProposalDesignMock doc="contract" />,
  cover: <ContractCoverMock />,
  parties: <ContractPartiesMock />,
  services: <ContractServicesMock />,
  "payment-schedule": <ContractScheduleMock />,
  terms: <ContractTermsMock />,
  signatures: <ContractSignaturesMock />,
  arrange: <ContractArrangeMock />,
  send: <ContractSendMock />,
};

const contract: Localized<Guide> = {
  en: {
    slug: "create-a-contract",
    title: "Create a contract",
    group: "Contracts",
    category: "Create documents",
    description: "A step-by-step guide to writing, designing and sending a service contract in InvoiceBirds.",
    intro:
      "Put the agreement in writing before the work starts. This guide follows Ridgeway Towing & Recovery turning their accepted proposal into a fleet recovery contract with Harbour Logistics.",
    sections: [
      {
        id: "builder",
        title: "Meet the contract builder",
        intro:
          "Like proposals, a contract is written directly on the page. The list on the left jumps to each section, and Ready to send tracks what's still missing.",
        steps: [
          "Open Contracts and select Create, then Contract.",
          "Select a section in Build your contract to jump to it on the page.",
          "Work through Ready to send: a title, the client's name and email, and a priced service or milestone.",
        ],
        tip: "Your own signature is already in place, so Ready to send starts at 1 of 5.",
        mock: contractMocks.builder,
      },
      {
        id: "design",
        title: "Customize the design",
        intro: "Design works just like it does for invoices and proposals: choose a template, a color pair, corners and a font.",
        steps: [
          "Select Design at the top of the list.",
          "Choose a template, then a color pair. Primary, Secondary and Accent update to match.",
          "Pick Sharp, Soft or Rounded corners and choose a font.",
        ],
        mock: contractMocks.design,
      },
      {
        id: "cover",
        title: "Add a title, description and dates",
        intro: "The cover names the agreement and sets when it starts and ends. Each contract gets its own number, such as CONT-001.",
        steps: [
          "Select Cover.",
          "Click the title and type a name for the agreement, then add a short description.",
          "Select the effective date and the expiration date.",
        ],
        mock: contractMocks.cover,
      },
      {
        id: "parties",
        title: "Add the parties",
        intro: "Parties shows who the agreement is between: you as the provider, and your client.",
        steps: [
          "Select Parties. Your details as the provider are filled in for you.",
          "Select Search saved clients and choose the client.",
          "For a new client, type their full name, email, phone and address.",
        ],
        tip: "The client's name and email are both checks in Ready to send.",
        mock: contractMocks.parties,
      },
      {
        id: "services",
        title: "List the services",
        intro: "Services is the scope of work: what you'll do, at what rate and how many times.",
        steps: ["Select Services.", "Select Add service.", "Type a description, then the rate and quantity. The amount and total calculate for you."],
        mock: contractMocks.services,
      },
      {
        id: "payment-schedule",
        title: "Set a payment schedule",
        intro: "Split the total into milestones so your client knows exactly what's due and when.",
        steps: ["Select Payment Schedule.", "Select Add milestone.", "Name the milestone, then set its due date and amount. Repeat for each payment."],
        tip: "A priced milestone also completes Ready to send, even without services.",
        mock: contractMocks["payment-schedule"],
      },
      {
        id: "terms",
        title: "Write the terms",
        intro: "Spell out the conditions of the agreement and how you'll be paid.",
        steps: [
          "Select Terms.",
          "Type your terms and conditions. Use the toolbar for headings, bold and lists.",
          "Under Payment terms, enter the method, when payment is due, and any instructions.",
        ],
        mock: contractMocks.terms,
      },
      {
        id: "signatures",
        title: "Check the signatures",
        intro: "Signatures shows both sides of the agreement. Yours is already signed as the provider.",
        steps: [
          "Select Signatures.",
          "Check your signature and business name under Provider.",
          "The client's line shows Awaiting signature until they sign.",
        ],
        mock: contractMocks.signatures,
      },
      {
        id: "arrange",
        title: "Reorder or remove sections",
        intro: "Move sections into the order that suits the agreement, and remove the ones you don't need.",
        steps: [
          "Click a section on the page to select it.",
          "Use the up and down arrows below it to move it.",
          "Select × to remove a section you don't need.",
        ],
        tip: "The list on the left always follows the order on the page.",
        mock: contractMocks.arrange,
      },
      {
        id: "send",
        title: "Download and send",
        intro: "When the contract is ready, download a PDF for your records or send it to your client to sign.",
        steps: ["Select PDF to download a copy.", "Select Send to email the contract to your client.", "The contract is marked Sent and waits for your client's signature."],
        mock: contractMocks.send,
      },
    ],
  },
  fr: {
    slug: "create-a-contract",
    title: "Créer un contrat",
    group: "Contrats",
    category: "Create documents",
    description: "Un guide pas à pas pour rédiger, mettre en forme et envoyer un contrat de prestation de services avec InvoiceBirds.",
    intro:
      "Mettez l’accord par écrit avant de commencer le travail. Ce guide suit Ridgeway Towing & Recovery, qui transforme sa proposition acceptée en contrat de dépannage de flotte avec Harbour Logistics.",
    sections: [
      {
        id: "builder",
        title: "Découvrir l’éditeur de contrat",
        intro:
          "Comme une proposition, un contrat se rédige directement sur la page. La liste de gauche mène à chaque section, et « Prêt à l’envoi » indique ce qu’il manque encore.",
        steps: [
          "Ouvrez « Contrats », sélectionnez « Créer », puis « Contrat ».",
          "Sélectionnez une section dans « Créez votre contrat » pour l’atteindre sur la page.",
          "Complétez « Prêt à l’envoi » : un titre, le nom et l’e-mail du client, et une prestation ou un jalon avec un prix.",
        ],
        tip: "Votre propre signature est déjà en place : « Prêt à l’envoi » démarre donc à 1 sur 5.",
        mock: contractMocks.builder,
      },
      {
        id: "design",
        title: "Personnaliser le design",
        intro: "Le design se règle comme pour les factures et les propositions : choisissez un modèle, une paire de couleurs, des coins et une police.",
        steps: [
          "Sélectionnez « Design » en haut de la liste.",
          "Choisissez un modèle, puis une paire de couleurs. « Principale », « Secondaire » et « Accent » s’adaptent en conséquence.",
          "Choisissez des coins « Droits », « Doux » ou « Arrondis », puis une police.",
        ],
        mock: contractMocks.design,
      },
      {
        id: "cover",
        title: "Ajouter un titre, une description et des dates",
        intro: "La couverture nomme l’accord et fixe ses dates de début et de fin. Chaque contrat reçoit son propre numéro, par exemple CONT-001.",
        steps: [
          "Sélectionnez « Couverture ».",
          "Cliquez sur le titre et saisissez un nom pour l’accord, puis ajoutez une courte description.",
          "Sélectionnez la date d’effet et la date d’expiration.",
        ],
        mock: contractMocks.cover,
      },
      {
        id: "parties",
        title: "Ajouter les parties",
        intro: "La section « Parties » indique entre qui l’accord est conclu : vous, en tant que prestataire, et votre client.",
        steps: [
          "Sélectionnez « Parties ». Vos informations de prestataire sont déjà remplies.",
          "Sélectionnez « Rechercher un client enregistré » et choisissez le client.",
          "Pour un nouveau client, saisissez son nom complet, son e-mail, son téléphone et son adresse.",
        ],
        tip: "Le nom et l’e-mail du client font tous deux partie des vérifications de « Prêt à l’envoi ».",
        mock: contractMocks.parties,
      },
      {
        id: "services",
        title: "Lister les prestations",
        intro: "La section « Prestations » décrit le périmètre des travaux : ce que vous ferez, à quel tarif et combien de fois.",
        steps: [
          "Sélectionnez « Prestations ».",
          "Sélectionnez « Ajouter une prestation ».",
          "Saisissez une désignation, puis le prix unitaire et la quantité. Le montant et le total se calculent automatiquement.",
        ],
        mock: contractMocks.services,
      },
      {
        id: "payment-schedule",
        title: "Définir un échéancier de paiement",
        intro: "Répartissez le total en jalons pour que votre client sache exactement ce qu’il doit régler, et quand.",
        steps: [
          "Sélectionnez « Échéancier de paiement ».",
          "Sélectionnez « Ajouter un jalon ».",
          "Nommez le jalon, puis définissez sa date d’échéance et son montant. Recommencez pour chaque paiement.",
        ],
        tip: "Un jalon avec un montant valide aussi « Prêt à l’envoi », même sans prestation.",
        mock: contractMocks["payment-schedule"],
      },
      {
        id: "terms",
        title: "Rédiger les conditions",
        intro: "Précisez les conditions de l’accord et la façon dont vous serez payé.",
        steps: [
          "Sélectionnez « Conditions ».",
          "Saisissez vos conditions générales. Utilisez la barre d’outils pour les titres, le gras et les listes.",
          "Dans « Conditions de paiement », indiquez le mode de paiement, l’échéance et les éventuelles instructions.",
        ],
        mock: contractMocks.terms,
      },
      {
        id: "signatures",
        title: "Vérifier les signatures",
        intro: "La section « Signatures » présente les deux parties à l’accord. La vôtre est déjà apposée en tant que prestataire.",
        steps: [
          "Sélectionnez « Signatures ».",
          "Vérifiez votre signature et le nom de votre entreprise sous « Prestataire ».",
          "La ligne du client affiche « En attente de signature » jusqu’à ce qu’il signe.",
        ],
        mock: contractMocks.signatures,
      },
      {
        id: "arrange",
        title: "Réorganiser ou supprimer des sections",
        intro: "Placez les sections dans l’ordre qui convient à l’accord, et supprimez celles dont vous n’avez pas besoin.",
        steps: [
          "Cliquez sur une section de la page pour la sélectionner.",
          "Utilisez les flèches haut et bas situées en dessous pour la déplacer.",
          "Sélectionnez × pour supprimer une section inutile.",
        ],
        tip: "La liste de gauche suit toujours l’ordre de la page.",
        mock: contractMocks.arrange,
      },
      {
        id: "send",
        title: "Télécharger et envoyer",
        intro: "Quand le contrat est prêt, téléchargez un PDF pour vos archives ou envoyez-le à votre client pour signature.",
        steps: [
          "Sélectionnez « PDF » pour en télécharger une copie.",
          "Sélectionnez « Envoyer » pour envoyer le contrat par e-mail à votre client.",
          "Le contrat passe au statut « Envoyé » et attend la signature de votre client.",
        ],
        mock: contractMocks.send,
      },
    ],
  },
};

const accountMocks = {
  settings: <SettingsTabsMock />,
  "business-identity": <BusinessIdentityMock />,
  "contact-legal": <ContactLegalMock />,
  "document-defaults": <DocumentDefaultsMock />,
  signature: <SignatureDefaultMock />,
  "invoice-defaults": <InvoiceDefaultsMock />,
  templates: <TemplatesMock />,
  tax: <TaxSettingsMock />,
  reminders: <RemindersMock />,
  notifications: <NotificationsMock />,
  billing: <BillingMock />,
  "profile-security": <ProfileSecurityMock />,
  language: <LanguageMock />,
};

const account: Localized<Guide> = {
  en: {
    slug: "manage-your-account",
    title: "Manage your account",
    group: "Account",
    category: "Your account",
    description: "How to set up your business details, invoice defaults, templates, tax, reminders, notifications, billing, security and language in InvoiceBirds.",
    intro:
      "Set things up once and every new document starts ready. This guide follows Ridgeway Towing & Recovery through each tab in Settings, from business details to security and language.",
    sections: [
      {
        id: "settings",
        title: "Find your settings",
        intro: "Everything about your account lives in Settings, split into eight tabs.",
        steps: [
          "Select Settings in the sidebar.",
          "Choose a tab: Business, Invoices, Templates, Tax, Reminders, Notifications, Billing & Plans or Profile.",
          "Make your changes, then select Save at the bottom of the tab.",
        ],
        tip: "The bar at the bottom shows Unsaved changes until you save. Discard undoes everything since your last save.",
        mock: accountMocks.settings,
      },
      {
        id: "business-identity",
        title: "Add your business identity",
        intro: "Your name, logo and contact email appear on every invoice, estimate, proposal and contract.",
        steps: [
          "Open the Business tab.",
          "Under Company logo, drop or browse for a PNG, JPG or WebP file up to 5 MB.",
          "Enter your company name, website and business email, choose your industry, then select Save business defaults.",
        ],
        tip: "Leave Business email blank to use your login email on documents.",
        mock: accountMocks["business-identity"],
      },
      {
        id: "contact-legal",
        title: "Add your contact and legal details",
        intro: "Your address, phone and VAT ID fill the From block of your documents and are used for compliant e-invoices.",
        steps: [
          "On the Business tab, scroll to Contact & legal details.",
          "Enter your business address, postal code and country.",
          "Add your phone and fax numbers and your VAT ID, then save.",
        ],
        tip: "For EU countries, a note under the VAT ID shows which e-invoice formats apply, such as Factur-X or XRechnung for Germany.",
        mock: accountMocks["contact-legal"],
      },
      {
        id: "document-defaults",
        title: "Set your document defaults",
        intro: "Choose the currency, notes and terms every new invoice and estimate starts with. Each draft stays editable.",
        steps: [
          "On the Business tab, scroll to Document defaults.",
          "Choose your primary currency.",
          "Write your default notes and default terms & conditions, then save.",
        ],
        tip: "Changes apply to new documents only. Documents you've already created stay as they are.",
        mock: accountMocks["document-defaults"],
      },
      {
        id: "signature",
        title: "Save your signature",
        intro: "Save one authorized signature and use it on invoices, estimates and contracts.",
        steps: ["On the Business tab, scroll to Authorized signature.", "Sign in the box, or select the image button to upload a PNG.", "Select Save business defaults."],
        tip: "Use the undo and delete buttons under the box to fix a signature before saving.",
        mock: accountMocks.signature,
      },
      {
        id: "invoice-defaults",
        title: "Set your tax, numbering and due dates",
        intro: "The Invoices tab sets the taxes available in the builder, how invoices are numbered and when they're due.",
        steps: [
          "Open the Invoices tab and select Add tax. Enter a name and rate, and choose Added on top or Included.",
          "Choose a default due date and an invoice number prefix.",
          "Under Email defaults, set the subject and message used when you send an invoice, then save.",
        ],
        tip: "Use Load preset to fill in the common tax rates for your country.",
        mock: accountMocks["invoice-defaults"],
      },
      {
        id: "templates",
        title: "Choose your template, colors and font",
        intro: "Pick the layout, brand colors and type every new invoice starts with.",
        steps: [
          "Open the Templates tab and choose Modern, Classic or Minimal.",
          "Select a quick preset or enter your own Primary, Secondary, Accent, Text and Background colors.",
          "Choose a font: Helvetica, Inter, Lora or Times, then save.",
        ],
        mock: accountMocks.templates,
      },
      {
        id: "tax",
        title: "Track your taxes",
        intro: "Turn on tax tracking to get reports and reminders before filing deadlines.",
        steps: [
          "Open the Tax tab and turn on Enable tax tracking.",
          "Set your country, state or province, and city under Tax jurisdiction.",
          "Choose a filing rhythm, then set up automatic reports and deadline reminders.",
        ],
        tip: "Invoice tax rates are set on the Invoices tab. The Tax tab is for reporting and deadlines.",
        mock: accountMocks.tax,
      },
      {
        id: "reminders",
        title: "Send automatic payment reminders",
        intro: "Let InvoiceBirds follow up on unpaid invoices for you, calmly and on time.",
        steps: [
          "Open the Reminders tab and turn on Automatic payment reminders.",
          "Under Reminder timeline, turn each message on or off and set how many days before or after the due date it goes out.",
          "Choose whether to include a payment link and send yourself a copy, then save.",
        ],
        tip: "Reminders stop as soon as an invoice is paid, and you can pause them on any single invoice. The queue is checked once a day at 8:00 AM UTC.",
        mock: accountMocks.reminders,
      },
      {
        id: "notifications",
        title: "Choose your notifications",
        intro: "Decide which events deserve your attention: payments, client responses, account alerts and more.",
        steps: [
          "Open the Notifications tab.",
          "Turn individual notifications on or off, such as Invoice Paid or Contract Signed.",
          "Use Enable all or Pause all to change everything at once, then save.",
        ],
        mock: accountMocks.notifications,
      },
      {
        id: "billing",
        title: "Change your plan or payment method",
        intro: "See your current plan, update how you pay, and switch between plans.",
        steps: [
          "Open the Billing & Plans tab.",
          "Under Payment method, add or update your card through Stripe.",
          "Under Available plans, choose Monthly or Yearly and select a plan to switch.",
        ],
        tip: "Yearly billing costs less. Receipts and invoices for your subscription appear under Billing history.",
        mock: accountMocks.billing,
      },
      {
        id: "profile-security",
        title: "Update your profile and password",
        intro: "Keep your personal details and sign-in secure.",
        steps: [
          "Open the Profile tab and update your full name and phone number.",
          "Under Change password, enter your current password and a new one of at least 8 characters, then select Update password.",
          "Turn on Two-factor authentication for an extra verification step when you sign in.",
        ],
        tip: "To close your account, use Delete account under Danger zone. This permanently removes your account and its data, so download anything you need first.",
        mock: accountMocks["profile-security"],
      },
      {
        id: "language",
        title: "Switch between English and French",
        intro: "Use InvoiceBirds in English or French. The whole app switches, from the menu to every screen.",
        steps: [
          "Open the account menu with your business name at the bottom of the sidebar.",
          "Select Language.",
          "Choose English or Français. The app updates straight away.",
        ],
        mock: accountMocks.language,
      },
    ],
  },
  fr: {
    slug: "manage-your-account",
    title: "Gérer votre compte",
    group: "Compte",
    category: "Your account",
    description:
      "Comment configurer les informations de votre entreprise, les valeurs par défaut des factures, les modèles, les taxes, les relances, les notifications, la facturation, la sécurité et la langue dans InvoiceBirds.",
    intro:
      "Configurez tout une seule fois, et chaque nouveau document est prêt d’emblée. Ce guide suit Ridgeway Towing & Recovery à travers chaque onglet des paramètres, des informations de l’entreprise jusqu’à la sécurité et la langue.",
    sections: [
      {
        id: "settings",
        title: "Trouver vos paramètres",
        intro: "Tout ce qui concerne votre compte se trouve dans « Paramètres », réparti en huit onglets.",
        steps: [
          "Sélectionnez « Paramètres » dans la barre latérale.",
          "Choisissez un onglet : « Entreprise », « Factures », « Modèles », « Taxes », « Relances », « Notifications », « Facturation et abonnement » ou « Profil ».",
          "Effectuez vos modifications, puis sélectionnez « Enregistrer » en bas de l’onglet.",
        ],
        tip: "La barre du bas affiche « Modifications non enregistrées » tant que vous n’avez pas enregistré. « Annuler » efface tout ce qui a changé depuis votre dernier enregistrement.",
        mock: accountMocks.settings,
      },
      {
        id: "business-identity",
        title: "Ajouter l’identité de votre entreprise",
        intro: "Votre nom, votre logo et votre e-mail de contact apparaissent sur chaque facture, devis, proposition et contrat.",
        steps: [
          "Ouvrez l’onglet « Entreprise ».",
          "Sous « Logo de l’entreprise », déposez ou sélectionnez un fichier PNG, JPG ou WebP de 5 Mo maximum.",
          "Saisissez le nom de votre entreprise, votre site web et votre e-mail professionnel, choisissez votre secteur d’activité, puis sélectionnez « Enregistrer les paramètres de l’entreprise ».",
        ],
        tip: "Laissez « E-mail professionnel » vide pour utiliser votre e-mail de connexion sur les documents.",
        mock: accountMocks["business-identity"],
      },
      {
        id: "contact-legal",
        title: "Ajouter vos coordonnées et mentions légales",
        intro: "Votre adresse, votre téléphone et votre numéro de TVA remplissent le bloc émetteur de vos documents et servent aux factures électroniques conformes.",
        steps: [
          "Dans l’onglet « Entreprise », faites défiler jusqu’à « Coordonnées et mentions légales ».",
          "Saisissez l’adresse de votre entreprise, son code postal et son pays.",
          "Ajoutez vos numéros de téléphone et de fax ainsi que votre numéro de TVA, puis enregistrez.",
        ],
        tip: "Pour les pays de l’UE, une note sous le numéro de TVA indique les formats de facture électronique applicables, par exemple Factur-X ou XRechnung pour l’Allemagne.",
        mock: accountMocks["contact-legal"],
      },
      {
        id: "document-defaults",
        title: "Définir les valeurs par défaut des documents",
        intro: "Choisissez la devise, les notes et les conditions de départ de chaque nouvelle facture et de chaque nouveau devis. Chaque brouillon reste modifiable.",
        steps: [
          "Dans l’onglet « Entreprise », faites défiler jusqu’à « Valeurs par défaut des documents ».",
          "Choisissez votre devise principale.",
          "Rédigez vos notes et vos conditions générales par défaut, puis enregistrez.",
        ],
        tip: "Les modifications ne s’appliquent qu’aux nouveaux documents. Ceux que vous avez déjà créés restent inchangés.",
        mock: accountMocks["document-defaults"],
      },
      {
        id: "signature",
        title: "Enregistrer votre signature",
        intro: "Enregistrez une signature autorisée et utilisez-la sur vos factures, devis et contrats.",
        steps: [
          "Dans l’onglet « Entreprise », faites défiler jusqu’à « Signature autorisée ».",
          "Signez dans le cadre, ou sélectionnez le bouton image pour importer un PNG.",
          "Sélectionnez « Enregistrer les paramètres de l’entreprise ».",
        ],
        tip: "Utilisez les boutons d’annulation et de suppression sous le cadre pour corriger une signature avant de l’enregistrer.",
        mock: accountMocks.signature,
      },
      {
        id: "invoice-defaults",
        title: "Définir les taxes, la numérotation et les échéances",
        intro: "L’onglet « Factures » définit les taxes disponibles dans l’éditeur, la numérotation des factures et leur échéance.",
        steps: [
          "Ouvrez l’onglet « Factures » et sélectionnez « Ajouter une taxe ». Saisissez un nom et un taux, puis choisissez « Ajoutée au prix » ou « Incluse ».",
          "Choisissez une échéance par défaut et un préfixe de numéro de facture.",
          "Dans « E-mails par défaut », définissez l’objet et le message utilisés à l’envoi d’une facture, puis enregistrez.",
        ],
        tip: "Utilisez « Charger un préréglage » pour renseigner les taux de taxe courants de votre pays.",
        mock: accountMocks["invoice-defaults"],
      },
      {
        id: "templates",
        title: "Choisir votre modèle, vos couleurs et votre police",
        intro: "Choisissez la mise en page, les couleurs de marque et la typographie de chaque nouvelle facture.",
        steps: [
          "Ouvrez l’onglet « Modèles » et choisissez « Moderne », « Classique » ou « Minimal ».",
          "Sélectionnez un préréglage rapide ou saisissez vos propres couleurs « Principale », « Secondaire », « Accent », « Texte » et « Arrière-plan ».",
          "Choisissez une police (Helvetica, Inter, Lora ou Times), puis enregistrez.",
        ],
        mock: accountMocks.templates,
      },
      {
        id: "tax",
        title: "Suivre vos taxes",
        intro: "Activez le suivi fiscal pour recevoir des rapports et des rappels avant vos dates limites de déclaration.",
        steps: [
          "Ouvrez l’onglet « Taxes » et activez l’option « Activer le suivi fiscal ».",
          "Sous « Juridiction fiscale », indiquez votre pays, votre État ou province, et votre ville.",
          "Choisissez une fréquence de déclaration, puis configurez les rapports automatiques et les rappels d’échéance.",
        ],
        tip: "Les taux de taxe des factures se définissent dans l’onglet « Factures ». L’onglet « Taxes » sert aux rapports et aux échéances.",
        mock: accountMocks.tax,
      },
      {
        id: "reminders",
        title: "Envoyer des relances de paiement automatiques",
        intro: "Laissez InvoiceBirds relancer vos factures impayées à votre place, avec tact et au bon moment.",
        steps: [
          "Ouvrez l’onglet « Relances » et activez « Relances de paiement automatiques ».",
          "Dans « Calendrier des relances », activez ou désactivez chaque message et indiquez combien de jours avant ou après la date d’échéance il est envoyé.",
          "Choisissez d’inclure ou non un lien de paiement et de recevoir une copie, puis enregistrez.",
        ],
        tip: "Les relances s’arrêtent dès qu’une facture est payée, et vous pouvez les suspendre pour une facture en particulier. La file d’attente est vérifiée une fois par jour à 8 h 00 UTC.",
        mock: accountMocks.reminders,
      },
      {
        id: "notifications",
        title: "Choisir vos notifications",
        intro: "Décidez quels événements méritent votre attention : paiements, réponses des clients, alertes du compte, etc.",
        steps: [
          "Ouvrez l’onglet « Notifications ».",
          "Activez ou désactivez chaque notification, par exemple « Facture payée » ou « Contrat signé ».",
          "Utilisez « Tout activer » ou « Tout suspendre » pour tout modifier d’un coup, puis enregistrez.",
        ],
        mock: accountMocks.notifications,
      },
      {
        id: "billing",
        title: "Changer de formule ou de moyen de paiement",
        intro: "Consultez votre formule actuelle, modifiez votre moyen de paiement et passez d’une formule à l’autre.",
        steps: [
          "Ouvrez l’onglet « Facturation et abonnement ».",
          "Sous « Moyen de paiement », ajoutez ou mettez à jour votre carte via Stripe.",
          "Sous « Formules disponibles », choisissez « Mensuel » ou « Annuel », puis sélectionnez la formule souhaitée.",
        ],
        tip: "La facturation annuelle revient moins cher. Les reçus et factures de votre abonnement figurent dans « Historique de facturation ».",
        mock: accountMocks.billing,
      },
      {
        id: "profile-security",
        title: "Mettre à jour votre profil et votre mot de passe",
        intro: "Protégez vos informations personnelles et votre connexion.",
        steps: [
          "Ouvrez l’onglet « Profil » et mettez à jour votre nom complet et votre numéro de téléphone.",
          "Sous « Modifier le mot de passe », saisissez votre mot de passe actuel et un nouveau mot de passe d’au moins 8 caractères, puis sélectionnez « Mettre à jour le mot de passe ».",
          "Activez « Authentification à deux facteurs » pour ajouter une étape de vérification à la connexion.",
        ],
        tip: "Pour fermer votre compte, utilisez « Supprimer le compte » dans la « Zone de danger ». Votre compte et ses données sont alors définitivement supprimés : téléchargez d’abord tout ce dont vous avez besoin.",
        mock: accountMocks["profile-security"],
      },
      {
        id: "language",
        title: "Choisir entre le français et l’anglais",
        intro: "Utilisez InvoiceBirds en français ou en anglais. Toute l’application change de langue, du menu à chaque écran.",
        steps: [
          "Ouvrez le menu du compte, qui porte le nom de votre entreprise, en bas de la barre latérale.",
          "Sélectionnez « Langue » (« Language » si l’application est en anglais).",
          "Choisissez « Français » ou « English ». L’application se met à jour immédiatement.",
        ],
        mock: accountMocks.language,
      },
    ],
  },
};

const GUIDES = [invoice, estimate, proposal, contract, account];

export function getGuides(locale: Locale): Guide[] {
  return GUIDES.map((guide) => guide[locale]);
}

export function guideBySlug(locale: Locale, slug: string): Guide {
  return getGuides(locale).find((g) => g.slug === slug)!;
}
