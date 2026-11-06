"use client";

import { useRef } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileText,
  ListChecks,
  CalendarDays,
  Palette,
  PoundSterling,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { MiniContract } from "./mini-contract";
import { MiniProposal, PROPOSAL, PROPOSAL_ORDER, ProposalWindow, type ProposalPart, type ProposalState } from "./mini-proposal";
import { Cursor, cursorAt, InvoiceSlot, Panel, SOFT_SHADOW, Stage, typed, useLoop } from "./mock-kit";
import { Seg } from "./mocks";

/* The proposal sidebar ------------------------------------------------------------- */

type Todo = "title" | "client" | "summary" | "scope" | "deliverable" | "price";

const TODOS: Localized<{ key: Todo; label: string }[]> = {
  en: [
    { key: "title", label: "Add a proposal title" },
    { key: "client", label: "Choose a client" },
    { key: "summary", label: "Write the summary" },
    { key: "scope", label: "Describe the scope" },
    { key: "deliverable", label: "Add a deliverable" },
    { key: "price", label: "Set a price" },
  ],
  fr: [
    { key: "title", label: "Ajouter un titre" },
    { key: "client", label: "Choisir un client" },
    { key: "summary", label: "Rédiger la synthèse" },
    { key: "scope", label: "Décrire le périmètre" },
    { key: "deliverable", label: "Ajouter un livrable" },
    { key: "price", label: "Fixer un prix" },
  ],
};

const BUILD_ICONS: Record<ProposalPart, typeof Sparkles> = {
  cover: Sparkles,
  summary: BookOpen,
  scope: FileText,
  deliverables: ListChecks,
  timeline: CalendarDays,
  pricing: PoundSterling,
  terms: ShieldCheck,
};

const BUILD: Localized<Record<ProposalPart, { name: string; sub: string }>> = {
  en: {
    cover: { name: "Cover", sub: "Title, client, intro" },
    summary: { name: "Summary", sub: "Executive summary" },
    scope: { name: "Scope of Work", sub: "Project scope and approach" },
    deliverables: { name: "Deliverables", sub: "Outputs and milestones" },
    timeline: { name: "Timeline", sub: "Phases and dates" },
    pricing: { name: "Pricing", sub: "Fixed, hourly, or itemized" },
    terms: { name: "Terms & Signature", sub: "Signed" },
  },
  fr: {
    cover: { name: "Couverture", sub: "Titre, client, introduction" },
    summary: { name: "Synthèse", sub: "Résumé du projet" },
    scope: { name: "Périmètre", sub: "Contenu du projet et approche" },
    deliverables: { name: "Livrables", sub: "Résultats et jalons" },
    timeline: { name: "Calendrier", sub: "Phases et dates" },
    pricing: { name: "Tarification", sub: "Forfait, à l’heure ou détaillé" },
    terms: { name: "Conditions et signature", sub: "Signé" },
  },
};

const labelsEn = {
  builder: "The proposal builder: selecting each section in the left list jumps to it on the proposal, and Ready to send fills up.",
  design: (doc: "proposal" | "contract") => `Design: picking a color pair and rounded corners; the ${doc} restyles live.`,
  cover: "Cover: typing the proposal title on the page, then choosing Harbour Logistics as the client.",
  summary: "Summary: writing the executive summary directly on the proposal.",
  scope: "Scope of Work: listing what's included and what's out of scope as bullet points.",
  deliverables: "Deliverables: adding three deliverables, each with a short description.",
  timeline: "Timeline: adding three phases with their dates.",
  pricing: "Pricing: entering a fixed project total of £14,400; the total updates.",
  terms: "Terms & Signature: typing the terms above the authorized signature.",
  arrange: "Moving the Timeline section below Pricing with the down arrow; the sidebar list follows.",
  send: "The action bar: preview the proposal, download the PDF, then send it; the status changes to Sent.",
};

const LABELS: Localized<typeof labelsEn> = {
  en: labelsEn,
  fr: {
    builder:
      "L’éditeur de proposition : sélectionner une section dans la liste de gauche y mène directement sur la proposition, et « Prêt à l’envoi » se remplit.",
    design: (doc: "proposal" | "contract") =>
      `Design : choix d’une paire de couleurs et de coins arrondis ; ${doc === "contract" ? "le contrat" : "la proposition"} change de style en direct.`,
    cover: "Couverture : saisie du titre de la proposition sur la page, puis choix de Harbour Logistics comme client.",
    summary: "Synthèse : rédaction de la synthèse directement sur la proposition.",
    scope: "Périmètre : liste à puces de ce qui est inclus et de ce qui est hors périmètre.",
    deliverables: "Livrables : ajout de trois livrables, chacun avec une courte description.",
    timeline: "Calendrier : ajout de trois phases avec leurs dates.",
    pricing: "Tarification : saisie d’un total forfaitaire de 14 400 £ ; le total se met à jour.",
    terms: "Conditions et signature : saisie des conditions au-dessus de la signature du prestataire.",
    arrange: "Déplacement de la section Calendrier sous Tarification avec la flèche vers le bas ; la liste latérale suit.",
    send: "La barre d’actions : prévisualiser la proposition, télécharger le PDF, puis l’envoyer ; le statut passe à Envoyée.",
  },
};

/** Everything checked off by the time a guide step starts. */
const DONE_BEFORE: Record<ProposalPart, Todo[]> = {
  cover: [],
  summary: ["title", "client"],
  scope: ["title", "client", "summary"],
  deliverables: ["title", "client", "summary", "scope"],
  timeline: ["title", "client", "summary", "scope", "deliverable"],
  pricing: ["title", "client", "summary", "scope", "deliverable"],
  terms: ["title", "client", "summary", "scope", "deliverable", "price"],
};

const SIDEBAR: Localized<{ design: string; designSub: string; ready: string; of: string; build: string; noun: string }> = {
  en: { design: "Design", designSub: "Template, colors, font", ready: "Ready to send", of: "of", build: "Build your", noun: "proposal" },
  fr: { design: "Design", designSub: "Modèle, couleurs, police", ready: "Prêt à l’envoi", of: "sur", build: "Créez votre", noun: "proposition" },
};

export type SidebarItem = { key: string; name: string; sub: string; icon: typeof Sparkles; signed?: boolean };

/** A builder's left column: Design, Ready to send and the Build list. */
export function BuilderSidebar({
  noun,
  todos,
  total,
  done,
  items,
  active,
  click,
}: {
  noun: string;
  todos: { key: string; label: string }[];
  /** Ready to send total; items not in `todos` count as already done. */
  total: number;
  done: string[];
  items: SidebarItem[];
  active?: string;
  /** A cursor clicking an item in the list at `at`. */
  click?: { key: string; ms: number; at: number };
}) {
  const locale = useLocale();
  const t = SIDEBAR[locale];
  const count = total - todos.length + done.length;
  return (
    <div className={cn("w-full max-w-[280px] shrink-0 space-y-2.5 rounded-2xl border border-line bg-white p-3 text-left text-[12px] text-navy", SOFT_SHADOW)}>
      <div className="flex items-center gap-2.5 rounded-xl border border-line px-2.5 py-2">
        <span className="flex size-7 items-center justify-center rounded-lg border border-line text-[#4B5563]">
          <Palette size={14} />
        </span>
        <span className="flex-1">
          <span className="block font-semibold">{t.design}</span>
          <span className="block text-[10.5px] text-[#6B7280]">{t.designSub}</span>
        </span>
        <ChevronRight size={13} className="text-[#9CA3AF]" />
      </div>

      <div className="rounded-xl border border-line px-2.5 py-2">
        <div className="flex justify-between font-semibold">
          <span>{t.ready}</span>
          <span className="font-normal text-[#6B7280]">
            {count} {t.of} {total}
          </span>
        </div>
        <div className="mt-1.5 mb-1 h-1.5 rounded-full bg-[#E9ECEF]">
          <div className="h-full rounded-full bg-green transition-[width] duration-300" style={{ width: `${(count / total) * 100}%` }} />
        </div>
        {todos.map(({ key, label }) => {
          const ok = done.includes(key);
          return (
            <p key={key} className="flex items-center gap-2 py-[3px] text-[11.5px]">
              <span className={cn("flex size-3.5 items-center justify-center rounded-full", ok ? "bg-green text-white" : "border border-dashed border-[#9CA3AF]")}>
                {ok && <Check size={9} strokeWidth={3} />}
              </span>
              <span className={cn("flex-1 truncate", ok ? "text-[#9CA3AF] line-through" : "text-[#374151]")}>{label}</span>
              <ChevronRight size={12} className="text-[#C4CAD2]" />
            </p>
          );
        })}
      </div>

      <p className="px-1 pt-0.5 text-[11px] text-[#6B7280]">
        {t.build} {noun}
      </p>
      <ul className="space-y-1">
        {items.map(({ key, name, sub, icon: Icon, signed }) => {
          const on = key === active;
          return (
            <li
              key={key}
              className={cn("relative flex items-center gap-2.5 rounded-xl border px-2 py-1.5 transition-colors", on ? "border-line bg-white shadow-sm" : "border-transparent")}
            >
              <span
                className={cn(
                  "relative flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  on ? "border-green/40 bg-green-soft text-green" : "border-line text-[#4B5563]",
                )}
              >
                <Icon size={14} />
                {signed && (
                  <span className="absolute -right-1 -bottom-1 flex size-3 items-center justify-center rounded-full border border-white bg-green text-white">
                    <Check size={7} strokeWidth={4} />
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{name}</span>
                <span className="block truncate text-[10.5px] text-[#6B7280]">{sub}</span>
              </span>
              <ChevronRight size={13} className={on ? "text-green" : "text-[#9CA3AF]"} />
              {click?.key === key && <Cursor {...cursorAt(click.ms, click.at)} className="top-6 left-[45%]" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProposalSidebar({
  active,
  done,
  order = PROPOSAL_ORDER,
  click,
}: {
  active?: ProposalPart;
  done: Todo[];
  order?: ProposalPart[];
  click?: { part: ProposalPart; ms: number; at: number };
}) {
  const locale = useLocale();
  return (
    <BuilderSidebar
      noun={SIDEBAR[locale].noun}
      todos={TODOS[locale]}
      total={6}
      done={done}
      items={(["cover", ...order] as ProposalPart[]).map((key) => ({ key, ...BUILD[locale][key], icon: BUILD_ICONS[key] }))}
      active={active}
      click={click && { key: click.part, ms: click.ms, at: click.at }}
    />
  );
}

/** Sidebar on the left, the proposal window on the right. */
function ProposalStage({
  ms,
  stageRef,
  label,
  part,
  done,
  doc,
  clickAt = 600,
  order,
}: {
  ms: number;
  stageRef: React.RefObject<HTMLDivElement | null>;
  label: string;
  part: ProposalPart;
  done: Todo[];
  doc: ProposalState;
  clickAt?: number;
  order?: ProposalPart[];
}) {
  const selected = ms >= clickAt + 100;
  return (
    <Stage ref={stageRef} label={label}>
      <ProposalSidebar active={selected ? part : undefined} done={done} order={order} click={{ part, ms, at: clickAt }} />
      <InvoiceSlot>
        <ProposalWindow focus={selected ? part : undefined}>
          <MiniProposal order={order} focus={selected ? part : undefined} {...doc} />
        </ProposalWindow>
      </InvoiceSlot>
    </Stage>
  );
}

/** Types `lines` one after another, starting at `start`. */
export function typedLines(lines: string[], ms: number, start: number, perChar = 28, gap = 250) {
  const out: string[] = [];
  let t = start;
  for (const line of lines) {
    if (ms < t) break;
    out.push(typed(line, ms, t, perChar));
    t += line.length * perChar + gap;
  }
  return out;
}

/** Adds rows one at a time: the name types out, then its second line appears. */
function typedRows<T extends { name: string }>(rows: T[], ms: number, starts: number[], second: keyof T) {
  return rows.flatMap((row, i) => {
    if (ms < starts[i]) return [];
    const name = typed(row.name, ms, starts[i], 40);
    const complete = name === row.name && ms >= starts[i] + row.name.length * 40 + 250;
    return [{ ...row, name, [second]: complete ? row[second] : "" }];
  });
}

/* 1. The builder ------------------------------------------------------------------- */

const STEP = 1_300;
const PARTS: ProposalPart[] = ["cover", ...PROPOSAL_ORDER];
/** Ready to send items completed once each section is done. */
const TICKS: Partial<Record<ProposalPart, Todo[]>> = {
  cover: ["title", "client"],
  summary: ["summary"],
  scope: ["scope"],
  deliverables: ["deliverable"],
  pricing: ["price"],
};

export function ProposalBuilderMock() {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, PARTS.length * STEP + 1_600);
  const current = Math.min(PARTS.length - 1, Math.floor(ms / STEP));
  const reached = Math.min(PARTS.length, Math.floor((ms + STEP / 2) / STEP));
  const done = PARTS.slice(0, reached).flatMap((p) => TICKS[p] ?? []);

  return (
    <Stage ref={ref} label={LABELS[locale].builder}>
      <ProposalSidebar active={PARTS[current]} done={done} />
      <InvoiceSlot>
        <ProposalWindow focus={PARTS[current]}>
          <MiniProposal focus={PARTS[current]} />
        </ProposalWindow>
      </InvoiceSlot>
    </Stage>
  );
}

/* 2. Design ------------------------------------------------------------------------ */

const P_SWATCHES = [
  ["#0A2540", "#06B047"],
  ["#1F2937", "#475569"],
  ["#1D4ED8", "#60A5FA"],
  ["#4C1D95", "#7C3AED"],
  ["#7F1D1D", "#DC2626"],
  ["#7C2D12", "#D97706"],
  ["#831843", "#EC4899"],
  ["#064E3B", "#059669"],
];
const P_COLORS = {
  plain: { primary: "#111827", secondary: "#1F2937", accent: "#9CA3AF" },
  red: { primary: "#B91C1C", secondary: "#7F1D1D", accent: "#DC2626" },
  navy: { primary: "#0A2540", secondary: "#123A63", accent: "#06B047" },
};
const P_DESIGN = { red: 1_200, corners: 3_000, navy: 5_000 };

type ColorRole = keyof (typeof P_COLORS)["plain"];

const designEn = {
  title: "Design",
  template: "Template",
  templates: ["Modern", "Classic", "Minimal"],
  colors: "Colors",
  colorNames: { primary: "primary", secondary: "secondary", accent: "accent" } as Record<ColorRole, string>,
  corners: "Corners",
  cornerOptions: ["Sharp", "Soft", "Rounded"],
  font: "Font",
};

const DESIGN_COPY: Localized<typeof designEn> = {
  en: designEn,
  fr: {
    title: "Design",
    template: "Modèle",
    templates: ["Moderne", "Classique", "Minimal"],
    colors: "Couleurs",
    colorNames: { primary: "principale", secondary: "secondaire", accent: "accent" },
    corners: "Coins",
    cornerOptions: ["Droits", "Doux", "Arrondis"],
    font: "Police",
  },
};

/** Design for the inline-edited documents: the proposal, or the contract when `doc` is set. */
export function ProposalDesignMock({ doc = "proposal" }: { doc?: "proposal" | "contract" }) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = DESIGN_COPY[locale];
  const ms = useLoop(ref, 8_000, 4_000);
  const theme = ms >= P_DESIGN.navy ? "navy" : ms >= P_DESIGN.red ? "red" : "plain";
  const picked = theme === "navy" ? 0 : theme === "red" ? 4 : -1;
  const rounded = ms >= P_DESIGN.corners;
  const colors = P_COLORS[theme];

  return (
    <Stage ref={ref} label={LABELS[locale].design(doc)}>
      <Panel title={t.title} back={false}>
        <p className="font-semibold">{t.template}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          {t.templates.map((name, i) => (
            <div key={name}>
              <div className={cn("relative h-[44px] rounded-lg border p-1.5", i === 0 ? "border-2 border-green" : "border-line")}>
                {i === 0 && (
                  <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-green text-white">
                    <Check size={8} strokeWidth={3.5} />
                  </span>
                )}
                <div className="h-[3px] w-1/3 bg-[#1F2937]" />
                <div className="mt-1.5 h-[2px] w-full bg-[#E5E7EB]" />
                <div className="mt-1 h-[3px] w-full bg-[#1F2937]" />
                <div className="mt-1.5 ml-auto h-[4px] w-5 bg-[#1F2937]" />
              </div>
              <p className={cn("mt-1", i === 0 ? "font-semibold" : "text-[#6B7280]")}>{name}</p>
            </div>
          ))}
        </div>
        <p className="font-semibold">{t.colors}</p>
        <div className="flex justify-between">
          {P_SWATCHES.map(([a, b], i) => (
            <span key={a} className="relative">
              <span
                className={cn("block size-[24px] rounded-full ring-offset-2 transition-shadow", i === picked && "ring-2 ring-navy")}
                style={{ background: `linear-gradient(135deg, ${a} 50%, ${b} 50%)` }}
              />
              {i === 4 && <Cursor {...cursorAt(ms, P_DESIGN.red)} className="top-3.5 left-4" />}
              {i === 0 && <Cursor {...cursorAt(ms, P_DESIGN.navy)} className="top-3.5 left-4" />}
            </span>
          ))}
        </div>
        <div className="space-y-1.5">
          {(Object.entries(colors) as [ColorRole, string][]).map(([name, hex]) => (
            <div key={name} className="flex items-center gap-2.5 rounded-lg border border-line px-2.5 py-1.5">
              <span className="size-4 rounded transition-colors duration-500" style={{ backgroundColor: hex }} />
              <span className="flex-1 capitalize">{t.colorNames[name]}</span>
              <span className="font-mono text-[10.5px] text-[#6B7280] uppercase">{hex}</span>
            </div>
          ))}
        </div>
        <p className="font-semibold">{t.corners}</p>
        <Seg
          options={t.cornerOptions}
          value={t.cornerOptions[rounded ? 2 : 1]}
          ms={ms}
          cursor={{ at: P_DESIGN.corners, target: t.cornerOptions[2] }}
        />
        <p className="font-semibold">{t.font}</p>
        <div className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2">
          <span className="text-[14px]">Aa</span> <span className="flex-1">Helvetica</span> <ChevronDown size={13} className="text-[#6B7280]" />
        </div>
      </Panel>
      <InvoiceSlot>
        {doc === "contract" ? (
          <ProposalWindow focus={rounded ? "services" : undefined}>
            <MiniContract theme={theme} rounded={rounded} />
          </ProposalWindow>
        ) : (
          <ProposalWindow focus={rounded ? "deliverables" : undefined}>
            <MiniProposal theme={theme} rounded={rounded} />
          </ProposalWindow>
        )}
      </InvoiceSlot>
    </Stage>
  );
}

/* 3. Cover ------------------------------------------------------------------------- */

export const CLIENTS = ["Harbour Logistics Ltd", "Northgate Haulage", "Daniel Carter"];
const COVER = { title: 1_200, client: 3_600, pick: 4_800 };
const SAVED_CLIENTS: Localized<string> = { en: "SAVED CLIENTS", fr: "CLIENTS ENREGISTRÉS" };

function ClientMenu({ ms }: { ms: number }) {
  const locale = useLocale();
  const hover = ms >= COVER.pick - 700;
  return (
    <span className={cn("absolute top-full right-0 z-20 mt-1.5 block w-[170px] rounded-lg border border-line bg-white p-1 text-left text-[10px] font-normal text-navy not-italic", SOFT_SHADOW)}>
      <span className="block px-2 pt-1 pb-1.5 text-[8.5px] tracking-[0.12em] text-[#9CA3AF]">{SAVED_CLIENTS[locale]}</span>
      {CLIENTS.map((name, i) => (
        <span key={name} className={cn("relative block rounded-md px-2 py-1.5", i === 0 && hover && "bg-[#F3F5F7]")}>
          {name}
          {i === 0 && <Cursor {...cursorAt(ms, COVER.pick)} className="top-4 left-[45%]" />}
        </span>
      ))}
    </span>
  );
}

export function ProposalCoverMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const sample = PROPOSAL[locale];
  const ms = useLoop(ref, 8_000);
  const title = typed(sample.title, ms, COVER.title, 40);
  const picked = ms >= COVER.pick + 100;
  const menu = ms >= COVER.client && !picked;
  const done: Todo[] = [...(title === sample.title ? (["title"] as const) : []), ...(picked ? (["client"] as const) : [])];

  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].cover}
      part="cover"
      done={done}
      doc={{
        title,
        client: picked ? sample.client : "",
        caret: ms >= COVER.title && title !== sample.title ? "title" : undefined,
        clientMenu: menu ? <ClientMenu ms={ms} /> : undefined,
        summary: "",
        scope: [],
        deliverables: [],
        timeline: [],
        price: null,
        terms: "",
      }}
    />
  );
}

/* 4. Summary ----------------------------------------------------------------------- */

export function ProposalSummaryMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const sample = PROPOSAL[locale];
  const ms = useLoop(ref, 8_500);
  const summary = typed(sample.summary, ms, 1_200, 22);
  const complete = summary === sample.summary;
  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].summary}
      part="summary"
      done={[...DONE_BEFORE.summary, ...(complete ? (["summary"] as const) : [])]}
      doc={{ summary, caret: ms >= 1_200 && !complete ? "summary" : undefined, scope: [], deliverables: [], timeline: [], price: null, terms: "" }}
    />
  );
}

/* 5. Scope of work ----------------------------------------------------------------- */

export function ProposalScopeMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const sample = PROPOSAL[locale];
  const ms = useLoop(ref, 8_500);
  const scope = typedLines(sample.scope, ms, 1_200, 26);
  const complete = scope.length === sample.scope.length && scope.at(-1) === sample.scope.at(-1);
  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].scope}
      part="scope"
      done={[...DONE_BEFORE.scope, ...(complete ? (["scope"] as const) : [])]}
      doc={{ scope, caret: scope.length && !complete ? "scope" : undefined, deliverables: [], timeline: [], price: null, terms: "" }}
    />
  );
}

/* 6. Deliverables ------------------------------------------------------------------ */

export function ProposalDeliverablesMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const ms = useLoop(ref, 8_500);
  const deliverables = typedRows(PROPOSAL[locale].deliverables, ms, [1_300, 3_000, 4_700], "detail");
  const last = deliverables.at(-1);
  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].deliverables}
      part="deliverables"
      done={[...DONE_BEFORE.deliverables, ...(deliverables[0]?.detail ? (["deliverable"] as const) : [])]}
      doc={{ deliverables, caret: last && !last.detail ? "deliverables" : undefined, timeline: [], price: null, terms: "" }}
    />
  );
}

/* 7. Timeline ---------------------------------------------------------------------- */

export function ProposalTimelineMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const ms = useLoop(ref, 8_000);
  const timeline = typedRows(PROPOSAL[locale].timeline, ms, [1_300, 2_900, 4_500], "date");
  const last = timeline.at(-1);
  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].timeline}
      part="timeline"
      done={DONE_BEFORE.timeline}
      doc={{ timeline, caret: last && !last.date ? "timeline" : undefined, price: null, terms: "" }}
    />
  );
}

/* 8. Pricing ----------------------------------------------------------------------- */

export function ProposalPricingMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const total = PROPOSAL[locale].price;
  const ms = useLoop(ref, 7_000, 5_000);
  const digits = typed(String(total), ms, 1_600, 220);
  const price = digits ? Number(digits) : null;
  const typing = ms >= 1_200 && ms < 3_200;
  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].pricing}
      part="pricing"
      done={[...DONE_BEFORE.pricing, ...(price === total ? (["price"] as const) : [])]}
      doc={{ price, caret: typing ? "price" : undefined, terms: "" }}
    />
  );
}

/* 9. Terms and signature ----------------------------------------------------------- */

export function ProposalTermsMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const sample = PROPOSAL[locale];
  const ms = useLoop(ref, 7_500);
  const terms = typed(sample.terms, ms, 1_200, 30);
  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].terms}
      part="terms"
      done={DONE_BEFORE.terms}
      doc={{ terms, caret: ms >= 1_200 && terms !== sample.terms ? "terms" : undefined }}
    />
  );
}

/* 10. Arrange sections ------------------------------------------------------------- */

const MOVE_AT = 2_600;
const MOVED: ProposalPart[] = ["summary", "scope", "deliverables", "pricing", "timeline", "terms"];

export function ProposalArrangeMock() {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 6_500, 4_000);
  const moved = ms >= MOVE_AT + 100;
  const order = moved ? MOVED : PROPOSAL_ORDER;
  return (
    <ProposalStage
      ms={ms}
      stageRef={ref}
      label={LABELS[locale].arrange}
      part="timeline"
      done={DONE_BEFORE.terms}
      order={order}
      doc={{ downCursor: cursorAt(ms, MOVE_AT) }}
    />
  );
}

/* 11. Preview, PDF and send -------------------------------------------------------- */

const P_SEND = { preview: 1_200, pdf: 2_800, send: 4_400 };
const SEND_COPY: Localized<{ preview: string; duplicate: string; send: string; sent: string }> = {
  en: { preview: "Preview", duplicate: "Duplicate", send: "Send", sent: "Sent" },
  fr: { preview: "Aperçu", duplicate: "Dupliquer", send: "Envoyer", sent: "Envoyée" },
};

export function ProposalSendMock() {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = SEND_COPY[locale];
  const ms = useLoop(ref, 8_000, 6_000);
  const downloaded = ms >= P_SEND.pdf && ms < P_SEND.pdf + 1_400;
  const sent = ms >= P_SEND.send + 400;
  return (
    <Stage ref={ref} label={LABELS[locale].send}>
      <div className="flex flex-col items-center gap-5">
        <div className={cn("flex flex-wrap items-center gap-1 rounded-2xl border border-line bg-white p-1.5 text-[13px] text-[#374151]", SOFT_SHADOW)}>
          <span className="relative flex items-center gap-1.5 px-2.5 py-2">
            <Eye size={15} /> {t.preview}
            <Cursor {...cursorAt(ms, P_SEND.preview)} className="top-5 left-[55%]" />
          </span>
          <span className="hidden items-center gap-1.5 px-2.5 py-2 sm:flex">
            <Copy size={15} /> {t.duplicate}
          </span>
          <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
          <span className="relative flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 font-medium text-navy">
            {downloaded ? <Check size={15} className="text-green" /> : <Download size={15} />} PDF
            <Cursor {...cursorAt(ms, P_SEND.pdf)} className="top-5 left-[55%]" />
          </span>
          <span className="relative flex items-center gap-1.5 rounded-lg bg-green px-3.5 py-2 font-semibold text-white">
            {sent ? <Check size={15} /> : <Send size={15} />} {sent ? t.sent : t.send}
            <Cursor {...cursorAt(ms, P_SEND.send)} className="top-5 left-[45%]" />
          </span>
        </div>
        <InvoiceSlot>
          <ProposalWindow height={440}>
            <MiniProposal status={sent ? "Sent" : "Draft"} />
          </ProposalWindow>
        </InvoiceSlot>
      </div>
    </Stage>
  );
}
