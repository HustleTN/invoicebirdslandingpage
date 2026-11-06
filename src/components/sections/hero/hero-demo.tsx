"use client";

import { useRef } from "react";
import Image from "next/image";

import { useLocale } from "@/components/i18n/locale-provider";
import { FitCanvas } from "@/components/ui/fit-canvas";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { BirdyChatPanel } from "./birdy-chat-panel";
import { getDemoFrame, useDemoClock, useGreeting, useInvoiceDates } from "./demo-timeline";
import { BUILDER_WIDTH, DesktopBuilder } from "./desktop-builder";
import { SendInvoiceModal } from "./send-invoice-modal";
import { useDraggable } from "./use-draggable";

/** A floating card the visitor can drag around inside the hero section. */
function DraggableCard({ className, floatDelay, children }: { className: string; floatDelay?: string; children: React.ReactNode }) {
  const { dragging, dragProps } = useDraggable<HTMLDivElement>();

  return (
    <div {...dragProps} className={cn("absolute z-20 select-none", className)}>
      <div className={cn(!dragging && "animate-float")} style={{ animationDelay: floatDelay }}>
        {children}
      </div>
    </div>
  );
}

/** Room either side of the builder for the two cards, which hang a little further out still. */
const CANVAS_GUTTER = 181;
const CANVAS_WIDTH = BUILDER_WIDTH + CANVAS_GUTTER * 2;

const DESCRIPTION: Localized<string> = {
  en: "Illustration: a towing company asks Birdy to invoice Harbour Logistics for a van recovery and 24 miles of towing with 20% VAT, due in 14 days. The invoice builder fills in the client, line items, VAT and due date for a £442.80 total, Birdy shows a summary with send and download options, the user switches the invoice to blue, then reviews it and sends it to the client with a CC.",
  fr: "Illustration : une entreprise de dépannage demande à Birdy de facturer à Harbour Logistics le dépannage d’une camionnette et 24 miles de remorquage, avec 20 % de TVA et une échéance à 14 jours. L’éditeur de factures renseigne le client, les lignes, la TVA et la date d’échéance pour un total de 442,80 £. Birdy affiche un récapitulatif avec des options d’envoi et de téléchargement, l’utilisateur passe la facture en bleu, puis la vérifie et l’envoie au client avec un destinataire en copie.",
};

/**
 * Animated, illustrative product demo: Birdy drafts invoice INV-822, the user
 * customises it and sends it. Purely visual: no data is created or sent.
 */
export function HeroDemo({ id }: { id: string }) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const frame = getDemoFrame(useDemoClock(ref), locale);
  const dates = useInvoiceDates(locale);
  const greeting = useGreeting(locale);

  return (
    <div ref={ref} id={id} className="relative scroll-mt-24">
      <p className="sr-only">{DESCRIPTION[locale]}</p>

      <div aria-hidden="true">
        {/* One composition at every size: the builder and both cards on a canvas scaled to the container. */}
        <FitCanvas width={CANVAS_WIDTH} max={0.74} fallback="max-sm:[zoom:0.218] sm:max-lg:[zoom:0.44] lg:[zoom:0.6]">
          <div className="pb-[100px]" style={{ paddingInline: CANVAS_GUTTER }}>
            <div className="group/showcase relative">
              {/* Birdy hides behind the builder's left edge and peeks out while the showcase is hovered. */}
              <Image
                src="/images/birdy-peek.png"
                alt=""
                width={422}
                height={520}
                className="pointer-events-none absolute top-[96px] left-[24px] w-[190px] origin-bottom-right rotate-0 transition-transform duration-[650ms] ease-[cubic-bezier(0.34,1.4,0.64,1)] group-hover/showcase:-translate-x-[118px] group-hover/showcase:-rotate-[10deg] motion-reduce:transition-none"
              />
              <div className="relative">
                <DesktopBuilder frame={frame} dates={dates} />
              </div>
              <DraggableCard className="top-[359px] -left-[230px]">
                <SendInvoiceModal frame={frame} />
              </DraggableCard>
              <DraggableCard className="top-[268px] -right-[230px]" floatDelay="-3.5s">
                <BirdyChatPanel frame={frame} dates={dates} greeting={greeting} />
              </DraggableCard>
            </div>
          </div>
        </FitCanvas>
      </div>
    </div>
  );
}
