import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { gbp, ITEMS, THEMES, totals, type Look } from "./timeline";

const en = {
  noLogo: "No logo yet",
  invoice: "INVOICE",
  invoiceNo: "Invoice No.",
  terms: "Terms",
  net14: "Net 14",
  from: "FROM",
  billTo: "BILL TO",
  vatReg: "VAT Reg.",
  description: "DESCRIPTION",
  qty: "QTY",
  rate: "RATE",
  amount: "AMOUNT",
  subtotal: "Subtotal",
  discount: "Discount (10%)",
  vat: "VAT (20%)",
  totalDue: "TOTAL DUE",
  notes: "NOTES",
  thanks: "Thank you for choosing Ridgeway. Payment by bank transfer within 14 days.",
  authorized: "AUTHORIZED",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    noLogo: "Pas encore de logo",
    invoice: "FACTURE",
    invoiceNo: "N° de facture",
    terms: "Conditions",
    net14: "14 jours net",
    from: "DE",
    billTo: "FACTURÉ À",
    vatReg: "N° TVA",
    description: "DÉSIGNATION",
    qty: "QTÉ",
    rate: "P.U.",
    amount: "MONTANT",
    subtotal: "Sous-total",
    discount: "Remise (10 %)",
    vat: "TVA (20 %)",
    totalDue: "NET À PAYER",
    notes: "NOTES",
    thanks: "Merci d’avoir choisi Ridgeway. Paiement par virement bancaire sous 14 jours.",
    authorized: "SIGNATAIRE AUTORISÉ",
  },
};

/** A hand-drawn signature, revealed by `progress` (0 to 1). */
export function Signature({ progress, className }: { progress: number; className?: string }) {
  return (
    <svg viewBox="0 0 160 48" fill="none" className={className} aria-hidden="true">
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

/** Text-only wordmark for the demo business. */
export function RidgewayLogo({ size = 1 }: { size?: number }) {
  return (
    <div className="leading-none" style={{ fontSize: `${size}em` }}>
      <p className="text-[21px] font-black tracking-[-0.02em] text-[#B91C1C] italic">RIDGEWAY</p>
      <p className="mt-1 text-[8px] font-bold tracking-[0.28em] text-[#1F2937]">TOWING &amp; RECOVERY</p>
    </div>
  );
}

const label = "mb-1.5 text-[8.5px] font-semibold tracking-[0.16em] text-[#8A94A3]";
const cols = "grid grid-cols-[1fr_44px_78px_84px] gap-2";

/** Collapses a row in and out smoothly. */
function Reveal({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("grid transition-all duration-500", show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

/** The invoice being customized: 560px wide, every look change applied live. */
export function InvoicePreview({ look }: { look: Look }) {
  const locale = useLocale();
  const t = COPY[locale];
  const money = gbp(locale);
  const theme = look.brand ? THEMES.brand : THEMES.plain;
  const radius = look.rounded ? 12 : 5;
  const sum = totals(look);

  return (
    <div className="w-[560px] rounded-xl border border-line bg-white shadow-[0_12px_40px_rgba(10,37,64,0.08),0_2px_6px_rgba(10,37,64,0.04)] px-9 pt-7 pb-6 font-[Helvetica,Arial,sans-serif] text-[11px] text-[#111827]">
      <div className={cn("transition-opacity duration-500", look.resetting ? "opacity-0" : "opacity-100")}>
        {/* Header: business name becomes the logo */}
        <div className="flex items-start justify-between">
          <div className="relative h-[46px] w-[230px]">
            <div className={cn("absolute inset-0 transition-all duration-500", look.logo ? "-translate-y-1 opacity-0" : "opacity-100")}>
              <p className="text-[15px] font-bold">Ridgeway Towing &amp; Recovery Ltd</p>
              <p className="mt-1 text-[10px] text-[#9CA3AF] italic">{t.noLogo}</p>
            </div>
            <div className={cn("absolute inset-0 pt-0.5 transition-all duration-500", look.logo ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}>
              <RidgewayLogo />
            </div>
          </div>
          <div className="text-right">
            <p className="text-[30px] leading-none font-bold tracking-[-0.02em] transition-colors duration-500" style={{ color: theme.primary }}>
              {t.invoice}
            </p>
            <dl className="mt-3 grid grid-cols-[auto_auto] justify-end gap-x-4 gap-y-1 text-[9.5px]">
              <dt className="text-[#6B7280]">{t.invoiceNo}</dt>
              <dd className="font-semibold">INV-1206</dd>
              <dt className="text-[#6B7280]">{t.terms}</dt>
              <dd>{t.net14}</dd>
            </dl>
          </div>
        </div>

        <div className="mt-4 h-[2px] rounded-full transition-colors duration-500" style={{ backgroundColor: theme.accent }} />

        {/* Parties */}
        <div className="mt-4 grid grid-cols-2 gap-8 leading-[1.55]">
          <div>
            <p className={label}>{t.from}</p>
            <p className="text-[11px] font-semibold">Ridgeway Towing &amp; Recovery Ltd</p>
            <p className="text-[#4B5563]">Unit 4, Brookfield Industrial Estate</p>
            <p className="text-[#4B5563]">Leeds LS11 5QR, United Kingdom</p>
            <p className="text-[#4B5563]">{t.vatReg} GB 318 4402 57</p>
          </div>
          <div>
            <p className={label}>{t.billTo}</p>
            <p className="text-[11px] font-semibold">Harbour Logistics Ltd</p>
            <p className="text-[#4B5563]">Dock Road</p>
            <p className="text-[#4B5563]">Hull HU9 1TA, United Kingdom</p>
            <p className="text-[#4B5563]">accounts@harbourlogistics.co.uk</p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4 overflow-hidden border border-[#E4E7EB] transition-[border-radius] duration-500" style={{ borderRadius: radius }}>
          <div
            className={cn(cols, "px-4 py-2.5 text-[8.5px] font-semibold tracking-[0.16em] text-white transition-colors duration-500")}
            style={{ backgroundColor: theme.primary }}
          >
            <span>{t.description}</span>
            <span className="text-center">{t.qty}</span>
            <span className="text-right">{t.rate}</span>
            <span className="text-right">{t.amount}</span>
          </div>
          {ITEMS.map((item, i) => (
            <div
              key={item.name.en}
              className={cn(
                cols,
                "items-start px-4 py-2.5 transition-colors duration-500",
                look.striped ? (i % 2 ? "bg-[#F3F6F9]" : "bg-white") : i > 0 ? "border-t border-[#EEF0F3]" : "",
              )}
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{item.name[locale]}</p>
                <p className="mt-0.5 truncate text-[9px] text-[#6B7280]">{item.detail[locale]}</p>
              </div>
              <span className="text-center">{item.qty}</span>
              <span className="text-right tabular-nums">{money(item.rate)}</span>
              <span className="text-right font-semibold tabular-nums">{money(item.qty * item.rate)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 ml-auto w-[250px]">
          <div className="flex justify-between py-1">
            <span className="text-[#4B5563]">{t.subtotal}</span>
            <span className="tabular-nums">{money(sum.subtotal)}</span>
          </div>
          <Reveal show={look.discount}>
            <div className="flex justify-between py-1">
              <span className="text-[#4B5563]">{t.discount}</span>
              <span className="text-green tabular-nums">-{money(sum.subtotal * 0.1)}</span>
            </div>
          </Reveal>
          <Reveal show={look.vat}>
            <div className="flex justify-between py-1">
              <span className="text-[#4B5563]">{t.vat}</span>
              <span className="tabular-nums">{money(sum.vat)}</span>
            </div>
          </Reveal>
          <div
            className="mt-2 flex items-center justify-between px-4 py-3 text-white transition-[background-color,border-radius] duration-500"
            style={{ backgroundColor: theme.primary, borderRadius: radius }}
          >
            <span className="text-[8.5px] font-semibold tracking-[0.18em]">{t.totalDue}</span>
            <span key={sum.total} className="animate-fade-in text-[18px] font-bold tabular-nums">
              {money(sum.total)}
            </span>
          </div>
        </div>

        {/* Notes and signature */}
        <div className="mt-4 grid grid-cols-2 items-end gap-8">
          <div>
            <p className={label}>{t.notes}</p>
            <p className="text-[#4B5563]">{t.thanks}</p>
          </div>
          <div className="text-right">
            <div className="flex h-[42px] items-end justify-end">
              <Signature progress={look.signed ? 1 : 0} className={cn("h-[40px] w-auto transition-opacity duration-500", look.signed ? "opacity-100" : "opacity-0")} />
            </div>
            <div className="mt-1 border-t border-[#D1D5DB] pt-1.5">
              <p className="text-[8.5px] font-semibold tracking-[0.16em] text-[#4B5563]">{t.authorized}</p>
              <p className="text-[9.5px] text-[#6B7280]">Mark Ridgeway</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
