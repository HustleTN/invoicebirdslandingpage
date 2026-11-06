"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { FileText, Send } from "lucide-react";

import { cn } from "@/lib/cn";
import { useLoopClock } from "@/lib/use-loop-clock";

import type { FormatId } from "./data";
import {
  ClientField,
  CurrencyField,
  FormatOptions,
  FormatSelector,
  IncomingNotice,
  InvoicePaper,
  XmlPanel,
  type InvoiceDates,
  type Mode,
} from "./einvoice-ui";

/* Auto-play loop, used until the visitor picks a format themselves. */
const LOOP_MS = 14_000;
const EINVOICE_FROM = 3_000;
const EINVOICE_UNTIL = 11_000;
const NOTICE_FROM = 5_500;
const NOTICE_UNTIL = 13_500;
const FINAL_FRAME = 7_000;

/* Desktop canvas geometry in design pixels; scaled with CSS `zoom`. */
const CANVAS_WIDTH = 1216;
const SIDEBAR_WIDTH = 300;
const PAPER_WIDTH = 420;
const PREVIEW_WIDTH = CANVAS_WIDTH - SIDEBAR_WIDTH;
const PAPER_CENTER_SHIFT = (PREVIEW_WIDTH - PAPER_WIDTH) / 2 - 40;

const subscribeNever = () => () => {};

function computeDates(): InvoiceDates {
  const issue = new Date();
  const due = new Date(issue);
  due.setDate(issue.getDate() + 14);
  const display = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "short", year: "numeric" });
  const iso = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return { issued: display.format(issue), due: display.format(due), issueIso: iso(issue), dueIso: iso(due) };
}

const FALLBACK_DATES: InvoiceDates = { issued: "Today", due: "In 14 days", issueIso: "YYYY-MM-DD", dueIso: "YYYY-MM-DD" };
let cachedDates: InvoiceDates | null = null;

/** Real dates on the client; neutral labels during prerender so hydration matches. */
function useInvoiceDates() {
  return useSyncExternalStore(
    subscribeNever,
    () => (cachedDates ??= computeDates()),
    () => FALLBACK_DATES,
  );
}

function SettingsLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-[#6B7280] uppercase">{children}</p>;
}

function DeliverySettings({ mode, format, onFormat, compact = false }: { mode: Mode; format: FormatId; onFormat: (format: FormatId) => void; compact?: boolean }) {
  return mode === "einvoice" ? (
    <div key="einvoice" className="animate-fade-in">
      <SettingsLabel>E-invoice format</SettingsLabel>
      <FormatOptions format={format} onChange={onFormat} compact={compact} />
    </div>
  ) : (
    <div key="regular" className="animate-fade-in">
      <SettingsLabel>Delivery</SettingsLabel>
      <div className="flex items-center gap-2.5 rounded-xl border border-[#E6EAEF] px-3 py-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-surface text-navy">
          <FileText size={14} />
        </span>
        <div>
          <p className="text-[12.5px] font-semibold text-navy">PDF by email</p>
          <p className="text-[11px] text-[#6B7280]">Your usual invoice layout</p>
        </div>
      </div>
    </div>
  );
}

export function EInvoiceDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoopClock(ref, { loopEnd: LOOP_MS, finalFrame: FINAL_FRAME });
  const dates = useInvoiceDates();

  const [choice, setChoice] = useState<Mode | null>(null);
  const [format, setFormat] = useState<FormatId>("peppol");

  const mode: Mode = choice ?? (ms >= EINVOICE_FROM && ms < EINVOICE_UNTIL ? "einvoice" : "regular");
  const noticeShown = choice !== null || (ms >= NOTICE_FROM && ms < NOTICE_UNTIL);
  const einvoice = mode === "einvoice";

  const pickFormat = (next: FormatId) => {
    setFormat(next);
    setChoice("einvoice");
  };

  const sendLabel = einvoice ? "Send e-invoice" : "Send invoice";

  return (
    <div ref={ref}>
      <p className="sr-only">
        {einvoice
          ? `Showing invoice INV-842 as an e-invoice in ${format === "zugferd" ? "ZUGFeRD / Factur-X, a PDF with embedded XML" : "structured UBL XML"}, generated from the same invoice data.`
          : "Showing invoice INV-842 as a regular PDF invoice."}
      </p>

      {/* Desktop */}
      <div className="hidden lg:block lg:[zoom:0.79] min-[1152px]:[zoom:0.895] xl:[zoom:1]">
        <div
          className="mx-auto overflow-hidden rounded-3xl border border-[#E3E7EC] bg-white text-left text-navy shadow-[0_24px_70px_rgba(10,37,64,0.08)]"
          style={{ width: CANVAS_WIDTH }}
        >
          <div className="flex h-16 items-center justify-between border-b border-[#EEF1F4] px-6">
            <div className="flex items-center gap-2.5">
              <span className="text-[15px] font-semibold">INV-842</span>
              <span className="rounded-md bg-[#F1F3F5] px-2 py-0.5 text-[11px] font-medium text-[#4B5563]">Draft</span>
              <span className="text-[13px] text-[#6B7280]">· {einvoice ? "E-invoice" : "Invoice"} for Northlight Logistics</span>
            </div>
            <FormatSelector mode={mode} onChange={setChoice} className="w-[330px]" />
            <span className="flex items-center gap-1.5 rounded-lg bg-green px-3.5 py-2 text-[13px] font-semibold text-white" aria-hidden="true">
              <Send size={14} /> {sendLabel}
            </span>
          </div>

          <div className="flex" style={{ height: 580 }}>
            <div className="space-y-5 border-r border-[#EEF1F4] p-5" style={{ width: SIDEBAR_WIDTH }}>
              <div>
                <SettingsLabel>Client</SettingsLabel>
                <ClientField />
              </div>
              <div>
                <SettingsLabel>Currency</SettingsLabel>
                <CurrencyField />
              </div>
              <DeliverySettings mode={mode} format={format} onFormat={pickFormat} />
            </div>

            <div className="relative flex-1 overflow-hidden bg-[#F3F5F8]" aria-hidden="true">
              <div
                className="absolute top-7 left-10 transition-transform duration-700 ease-in-out"
                style={{ width: PAPER_WIDTH, transform: `translateX(${einvoice ? 0 : PAPER_CENTER_SHIFT}px)` }}
              >
                <InvoicePaper mode={mode} format={format} dates={dates} />
              </div>

              <div
                className={cn(
                  "absolute top-10 right-10 w-[400px] transition-all duration-700 ease-out",
                  einvoice ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0",
                )}
              >
                {einvoice && <XmlPanel format={format} dates={dates} />}
              </div>

              <div
                className={cn(
                  "absolute right-10 bottom-7 w-[340px] transition-all duration-700 ease-out",
                  noticeShown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
              >
                <IncomingNotice />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and tablet */}
      <div className="space-y-4 lg:hidden">
        <div className="rounded-3xl border border-[#E3E7EC] bg-white p-4 text-left text-navy shadow-[0_18px_50px_rgba(10,37,64,0.07)] sm:p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="text-[15px] font-semibold">INV-842</span>
            <span className="rounded-md bg-[#F1F3F5] px-2 py-0.5 text-[11px] font-medium text-[#4B5563]">Draft</span>
          </div>
          <FormatSelector mode={mode} onChange={setChoice} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <SettingsLabel>Client</SettingsLabel>
              <ClientField />
            </div>
            <div>
              <SettingsLabel>Currency</SettingsLabel>
              <CurrencyField />
            </div>
          </div>
          <div className="mt-4">
            <DeliverySettings mode={mode} format={format} onFormat={pickFormat} compact />
          </div>
        </div>

        <div aria-hidden="true" className="space-y-4">
          <div className="rounded-3xl bg-[#F3F5F8] p-3 sm:p-5">
            <InvoicePaper mode={mode} format={format} dates={dates} />
          </div>
          {einvoice && (
            <div className="animate-fade-in">
              <XmlPanel format={format} dates={dates} />
            </div>
          )}
          <IncomingNotice
            className={cn("transition-all duration-700", noticeShown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
          />
        </div>
      </div>
    </div>
  );
}
