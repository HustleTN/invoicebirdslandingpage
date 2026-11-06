"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { Check } from "lucide-react";

import { HairlineFigure } from "@/components/hairline/hairline-figure";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

type NodeId = "proposal" | "estimate" | "invoice" | "contract" | "payment" | "reports";

/** The desktop canvas: a 1180 × 860 drawing, scaled to fit, with the documents placed round the hub on an oval. */
const CANVAS = { w: 1180, h: 860 };
const ORBIT = { cx: 590, cy: 380, rx: 440, ry: 270 };
/** Each drawing is 230 × 184; a document's point on the oval is the centre of its drawing. */
const FIG_HALF = 92;

/** In workflow order, which is how they stack on phones; on desktop each sits at its angle round the hub. */
const NODES: { id: NodeId; tone: string; angle: number }[] = [
  { id: "proposal", tone: "bg-[#F0EBFE] text-[#6847C4]", angle: 215 },
  { id: "estimate", tone: "bg-[#FEF0E4] text-[#B25A16]", angle: 145 },
  { id: "contract", tone: "bg-[#E7F1FD] text-[#2A62A6]", angle: 325 },
  { id: "invoice", tone: "bg-[#FCEAF2] text-[#B13F76]", angle: 270 },
  { id: "payment", tone: "bg-[#E2F5F2] text-[#1D7468]", angle: 35 },
  { id: "reports", tone: "bg-[#FDF4D7] text-[#8A6410]", angle: 90 },
];

const COPY: Localized<Record<NodeId, { title: string; status: string; text: string }>> = {
  en: {
    proposal: { title: "Proposal", status: "Accepted", text: "Share the scope and price. Your client accepts online." },
    estimate: { title: "Estimate", status: "Approved", text: "Quote the job. Once approved, it converts into an invoice with its items intact." },
    contract: { title: "Contract", status: "Signed", text: "Confirm the agreed work and collect an online signature." },
    invoice: { title: "Invoice", status: "Sent", text: "Client details and line items carry over. Nothing to retype." },
    payment: { title: "Payment", status: "Paid", text: "Your client pays from the invoice and you see it recorded." },
    reports: { title: "Reports", status: "Up to date", text: "Payments and expenses land in your reports, so you always know how the month is going." },
  },
  fr: {
    proposal: { title: "Proposition", status: "Acceptée", text: "Partagez le périmètre et le prix. Votre client accepte en ligne." },
    estimate: { title: "Devis", status: "Approuvé", text: "Chiffrez la mission. Une fois approuvé, il devient une facture avec toutes ses lignes." },
    contract: { title: "Contrat", status: "Signé", text: "Confirmez le travail convenu et recueillez une signature en ligne." },
    invoice: { title: "Facture", status: "Envoyée", text: "Coordonnées du client et lignes sont reprises. Rien à ressaisir." },
    payment: { title: "Paiement", status: "Reçu", text: "Votre client paie depuis la facture et vous voyez le paiement enregistré." },
    reports: { title: "Rapports", status: "À jour", text: "Paiements et dépenses alimentent vos rapports : vous savez toujours où en est votre mois." },
  },
};

const at = (angle: number) => {
  const a = (angle * Math.PI) / 180;
  return { x: ORBIT.cx + ORBIT.rx * Math.cos(a), y: ORBIT.cy + ORBIT.ry * Math.sin(a) };
};

export function WorkflowSteps() {
  const copy = COPY[useLocale()];
  return (
    <div className="lg:mx-auto lg:w-[1180px] lg:[zoom:0.8] min-[1180px]:[zoom:0.92] xl:[zoom:1]">
      <div className="relative grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:block">
        <div aria-hidden="true" className="hidden lg:block" style={{ height: CANVAS.h }} />

        {/* Spokes flowing out from the hub to every document (desktop only) */}
        <svg aria-hidden="true" viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`} className="pointer-events-none absolute inset-0 hidden size-full lg:block">
          {NODES.map((node) => {
            const p = at(node.angle);
            return (
              <line
                key={node.id}
                x1={ORBIT.cx}
                y1={ORBIT.cy}
                x2={p.x}
                y2={p.y}
                stroke="#C3D0DD"
                strokeWidth={1.25}
                strokeDasharray="2 7"
                strokeLinecap="round"
                className="animate-line-flow motion-reduce:animate-none"
              />
            );
          })}
        </svg>

        {/* The hub, breathing a soft halo at the centre */}
        <div
          className="hidden lg:absolute lg:flex lg:justify-center lg:top-(--y) lg:left-(--x) lg:-translate-1/2"
          style={{ "--x": `${ORBIT.cx}px`, "--y": `${ORBIT.cy}px` } as CSSProperties}
        >
          <div className="relative z-10">
            <span
              aria-hidden="true"
              className="absolute -inset-4 animate-hub-breathe rounded-[24px] bg-[radial-gradient(closest-side,rgba(6,176,71,0.3),rgba(61,123,217,0.12),transparent)] motion-reduce:animate-none"
            />
            <div className="relative flex items-center rounded-2xl bg-navy px-7 py-5 shadow-[0_14px_40px_rgba(10,37,64,0.22)]">
              <Image src="/images/svgs/invoicebirdslogo-on-navy.svg" alt="InvoiceBirds" width={188} height={40} className="h-8 w-auto" />
            </div>
          </div>
        </div>

        {/* The six documents, each centred on its point round the hub */}
        {NODES.map((node) => {
          const p = at(node.angle);
          const t = copy[node.id];
          return (
            <article
              key={node.id}
              className="relative mx-auto flex w-full max-w-[340px] flex-col items-center px-4 text-center lg:absolute lg:top-(--y) lg:left-(--x) lg:mx-0 lg:w-[290px] lg:max-w-none lg:-translate-x-1/2 lg:px-0"
              style={{ "--x": `${p.x}px`, "--y": `${p.y - FIG_HALF}px` } as CSSProperties}
            >
              {/* a white halo, so the spoke ends behind the drawing */}
              <div className="w-full max-w-[260px] lg:w-[230px] lg:max-w-none lg:rounded-full lg:bg-[radial-gradient(closest-side,#fff_72%,rgba(255,255,255,0))]">
                <HairlineFigure name={node.id} zoom={1.15} />
              </div>
              {/* text on a white backing, so a spoke never runs through it */}
              <div className="lg:relative lg:z-10 lg:rounded-xl lg:bg-white lg:px-3 lg:pb-1">
                <div className="mt-2 flex items-center justify-center gap-2.5">
                  <h3 className="text-[19px] font-semibold tracking-[-0.015em]">{t.title}</h3>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold", node.tone)}>
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                    {t.status}
                  </span>
                </div>
                <p className="mx-auto mt-1.5 max-w-[280px] text-[15px] leading-relaxed text-muted lg:max-w-none">{t.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
