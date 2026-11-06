import type { Locale, Localized } from "@/lib/i18n";

/**
 * Format explorer content. One sample invoice across all three previews.
 * Snippets are abbreviated, illustrative excerpts (not complete or validated
 * files) and deliberately name no format versions or certifications.
 */
export const SAMPLE = {
  number: "INV-2026-0142",
  issueDate: "2026-10-31",
  issueDateCompact: "20261031",
  seller: "Morrow Studio GmbH",
  buyer: "Lumen Labs GmbH",
  lines: [
    { name: { en: "Brand design retainer", fr: "Forfait identité visuelle" }, amount: 1_200 },
    { name: { en: "Website support", fr: "Maintenance du site" }, amount: 300 },
  ],
  net: 1_500,
  vatRate: 19,
  vat: 285,
  total: 1_785,
} as const;

export type FormatId = "facturx" | "xrechnung" | "ubl";

export type Format = {
  id: FormatId;
  name: string;
  short: string;
  kind: "PDF" | "XML";
  description: string;
  filename: string;
  /** For hybrid files: the XML file carried inside the PDF. */
  embedded?: string;
  why: string;
  accent: { icon: string; soft: string };
  xml: string[];
};

const amount = (n: number) => n.toFixed(2);

const en = {
  facturx: {
    description: "PDF/A-3 with embedded XML",
    why: "One file for people and software: your client reads the PDF, their accounting system reads the data inside it.",
  },
  xrechnung: {
    description: "Structured XML following German invoice requirements",
    why: "Common with German public-sector clients. The buyer reference they ask for travels with the invoice.",
  },
  ubl: {
    description: "Structured XML invoice",
    why: "A widely used XML invoice format that accounting software can read directly, without retyping.",
  },
  /** Comments inside the sample XML. */
  partiesAndLines: "seller, buyer and line items",
  xrechnungInUbl: "XRechnung rules, shown here in UBL syntax",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    facturx: {
      description: "PDF/A-3 avec XML intégré",
      why: "Un seul fichier pour les humains et les logiciels : votre client lit le PDF, son logiciel comptable lit les données qu’il contient.",
    },
    xrechnung: {
      description: "XML structuré selon les règles de facturation allemandes",
      why: "Courant avec les clients du secteur public allemand. La référence acheteur qu’ils demandent accompagne la facture.",
    },
    ubl: {
      description: "Facture XML structurée",
      why: "Un format de facture XML très répandu, que les logiciels comptables lisent directement, sans ressaisie.",
    },
    partiesAndLines: "vendeur, acheteur et lignes",
    xrechnungInUbl: "règles XRechnung, ici en syntaxe UBL",
  },
};

function formats(locale: Locale): Format[] {
  const t = COPY[locale];
  return [
    {
      id: "facturx",
      name: "ZUGFeRD / Factur-X",
      short: "Factur-X",
      kind: "PDF",
      description: t.facturx.description,
      filename: `${SAMPLE.number}.pdf`,
      embedded: "factur-x.xml",
      why: t.facturx.why,
      accent: { icon: "#06B047", soft: "#E7F7ED" },
      xml: [
        `<rsm:CrossIndustryInvoice`,
        `    xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100">`,
        `  <rsm:ExchangedDocument>`,
        `    <ram:ID>${SAMPLE.number}</ram:ID>`,
        `    <ram:TypeCode>380</ram:TypeCode>`,
        `    <ram:IssueDateTime>`,
        `      <udt:DateTimeString format="102">${SAMPLE.issueDateCompact}</udt:DateTimeString>`,
        `    </ram:IssueDateTime>`,
        `  </rsm:ExchangedDocument>`,
        `  <rsm:SupplyChainTradeTransaction>`,
        `    <!-- ${t.partiesAndLines} … -->`,
        `    <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>`,
        `    <ram:TaxBasisTotalAmount>${amount(SAMPLE.net)}</ram:TaxBasisTotalAmount>`,
        `    <ram:TaxTotalAmount currencyID="EUR">${amount(SAMPLE.vat)}</ram:TaxTotalAmount>`,
        `    <ram:GrandTotalAmount>${amount(SAMPLE.total)}</ram:GrandTotalAmount>`,
        `  </rsm:SupplyChainTradeTransaction>`,
        `</rsm:CrossIndustryInvoice>`,
      ],
    },
    {
      id: "xrechnung",
      name: "XRechnung",
      short: "XRechnung",
      kind: "XML",
      description: t.xrechnung.description,
      filename: `${SAMPLE.number}-xrechnung.xml`,
      why: t.xrechnung.why,
      accent: { icon: "#114077", soft: "#EAF0F7" },
      xml: [
        `<!-- ${t.xrechnungInUbl} -->`,
        `<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">`,
        `  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_…</cbc:CustomizationID>`,
        `  <cbc:ID>${SAMPLE.number}</cbc:ID>`,
        `  <cbc:IssueDate>${SAMPLE.issueDate}</cbc:IssueDate>`,
        `  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>`,
        `  <cbc:BuyerReference>04011000-12345-67</cbc:BuyerReference>`,
        `  <cac:AccountingCustomerParty>`,
        `    <!-- ${SAMPLE.buyer} … -->`,
        `  </cac:AccountingCustomerParty>`,
        `  <cac:LegalMonetaryTotal>`,
        `    <cbc:PayableAmount currencyID="EUR">${amount(SAMPLE.total)}</cbc:PayableAmount>`,
        `  </cac:LegalMonetaryTotal>`,
        `</Invoice>`,
      ],
    },
    {
      id: "ubl",
      name: "UBL",
      short: "UBL",
      kind: "XML",
      description: t.ubl.description,
      filename: `${SAMPLE.number}.xml`,
      why: t.ubl.why,
      accent: { icon: "#0A2540", soft: "#EEF1F5" },
      xml: [
        `<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">`,
        `  <cbc:ID>${SAMPLE.number}</cbc:ID>`,
        `  <cbc:IssueDate>${SAMPLE.issueDate}</cbc:IssueDate>`,
        `  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>`,
        `  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>`,
        `  <!-- ${t.partiesAndLines} … -->`,
        `  <cac:TaxTotal>`,
        `    <cbc:TaxAmount currencyID="EUR">${amount(SAMPLE.vat)}</cbc:TaxAmount>`,
        `  </cac:TaxTotal>`,
        `  <cac:LegalMonetaryTotal>`,
        `    <cbc:TaxExclusiveAmount currencyID="EUR">${amount(SAMPLE.net)}</cbc:TaxExclusiveAmount>`,
        `    <cbc:TaxInclusiveAmount currencyID="EUR">${amount(SAMPLE.total)}</cbc:TaxInclusiveAmount>`,
        `    <cbc:PayableAmount currencyID="EUR">${amount(SAMPLE.total)}</cbc:PayableAmount>`,
        `  </cac:LegalMonetaryTotal>`,
        `</Invoice>`,
      ],
    },
  ];
}

export const FORMATS: Localized<Format[]> = { en: formats("en"), fr: formats("fr") };
