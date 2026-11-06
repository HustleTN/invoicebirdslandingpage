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

import { HairlineFigure } from "@/components/hairline/hairline-figure";
import { CLIENT, FINAL_FRAME, getFlowFrame, LOOP_END, LOOP_FROM, money, TOTAL, type FlowFrame } from "@/components/sections/documents/flow-timeline";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type Doc = {
  title: string;
  subtitle: string;
  value: string;
  icon: LucideIcon;
  tint: string;
  status: string;
  statusIcon: LucideIcon;
  isDone: (frame: FlowFrame) => boolean;
  /** public/hairline/figures/<figure>.js */
  figure: string;
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
    figure: "proposal",
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
    figure: "contract",
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
    figure: "estimate",
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
    figure: "invoice",
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
    figure: "payment",
  },
];

const ESTIMATE = 2;

/* Desktop canvas geometry, in design pixels (scaled with CSS `zoom`). Cards are wider than the original's to give the figures room. */
const CANVAS_WIDTH = 1216;
const PAD_X = 24;
const CARD_WIDTH = 214;
const GAP = (CANVAS_WIDTH - PAD_X * 2 - CARD_WIDTH * DOCS.length) / (DOCS.length - 1);
const CARD_TOP = 64;
const CARD_HEIGHT = 282;
const HANDLE_Y = CARD_TOP + CARD_HEIGHT / 2;
const BUS_Y = CARD_TOP + CARD_HEIGHT + 34;
const CANVAS_HEIGHT = BUS_Y + 46;

const cardLeft = (index: number) => PAD_X + index * (CARD_WIDTH + GAP);
const cardCenter = (index: number) => cardLeft(index) + CARD_WIDTH / 2;

const TICK_MS = 50;

/** Same clock as the original section: starts in view, then replays only the conversion. */
function useFlowClock(targetRef: React.RefObject<HTMLElement | null>) {
  const reduceMotion = usePrefersReducedMotion();
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let isOnScreen = false;
    // A low threshold: on mobile the stacked cards are taller than the screen.
    const observer = new IntersectionObserver(([entry]) => (isOnScreen = entry.isIntersecting), { threshold: 0.1 });
    if (targetRef.current) observer.observe(targetRef.current);
    const timer = window.setInterval(() => {
      if (isOnScreen && !document.hidden) setMs((previous) => (previous + TICK_MS >= LOOP_END ? LOOP_FROM : previous + TICK_MS));
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
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[#CDEFD9] bg-[#EDFBF2] px-2.5 py-1 text-[12px] font-medium text-green transition-all duration-500",
        doc.isDone(frame) ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
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

function DocCard({ doc, highlighted, style, className }: { doc: Doc; highlighted: boolean; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_10px_30px_rgba(10,37,64,0.07)] transition-colors duration-500",
        highlighted ? "border-green/60" : "border-[#DCE3EB]",
        className,
      )}
      style={style}
    >
      <div className="px-3 pt-3.5 pb-1">
        <CardHeader doc={doc} />
      </div>
      <HairlineFigure name={doc.figure} zoom={1.2} />
      <p className="mt-auto truncate border-t border-[#EEF1F4] px-3 py-2.5 text-[12px] font-medium text-[#374151]">{doc.value}</p>
    </div>
  );
}

function DesktopCanvas({ frame }: { frame: FlowFrame }) {
  const linkActive = (index: number) => (index === ESTIMATE && frame.converting) || (index === ESTIMATE + 1 && frame.toPayment);
  const busShown = frame.cardsShown === DOCS.length;

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-3xl border border-[#E3E7EC] bg-[#F7F9FB] bg-[radial-gradient(#D7DEE6_1px,transparent_1px)] [background-size:20px_20px]"
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
    >
      <svg className="absolute inset-0" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} aria-hidden="true">
        {DOCS.slice(0, -1).map((_, index) => (
          <line
            key={index}
            x1={cardLeft(index) + CARD_WIDTH}
            y1={HANDLE_Y}
            x2={cardLeft(index + 1)}
            y2={HANDLE_Y}
            strokeWidth={linkActive(index) ? 2 : 1.5}
            className={cn("transition-[stroke,stroke-dashoffset] duration-500", linkActive(index) ? "stroke-green" : "stroke-[#B8C2CE]")}
            strokeDasharray={GAP}
            strokeDashoffset={index < frame.connectorsShown ? 0 : GAP}
          />
        ))}
        <g className={cn("transition-opacity duration-700", busShown ? "opacity-100" : "opacity-0")}>
          <line x1={cardCenter(0)} y1={BUS_Y} x2={cardCenter(DOCS.length - 1)} y2={BUS_Y} className="stroke-[#C9D2DC]" strokeWidth={1.5} />
          {DOCS.map((_, index) => (
            <line key={index} x1={cardCenter(index)} y1={CARD_TOP + CARD_HEIGHT} x2={cardCenter(index)} y2={BUS_Y} className="stroke-[#C9D2DC]" strokeWidth={1.5} strokeDasharray="3 3" />
          ))}
        </g>
      </svg>

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

      {DOCS.map((doc, index) => (
        <div
          key={doc.title}
          className={cn("absolute transition-all duration-700 ease-out", index < frame.cardsShown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
          style={{ left: cardLeft(index), top: CARD_TOP - 36, width: CARD_WIDTH }}
        >
          <div className="mb-2.5 flex h-[26px] justify-end">
            <StatusPill doc={doc} frame={frame} />
          </div>
          <DocCard
            doc={doc}
            highlighted={(index === ESTIMATE || index === ESTIMATE + 1) && frame.converting}
            style={{ height: CARD_HEIGHT }}
          />
        </div>
      ))}

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
  return (
    <ol className="mx-auto grid max-w-[640px] gap-4 sm:grid-cols-2">
      {DOCS.map((doc, index) => (
        <li
          key={doc.title}
          className={cn("transition-all duration-700 ease-out", index < frame.cardsShown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")}
        >
          <div className="mb-2 flex justify-end">
            <StatusPill doc={doc} frame={frame} />
          </div>
          <DocCard doc={doc} highlighted={(index === ESTIMATE || index === ESTIMATE + 1) && frame.converting} />
        </li>
      ))}
    </ol>
  );
}

export function IllustratedFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = getFlowFrame(useFlowClock(ref));

  return (
    <div ref={ref}>
      <p className="sr-only">
        Five connected documents for one client, Northlight Logistics, each drawn as an interactive line illustration:
        an accepted proposal, a signed contract, an approved estimate for $720 including VAT, an invoice that carries
        over the estimate&apos;s line items and is sent, and the $720 payment received. Each document can also be used
        on its own.
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
