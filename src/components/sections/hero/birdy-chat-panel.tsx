import Image from "next/image";
import {
  ArrowUp,
  Bookmark,
  ChartNoAxesColumn,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  History,
  Mail,
  Mic,
  X,
  type LucideIcon,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { DemoCursor } from "./demo-cursor";
import { BUSINESS, CLIENT, ITEMS, money, REQUEST, SUBTOTAL, TOTAL, VAT, type DemoFrame, type InvoiceDates } from "./demo-timeline";
import { TypingCaret } from "./typing-caret";

const MONTHLY_REQUESTS = 35;

const SUGGESTIONS: { icon: LucideIcon; label: Localized<string> }[] = [
  { icon: FileText, label: { en: "Create an invoice for a client", fr: "Créer une facture pour un client" } },
  { icon: Clock, label: { en: "What's overdue right now?", fr: "Quelles factures sont en retard ?" } },
  { icon: ChartNoAxesColumn, label: { en: "How is this month going?", fr: "Comment se passe ce mois-ci ?" } },
  { icon: Bookmark, label: { en: "Log an expense", fr: "Enregistrer une dépense" } },
];

const en = {
  tryAsking: "Try asking",
  invoice: "Invoice",
  sent: "Sent",
  draft: "Draft",
  subtotal: "Subtotal",
  vat: "VAT 20%",
  total: "Total",
  due: (date: string) => `Due ${date}`,
  open: "Open",
  download: "Download PDF",
  send: "Send",
  ready: "Done. Your draft is ready to review:",
  drafting: "Drafting INV-822 for you…",
  billedTo: "Billed to",
  recovery: "Recovery",
  towing: (miles: number) => `Towing ${miles} miles`,
  requestsLeft: (left: number, total: number) => `${left} of ${total} Birdy requests left this month`,
  placeholder: "Message Birdy",
  hint: "Enter to send, Shift + Enter for a new line",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    tryAsking: "Essayez par exemple",
    invoice: "Facture",
    sent: "Envoyée",
    draft: "Brouillon",
    subtotal: "Sous-total",
    vat: "TVA 20 %",
    total: "Total",
    due: (date) => `Échéance : ${date}`,
    open: "Ouvrir",
    download: "Télécharger",
    send: "Envoyer",
    ready: "C’est fait. Voici votre brouillon à relire :",
    drafting: "Je prépare la facture INV-822…",
    billedTo: "Client :",
    recovery: "Dépannage",
    towing: (miles) => `Remorquage sur ${miles} miles`,
    requestsLeft: (left, total) => `Il reste ${left} requêtes sur ${total} ce mois-ci`,
    placeholder: "Écrire à Birdy",
    hint: "Entrée pour envoyer, Maj + Entrée pour aller à la ligne",
  },
};

function Birdy({ size }: { size: number }) {
  return <Image src="/images/bird-wave.webp" alt="" width={181} height={160} style={{ width: size, height: "auto" }} />;
}

function Step({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <li className="flex animate-fade-in items-center gap-1.5">
      <Check size={12} strokeWidth={2.5} className="shrink-0 text-green" />
      {children}
    </li>
  );
}

function Greeting({ greeting }: { greeting: string }) {
  const locale = useLocale();

  return (
    <div className="pb-2">
      <div className="flex items-center gap-3 px-1">
        <Birdy size={84} />
        <p className="text-[19px] leading-tight font-bold tracking-tight text-navy">
          {greeting},
          <br />
          {BUSINESS.shortName}.
        </p>
      </div>
      <p className="mt-4 mb-1 text-[11px] text-[#6B7280]">{COPY[locale].tryAsking}</p>
      <ul className="divide-y divide-[#EEF0F3] border-y border-[#EEF0F3]">
        {SUGGESTIONS.map(({ icon: Icon, label }) => (
          <li key={label.en} className="flex items-center gap-2.5 py-2.5 text-[12.5px] text-[#1F2937]">
            <Icon size={15} strokeWidth={1.6} className="text-[#4B5563]" />
            <span className="flex-1">{label[locale]}</span>
            <ChevronRight size={13} className="text-[#9CA3AF]" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The invoice summary Birdy posts when a draft is ready, with quick actions. */
function InvoiceSummaryCard({ frame, dates }: { frame: DemoFrame; dates: InvoiceDates }) {
  const locale = useLocale();
  const t = COPY[locale];

  return (
    <div className="mt-2 animate-fade-in overflow-hidden rounded-xl border border-[#E3E7EC] bg-white text-[11px]">
      <div className="px-3 pt-2.5 pb-2">
        <div className="flex items-center justify-between">
          <p className="text-[#6B7280]">
            {t.invoice} <span className="ml-0.5 text-[13px] font-bold text-[#111827]">INV-822</span>
          </p>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
              frame.sent ? "bg-green-soft text-green" : "bg-[#F1F3F5] text-[#4B5563]",
            )}
          >
            {frame.sent ? t.sent : t.draft}
          </span>
        </div>
        <p className="mt-1 text-[#1F2937] uppercase">{CLIENT.name}</p>
      </div>
      <div className="space-y-1.5 border-t border-[#EEF0F3] px-3 py-2">
        {ITEMS.map((item) => (
          <div key={item.description.en}>
            <div className="flex justify-between gap-2">
              <span className="truncate font-semibold">{item.description[locale]}</span>
              <span className="tabular-nums">{money(item.qty * item.rate, locale)}</span>
            </div>
            <p className="text-[10px] text-[#6B7280]">
              {item.qty} × {money(item.rate, locale)}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-1 border-t border-[#EEF0F3] px-3 py-2">
        <div className="flex justify-between text-[#6B7280]">
          <span>{t.subtotal}</span>
          <span className="text-[#111827] tabular-nums">{money(SUBTOTAL, locale)}</span>
        </div>
        <div className="flex justify-between text-[#6B7280]">
          <span>{t.vat}</span>
          <span className="text-[#111827] tabular-nums">{money(VAT, locale)}</span>
        </div>
        <div className="flex items-baseline justify-between font-bold">
          <span className="text-[11.5px]">{t.total}</span>
          <span className="text-[14px] tabular-nums">{money(TOTAL, locale)}</span>
        </div>
        <p className="text-[10px] text-[#6B7280]">{t.due(dates.due)}</p>
      </div>
      <div className="flex items-center gap-3 border-t border-[#EEF0F3] bg-[#FAFBFC] px-3 py-2 text-[11px] font-medium text-[#1F2937]">
        <span>{t.open}</span>
        <span className="flex items-center gap-1">
          <Download size={12} /> {t.download}
        </span>
        <span className="relative ml-auto">
          <span
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-white transition-colors",
              frame.chatSendClick ? "bg-green-hover" : "bg-green",
            )}
          >
            {frame.sent ? <Check size={12} /> : <Mail size={12} />}
            {frame.sent ? t.sent : t.send}
          </span>
          <DemoCursor visible={frame.chatSendCursor} clicking={frame.chatSendClick} className="top-4 left-9" />
        </span>
      </div>
    </div>
  );
}

function Conversation({ frame, dates }: { frame: DemoFrame; dates: InvoiceDates }) {
  const locale = useLocale();
  const t = COPY[locale];

  return (
    <div className="space-y-3 pb-1 text-[12px] leading-[1.5]">
      <p className="ml-8 animate-fade-in rounded-2xl rounded-br-md bg-surface px-3 py-2 text-[#1F2937]">{REQUEST[locale]}</p>

      <div className="flex gap-2">
        <span className="mt-0.5 shrink-0">
          <Birdy size={24} />
        </span>
        <div className="min-w-0 flex-1 text-[#1F2937]">
          {frame.thinking ? (
            <span className="inline-flex gap-1 py-2">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="size-1.5 animate-bounce rounded-full bg-[#9CA3AF]"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </span>
          ) : (
            <>
              <p>{frame.draftReady ? t.ready : t.drafting}</p>
              <ul className="mt-1.5 space-y-1 text-[11.5px] text-[#374151]">
                <Step show={frame.clientReady}>{t.billedTo} {CLIENT.name}</Step>
                <Step show={frame.priceReady}>{t.recovery} · {money(ITEMS[0].rate, locale)}</Step>
                <Step show={frame.secondItemReady}>
                  {t.towing(ITEMS[1].qty)} · {money(ITEMS[1].qty * ITEMS[1].rate, locale)}
                </Step>
                <Step show={frame.vatReady}>{t.vat} · {money(VAT, locale)}</Step>
                <Step show={frame.dueReady}>{t.due(dates.due)}</Step>
              </ul>
              {frame.draftReady && <InvoiceSummaryCard frame={frame} dates={dates} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Compact recreation of the Birdy assistant panel. */
export function BirdyChatPanel({ frame, dates, greeting }: { frame: DemoFrame; dates: InvoiceDates; greeting: string }) {
  const t = COPY[useLocale()];
  const hasDraftText = frame.draftInput.length > 0;

  return (
    <div className="flex h-[500px] w-[340px] flex-col overflow-hidden rounded-2xl border border-[#E3E7EC] bg-white text-left text-[#111827] shadow-[0_12px_32px_rgba(10,37,64,0.09),0_2px_6px_rgba(10,37,64,0.04)]">
      <div className="flex items-center gap-2.5 px-4 pt-3 pb-2.5">
        <Birdy size={30} />
        <div className="flex-1">
          <p className="text-[13.5px] font-semibold">Birdy</p>
          <p className="text-[10.5px] text-[#6B7280]">{t.requestsLeft(frame.requestsLeft, MONTHLY_REQUESTS)}</p>
        </div>
        <History size={16} className="text-[#374151]" />
        <X size={16} className="text-[#374151]" />
      </div>
      <div className="h-0.5 bg-[#EEF0F3]">
        <div
          className="h-full bg-navy transition-[width] duration-500"
          style={{ width: `${(frame.requestsLeft / MONTHLY_REQUESTS) * 100}%` }}
        />
      </div>

      {/* Newest messages stay pinned to the bottom; older ones scroll out of view, as in the app. */}
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-4 transition-opacity duration-500",
          frame.resetting && "opacity-0",
        )}
      >
        {frame.requestSent ? <Conversation frame={frame} dates={dates} /> : <Greeting greeting={greeting} />}
      </div>

      <div className="border-t border-[#EEF0F3] px-3 pt-3 pb-2.5">
        <div
          className={cn(
            "flex items-end gap-2 rounded-2xl border px-3 py-2.5 transition-colors",
            frame.draftTyping ? "border-[#9CA3AF]" : "border-[#D9DDE2]",
          )}
        >
          <p className="min-h-[18px] flex-1 text-[12px] leading-[1.5]">
            {hasDraftText ? (
              <span className="line-clamp-3 text-[#1F2937]">
                {frame.draftInput}
                {frame.draftTyping && <TypingCaret />}
              </span>
            ) : (
              <span className="text-[#9CA3AF]">{t.placeholder}</span>
            )}
          </p>
          <Mic size={15} className="mb-1 text-[#4B5563]" />
          <span className="relative">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full transition-colors",
                hasDraftText ? "bg-navy text-white" : "bg-[#E5E7EB] text-[#9CA3AF]",
              )}
            >
              <ArrowUp size={14} />
            </span>
            <DemoCursor visible={frame.sendRequestCursor} clicking={frame.sendRequestClick} className="top-3.5 left-3.5" />
          </span>
        </div>
        <p className="mt-1.5 px-1 text-[9.5px] text-[#9CA3AF]">{t.hint}</p>
      </div>
    </div>
  );
}
