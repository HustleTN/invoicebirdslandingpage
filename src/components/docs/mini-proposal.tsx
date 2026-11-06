"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  Bold,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Heading,
  Italic,
  List,
  ListOrdered,
  Plus,
  Redo2,
  Underline,
  Undo2,
  X,
  Zap,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import { INTL_LOCALE, type Localized } from "@/lib/i18n";

import { gbp, RidgewayLogo, SignatureStroke, THEMES } from "./mini-invoice";
import { Cursor } from "./mock-kit";

/* Sample data: Ridgeway Towing & Recovery Ltd proposing a fleet recovery contract to Harbour Logistics Ltd. */

export type ProposalPart = "cover" | "summary" | "scope" | "deliverables" | "timeline" | "pricing" | "terms";

const proposalEn = {
  title: "Fleet Recovery Partnership 2027",
  client: "Harbour Logistics Ltd",
  summary:
    "Ridgeway will provide 24/7 breakdown recovery for Harbour Logistics' fleet of 40 vehicles across Yorkshire and the Humber, with a guaranteed 60-minute response and a dedicated recovery truck on standby.",
  scope: [
    "24/7 recovery for all 40 fleet vehicles",
    "Towing to the Hull depot or the nearest approved garage",
    "Winching and off-road recovery",
    "Out of scope: repairs and replacement parts",
  ],
  deliverables: [
    { name: "Recovery hotline", detail: "Staffed 24/7 with a 60-minute response" },
    { name: "Standby recovery truck", detail: "Based at our Leeds depot" },
    { name: "Monthly incident report", detail: "Every call-out, with times and costs" },
  ],
  timeline: [
    { name: "Fleet survey", date: "1 to 12 Dec 2026" },
    { name: "Service go-live", date: "1 Jan 2027" },
    { name: "First quarterly review", date: "1 Apr 2027" },
  ],
  price: 14_400,
  terms: "Annual agreement, invoiced quarterly in advance. Either party may cancel with 30 days' notice.",
};

export const PROPOSAL: Localized<typeof proposalEn> = {
  en: proposalEn,
  fr: {
    title: "Partenariat dépannage de flotte 2027",
    client: "Harbour Logistics Ltd",
    summary:
      "Ridgeway assurera le dépannage 24 h/24, 7 j/7 de la flotte de 40 véhicules de Harbour Logistics dans le Yorkshire et le Humber, avec une intervention garantie en 60 minutes et une dépanneuse dédiée en astreinte.",
    scope: [
      "Dépannage 24 h/24, 7 j/7 des 40 véhicules",
      "Remorquage au dépôt de Hull ou au garage agréé le plus proche",
      "Treuillage et dépannage hors route",
      "Hors périmètre : réparations et pièces détachées",
    ],
    deliverables: [
      { name: "Ligne d’urgence dépannage", detail: "Joignable 24 h/24, intervention en 60 minutes" },
      { name: "Dépanneuse en astreinte", detail: "Basée à notre dépôt de Leeds" },
      { name: "Rapport mensuel d’activité", detail: "Chaque intervention, avec horaires et coûts" },
    ],
    timeline: [
      { name: "Audit de la flotte", date: "Du 1er au 12 déc. 2026" },
      { name: "Mise en service", date: "1er janv. 2027" },
      { name: "Premier bilan trimestriel", date: "1er avr. 2027" },
    ],
    price: 14_400,
    terms: "Contrat annuel, facturé trimestriellement à l’avance. Résiliable par l’une ou l’autre partie avec un préavis de 30 jours.",
  },
};

export const PROPOSAL_ORDER: ProposalPart[] = ["summary", "scope", "deliverables", "timeline", "pricing", "terms"];

export type ProposalState = {
  title?: string;
  client?: string;
  summary?: string;
  scope?: string[];
  deliverables?: { name: string; detail: string }[];
  timeline?: { name: string; date: string }[];
  /** Typed project total; null shows 0. */
  price?: number | null;
  terms?: string;
  theme?: keyof typeof THEMES;
  rounded?: boolean;
  order?: ProposalPart[];
  /** The section outlined in green, as when selected in the app. */
  focus?: ProposalPart;
  /** The field showing a caret. */
  caret?: "title" | "client" | "summary" | "scope" | "deliverables" | "timeline" | "price" | "terms";
  status?: "Draft" | "Sent";
  /** Extra content under the client name, e.g. a client picker. */
  clientMenu?: ReactNode;
  /** A cursor on the down arrow of the section toolbar. */
  downCursor?: { visible: boolean; clicking: boolean };
};

const en = {
  status: { Draft: "Draft", Sent: "Sent" },
  summary: "EXECUTIVE SUMMARY",
  summaryEmpty: "Briefly describe the project goals, approach, and why you are the right partner…",
  scope: "PROJECT SCOPE",
  outOfScope: "Out of scope:",
  scopeEmpty: "Describe the project scope, what is included and what is out of scope…",
  deliverables: "DELIVERABLES",
  deliverablesEmpty: "No deliverables yet. Add one below.",
  addDeliverable: "Add deliverable",
  timeline: "TIMELINE",
  timelineEmpty: "No phases yet. Add one below.",
  addPhase: "Add phase",
  pricing: "INVESTMENT",
  fixed: "Fixed",
  hourly: "Hourly",
  itemized: "Itemized",
  projectTotal: "Project total (fixed price)",
  total: "TOTAL",
  terms: "TERMS & CONDITIONS",
  termsEmpty: "Enter your terms and conditions…",
  signature: "Authorized Signature",
  date: "1 Nov 2026",
  heading: "PROPOSAL",
  titleLabel: "TITLE",
  titleEmpty: "Proposal Title",
  preparedFor: "PREPARED FOR",
  clientEmpty: "Client Name",
  dateLabel: "DATE",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    status: { Draft: "Brouillon", Sent: "Envoyée" },
    summary: "SYNTHÈSE",
    summaryEmpty: "Décrivez brièvement les objectifs du projet, votre approche et pourquoi vous êtes le bon partenaire…",
    scope: "PÉRIMÈTRE DU PROJET",
    outOfScope: "Hors périmètre :",
    scopeEmpty: "Décrivez le périmètre du projet, ce qui est inclus et ce qui ne l’est pas…",
    deliverables: "LIVRABLES",
    deliverablesEmpty: "Aucun livrable pour l’instant. Ajoutez-en un ci-dessous.",
    addDeliverable: "Ajouter un livrable",
    timeline: "CALENDRIER",
    timelineEmpty: "Aucune phase pour l’instant. Ajoutez-en une ci-dessous.",
    addPhase: "Ajouter une phase",
    pricing: "INVESTISSEMENT",
    fixed: "Forfait",
    hourly: "À l’heure",
    itemized: "Détaillé",
    projectTotal: "Total du projet (prix forfaitaire)",
    total: "TOTAL",
    terms: "CONDITIONS GÉNÉRALES",
    termsEmpty: "Saisissez vos conditions générales…",
    signature: "Signature du prestataire",
    date: "1er nov. 2026",
    heading: "PROPOSITION",
    titleLabel: "TITRE",
    titleEmpty: "Titre de la proposition",
    preparedFor: "PRÉPARÉE POUR",
    clientEmpty: "Nom du client",
    dateLabel: "DATE",
  },
};

const heading = "text-[8.5px] font-semibold tracking-[0.22em] text-[#8A94A3]";
const empty = "text-[10px] text-[#9CA3AF] italic";
export const Caret = () => <span className="ml-px inline-block h-2.5 w-px translate-y-0.5 animate-pulse bg-green" />;

export function RichToolbar() {
  return (
    <div className="mt-2 flex items-center gap-2.5 border-b border-[#EEF0F3] pb-1.5 text-[#6B7280]">
      <Heading size={11} />
      <span className="h-3 w-px bg-[#E5E7EB]" />
      <Bold size={11} />
      <Italic size={11} />
      <Underline size={11} />
      <span className="h-3 w-px bg-[#E5E7EB]" />
      <List size={11} />
      <ListOrdered size={11} />
      <span className="h-3 w-px bg-[#E5E7EB]" />
      <Undo2 size={11} />
      <Redo2 size={11} className="text-[#C4CAD2]" />
    </div>
  );
}

export function AddRow({ label }: { label: string }) {
  return (
    <p className="mt-2 flex items-center gap-1 text-[9.5px] font-medium text-[#06B047]">
      <Plus size={10} /> {label}
    </p>
  );
}

/** A section of an inline-edited document, outlined with the move and remove toolbar when selected. */
export function SectionBlock({
  part,
  on,
  downCursor,
  children,
}: {
  part: string;
  on: boolean;
  downCursor?: { visible: boolean; clicking: boolean };
  children: ReactNode;
}) {
  return (
    <div data-part={part} className="relative border-t border-[#EEF0F3] pt-1 pb-3 first:border-t-0">
      <div className={cn("-mx-2 rounded-lg px-2 pt-2 pb-2 transition-shadow duration-300", on && "ring-2 ring-green")}>{children}</div>
      {on && (
        <span className="absolute -bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-white px-2.5 py-1 text-[#4B5563] shadow-[0_4px_14px_rgba(10,37,64,0.12)]">
          <ChevronUp size={11} />
          <span className="relative">
            <ChevronDown size={11} className={cn("rounded transition-colors", downCursor?.clicking && "bg-green text-white")} />
            {downCursor && <Cursor {...downCursor} className="top-2 left-1.5" />}
          </span>
          <span className="h-3 w-px bg-[#E5E7EB]" />
          <X size={11} />
        </span>
      )}
    </div>
  );
}

/** The sample proposal (520px wide). Unset props use a complete proposal. */
export function MiniProposal(props: ProposalState) {
  const locale = useLocale();
  const t = COPY[locale];
  const sample = PROPOSAL[locale];
  const s = {
    title: sample.title,
    client: sample.client,
    summary: sample.summary,
    scope: sample.scope,
    deliverables: sample.deliverables,
    timeline: sample.timeline,
    price: sample.price as number | null,
    terms: sample.terms,
    theme: "red" as keyof typeof THEMES,
    rounded: false,
    order: PROPOSAL_ORDER,
    status: "Draft" as const,
    ...Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)),
  } as Required<Omit<ProposalState, "focus" | "caret" | "clientMenu" | "downCursor">> & ProposalState;
  const theme = THEMES[s.theme];
  const radius = s.rounded ? 10 : 4;

  const sections: Record<ProposalPart, ReactNode> = {
    cover: null,
    summary: (
      <>
        <p className={heading}>{t.summary}</p>
        {s.focus === "summary" && <RichToolbar />}
        <p className={cn("mt-2 leading-[1.55]", s.summary ? "text-[#374151]" : empty)}>
          {s.summary || t.summaryEmpty}
          {s.caret === "summary" && <Caret />}
        </p>
      </>
    ),
    scope: (
      <>
        <p className={heading}>{t.scope}</p>
        {s.focus === "scope" && <RichToolbar />}
        {s.scope.length ? (
          <ul className="mt-2 list-disc space-y-0.5 pl-4 leading-[1.5] text-[#374151] marker:text-[#9CA3AF]">
            {s.scope.map((line, i) => (
              <li key={i}>
                {line.startsWith(t.outOfScope) ? (
                  <>
                    <b className="font-semibold text-[#111827]">{t.outOfScope}</b>
                    {line.slice(t.outOfScope.length)}
                  </>
                ) : (
                  line
                )}
                {s.caret === "scope" && i === s.scope.length - 1 && <Caret />}
              </li>
            ))}
          </ul>
        ) : (
          <p className={cn("mt-2", empty)}>{t.scopeEmpty}</p>
        )}
      </>
    ),
    deliverables: (
      <>
        <p className={heading}>{t.deliverables}</p>
        {s.deliverables.length ? (
          <div className="mt-2 space-y-1.5">
            {s.deliverables.map((d, i) => (
              <div key={i} className="flex items-start gap-2.5 border border-[#EEF0F3] px-2.5 py-1.5" style={{ borderRadius: radius }}>
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white transition-colors duration-500"
                  style={{ backgroundColor: theme.primary }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">
                    {d.name}
                    {s.caret === "deliverables" && i === s.deliverables.length - 1 && !d.detail && <Caret />}
                  </p>
                  {d.detail && <p className="text-[9.5px] text-[#6B7280]">{d.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={cn("mt-2", empty)}>{t.deliverablesEmpty}</p>
        )}
        <AddRow label={t.addDeliverable} />
      </>
    ),
    timeline: (
      <>
        <p className={heading}>{t.timeline}</p>
        {s.timeline.length ? (
          <ol className="mt-2">
            {s.timeline.map((p, i) => (
              <li key={i} className="relative flex items-center gap-2.5 py-1">
                <span className="relative z-10 size-2 shrink-0 rounded-full transition-colors duration-500" style={{ backgroundColor: theme.primary }} />
                {i < s.timeline.length - 1 && <span className="absolute top-1/2 left-[3.5px] h-full w-px bg-[#E5E7EB]" />}
                <span className="flex-1 font-semibold">
                  {p.name}
                  {s.caret === "timeline" && i === s.timeline.length - 1 && !p.date && <Caret />}
                </span>
                {p.date && (
                  <span className="flex items-center gap-1 text-[9.5px] text-[#6B7280]">
                    <CalendarDays size={9} /> {p.date}
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className={cn("mt-2", empty)}>{t.timelineEmpty}</p>
        )}
        <AddRow label={t.addPhase} />
      </>
    ),
    pricing: (
      <>
        <p className={heading}>{t.pricing}</p>
        <div className="mt-2 inline-flex gap-0.5 rounded-md border border-[#E5E7EB] bg-[#F7F8FA] p-0.5 text-[9.5px]">
          <span className="flex items-center gap-1 rounded bg-white px-2 py-1 font-medium shadow-sm">
            <Zap size={9} /> {t.fixed}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 text-[#6B7280]">
            <Clock size={9} /> {t.hourly}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 text-[#6B7280]">
            <List size={9} /> {t.itemized}
          </span>
        </div>
        <p className="mt-2 text-[9.5px] text-[#4B5563]">{t.projectTotal}</p>
        <p
          className={cn("mt-1 w-[140px] border px-2 py-1 transition-colors", s.caret === "price" ? "border-green ring-2 ring-green/15" : "border-[#E5E7EB]")}
          style={{ borderRadius: radius }}
        >
          <span className="text-[#9CA3AF]">£</span> {s.price ? s.price.toLocaleString(locale === "en" ? "en-GB" : INTL_LOCALE[locale]) : "0"}
          {s.caret === "price" && <Caret />}
        </p>
        <div className="mt-2.5 flex items-center justify-end gap-3 border-t border-[#EEF0F3] pt-2">
          <span className="text-[8.5px] font-semibold tracking-[0.16em] text-[#6B7280]">{t.total}</span>
          <span className="text-[17px] font-bold tabular-nums transition-colors duration-500" style={{ color: theme.primary }}>
            {gbp(s.price ?? 0, locale)}
          </span>
        </div>
      </>
    ),
    terms: (
      <>
        <p className={heading}>{t.terms}</p>
        {s.focus === "terms" && <RichToolbar />}
        <p className={cn("mt-2 leading-[1.55]", s.terms ? "text-[#374151]" : empty)}>
          {s.terms || t.termsEmpty}
          {s.caret === "terms" && <Caret />}
        </p>
        <div className="mt-3 flex flex-col items-end border-t border-[#EEF0F3] pt-3 text-right">
          <span className="flex h-[44px] w-[130px] items-center justify-center border border-dashed border-[#D1D5DB]" style={{ borderRadius: radius }}>
            <SignatureStroke progress={1} className="h-[30px] w-auto" />
          </span>
          <p className="mt-1.5 text-[9.5px] text-[#4B5563]">{t.signature}</p>
          <p className="text-[8.5px] text-[#9CA3AF]">Mark Ridgeway · Ridgeway Towing &amp; Recovery · {t.date}</p>
        </div>
      </>
    ),
  };



  return (
    <div className="relative w-[520px] overflow-hidden rounded-xl border border-line bg-white py-7 pr-8 pl-10 font-[Helvetica,Arial,sans-serif] text-[10.5px] text-[#111827] shadow-[0_12px_40px_rgba(10,37,64,0.08),0_2px_6px_rgba(10,37,64,0.04)]">
      <span className="absolute inset-y-0 left-0 w-[5px] transition-colors duration-500" style={{ backgroundColor: theme.primary }} />
      <span
        className={cn(
          "absolute top-3 right-3 rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors",
          s.status === "Sent" ? "bg-[#E8F7EE] text-green" : "bg-[#F1F3F5] text-[#4B5563]",
        )}
      >
        {t.status[s.status]}
      </span>

      {/* Cover */}
      <div data-part="cover" className={cn("-mx-2 flex items-start justify-between gap-4 rounded-lg px-2 pt-2 pb-3 transition-shadow", s.focus === "cover" && "ring-2 ring-green")}>
        <div>
          <div className="[zoom:0.8]">
            <RidgewayLogo />
          </div>
          <div className="mt-2 leading-[1.5]">
            <p className="text-[11.5px] font-bold whitespace-nowrap transition-colors duration-500" style={{ color: theme.primary }}>
              Ridgeway Towing &amp; Recovery Ltd
            </p>
            <p className="text-[9px] text-[#4B5563]">Unit 4, Brookfield Industrial Estate, Leeds</p>
            <p className="text-[9px] text-[#4B5563]">+44 113 496 0721</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[22px] leading-none font-bold tracking-[-0.01em] transition-colors duration-500" style={{ color: theme.primary }}>
            {t.heading}
          </p>
          <dl className="mt-2.5 grid grid-cols-[auto_auto] items-baseline justify-end gap-x-3 gap-y-1">
            <dt className="text-[8px] tracking-[0.14em] text-[#9CA3AF]">{t.titleLabel}</dt>
            <dd className={cn("max-w-[170px] font-semibold", !s.title && "text-[#9CA3AF] italic")}>
              {s.title || t.titleEmpty}
              {s.caret === "title" && <Caret />}
            </dd>
            <dt className="text-[8px] tracking-[0.14em] text-[#9CA3AF]">{t.preparedFor}</dt>
            <dd className={cn("relative font-semibold", !s.client && "text-[#9CA3AF] italic")}>
              {s.client || t.clientEmpty}
              {s.caret === "client" && <Caret />}
              {s.clientMenu}
            </dd>
            <dt className="text-[8px] tracking-[0.14em] text-[#9CA3AF]">{t.dateLabel}</dt>
            <dd className="font-semibold">{t.date}</dd>
          </dl>
        </div>
      </div>

      <div className="mt-1 border-t border-[#E5E7EB]">{s.order.map((part) => (
          <SectionBlock key={part} part={part} on={s.focus === part} downCursor={s.downCursor}>
            {sections[part]}
          </SectionBlock>
        ))}</div>
    </div>
  );
}

/**
 * A fixed-height window onto the proposal that glides to the `focus` section,
 * like scrolling the canvas in the app.
 */
export function ProposalWindow({ focus, height = 800, children }: { focus?: string; height?: number; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const target = focus ? el.querySelector<HTMLElement>(`[data-part="${focus}"]`) : null;
    const max = Math.max(0, el.scrollHeight - height);
    const y = target ? Math.min(max, Math.max(0, target.offsetTop - 40)) : 0;
    el.style.transform = `translateY(${-y}px)`;
  });

  return (
    <div className="overflow-hidden rounded-xl" style={{ height }}>
      <div ref={inner} className="relative transition-transform duration-700 ease-out">
        {children}
      </div>
    </div>
  );
}
