export const euro = (amount: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);

export const BUSINESS = {
  name: "Ridgeway Towing & Recovery Ltd",
  address: "Unit 4, Ballymount Business Park, Dublin 12",
  vatId: "IE 3271946PH",
};

export const CLIENT = {
  name: "Northlight Logistics Ltd",
  address: "Harbour Road, Cork T12 X2K8",
  vatId: "IE 6388047V",
  initials: "NL",
};

export const ITEMS = [
  { name: "Vehicle recovery", qty: 1, rate: 350 },
  { name: "Flatbed towing", qty: 1, rate: 250 },
] as const;

export const VAT_RATE = 0.23;
export const SUBTOTAL = ITEMS.reduce((sum, item) => sum + item.qty * item.rate, 0);
export const VAT = SUBTOTAL * VAT_RATE;
export const TOTAL = SUBTOTAL + VAT;

const amount = (value: number) => value.toFixed(2);

export const INCOMING = {
  supplier: "Kerry Fuel Supplies Ltd",
  number: "KFS-5519",
  total: 1_225.08,
  format: "Peppol BIS Billing 3.0",
};

export type FormatId = "peppol" | "ubl" | "xrechnung" | "zugferd";

export const FORMATS: { id: FormatId; name: string; output: string; file: string }[] = [
  { id: "peppol", name: "Peppol BIS Billing 3.0", output: "UBL XML", file: "INV-842.xml" },
  { id: "ubl", name: "UBL 2.1", output: "UBL XML", file: "INV-842.xml" },
  { id: "xrechnung", name: "XRechnung", output: "UBL XML", file: "INV-842.xml" },
  { id: "zugferd", name: "ZUGFeRD / Factur-X", output: "PDF with embedded XML", file: "INV-842.pdf › factur-x.xml" },
];

/** A shortened, real-shaped preview of the generated XML; `…` marks folded content. */
export function xmlPreview(format: FormatId, dates: { issueIso: string; dueIso: string }) {
  if (format === "zugferd") {
    return [
      `<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100">`,
      `  <rsm:ExchangedDocumentContext>`,
      `    <ram:GuidelineSpecifiedDocumentContextParameter>`,
      `      <ram:ID>urn:cen.eu:en16931:2017</ram:ID>`,
      `    </ram:GuidelineSpecifiedDocumentContextParameter>`,
      `  </rsm:ExchangedDocumentContext>`,
      `  <rsm:ExchangedDocument>`,
      `    <ram:ID>INV-842</ram:ID>`,
      `    <ram:TypeCode>380</ram:TypeCode>`,
      `  </rsm:ExchangedDocument>`,
      `  <rsm:SupplyChainTradeTransaction>`,
      `    …`,
      `      <ram:Name>${CLIENT.name}</ram:Name>`,
      `    …`,
      `      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>`,
      `      <ram:TaxTotalAmount currencyID="EUR">${amount(VAT)}</ram:TaxTotalAmount>`,
      `      <ram:DuePayableAmount>${amount(TOTAL)}</ram:DuePayableAmount>`,
      `  </rsm:SupplyChainTradeTransaction>`,
      `</rsm:CrossIndustryInvoice>`,
    ];
  }

  const header = {
    peppol: [
      `  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>`,
      `  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>`,
    ],
    ubl: [`  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>`],
    xrechnung: [
      `  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0</cbc:CustomizationID>`,
      `  <cbc:BuyerReference>PO-2291</cbc:BuyerReference>`,
    ],
  }[format];

  return [
    `<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">`,
    ...header,
    `  <cbc:ID>INV-842</cbc:ID>`,
    `  <cbc:IssueDate>${dates.issueIso}</cbc:IssueDate>`,
    `  <cbc:DueDate>${dates.dueIso}</cbc:DueDate>`,
    `  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>`,
    `  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>`,
    `  <cac:AccountingCustomerParty>`,
    `    …`,
    `      <cbc:RegistrationName>${CLIENT.name}</cbc:RegistrationName>`,
    `    …`,
    `  </cac:AccountingCustomerParty>`,
    `  <cac:TaxTotal>`,
    `    <cbc:TaxAmount currencyID="EUR">${amount(VAT)}</cbc:TaxAmount>`,
    `  </cac:TaxTotal>`,
    `  <cac:LegalMonetaryTotal>`,
    `    <cbc:PayableAmount currencyID="EUR">${amount(TOTAL)}</cbc:PayableAmount>`,
    `  </cac:LegalMonetaryTotal>`,
    `</Invoice>`,
  ];
}
