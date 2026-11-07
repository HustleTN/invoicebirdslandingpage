"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck, Download, Eye, FileSignature, PenLine, Receipt, Send } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * Small, looping product previews for the upgrade popups: the feature itself instead of an illustration.
 * Each takes `ms` (time into its loop) so a static thumbnail can pass the final frame.
 */

const CARD = "rounded-xl border border-line bg-white shadow-[0_18px_40px_rgba(10,37,64,0.08),0_2px_6px_rgba(10,37,64,0.04)]";
const FLOAT = "rounded-xl border border-line bg-white shadow-[0_14px_32px_rgba(10,37,64,0.12)]";

/** 0 → 1 between `start` and `end`. */
function progress(ms: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (ms - start) / (end - start)));
}

/** Fast start, soft landing. */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function gbp(amount: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);
}

/** A chip that pops in with a little bounce once `shown` turns true. */
function chip(shown: boolean) {
  return shown ? "animate-chip-in" : "opacity-0";
}

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  // Keyed on the label, so each status change pops in fresh.
  return (
    <span key={String(children)} className={cn("inline-block animate-chip-in rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap", tone)}>
      {children}
    </span>
  );
}

/** Expanding ring behind an icon, to draw the eye to a change. */
function Ping({ className }: { className: string }) {
  return <span aria-hidden="true" className={cn("absolute inset-0 rounded-full animate-ping-soft", className)} />;
}

/** Grey text placeholder bars. */
function Lines({ widths }: { widths: string[] }) {
  return (
    <div className="space-y-1.5">
      {widths.map((width, i) => (
        <div key={i} className="h-[5px] rounded-full bg-[#E6EBF1]" style={{ width }} />
      ))}
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between", strong ? "font-semibold text-navy" : "text-muted")}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

/** The client's pointer, parked at an offset from its target and gliding onto it. */
function Cursor({ travel, pressed, visible }: { travel: number; pressed: boolean; visible: boolean }) {
  const t = easeOut(travel);
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("pointer-events-none absolute top-1/2 left-1/2 z-10 size-5 transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}
      style={{ transform: `translate(${(1 - t) * 150 - 2}px, ${(1 - t) * 80 - 2}px) scale(${pressed ? 0.82 : 1})` }}
    >
      <path d="M5 3l14 8.5-6.6 1.4L9.3 20 5 3z" fill="#0A2540" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* Proposal: sent, viewed, then the client clicks Accept and a contract is created from it. */

export const PROPOSAL_LOOP = 9400;
export const PROPOSAL_FINAL = 7400;

const PROPOSAL_EVENTS = [
  { at: 400, icon: Send, text: "Sent to Dana Price", meta: "09:12" },
  { at: 1800, icon: Eye, text: "Viewed 3 times", meta: "11:40" },
  { at: 4700, icon: CircleCheck, text: "Accepted", meta: "14:05" },
];

export function ProposalPreview({ ms }: { ms: number }) {
  const viewed = ms >= 1800;
  const travel = progress(ms, 2800, 3900);
  const pressed = ms >= 4200 && ms < 4400;
  const accepted = ms >= 4400;
  const cursorVisible = ms >= 2800 && ms < 5000;
  const contract = ms >= 6200;
  const status = accepted
    ? { tone: "bg-[#E2F5F2] text-[#1D7468]", label: "Accepted" }
    : viewed
      ? { tone: "bg-[#F0EBFE] text-[#6847C4]", label: "Viewed" }
      : { tone: "bg-[#E7F1FD] text-[#2A62A6]", label: "Sent" };

  return (
    <div className="relative w-[300px] pb-28">
      <div className={cn(CARD, "p-5")}>
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase">Proposal · P-014</span>
          <Pill tone={status.tone}>{status.label}</Pill>
        </div>
        <p className="mt-3 text-[16px] leading-snug font-semibold text-navy">Fleet recovery partnership 2027</p>
        <p className="mt-1 text-[11.5px] text-muted">For Harbour Logistics · by Ridgeway Towing</p>

        <p className="mt-4 text-[10.5px] font-semibold tracking-[0.06em] text-navy uppercase">Scope</p>
        <div className="mt-2">
          <Lines widths={["100%", "92%", "64%"]} />
        </div>

        <p className="mt-4 text-[10.5px] font-semibold tracking-[0.06em] text-navy uppercase">Pricing</p>
        <div className="mt-2 space-y-1.5 text-[11.5px]">
          <Row label="24/7 fleet recovery" value={gbp(9600)} />
          <Row label="Priority towing" value={gbp(3600)} />
          <Row label="Quarterly inspections" value={gbp(1200)} />
          <div className="border-t border-line pt-1.5">
            <Row label="Total" value={gbp(14400)} strong />
          </div>
        </div>

        <div className="relative mt-4">
          <div
            className={cn(
              "flex h-9 items-center justify-center gap-1.5 rounded-lg text-[12px] font-semibold transition-all duration-300",
              accepted ? "bg-green-soft text-navy" : travel === 1 ? "bg-green-hover text-white" : "bg-green text-white",
              pressed && "scale-[0.96]",
            )}
          >
            {accepted ? (
              <>
                <span className="relative flex">
                  {ms < 6000 && <Ping className="bg-green/60" />}
                  <CircleCheck size={14} className="relative text-green" aria-hidden="true" />
                </span>
                Accepted by Dana Price
              </>
            ) : (
              "Accept proposal"
            )}
          </div>
          <Cursor travel={travel} pressed={pressed} visible={cursorVisible} />
        </div>
      </div>

      {/* Client activity */}
      <div className={cn(FLOAT, "absolute bottom-0 -left-9 w-[214px] p-3")}>
        <p className="text-[10px] font-semibold tracking-[0.08em] text-muted uppercase">Client activity</p>
        <ul className="mt-2 space-y-2">
          {PROPOSAL_EVENTS.map(({ at, icon: Icon, text, meta }) => {
            const live = text === "Viewed 3 times" ? viewed && !accepted : text === "Accepted" ? accepted && ms < 6400 : false;
            return (
              <li key={text} className={cn("flex items-center gap-2 text-[11.5px]", ms >= at ? "animate-rise" : "opacity-0")}>
                <span
                  className={cn(
                    "relative flex size-6 shrink-0 items-center justify-center rounded-full",
                    text === "Accepted" ? "bg-green-soft text-green" : "bg-surface text-navy",
                  )}
                >
                  {live && <Ping className={text === "Accepted" ? "bg-green/50" : "bg-[#6847C4]/30"} />}
                  <Icon size={12} className="relative" aria-hidden="true" />
                </span>
                <span className="flex-1 font-medium text-navy">{text}</span>
                <span className="text-muted tabular-nums">{meta}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Next step */}
      <div className={cn(FLOAT, "absolute top-[118px] -right-10 flex items-center gap-2 px-3 py-2.5", chip(contract))}>
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#E7F1FD] text-[#2A62A6]">
          <FileSignature size={14} aria-hidden="true" />
        </span>
        <span className="text-[11.5px] leading-tight">
          <span className="block font-semibold text-navy">Contract created</span>
          <span className="text-muted">Details filled in</span>
        </span>
      </div>
    </div>
  );
}

/* Contract: the client signs with the pen following the stroke, a stamp lands, the deposit invoice is ready. */

export const CONTRACT_LOOP = 9400;
export const CONTRACT_FINAL = 7400;

const SIGNATURE_PATH = "M6 28c6-14 12-20 15-17s-6 18-2 19 9-16 13-15-3 13 1 13 7-9 10-9 1 8 5 8 8-10 12-10-2 9 3 9 10-6 16-8 14-2 26-4";

/** A loose handwritten signature drawn with one stroke; with `pen`, a pen tip rides the end of the stroke. */
function Signature({ draw, pen = false, className }: { draw: number; pen?: boolean; className?: string }) {
  const path = useRef<SVGPathElement>(null);
  const [tip, setTip] = useState({ x: 6, y: 28 });

  useEffect(() => {
    if (!pen || !path.current) return;
    const point = path.current.getPointAtLength(draw * path.current.getTotalLength());
    setTip({ x: point.x, y: point.y });
  }, [draw, pen]);

  return (
    <svg viewBox="0 0 120 40" fill="none" aria-hidden="true" className={cn("overflow-visible", className)}>
      <path
        ref={path}
        d={SIGNATURE_PATH}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
      {pen && draw > 0 && draw < 1 && (
        <g transform={`translate(${tip.x} ${tip.y})`}>
          <PenLine x={-2} y={-18} width={20} height={20} strokeWidth={2} className="text-navy" />
        </g>
      )}
    </svg>
  );
}

export function ContractPreview({ ms }: { ms: number }) {
  const draw = easeOut(progress(ms, 1400, 3500));
  const signed = ms >= 3700;
  const both = ms >= 4300;
  const invoice = ms >= 5900;

  return (
    <div className="relative w-[300px] pb-9">
      <div className={cn(CARD, "relative p-5")}>
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase">Contract · C-031</span>
          <Pill tone={signed ? "bg-[#E2F5F2] text-[#1D7468]" : "bg-[#FDF4D7] text-[#8A6410]"}>
            {signed ? "Signed" : "Awaiting signature"}
          </Pill>
        </div>
        <p className="mt-3 text-[16px] leading-snug font-semibold text-navy">Fleet recovery service agreement</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">Provider</p>
            <p className="mt-1 font-medium text-navy">Ridgeway Towing</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.06em] text-muted uppercase">Client</p>
            <p className="mt-1 font-medium text-navy">Harbour Logistics</p>
          </div>
        </div>

        <div className="relative mt-4">
          <Lines widths={["100%", "96%", "88%", "52%"]} />
          {/* The stamp lands on the clauses once the client has signed. */}
          {signed && (
            <span className="absolute -top-2 right-2 animate-stamp rounded-md border-[2.5px] border-green px-2 py-0.5 text-[12px] font-bold tracking-[0.12em] text-green uppercase">
              Signed
            </span>
          )}
        </div>

        <p className="mt-4 text-[10.5px] font-semibold tracking-[0.06em] text-navy uppercase">Payment schedule</p>
        <div className="mt-2 space-y-1.5 text-[11.5px]">
          <Row label="Deposit · on signing" value={gbp(4320)} />
          <Row label="Balance · monthly" value={gbp(10080)} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { who: "Alex Morgan", draw: 1, done: true, pen: false },
            { who: "Dana Price", draw, done: signed, pen: true },
          ].map((party) => (
            <div
              key={party.who}
              className={cn(
                "relative rounded-lg border px-2.5 pt-1 pb-2 transition-colors duration-500",
                party.pen && !party.done && draw > 0 ? "border-green/50 bg-green-soft/40" : "border-line",
              )}
            >
              <Signature draw={party.draw} pen={party.pen} className="h-8 w-full text-navy" />
              <div className="border-t border-line pt-1 text-[10px]">
                <span className="font-medium text-navy">{party.who}</span>
                <span className={cn("block text-muted transition-opacity duration-300", party.done ? "opacity-100" : "opacity-0")}>
                  Signed 6 Nov 2026
                </span>
              </div>
              {party.pen && party.done && (
                <span className="absolute -top-2 -right-2 flex size-5 animate-chip-in items-center justify-center rounded-full bg-green text-white shadow-[0_2px_6px_rgba(10,37,64,0.2)]">
                  {ms < 5600 && <Ping className="bg-green/50" />}
                  <CircleCheck size={12} className="relative" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Outcome */}
      <div className={cn(FLOAT, "absolute bottom-0 -left-9 flex items-center gap-2.5 px-3 py-2.5", chip(both))}>
        <span className="flex size-7 items-center justify-center rounded-full bg-green text-white">
          <CircleCheck size={15} aria-hidden="true" />
        </span>
        <span className="text-[11.5px] leading-tight">
          <span className="block font-semibold text-navy">Signed by both parties</span>
          <span className="text-muted">Signed PDF sent to everyone</span>
        </span>
      </div>

      <div className={cn(FLOAT, "absolute top-[150px] -right-10 flex items-center gap-2 px-3 py-2.5", chip(invoice))}>
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#FCEAF2] text-[#B13F76]">
          <Receipt size={14} aria-hidden="true" />
        </span>
        <span className="text-[11.5px] leading-tight">
          <span className="block font-semibold text-navy">Deposit invoice ready</span>
          <span className="text-muted tabular-nums">INV-831 · {gbp(4320)}</span>
        </span>
      </div>
    </div>
  );
}

/* Tax report: the quarter's figures add up month by month, then the summary is ready to export. */

export const TAX_LOOP = 8400;
export const TAX_FINAL = 6200;

const MONTHS = [
  { month: "Oct", income: 0.72, expenses: 0.3, sales: 1290, purchases: 340 },
  { month: "Nov", income: 0.86, expenses: 0.42, sales: 1420, purchases: 410 },
  { month: "Dec", income: 1, expenses: 0.36, sales: 1570, purchases: 370 },
];

export function TaxReportPreview({ ms }: { ms: number }) {
  const ready = ms >= 2700;
  const exported = ms >= 4000;
  // Each month's bars grow in turn, and the totals count up as they do.
  const grown = MONTHS.map((_, i) => easeOut(progress(ms, 300 + i * 450, 1300 + i * 450)));
  const sales = MONTHS.reduce((sum, m, i) => sum + m.sales * grown[i], 0);
  const purchases = MONTHS.reduce((sum, m, i) => sum + m.purchases * grown[i], 0);
  const net = sales - purchases;

  return (
    <div className="relative w-[300px] pb-9">
      <div className={cn(CARD, "p-5")}>
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-semibold tracking-[0.08em] text-muted uppercase">VAT summary · Q4 2026</span>
          <span className="relative">
            {ready && ms < 4200 && <Ping className="rounded-full bg-green/40" />}
            <Pill tone={ready ? "bg-[#E2F5F2] text-[#1D7468]" : "bg-[#FDF4D7] text-[#8A6410]"}>{ready ? "Ready to file" : "Calculating"}</Pill>
          </span>
        </div>

        <p className="mt-4 text-[11.5px] text-muted">VAT to pay</p>
        <p className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-navy tabular-nums">{gbp(Math.round(net))}</p>
        <p className="text-[11px] text-muted">Due 7 Feb 2027</p>

        <div className="mt-4 flex h-[84px] items-end gap-5 border-b border-line px-2">
          {MONTHS.map(({ month, income, expenses }, i) => (
            <div key={month} className="flex flex-1 flex-col items-center">
              <div className="flex h-[76px] items-end gap-1">
                <div className="w-3.5 rounded-t-[3px] bg-blue" style={{ height: `${income * 100 * grown[i]}%` }} />
                <div className="w-3.5 rounded-t-[3px] bg-[#BFD0E4]" style={{ height: `${expenses * 100 * grown[i]}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-5 px-2 text-center text-[10px] text-muted">
          {MONTHS.map(({ month }, i) => (
            <span key={month} className={cn("flex-1 transition-colors duration-300", grown[i] > 0 ? "text-navy" : "text-[#B9C5D3]")}>
              {month}
            </span>
          ))}
        </div>

        <div className="mt-4 space-y-1.5 text-[11.5px]">
          <Row label="VAT on sales" value={gbp(Math.round(sales))} />
          <Row label="VAT on expenses" value={`−${gbp(Math.round(purchases))}`} />
          <div className="relative border-t border-line pt-1.5">
            <Row label="Net VAT" value={gbp(Math.round(net))} strong />
            {!ready && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-full animate-shimmer bg-[linear-gradient(90deg,transparent_0%,rgba(242,245,248,0.9)_50%,transparent_100%)] bg-[length:200%_100%]"
              />
            )}
          </div>
        </div>
      </div>

      <div className={cn(FLOAT, "absolute bottom-0 -left-9 flex items-center gap-2 px-3 py-2.5", chip(exported))}>
        <span className="flex size-7 items-center justify-center rounded-lg bg-[#FDF4D7] text-[#8A6410]">
          <Download size={14} aria-hidden="true" />
        </span>
        <span className="text-[11.5px] leading-tight">
          <span className="block font-semibold text-navy">Exported for your accountant</span>
          <span className="text-muted">42 invoices · 18 expenses · PDF and CSV</span>
        </span>
      </div>
    </div>
  );
}
