"use client";

import { useRef } from "react";
import { Check, Lock } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { FitCanvas } from "@/components/ui/fit-canvas";
import { cn } from "@/lib/cn";
import { INTL_LOCALE, type Locale, type Localized } from "@/lib/i18n";
import { useLoopClock } from "@/lib/use-loop-clock";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** Other sample invoices in the status panel; the paid one lands above them each loop. */
const STATUS = [
  { client: "Harbor & Co.", amount: 640, status: "sent", tone: "bg-blue-soft text-blue" },
  { client: "Fieldnote Studio", amount: 1_150, status: "overdue", tone: "bg-[#FDECEC] text-[#A61B1B]" },
  { client: "Northbeam", amount: 420, status: "paid", tone: "bg-green-soft text-green" },
] as const;

const eur = (locale: Locale) => (amount: number) =>
  new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const en = {
  summary:
    "Illustration: your client opens invoice INV-1048 for Lumen Labs (design retainer €1,200, website support €300, VAT 20% €300, €1,800 due in 30 days) and pays with the Pay invoice button. A confirmation shows the €1,800 payment received online today, and your invoice list shows Harbor & Co. €640 sent, Fieldnote Studio €1,150 overdue and Northbeam €420 paid.",
  invoice: "Invoice",
  client: "Client",
  items: ["Design retainer", "Website support"],
  vat: "VAT 20%",
  totalDue: "Total due",
  dueIn: "Due in 30 days",
  pay: "Pay invoice",
  stripe: "Payments via Stripe",
  received: "Payment received",
  paidSuccessfully: "paid successfully",
  paidToday: "Paid online today",
  invoiceStatus: "Invoice status",
  status: { sent: "Sent", overdue: "Overdue", paid: "Paid" },
  cardHolder: "Card holder",
  expires: "Expires",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    summary:
      "Illustration : votre client ouvre la facture INV-1048 de Lumen Labs (forfait design 1 200 €, maintenance du site 300 €, TVA 20 % 300 €, 1 800 € à régler sous 30 jours) et effectue le paiement avec le bouton « Payer la facture ». Une confirmation indique le paiement de 1 800 € reçu en ligne aujourd’hui, et votre liste de factures affiche Harbor & Co. 640 € envoyée, Fieldnote Studio 1 150 € en retard et Northbeam 420 € payée.",
    invoice: "Facture",
    client: "Client",
    items: ["Forfait design", "Maintenance du site"],
    vat: "TVA 20 %",
    totalDue: "Total dû",
    dueIn: "Échéance à 30 jours",
    pay: "Payer la facture",
    stripe: "Paiements via Stripe",
    received: "Paiement reçu",
    paidSuccessfully: "payés avec succès",
    paidToday: "Payé en ligne aujourd’hui",
    invoiceStatus: "Statut des factures",
    status: { sent: "Envoyée", overdue: "En retard", paid: "Payée" },
    cardHolder: "Titulaire",
    expires: "Expire",
  },
};

/** A flat Visa card in brand blue: chip, contactless mark, masked number. Decorative. */
function PaymentCard() {
  const copy = COPY[useLocale()];
  return (
    <div className="relative aspect-[1.586] -rotate-6 overflow-hidden rounded-xl bg-blue p-[7%] text-white">
      <span className="absolute -top-[30%] -right-[18%] size-[75%] rounded-full bg-white/[0.06]" />
      <span className="absolute -right-[28%] -bottom-[45%] size-[85%] rounded-full bg-white/[0.05]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          {/* chip */}
          <svg viewBox="0 0 36 28" className="w-[19%]">
            <rect x="0.5" y="0.5" width="35" height="27" rx="5" fill="#D9E2EC" stroke="#AFC0D2" />
            <path d="M12 0.5v27M24 0.5v27M0.5 10h11.5M24 10h11.5M0.5 18h11.5M24 18h11.5M12 14h12" stroke="#AFC0D2" />
          </svg>
          {/* contactless */}
          <svg viewBox="0 0 20 20" className="w-[11%]" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 6.5a5 5 0 0 1 0 7M9.5 4a8.5 8.5 0 0 1 0 12M13 1.5a12 12 0 0 1 0 17" opacity="0.9" />
          </svg>
        </div>
        <p className="font-mono text-[12.5px] tracking-[0.08em] whitespace-nowrap tabular-nums">•••• •••• •••• 4242</p>
        <div className="flex items-end gap-4">
          <div className="leading-tight">
            <p className="text-[7.5px] tracking-[0.12em] whitespace-nowrap text-white/60 uppercase">{copy.cardHolder}</p>
            <p className="text-[11px] font-semibold tracking-[0.05em] whitespace-nowrap">LUMEN LABS</p>
          </div>
          <div className="leading-tight">
            <p className="text-[7.5px] tracking-[0.12em] whitespace-nowrap text-white/60 uppercase">{copy.expires}</p>
            <p className="text-[11px] font-semibold tabular-nums">08/29</p>
          </div>
          <p className="ml-auto text-[21px] leading-none font-black tracking-[-0.02em] italic">VISA</p>
        </div>
      </div>
    </div>
  );
}

/** A dashed guide that draws along x or y, then keeps its dashes flowing in the payment's direction. */
function Connector({ on, delay, axis, className }: { on: boolean; delay: number; axis: "x" | "y"; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("block overflow-hidden", className)}>
      <span
        className={cn(
          "block h-full w-full transition-transform duration-500 ease-out motion-reduce:animate-none",
          axis === "x" ? "origin-left animate-dash-x" : "origin-top animate-dash-y",
          on ? "scale-100" : axis === "x" ? "scale-x-0" : "scale-y-0",
        )}
        style={{
          transitionDelay: `${delay}ms`,
          backgroundImage: `repeating-linear-gradient(${axis === "x" ? "to right" : "to bottom"}, rgb(17 64 119 / 0.55) 0 5px, transparent 5px 10px)`,
          backgroundSize: axis === "x" ? "10px 1px" : "1px 10px",
        }}
      />
    </span>
  );
}

/* The loop, in ms: everything plays in on the delays below, holds, then clears before replaying. */
const LOOP = 8_000;
const CLEAR_AT = 6_900;

/**
 * The payment story as one composition: the client's invoice, the payment
 * confirmation it leads to, and where that lands among other invoices.
 * Loops while on screen: plays in, holds, clears, replays. Reduced motion shows the finished state.
 */
export function PaymentVisual() {
  const locale = useLocale();
  const copy = COPY[locale];
  const money = eur(locale);
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const ms = useLoopClock(ref, { loopEnd: LOOP, finalFrame: CLEAR_AT - 1 });
  const on = ms >= 150 && ms < CLEAR_AT;
  const landed = ms >= 2_700 && ms < CLEAR_AT;
  const t = (ms: number) => (reduceMotion ? 0 : ms);
  const appear = (ms: number) => ({
    className: cn("transition-[opacity,translate] duration-700 ease-out", on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"),
    style: { transitionDelay: `${t(ms)}ms` },
  });

  return (
    <div ref={ref} className="relative">
      <p className="sr-only">{copy.summary}</p>

      {/* One composition at every size, on a 580px canvas scaled down on small screens */}
      <FitCanvas width={580} fallback="max-sm:[zoom:0.6]">
      <div aria-hidden="true">
        {/* 1. The invoice the client sees, with the confirmation it leads to */}
        <div className="relative">
          <div {...appear(0)} className={cn(appear(0).className, "w-[76%] rounded-2xl border border-line bg-white")}>
            <div className="px-7 pt-6 pb-5">
              <p className="text-[13px] text-muted">{copy.invoice} INV-1048</p>
              <p className="mt-1 text-[13px] text-muted">
                {copy.client} <span className="ml-1 text-[17px] font-semibold text-navy">Lumen Labs</span>
              </p>
            </div>
            <div className="space-y-2.5 border-t border-line px-7 py-5 text-[15px]">
              {[
                [copy.items[0], money(1_200)],
                [copy.items[1], money(300)],
              ].map(([item, amount]) => (
                <div key={item} className="flex justify-between gap-4">
                  <span className="text-[#374151]">{item}</span>
                  <span className="tabular-nums">{amount}</span>
                </div>
              ))}
              <div className="flex justify-between gap-4 text-muted">
                <span>{copy.vat}</span>
                <span className="tabular-nums">{money(300)}</span>
              </div>
            </div>
            <div className="border-t border-line px-7 pt-5 pb-6">
              <p className="text-[13px] text-muted">{copy.totalDue}</p>
              <p className="mt-1 text-[44px] leading-none font-semibold tracking-[-0.04em] tabular-nums">{money(1_800)}</p>
              <p className="mt-2 text-[14px] text-muted">{copy.dueIn}</p>
              <div className="mt-6 flex items-center">
                <span
                  className={cn(
                    "inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-green px-6 text-[15px] font-semibold text-white transition-transform duration-200",
                    on && !reduceMotion && "animate-[press_420ms_ease-in-out_both]",
                  )}
                  style={{ animationDelay: `${t(700)}ms` }}
                >
                  {copy.pay}
                </span>
                {/* the payment, travelling to the confirmation */}
                <Connector on={on} delay={t(1000)} axis="x" className="ml-3 h-px flex-1" />
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-muted">
                <Lock size={13} /> {copy.stripe}
              </p>
            </div>
          </div>

          {/* 2. The confirmation, floating over the invoice's lower right corner */}
          <div
            {...appear(1300)}
            className={cn(
              appear(1300).className,
              "absolute right-0 -bottom-12 w-[50%] rounded-2xl border border-green/30 bg-white p-5",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green text-white">
                <Check size={18} strokeWidth={3} />
              </span>
              <div>
                <p className="font-semibold whitespace-nowrap">{copy.received}</p>
                <p className="text-[13px] text-muted">Lumen Labs</p>
              </div>
            </div>
            <p className="mt-4 text-[15px] text-navy">
              <span className="font-semibold tabular-nums">{money(1_800)}</span> {copy.paidSuccessfully}
            </p>
            <p className="mt-1 text-[13px] font-medium text-green">{copy.paidToday}</p>
          </div>
        </div>

        {/* 3. Where it lands: the invoice list */}
        <div className="relative mt-28">
          <Connector on={on} delay={t(1800)} axis="y" className="absolute -top-12 right-[24%] h-12 w-px" />
          {/* The client's card, used to pay: tucked over the status panel's corner */}
          <div {...appear(1100)} className={cn(appear(1100).className, "absolute -top-[86px] left-[2%] z-10 w-[36%] min-w-[210px]")}>
            <PaymentCard />
          </div>
          <div {...appear(2000)} className={cn(appear(2000).className, "ml-auto w-[82%] rounded-2xl border border-line bg-white")}>
            <p className="px-5 pt-4 pb-2 text-right text-[13px] font-semibold text-navy">{copy.invoiceStatus}</p>
            <ul className="divide-y divide-line border-t border-line">
              {/* the payment just made, sliding in at the top of the list */}
              <li
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                  landed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <span className="overflow-hidden">
                  <span className="flex items-center gap-4 bg-green-soft/60 px-5 py-3 text-[15px]">
                    <span className="min-w-0 flex-1 truncate font-semibold">Lumen Labs</span>
                    <span className="tabular-nums">{money(1_800)}</span>
                    <span className="w-[70px] shrink-0 rounded-full bg-green-soft px-2 py-0.5 text-center text-[12px] font-medium text-green">
                      {copy.status.paid}
                    </span>
                  </span>
                </span>
              </li>
              {STATUS.map((row) => (
                <li key={row.client} className="flex items-center gap-4 px-5 py-3 text-[15px]">
                  <span className="min-w-0 flex-1 truncate">{row.client}</span>
                  <span className="tabular-nums">{money(row.amount)}</span>
                  <span className={cn("w-[70px] shrink-0 rounded-full px-2 py-0.5 text-center text-[12px] font-medium", row.tone)}>
                    {copy.status[row.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      </FitCanvas>
    </div>
  );
}
