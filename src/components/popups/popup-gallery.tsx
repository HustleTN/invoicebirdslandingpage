"use client";

import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import {
  Calculator,
  ChartColumn,
  Download,
  Eye,
  FileSignature,
  FileText,
  ListChecks,
  PenLine,
  Plus,
  Receipt,
  UserPlus,
} from "lucide-react";

import { FitCanvas } from "@/components/ui/fit-canvas";
import { useLoopClock } from "@/lib/use-loop-clock";

import {
  CONTRACT_FINAL,
  CONTRACT_LOOP,
  ContractPreview,
  PROPOSAL_FINAL,
  PROPOSAL_LOOP,
  ProposalPreview,
  TAX_FINAL,
  TAX_LOOP,
  TaxReportPreview,
} from "./feature-previews";
import { LimitModal, type LimitContent } from "./limit-modal";
import { UpgradeModal, type UpgradeContent } from "./upgrade-modal";

type Preview = { Component: ComponentType<{ ms: number }>; loop: number; final: number };

type Popup = { id: string; name: string; trigger: string } & (
  | { kind: "upgrade"; content: UpgradeContent; preview: Preview }
  | { kind: "limit"; content: LimitContent }
);

const POPUPS: Popup[] = [
  {
    id: "proposals",
    name: "Proposals",
    trigger: "A Free or Professional user opens Proposals.",
    kind: "upgrade",
    preview: { Component: ProposalPreview, loop: PROPOSAL_LOOP, final: PROPOSAL_FINAL },
    content: {
      plan: "Growth",
      title: "Send proposals clients say yes to.",
      lead: "Put scope, pricing and terms in one polished proposal, see when it’s read, and turn a yes into a contract.",
      features: [
        { icon: FileText, title: "Everything in one document", text: "Scope, deliverables, pricing and terms, branded like your invoices." },
        { icon: Eye, title: "Know where every deal stands", text: "See when a proposal is opened, accepted or still waiting." },
        { icon: FileSignature, title: "From yes to contract in one click", text: "Accepted proposals become contracts with the details filled in." },
      ],
      price: "From $12/month, billed yearly.",
    },
  },
  {
    id: "contracts",
    name: "Contracts",
    trigger: "A Free or Professional user opens Contracts.",
    kind: "upgrade",
    preview: { Component: ContractPreview, loop: CONTRACT_LOOP, final: CONTRACT_FINAL },
    content: {
      plan: "Growth",
      title: "Get every agreement signed.",
      lead: "Set clear terms, collect signatures online and keep each contract linked to its client and invoices.",
      features: [
        { icon: ListChecks, title: "Start from the proposal", text: "Services, prices and dates carry over, so nothing is retyped." },
        { icon: PenLine, title: "Signed online in minutes", text: "Clients sign from any device, and both sides get the signed PDF." },
        { icon: Receipt, title: "Invoice straight from the contract", text: "Turn each payment milestone into an invoice when it’s due." },
      ],
      price: "From $12/month, billed yearly.",
    },
  },
  {
    id: "tax-reports",
    name: "Tax reports",
    trigger: "A Free user opens Reports, then Tax.",
    kind: "upgrade",
    preview: { Component: TaxReportPreview, loop: TAX_LOOP, final: TAX_FINAL },
    content: {
      plan: "Professional",
      title: "Know what you owe before it’s due.",
      lead: "Your invoices and expenses become a clear tax summary, ready to review and send to your accountant.",
      features: [
        { icon: ChartColumn, title: "Revenue, tax and expenses together", text: "One view of the period, month by month." },
        { icon: Calculator, title: "Totals you don’t rebuild", text: "Figures come straight from your documents, so they always match." },
        { icon: Download, title: "Export in one click", text: "Download a PDF or CSV for your records or your accountant." },
      ],
      price: "From $8/month, billed yearly.",
    },
  },
  {
    id: "client-limit",
    name: "Client limit",
    trigger: "A Free user with 3 clients clicks Add client.",
    kind: "limit",
    content: {
      icon: UserPlus,
      action: "Add client",
      noun: "clients",
      limit: 3,
    },
  },
  {
    id: "item-limit",
    name: "Item limit",
    trigger: "A Free user with 3 saved items clicks Add item.",
    kind: "limit",
    content: {
      icon: Plus,
      action: "Add item",
      noun: "items",
      limit: 3,
    },
  },
];

/** Upgrade popup width on desktop; limit popups are narrower. */
const UPGRADE_WIDTH = 900;
const LIMIT_WIDTH = 440;

/** Runs the preview's loop while the open popup is on screen. */
function LivePreview({ preview }: { preview: Preview }) {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoopClock(ref, { loopEnd: preview.loop, finalFrame: preview.final, threshold: 0.1 });
  return (
    <div ref={ref}>
      <preview.Component ms={ms} />
    </div>
  );
}

/** A popup with its preview running; previews pause off screen, so the thumbnails cost nothing until seen. */
function PopupView({ popup, titleId, onClose }: { popup: Popup; titleId?: string; onClose?: () => void }) {
  if (popup.kind === "limit") return <LimitModal content={popup.content} animated titleId={titleId} onClose={onClose} />;
  return <UpgradeModal content={popup.content} titleId={titleId} onClose={onClose} preview={<LivePreview preview={popup.preview} />} />;
}

/** Cards with a scaled preview of each popup; the button opens the real one in a modal dialog. */
export function PopupGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = POPUPS.find((popup) => popup.id === openId);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Start at the top with focus on the close button, not on the first button down the page.
      dialog.scrollTop = 0;
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => setOpenId(null);

  return (
    <>
      <ul className="grid gap-6 md:grid-cols-2">
        {POPUPS.map((popup) => (
          <li key={popup.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(10,37,64,0.08)]">
            <button
              type="button"
              onClick={() => setOpenId(popup.id)}
              aria-label={`Open the ${popup.name} popup`}
              className="group flex h-[300px] cursor-pointer items-center justify-center overflow-hidden bg-surface px-6 sm:h-[380px]"
            >
              <div inert aria-hidden="true" className="w-full text-left transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                <FitCanvas
                  width={popup.kind === "upgrade" ? UPGRADE_WIDTH : LIMIT_WIDTH}
                  max={popup.kind === "upgrade" ? 0.52 : 0.5}
                >
                  <PopupView popup={popup} />
                </FitCanvas>
              </div>
            </button>
            <div className="flex flex-1 flex-col gap-4 border-t border-line p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[17px] font-semibold text-navy">
                  {popup.name}
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-[12px] font-semibold text-muted">
                    {popup.kind === "upgrade" ? "Upgrade" : "Limit"}
                  </span>
                </p>
                <p className="mt-1 text-[14px] text-muted">{popup.trigger}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(popup.id)}
                className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-navy px-4 text-[14px] font-semibold text-white transition-colors hover:bg-blue"
              >
                Open popup
              </button>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={close}
        onClick={(event) => event.target === event.currentTarget && close()}
        className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] overflow-y-auto overscroll-contain rounded-3xl bg-transparent p-0 backdrop:bg-navy/55 backdrop:backdrop-blur-[2px] backdrop:animate-fade-in open:animate-pop-in motion-reduce:open:animate-none"
        style={{ maxWidth: open?.kind === "limit" ? LIMIT_WIDTH : UPGRADE_WIDTH }}
      >
        {open && <PopupView key={open.id} popup={open} titleId={titleId} onClose={close} />}
      </dialog>
    </>
  );
}
