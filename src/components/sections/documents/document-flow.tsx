"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calculator,
  Check,
  CreditCard,
  FileSignature,
  FileText,
  Presentation,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

import { ContractSheet, EstimateSheet, InvoiceSheet, PaymentSheet, ProposalSheet, SHEET_WIDTH } from "./doc-previews";
import { CLIENT, FINAL_FRAME, getFlowFrame, LOOP_END, LOOP_FROM, money, TOTAL, type FlowFrame } from "./flow-timeline";

type Doc = {
  title: string;
  subtitle: string;
  value: string;
  icon: LucideIcon;
  tint: string;
  status: string;
  statusIcon: LucideIcon;
  isDone: (frame: FlowFrame) => boolean;
  Sheet: (props: { frame: FlowFrame }) => React.ReactNode;
};

const DOCS: Doc[] = [
  {
    title: "Proposal",
    subtitle: "PRO-031 · Fleet plan",
    value: "12-month plan",
    icon: Presentation,
    tint: "bg-[#F5F3FF] text-[#7C3AED]",
    status: "Accepted",
    statusIcon: Check,
    isDone: (frame) => frame.proposalAccepted,
    Sheet: ProposalSheet,
  },
  {
    title: "Contract",
    subtitle: "Service agreement",
    value: "Signed by both parties",
    icon: FileSignature,
    tint: "bg-[#FFFBEB] text-[#B45309]",
    status: "Signed",
    statusIcon: Check,
    isDone: (frame) => frame.contractSigned,
    Sheet: ContractSheet,
  },
  {
    title: "Estimate",
    subtitle: "EST-112 · M62 recovery",
    value: `${money(TOTAL)} incl. VAT`,
    icon: Calculator,
    tint: "bg-[#F0F9FF] text-[#0369A1]",
    status: "Approved",
    statusIcon: Check,
    isDone: (frame) => frame.estimateApproved,
    Sheet: EstimateSheet,
  },
  {
    title: "Invoice",
    subtitle: "INV-823 · from EST-112",
    value: `${money(TOTAL)} · due in 14 days`,
    icon: FileText,
    tint: "bg-green-soft text-green",
    status: "Sent",
    statusIcon: Send,
    isDone: (frame) => frame.invoiceSent && !frame.resetting,
    Sheet: InvoiceSheet,
  },
  {
    title: "Payment",
    subtitle: "INV-823 · Card",
    value: `${money(TOTAL)} received`,
    icon: CreditCard,
    tint: "bg-[#ECFDF5] text-[#047857]",
    status: "Received",
    statusIcon: Check,
    isDone: (frame) => frame.paymentReceived && !frame.resetting,
    Sheet: PaymentSheet,
  },
];

/** Index of the estimate card; the estimate → invoice link is the highlighted conversion. */
const ESTIMATE = 2;

/* Desktop canvas geometry, in design pixels (scaled with CSS `zoom`). */
const CANVAS_WIDTH = 1216;
const PAD_X = 40;
const CARD_WIDTH = 188;
const GAP = (CANVAS_WIDTH - PAD_X * 2 - CARD_WIDTH * DOCS.length) / (DOCS.length - 1);
const CARD_TOP = 64;
const CARD_HEIGHT = 316;
const HANDLE_Y = CARD_TOP + CARD_HEIGHT / 2;
const BUS_Y = CARD_TOP + CARD_HEIGHT + 34;
const CANVAS_HEIGHT = BUS_Y + 46;

const cardLeft = (index: number) => PAD_X + index * (CARD_WIDTH + GAP);
const cardCenter = (index: number) => cardLeft(index) + CARD_WIDTH / 2;

const TICK_MS = 50;

/** Starts when the flow scrolls into view; after the first pass only the conversion replays. */
function useFlowClock(targetRef: React.RefObject<HTMLElement | null>) {
  const reduceMotion = usePrefersReducedMotion();
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let isOnScreen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isOnScreen = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    if (targetRef.current) observer.observe(targetRef.current);

    const timer = window.setInterval(() => {
      if (isOnScreen && !document.hidden) {
        setMs((previous) => (previous + TICK_MS >= LOOP_END ? LOOP_FROM : previous + TICK_MS));
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [reduceMotion, targetRef]);

  return reduceMotion ? FINAL_FRAME : ms;
}

function StatusPill({ doc, frame }: { doc: Doc; frame: FlowFrame }) {
  const Icon = doc.statusIcon;
  const done = doc.isDone(frame);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[#CDEFD9] bg-[#EDFBF2] px-2.5 py-1 text-[12px] font-medium text-green transition-all duration-500",
        done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
      )}
    >
      <Icon size={12} strokeWidth={2.5} />
      {doc.status}
    </span>
  );
}

function CardHeader({ doc }: { doc: Doc }) {
  const Icon = doc.icon;
  return (
    <div className="flex items-center gap-2.5">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", doc.tint)}>
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-[14px] leading-tight font-semibold text-navy">{doc.title}</p>
        <p className="truncate text-[11.5px] text-[#6B7280]">{doc.subtitle}</p>
      </div>
    </div>
  );
}

function Handle({ x, active }: { x: number; active: boolean }) {
  return (
    <span
      className={cn(
        "absolute z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white transition-colors duration-500",
        active ? "border-green" : "border-[#B8C2CE]",
      )}
      style={{ left: x, top: HANDLE_Y }}
    />
  );
}

function DesktopCanvas({ frame }: { frame: FlowFrame }) {
  const linkActive = (index: number) =>
    (index === ESTIMATE && frame.converting) || (index === ESTIMATE + 1 && frame.toPayment);
  const busShown = frame.cardsShown === DOCS.length;

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-3xl border border-[#E3E7EC] bg-[#F7F9FB] bg-[radial-gradient(#D7DEE6_1px,transparent_1px)] [background-size:20px_20px]"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
    >
      {/* Connectors between neighbouring documents */}
      <svg className="absolute inset-0" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} aria-hidden="true">
        {DOCS.slice(0, -1).map((_, index) => {
          const x1 = cardLeft(index) + CARD_WIDTH;
          const x2 = cardLeft(index + 1);
          const shown = index < frame.connectorsShown;
          return (
            <line
              key={index}
              x1={x1}
              y1={HANDLE_Y}
              x2={x2}
              y2={HANDLE_Y}
              strokeWidth={linkActive(index) ? 2 : 1.5}
              className={cn("transition-[stroke,stroke-dashoffset] duration-500", linkActive(index) ? "stroke-green" : "stroke-[#B8C2CE]")}
              strokeDasharray={GAP}
              strokeDashoffset={shown ? 0 : GAP}
            />
          );
        })}

        {/* Shared client record running under every document */}
        <g className={cn("transition-opacity duration-700", busShown ? "opacity-100" : "opacity-0")}>
          <line x1={cardCenter(0)} y1={BUS_Y} x2={cardCenter(DOCS.length - 1)} y2={BUS_Y} className="stroke-[#C9D2DC]" strokeWidth={1.5} />
          {DOCS.map((_, index) => (
            <line
              key={index}
              x1={cardCenter(index)}
              y1={CARD_TOP + CARD_HEIGHT}
              x2={cardCenter(index)}
              y2={BUS_Y}
              className="stroke-[#C9D2DC]"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          ))}
        </g>
      </svg>

      {DOCS.slice(0, -1).map((_, index) => (
        <div key={index} className={cn("transition-opacity duration-300", index < frame.connectorsShown ? "opacity-100" : "opacity-0")}>
          <Handle x={cardLeft(index) + CARD_WIDTH} active={linkActive(index)} />
          <Handle x={cardLeft(index + 1)} active={linkActive(index)} />
        </div>
      ))}

      {/* Data travelling along the active link */}
      {[
        { index: ESTIMATE, active: frame.toInvoice },
        { index: ESTIMATE + 1, active: frame.toPayment },
      ].map(({ index, active }) => (
        <span
          key={index}
          className={cn(
            "absolute z-20 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green shadow-[0_0_0_4px_rgba(6,176,71,0.18)]",
            active ? "opacity-100 transition-[left] duration-[600ms] ease-in-out" : "opacity-0",
          )}
          style={{ left: active ? cardLeft(index + 1) : cardLeft(index) + CARD_WIDTH, top: HANDLE_Y }}
        />
      ))}

      {DOCS.map((doc, index) => {
        const shown = index < frame.cardsShown;
        const highlighted = (index === ESTIMATE || index === ESTIMATE + 1) && frame.converting;
        return (
          <div
            key={doc.title}
            className={cn("absolute transition-all duration-700 ease-out", shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
            style={{ left: cardLeft(index), top: CARD_TOP - 36, width: CARD_WIDTH }}
          >
            <div className="mb-2.5 flex h-[26px] justify-end">
              <StatusPill doc={doc} frame={frame} />
            </div>
            <div
              className={cn(
                "flex flex-col rounded-2xl border bg-white shadow-[0_10px_30px_rgba(10,37,64,0.07)] transition-colors duration-500",
                highlighted ? "border-green/60" : "border-[#DCE3EB]",
              )}
              style={{ height: CARD_HEIGHT }}
            >
              <div className="px-3 pt-3.5 pb-3">
                <CardHeader doc={doc} />
              </div>
              <div className="flex justify-center px-3">
                <div className="rounded-lg bg-[#F3F5F8] p-1.5">
                  <doc.Sheet frame={frame} />
                </div>
              </div>
              <p className="mt-auto truncate border-t border-[#EEF0F3] px-3 py-2.5 text-[12px] font-medium text-[#374151]">
                {doc.value}
              </p>
            </div>
          </div>
        );
      })}

      <div
        className={cn(
          "absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-[#DCE3EB] bg-white px-3.5 py-1.5 text-[12px] whitespace-nowrap text-[#374151] shadow-sm transition-opacity duration-700",
          busShown ? "opacity-100" : "opacity-0",
        )}
        style={{ top: BUS_Y }}
      >
        <Users size={13} className="text-green" />
        <span className="font-semibold text-navy">{CLIENT.name}</span>
        <span className="text-[#6B7280]">· one client record, shared by every document</span>
      </div>
    </div>
  );
}

function MobileList({ frame }: { frame: FlowFrame }) {
  const thumbZoom = 0.5;

  return (
    <ol className="mx-auto max-w-[560px]">
      {DOCS.map((doc, index) => {
        const shown = index < frame.cardsShown;
        const linkActive = index === ESTIMATE && frame.converting;
        return (
          <li
            key={doc.title}
            className={cn("transition-all duration-700 ease-out", shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
          >
            <div
              className={cn(
                "flex gap-4 rounded-2xl border bg-white p-3 shadow-[0_8px_24px_rgba(10,37,64,0.06)] transition-colors duration-500",
                (index === ESTIMATE || index === ESTIMATE + 1) && frame.converting ? "border-green/60" : "border-[#DCE3EB]",
              )}
            >
              <div className="shrink-0 rounded-lg bg-[#F3F5F8] p-1">
                <div style={{ zoom: thumbZoom, width: SHEET_WIDTH }}>
                  <doc.Sheet frame={frame} />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col py-0.5">
                <CardHeader doc={doc} />
                <p className="mt-3 text-[13px] font-medium text-[#374151]">{doc.value}</p>
                <div className="mt-auto pt-2">
                  <StatusPill doc={doc} frame={frame} />
                </div>
              </div>
            </div>
            {index < DOCS.length - 1 && (
              <div className="flex h-6 items-center pl-[45px]">
                <span
                  className={cn(
                    "h-full w-0.5 rounded-full transition-colors duration-500",
                    linkActive ? "bg-green" : "bg-[#D5DCE4]",
                  )}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function DocumentFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = getFlowFrame(useFlowClock(ref));

  return (
    <div ref={ref}>
      <p className="sr-only">
        Five connected documents for one client, Northlight Logistics: an accepted proposal for a fleet recovery
        partnership, a signed service agreement, an approved estimate for $720 including VAT, an invoice converted
        from that estimate with the client, services and pricing carried over and sent, and the $720 payment
        received. Each document can also be used on its own.
      </p>
      <div aria-hidden="true">
        <div className="hidden lg:block lg:[zoom:0.79] min-[1152px]:[zoom:0.895] xl:[zoom:1]">
          <DesktopCanvas frame={frame} />
        </div>
        <div className="lg:hidden">
          <MobileList frame={frame} />
        </div>
      </div>
    </div>
  );
}
