"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import { INTL_LOCALE, type Locale, type Localized } from "@/lib/i18n";

/* Sample data: Ridgeway Towing & Recovery Ltd invoicing Harbour Logistics Ltd. */
export const gbp = (n: number, locale: Locale = "en") =>
  new Intl.NumberFormat(locale === "en" ? "en-GB" : INTL_LOCALE[locale], { style: "currency", currency: "GBP" }).format(n);

export type Item = { name: string; detail: string; qty: number; rate: number };

export const ITEMS: Localized<Item[]> = {
  en: [
    { name: "Vehicle recovery, Ford Transit", detail: "M62 J27 eastbound", qty: 1, rate: 285 },
    { name: "Towing to depot", detail: "Per mile, to Leeds depot", qty: 24, rate: 3.5 },
    { name: "Winching", detail: "Ditch recovery", qty: 1, rate: 95 },
  ],
  fr: [
    { name: "Dépannage, Ford Transit", detail: "M62 J27, direction est", qty: 1, rate: 285 },
    { name: "Remorquage au dépôt", detail: "Par mile, jusqu’au dépôt de Leeds", qty: 24, rate: 3.5 },
    { name: "Treuillage", detail: "Sortie de fossé", qty: 1, rate: 95 },
  ],
};

export const THEMES = {
  red: { primary: "#B91C1C", accent: "#DC2626" },
  navy: { primary: "#0A2540", accent: "#06B047" },
  plain: { primary: "#111827", accent: "#9CA3AF" },
  blue: { primary: "#1D4ED8", accent: "#60A5FA" },
} as const;

export type Part = "logo" | "client" | "setup" | "items" | "totals" | "payment" | "notes" | "terms" | "signature" | "design";

export type DocKind = "invoice" | "estimate";

export type InvoiceState = {
  kind?: DocKind;
  logo?: boolean;
  client?: boolean;
  number?: string;
  issue?: string;
  due?: string;
  showNumber?: boolean;
  currencyCode?: boolean;
  items?: Item[];
  /** A row being typed on the canvas: index into `items`, and how much of it is filled. */
  typingRow?: { index: number; name: string; qty?: number; rate?: number };
  vat?: boolean;
  discount?: boolean;
  theme?: keyof typeof THEMES;
  rounded?: boolean;
  striped?: boolean;
  payment?: boolean;
  notes?: string;
  terms?: string;
  /** Signature draw progress, 0 to 1. */
  signature?: number;
  status?: "Draft" | "Sent";
  highlight?: Part | Part[];
};

type Doc = Required<Omit<InvoiceState, "typingRow" | "highlight" | "kind">>;

const DEFAULTS: Omit<Doc, "items" | "issue" | "due" | "notes" | "terms"> = {
  logo: true,
  client: true,
  number: "INV-1206",
  showNumber: true,
  currencyCode: false,
  vat: true,
  discount: false,
  theme: "red",
  rounded: true,
  striped: false,
  payment: true,
  signature: 1,
  status: "Draft",
};

const en = {
  issue: "1 Nov 2026",
  due: "15 Nov 2026",
  validUntil: "1 Dec 2026",
  notes: "Thank you for choosing Ridgeway. We appreciate your business.",
  terms: "Payment due within 14 days by bank transfer.",
  estimateTerms: "Valid for 30 days. Final price confirmed on completion.",
  status: { invoice: { Draft: "Draft", Sent: "Sent" }, estimate: { Draft: "Draft", Sent: "Sent" } },
  title: { invoice: "INVOICE", estimate: "ESTIMATE" },
  number: { invoice: "Invoice No.", estimate: "Estimate No." },
  issueDate: "Issue date",
  dueDate: { invoice: "Due date", estimate: "Valid until" },
  noLogo: "No logo yet",
  from: "FROM",
  city: "Leeds LS11 5QR, United Kingdom",
  billTo: { invoice: "BILL TO", estimate: "BILL TO" },
  chooseClient: "Choose a client",
  address: "Address",
  email: "Email",
  columns: { description: "DESCRIPTION", qty: "QTY", rate: "RATE", amount: "AMOUNT" },
  itemPlaceholder: "Item description",
  subtotal: "Subtotal",
  discount: "Discount (10%)",
  vat: "VAT (20%)",
  total: { invoice: "TOTAL DUE", estimate: "ESTIMATE TOTAL" },
  paymentDetails: "PAYMENT DETAILS",
  bank: "Bank transfer · Barclays Business · Account 41263321 · SWIFT BARCGB22",
  notesLabel: "NOTES",
  addNote: "Add a note",
  termsLabel: "TERMS",
  addTerms: "Add your terms",
  signature: "AUTHORIZED",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    issue: "1er nov. 2026",
    due: "15 nov. 2026",
    validUntil: "1er déc. 2026",
    notes: "Merci d’avoir choisi Ridgeway. Nous apprécions votre confiance.",
    terms: "Paiement sous 14 jours par virement bancaire.",
    estimateTerms: "Valable 30 jours. Prix définitif confirmé à la fin des travaux.",
    status: { invoice: { Draft: "Brouillon", Sent: "Envoyée" }, estimate: { Draft: "Brouillon", Sent: "Envoyé" } },
    title: { invoice: "FACTURE", estimate: "DEVIS" },
    number: { invoice: "N° de facture", estimate: "N° de devis" },
    issueDate: "Date d’émission",
    dueDate: { invoice: "Date d’échéance", estimate: "Valable jusqu’au" },
    noLogo: "Pas encore de logo",
    from: "DE",
    city: "Leeds LS11 5QR, Royaume-Uni",
    billTo: { invoice: "FACTURÉ À", estimate: "ADRESSÉ À" },
    chooseClient: "Choisir un client",
    address: "Adresse",
    email: "E-mail",
    columns: { description: "DÉSIGNATION", qty: "QTÉ", rate: "P.U.", amount: "MONTANT" },
    itemPlaceholder: "Description de l’article",
    subtotal: "Sous-total",
    discount: "Remise (10 %)",
    vat: "TVA (20 %)",
    total: { invoice: "TOTAL À PAYER", estimate: "TOTAL DU DEVIS" },
    paymentDetails: "INFORMATIONS DE PAIEMENT",
    bank: "Virement bancaire · Barclays Business · Compte 41263321 · SWIFT BARCGB22",
    notesLabel: "NOTES",
    addNote: "Ajouter une note",
    termsLabel: "CONDITIONS",
    addTerms: "Ajouter vos conditions",
    signature: "SIGNATURE",
  },
};

/** Draws a signature up to `progress`. */
export function SignatureStroke({ progress, className }: { progress: number; className?: string }) {
  return (
    <svg viewBox="0 0 160 48" fill="none" className={className}>
      <path
        d="M6 34c6-14 14-24 18-20s-6 22-2 22 10-22 16-22-2 18 2 18 8-14 12-14 0 12 4 12 6-10 10-12 2 10 6 10 8-8 12-10 0 8 4 8c6 0 10-6 16-8M30 40c26-4 60-6 112-10"
        stroke="#0A2540"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
    </svg>
  );
}

export function RidgewayLogo({ className }: { className?: string }) {
  return (
    <div className={cn("leading-none", className)}>
      <p className="text-[20px] font-black tracking-[-0.02em] text-[#B91C1C] italic">RIDGEWAY</p>
      <p className="mt-1 text-[7.5px] font-bold tracking-[0.28em] text-[#1F2937]">TOWING &amp; RECOVERY</p>
    </div>
  );
}

const label = "mb-1 text-[8px] font-semibold tracking-[0.16em] text-[#8A94A3]";
const cols = "grid grid-cols-[1fr_38px_70px_76px] gap-2";
const placeholder = "text-[#B5BDC7] italic";

export function totalsFor(s: Pick<Required<InvoiceState>, "items" | "vat" | "discount">) {
  const subtotal = s.items.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const discount = s.discount ? subtotal * 0.1 : 0;
  const vat = s.vat ? (subtotal - discount) * 0.2 : 0;
  return { subtotal, discount, vat, total: subtotal - discount + vat };
}

/** The sample invoice or estimate (520px wide). Unset props use a complete document. */
export function MiniInvoice({ kind = "invoice", ...props }: InvoiceState) {
  const locale = useLocale();
  const copy = COPY[locale];
  const money = (n: number) => gbp(n, locale);
  const estimate = kind === "estimate";
  const base: Doc = {
    ...DEFAULTS,
    items: ITEMS[locale],
    issue: copy.issue,
    due: estimate ? copy.validUntil : copy.due,
    notes: copy.notes,
    terms: estimate ? copy.estimateTerms : copy.terms,
  };
  const s = { ...base, ...Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) } as Doc &
    Pick<InvoiceState, "typingRow" | "highlight">;
  const theme = THEMES[s.theme];
  const radius = s.rounded ? 10 : 4;
  const sum = totalsFor(s);
  const lit = (part: Part) => (Array.isArray(s.highlight) ? s.highlight.includes(part) : s.highlight === part);
  /** Outlines the block a step changes. */
  const mark = (part: Part) =>
    cn("-mx-2 rounded-lg px-2 transition-[box-shadow,background-color] duration-300", lit(part) && "bg-[#06B047]/[0.06] ring-2 ring-[#06B047]/45");

  return (
    <div className="relative w-[520px] rounded-xl border border-line bg-white px-8 pt-7 pb-6 font-[Helvetica,Arial,sans-serif] text-[10.5px] text-[#111827] shadow-[0_12px_40px_rgba(10,37,64,0.08),0_2px_6px_rgba(10,37,64,0.04)]">
      <span
        className={cn(
          "absolute top-3 right-3 rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors",
          s.status === "Sent" ? "bg-[#E8F7EE] text-green" : "bg-[#F1F3F5] text-[#4B5563]",
        )}
      >
        {copy.status[kind][s.status]}
      </span>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className={cn(mark("logo"), "min-h-[40px] py-1")}>
          {s.logo ? (
            <RidgewayLogo />
          ) : (
            <>
              <p className="text-[13px] font-bold">Ridgeway Towing &amp; Recovery Ltd</p>
              <p className={cn("mt-0.5 text-[9px]", placeholder)}>{copy.noLogo}</p>
            </>
          )}
        </div>
        <div className={cn(mark("setup"), "py-1 text-right")}>
          <p className="text-[26px] leading-none font-bold transition-colors duration-500" style={{ color: theme.primary }}>
            {copy.title[kind]}
          </p>
          <dl className="mt-2.5 grid grid-cols-[auto_auto] justify-end gap-x-4 gap-y-0.5 text-[9px]">
            {s.showNumber && (
              <>
                <dt className="text-[#6B7280]">{copy.number[kind]}</dt>
                <dd className="font-semibold">{estimate && s.number === DEFAULTS.number ? "EST-0418" : s.number}</dd>
              </>
            )}
            <dt className="text-[#6B7280]">{copy.issueDate}</dt>
            <dd>{s.issue}</dd>
            <dt className="text-[#6B7280]">{copy.dueDate[kind]}</dt>
            <dd>{s.due}</dd>
          </dl>
        </div>
      </div>

      <div className="mt-3 h-[2px] rounded-full transition-colors duration-500" style={{ backgroundColor: theme.accent }} />

      {/* Parties */}
      <div className="mt-3 grid grid-cols-2 gap-6 leading-[1.5]">
        <div>
          <p className={label}>{copy.from}</p>
          <p className="font-semibold">Ridgeway Towing &amp; Recovery Ltd</p>
          <p className="text-[#4B5563]">Unit 4, Brookfield Industrial Estate</p>
          <p className="text-[#4B5563]">{copy.city}</p>
        </div>
        <div className={cn(mark("client"), "py-1")}>
          <p className={label}>{copy.billTo[kind]}</p>
          {s.client ? (
            <>
              <p className="font-semibold">Harbour Logistics Ltd</p>
              <p className="text-[#4B5563]">Dock Road, Hull HU9 1TA</p>
              <p className="text-[#4B5563]">accounts@harbourlogistics.co.uk</p>
            </>
          ) : (
            <>
              <p className={placeholder}>{copy.chooseClient}</p>
              <p className={placeholder}>{copy.address}</p>
              <p className={placeholder}>{copy.email}</p>
            </>
          )}
        </div>
      </div>

      {/* Items */}
      <div className={cn(mark("items"), "mt-3 py-1")}>
        <div className="overflow-hidden border border-[#E4E7EB] transition-[border-radius] duration-500" style={{ borderRadius: radius }}>
          <div className={cn(cols, "px-3 py-2 text-[8px] font-semibold tracking-[0.14em] text-white transition-colors duration-500")} style={{ backgroundColor: theme.primary }}>
            <span>{copy.columns.description}</span>
            <span className="text-center">{copy.columns.qty}</span>
            <span className="text-right">{copy.columns.rate}</span>
            <span className="text-right">{copy.columns.amount}</span>
          </div>
          {s.items.map((item, i) => {
            const t = s.typingRow?.index === i ? s.typingRow : null;
            const qty = t ? t.qty : item.qty;
            const rate = t ? t.rate : item.rate;
            return (
              <div
                key={i}
                className={cn(cols, "items-start px-3 py-2", s.striped ? (i % 2 ? "bg-[#F3F6F9]" : "") : i > 0 && "border-t border-[#EEF0F3]")}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {t ? t.name || <span className="font-normal text-[#B5BDC7]">{copy.itemPlaceholder}</span> : item.name}
                    {t && <span className="ml-px inline-block h-2.5 w-px translate-y-0.5 animate-pulse bg-green" />}
                  </p>
                  <p className="truncate text-[8.5px] text-[#6B7280]">{t ? "" : item.detail}</p>
                </div>
                <span className="text-center">{qty ?? "-"}</span>
                <span className="text-right tabular-nums">{rate !== undefined ? money(rate) : "-"}</span>
                <span className="text-right font-semibold tabular-nums">{qty !== undefined && rate !== undefined ? money(qty * rate) : "-"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className={cn(mark("totals"), "mt-2 ml-auto w-[230px] py-1")}>
        <div className="flex justify-between py-0.5">
          <span className="text-[#4B5563]">{copy.subtotal}</span>
          <span className="tabular-nums">{money(sum.subtotal)}</span>
        </div>
        {s.discount && (
          <div className="flex justify-between py-0.5">
            <span className="text-[#4B5563]">{copy.discount}</span>
            <span className="text-green tabular-nums">-{money(sum.discount)}</span>
          </div>
        )}
        {s.vat && (
          <div className="flex justify-between py-0.5">
            <span className="text-[#4B5563]">{copy.vat}</span>
            <span className="tabular-nums">{money(sum.vat)}</span>
          </div>
        )}
        <div
          className="mt-1.5 flex items-center justify-between px-3 py-2.5 text-white transition-[background-color,border-radius] duration-500"
          style={{ backgroundColor: theme.primary, borderRadius: radius }}
        >
          <span className="text-[8px] font-semibold tracking-[0.16em]">{copy.total[kind]}</span>
          <span className="text-[16px] font-bold tabular-nums">
            {money(sum.total)}
            {s.currencyCode && <span className="ml-1 text-[8.5px] font-medium">GBP</span>}
          </span>
        </div>
      </div>

      {/* Payment details */}
      {s.payment && !estimate && (
        <div className={cn(mark("payment"), "mt-3 py-1")}>
          <p className={label}>{copy.paymentDetails}</p>
          <p className="text-[#4B5563]">{copy.bank}</p>
        </div>
      )}

      {/* Notes, terms, signature */}
      <div className="mt-3 grid grid-cols-[1fr_1fr_150px] gap-4">
        <div className={cn(mark("notes"), "py-1")}>
          <p className={label}>{copy.notesLabel}</p>
          <p className={cn("leading-snug", s.notes ? "text-[#4B5563]" : placeholder)}>{s.notes || copy.addNote}</p>
        </div>
        <div className={cn(mark("terms"), "py-1")}>
          <p className={label}>{copy.termsLabel}</p>
          <p className={cn("leading-snug", s.terms ? "text-[#4B5563]" : placeholder)}>{s.terms || copy.addTerms}</p>
        </div>
        <div className={cn(mark("signature"), "py-1 text-right")}>
          <div className="flex h-[34px] items-end justify-end">
            <SignatureStroke progress={s.signature} className="h-[32px] w-auto" />
          </div>
          <div className="border-t border-[#D1D5DB] pt-1 text-[8px] font-semibold tracking-[0.14em] text-[#4B5563]">{copy.signature}</div>
        </div>
      </div>
    </div>
  );
}
