"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bookmark,
  ChartColumn,
  ChartNoAxesColumn,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Mail,
  Pause,
  Play,
  Receipt,
  type LucideIcon,
} from "lucide-react";

import { BirdyChatShell, BirdyMascot, BirdyMessage, ThinkingDots, TypingCaret, UserMessage } from "@/components/birdy/birdy-chat";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import { INTL_LOCALE, type Locale, type Localized } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/*
 * Illustrative data for Ridgeway Towing & Recovery Ltd, the same business and
 * client as the hero demo. Nothing here touches a real account.
 */
const money = (locale: Locale) => (amount: number, pence = true) =>
  new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: "GBP",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: pence ? 2 : 0,
    maximumFractionDigits: pence ? 2 : 0,
  }).format(amount);

/* Invoice: £285 recovery + 24 miles at £3.50 = £369.00, VAT 20% £73.80, total £442.80 (as in the hero). */
const vatOn = (subtotal: number) => subtotal * 0.2;
const OVERDUE = [
  ["Northgate Haulage", 264],
  ["Daniel Carter", 186],
  ["Pennine Fleet Services", 636],
] as const;
const OVERDUE_TOTAL = OVERDUE.reduce((sum, [, amount]) => sum + amount, 0);
const MONTH = { invoiced: 12_480, collected: 9_360, outstanding: 3_120 };

const en = {
  invoice: "Invoice",
  draft: "Draft",
  draftUpdated: "Draft · Updated",
  due: (days: number) => `Due in ${days} days`,
  newLine: "New",
  subtotal: "Subtotal",
  vat: "VAT 20%",
  total: "Total",
  open: "Open",
  download: "Download PDF",
  send: "Send",
  hi: "Hi,",
  tryAsking: "Try asking",
  suggestions: ["Create an invoice for a client", "What's overdue right now?", "How is this month going?", "Log an expense"],
  tryExample: "Try an example",
  play: "Play Birdy examples",
  pause: "Pause Birdy examples",
  examples: "Birdy examples",
  capabilities: [
    { title: "Prepare invoices", text: "From saved clients, services and VAT." },
    { title: "Check overdue", text: "See who owes what, at a glance." },
    { title: "Month overview", text: "Invoiced, collected and outstanding." },
    { title: "Log expenses", text: "Fuel, parts and receipts in seconds." },
  ],
  summary:
    "Example Birdy conversations for a towing business, shown one after another: an invoice for Harbour Logistics (subtotal £369.00, VAT £73.80, total £442.80), then edited to add £95 of winching and 30-day terms (total £556.80, draft not sent); three overdue invoices totalling £1,086.00 (Northgate Haulage £264.00, Daniel Carter £186.00, Pennine Fleet Services £636.00); a month overview (£12,480 invoiced, £9,360 collected, £3,120 outstanding); and £96.40 of Shell diesel logged under Fuel.",
  assistant: "Smart assistant",
  online: "Online",
  usesSaved: "Uses your saved clients, prices and VAT",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    invoice: "Facture",
    draft: "Brouillon",
    draftUpdated: "Brouillon modifié",
    due: (days) => `Échéance à ${days} jours`,
    newLine: "Nouveau",
    subtotal: "Sous-total",
    vat: "TVA 20 %",
    total: "Total",
    open: "Ouvrir",
    download: "PDF",
    send: "Envoyer",
    hi: "Bonjour,",
    tryAsking: "Essayez par exemple",
    suggestions: ["Créer une facture pour un client", "Quelles factures sont en retard ?", "Comment se passe ce mois-ci ?", "Enregistrer une dépense"],
    tryExample: "Essayez un exemple",
    play: "Lire les exemples Birdy",
    pause: "Mettre en pause les exemples Birdy",
    examples: "Exemples Birdy",
    capabilities: [
      { title: "Préparer des factures", text: "À partir de vos clients, prestations et TVA." },
      { title: "Suivre les retards", text: "Qui vous doit quoi, en un coup d’œil." },
      { title: "Bilan du mois", text: "Facturé, encaissé et à encaisser." },
      { title: "Saisir les dépenses", text: "Carburant, pièces et reçus en quelques secondes." },
    ],
    summary:
      "Exemples de conversations avec Birdy pour une entreprise de dépannage, présentés l’un après l’autre : une facture pour Harbour Logistics (sous-total 369,00 £, TVA 73,80 £, total 442,80 £), puis modifiée pour ajouter 95 £ de treuillage et une échéance à 30 jours (total 556,80 £, brouillon non envoyé) ; trois factures en retard pour un total de 1 086,00 £ (Northgate Haulage 264,00 £, Daniel Carter 186,00 £, Pennine Fleet Services 636,00 £) ; un bilan du mois (12 480 £ facturés, 9 360 £ encaissés, 3 120 £ à encaisser) ; et 96,40 £ de gazole Shell enregistrés dans la catégorie Carburant.",
    assistant: "Assistant intelligent",
    online: "En ligne",
    usesSaved: "Utilise vos clients, prix et TVA enregistrés",
  },
};

function Row({ label, value, strong = false }: { label: string; value: ReactNode; strong?: boolean }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-1.5", strong ? "font-semibold text-navy" : "text-muted")}>
      <span>{label}</span>
      <span className={cn("tabular-nums", strong ? "text-[16px]" : "text-navy")}>{value}</span>
    </div>
  );
}

/** A compact result under Birdy's reply: hairline-framed, no inner boxes. */
function Result({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-3 animate-fade-in rounded-xl border border-line bg-white px-4 pt-3 pb-2 text-[13.5px]">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-2.5">
        <p className="font-semibold text-navy">{title}</p>
        {aside}
      </div>
      <div className="divide-y divide-line">{children}</div>
    </div>
  );
}

type Line = { name: string; qty: number; rate: number; added?: boolean };

const LINES: Localized<Line[]> = {
  en: [
    { name: "Vehicle recovery, Ford Transit", qty: 1, rate: 285 },
    { name: "Towing to depot", qty: 24, rate: 3.5 },
  ],
  fr: [
    { name: "Dépannage, Ford Transit", qty: 1, rate: 285 },
    { name: "Remorquage au dépôt", qty: 24, rate: 3.5 },
  ],
};
/* After the edit: winching added, terms moved to 30 days. £464.00 + VAT £92.80 = £556.80. */
const EDITED: Localized<Line[]> = {
  en: [...LINES.en, { name: "Winching", qty: 1, rate: 95, added: true }],
  fr: [...LINES.fr, { name: "Treuillage", qty: 1, rate: 95, added: true }],
};

/** The draft invoice card, as Birdy shows it in the app: lines, totals and actions. */
function InvoiceCard({ lines, due, updated = false }: { lines: Line[]; due: number; updated?: boolean }) {
  const locale = useLocale();
  const t = COPY[locale];
  const gbp = money(locale);
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.rate, 0);
  return (
    <div className="mt-3 animate-fade-in overflow-hidden rounded-xl border border-line bg-white text-[13.5px]">
      <div className="px-4 pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted">
            {t.invoice} <span className="ml-1 text-[16px] font-semibold text-navy">INV-822</span>
          </p>
          <span className="rounded-full bg-[#F1F3F5] px-2.5 py-0.5 text-[12px] font-medium text-[#4B5563]">{updated ? t.draftUpdated : t.draft}</span>
        </div>
        <p className="mt-1 text-navy">
          Harbour Logistics Ltd{" "}
          <span className={cn("rounded px-1", updated ? "bg-green-soft text-green" : "text-muted")}>· {t.due(due)}</span>
        </p>
      </div>
      <div className="mx-4 mt-3 space-y-2 border-t border-line pt-3">
        {lines.map((line) => (
          <div key={line.name} className={cn("-mx-2 flex justify-between gap-4 rounded-lg px-2", line.added && "bg-green-soft py-1")}>
            <div>
              <p className="flex items-center gap-2 font-semibold text-navy">
                {line.name}
                {line.added && <span className="rounded-full bg-green px-1.5 text-[10.5px] font-semibold text-white">{t.newLine}</span>}
              </p>
              {/* once updated, only the new line keeps its detail, so the edit request stays in view */}
              {(!updated || line.added) && (
                <p className="text-[12.5px] text-muted">
                  {line.qty} × {gbp(line.rate)}
                </p>
              )}
            </div>
            <p className="text-navy tabular-nums">{gbp(line.qty * line.rate)}</p>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 border-t border-line pt-1.5 pb-2.5 [&>div]:py-1">
        <Row label={t.subtotal} value={gbp(subtotal)} />
        <Row label={t.vat} value={gbp(vatOn(subtotal))} />
        <div className="flex items-baseline justify-between gap-4 pt-1.5 font-semibold text-navy">
          <span>{t.total}</span>
          <span className="text-[17px] tabular-nums">{gbp(subtotal + vatOn(subtotal))}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-line bg-[#FAFBFC] px-4 py-2.5 text-[13px] font-medium text-navy">
        <span>{t.open}</span>
        <span className="flex items-center gap-1.5">
          <Download size={14} /> {t.download}
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-lg bg-green px-3.5 py-1.5 font-semibold text-white">
          <Mail size={14} /> {t.send}
        </span>
      </div>
    </div>
  );
}

const SUGGESTION_ICONS: LucideIcon[] = [FileText, Clock, ChartNoAxesColumn, Bookmark];

/** Birdy's opening state in the app: a greeting and suggested requests. `picked` highlights the first. */
function Greeting({ picked }: { picked: boolean }) {
  const t = COPY[useLocale()];
  const suggestions = SUGGESTION_ICONS.map((icon, i) => ({ icon, label: t.suggestions[i] }));
  return (
    <div className="animate-fade-in pb-1">
      <div className="flex items-center gap-3">
        <Image src="/images/bird-wave.webp" alt="" width={181} height={160} className="h-auto w-[84px]" />
        <p className="text-[19px] leading-tight font-bold tracking-tight text-navy">
          {t.hi}
          <br />
          Ridgeway Towing.
        </p>
      </div>
      <p className="mt-4 mb-1 text-[12px] text-muted">{t.tryAsking}</p>
      <ul className="divide-y divide-[#EEF0F3] border-y border-[#EEF0F3]">
        {suggestions.map(({ icon: Icon, label }, i) => (
          <li
            key={label}
            className={cn("-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-[13.5px] text-[#1F2937] transition-colors", i === 0 && picked && "bg-surface")}
          >
            <Icon size={16} strokeWidth={1.6} className="text-[#4B5563]" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="text-[#9CA3AF]" />
          </li>
        ))}
      </ul>
    </div>
  );
}

type Turn = { ask: string; reply: string; result: ReactNode };
type Scenario = { label: string; greet?: boolean; turns: Turn[] };

const scenarioEn = {
  invoice: {
    label: "Create an invoice",
    ask: "I need an invoice for Harbour Logistics for the Ford Transit recovery and 24 miles of towing.",
    reply: "Draft ready. I added the saved services, VAT and payment terms.",
    editAsk: "Add winching at £95 and make it due in 30 days.",
    editReply: "Updated. I added winching and changed the terms to 30 days.",
  },
  overdue: {
    label: "Check overdue",
    ask: "What’s overdue right now?",
    reply: (total: string) => `You have 3 overdue invoices totalling ${total}.`,
    title: "Overdue",
  },
  month: {
    label: "Month overview",
    ask: "How is this month going?",
    reply: (invoiced: string, collected: string, outstanding: string) =>
      `You’ve invoiced ${invoiced}, collected ${collected}, and have ${outstanding} still outstanding this month.`,
    columns: ["Invoiced", "Collected", "Outstanding"],
  },
  expense: {
    label: "Log an expense",
    ask: "Log £96.40 of diesel from Shell for the recovery truck.",
    reply: (amount: string) => `Done. I logged ${amount} under Fuel.`,
    title: "Expense logged",
    merchant: "Merchant",
    amount: "Amount",
    category: "Category",
    fuel: "Fuel",
  },
};

const SCENARIO_COPY: Localized<typeof scenarioEn> = {
  en: scenarioEn,
  fr: {
    invoice: {
      label: "Créer une facture",
      ask: "Il me faut une facture pour Harbour Logistics : dépannage du Ford Transit et 24 miles de remorquage.",
      reply: "Brouillon prêt. J’ai repris vos prestations, la TVA et vos conditions de paiement.",
      editAsk: "Ajoutez un treuillage à 95 £ et passez l’échéance à 30 jours.",
      editReply: "C’est fait. J’ai ajouté le treuillage et passé l’échéance à 30 jours.",
    },
    overdue: {
      label: "Factures en retard",
      ask: "Quelles factures sont en retard ?",
      reply: (total) => `Vous avez 3 factures en retard, pour un total de ${total}.`,
      title: "En retard",
    },
    month: {
      label: "Bilan du mois",
      ask: "Comment se passe ce mois-ci ?",
      reply: (invoiced, collected, outstanding) =>
        `Ce mois-ci, vous avez facturé ${invoiced}, encaissé ${collected}, et il reste ${outstanding} à encaisser.`,
      columns: ["Facturé", "Encaissé", "À encaisser"],
    },
    expense: {
      label: "Saisir une dépense",
      ask: "Enregistrez 96,40 £ de gazole chez Shell pour la dépanneuse.",
      reply: (amount) => `C’est fait. J’ai enregistré ${amount} dans la catégorie Carburant.`,
      title: "Dépense enregistrée",
      merchant: "Fournisseur",
      amount: "Montant",
      category: "Catégorie",
      fuel: "Carburant",
    },
  },
};

function scenarios(locale: Locale): Scenario[] {
  const t = SCENARIO_COPY[locale];
  const gbp = money(locale);
  return [
    {
      label: t.invoice.label,
      greet: true,
      turns: [
        {
          ask: t.invoice.ask,
          reply: t.invoice.reply,
          result: <InvoiceCard lines={LINES[locale]} due={14} />,
        },
        {
          ask: t.invoice.editAsk,
          reply: t.invoice.editReply,
          result: <InvoiceCard lines={EDITED[locale]} due={30} updated />,
        },
      ],
    },
    {
      label: t.overdue.label,
      turns: [
        {
          ask: t.overdue.ask,
          reply: t.overdue.reply(gbp(OVERDUE_TOTAL)),
          result: (
            <Result title={t.overdue.title} aside={<span className="font-semibold text-navy tabular-nums">{gbp(OVERDUE_TOTAL)}</span>}>
              {OVERDUE.map(([client, amount]) => (
                <div key={client} className="flex items-center justify-between gap-4 py-1.5">
                  <span className="flex items-center gap-2 text-navy">
                    <span className="size-1.5 rounded-full bg-[#C2410C]" aria-hidden="true" />
                    {client}
                  </span>
                  <span className="text-navy tabular-nums">{gbp(amount)}</span>
                </div>
              ))}
            </Result>
          ),
        },
      ],
    },
    {
      label: t.month.label,
      turns: [
        {
          ask: t.month.ask,
          reply: t.month.reply(gbp(MONTH.invoiced, false), gbp(MONTH.collected, false), gbp(MONTH.outstanding, false)),
          result: (
            <div className="mt-3 grid animate-fade-in grid-cols-3 divide-x divide-line rounded-xl border border-line bg-white text-center">
              {(
                [
                  [t.month.columns[0], MONTH.invoiced, "text-navy"],
                  [t.month.columns[1], MONTH.collected, "text-green"],
                  [t.month.columns[2], MONTH.outstanding, "text-blue"],
                ] as const
              ).map(([label, amount, tone]) => (
                <div key={label} className="px-2 py-3">
                  <p className="text-[12px] text-muted">{label}</p>
                  <p className={cn("mt-1 text-[17px] font-semibold tabular-nums", tone)}>{gbp(amount, false)}</p>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      label: t.expense.label,
      turns: [
        {
          ask: t.expense.ask,
          reply: t.expense.reply(gbp(96.4)),
          result: (
            <Result title={t.expense.title} aside={<Check size={16} strokeWidth={2.6} className="text-green" aria-hidden="true" />}>
              <Row label={t.expense.merchant} value="Shell" />
              <Row label={t.expense.amount} value={gbp(96.4)} />
              <Row label={t.expense.category} value={t.expense.fuel} />
            </Result>
          ),
        },
      ],
    },
  ];
}

const SCENARIOS: Localized<Scenario[]> = { en: scenarios("en"), fr: scenarios("fr") };

/* Timing inside one scenario, in ms: an optional greeting, then each turn typed, sent and answered. */
const GREET_MS = 2_600;
const TYPE_DELAY = 400;
const PER_CHAR = 26;
const THINK = 900;
const BETWEEN = 2_800;
const HOLD = 4_200;
const FADE = 450;
const TICK = 50;

type Timed = Turn & { typeFrom: number; sentAt: number; replyAt: number };

/** When each turn starts typing, is sent and is answered; and the scenario's full length. */
function timeline(scenario: Scenario) {
  let at = scenario.greet ? GREET_MS : 0;
  const turns: Timed[] = scenario.turns.map((turn, i) => {
    const typeFrom = at + TYPE_DELAY;
    const sentAt = typeFrom + turn.ask.length * PER_CHAR + 250;
    const replyAt = sentAt + THINK;
    at = replyAt + (i === scenario.turns.length - 1 ? HOLD : BETWEEN);
    return { ...turn, typeFrom, sentAt, replyAt };
  });
  return { turns, length: at + FADE };
}
type Timeline = ReturnType<typeof timeline>;
const TIMELINES: Localized<Timeline[]> = { en: SCENARIOS.en.map(timeline), fr: SCENARIOS.fr.map(timeline) };

/** Plays the scenarios in turn while on screen; pausable; jumps to any scenario. */
function usePlayer(targetRef: React.RefObject<HTMLElement | null>, timelines: Timeline[]) {
  const reduceMotion = usePrefersReducedMotion();
  const [state, setState] = useState({ index: 0, ms: 0 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || paused) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.3 });
    if (targetRef.current) observer.observe(targetRef.current);
    const timer = window.setInterval(() => {
      if (!visible || document.hidden) return;
      setState(({ index, ms }) =>
        ms + TICK >= timelines[index].length ? { index: (index + 1) % timelines.length, ms: 0 } : { index, ms: ms + TICK },
      );
    }, TICK);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [reduceMotion, paused, targetRef, timelines]);

  const last = timelines[state.index].turns.at(-1)!;
  return {
    index: state.index,
    // Reduced motion: each scenario is shown complete and changes only when chosen.
    ms: reduceMotion ? last.replyAt + 1 : state.ms,
    reduceMotion,
    paused,
    togglePause: () => setPaused((p) => !p),
    // Jumping skips the greeting and the first typing so the chosen task shows straight away.
    jump: (index: number) => setState({ index, ms: timelines[index].turns[0].sentAt }),
  };
}

const CAPABILITY_ICONS: LucideIcon[] = [FileText, Clock, ChartColumn, Receipt];

/**
 * The Birdy section's two columns: `intro` (heading and copy) with capability
 * cards that drive the chat, and the chat with two small floating cards.
 */
export function BirdyDemo({ intro }: { intro: ReactNode }) {
  const locale = useLocale();
  const t = COPY[locale];
  const ref = useRef<HTMLDivElement>(null);
  const { index, ms, reduceMotion, paused, togglePause, jump } = usePlayer(ref, TIMELINES[locale]);
  const scenario = SCENARIOS[locale][index];
  const { turns, length } = TIMELINES[locale][index];
  const sentTurns = turns.filter((turn) => ms >= turn.sentAt);
  const typing = turns.find((turn) => ms >= turn.typeFrom && ms < turn.sentAt);
  const fading = ms >= length - FADE;
  const typed = typing ? typing.ask.slice(0, Math.floor((ms - typing.typeFrom) / PER_CHAR)) : "";
  const progress = Math.min(1, ms / length);

  return (
    <div ref={ref} className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16">
      <div>
        {intro}

        {/* Capability cards: what Birdy can do; each one plays its example in the chat */}
        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold tracking-[0.06em] text-[#B8C4D3] uppercase">{t.tryExample}</p>
            {!reduceMotion && (
              <button
                type="button"
                onClick={togglePause}
                aria-label={paused ? t.play : t.pause}
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
              >
                {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
              </button>
            )}
          </div>
          <div role="group" aria-label={t.examples} className="grid grid-cols-2 gap-3">
            {t.capabilities.map(({ title, text }, i) => {
              const Icon = CAPABILITY_ICONS[i];
              const active = i === index;
              return (
                <button
                  key={title}
                  type="button"
                  aria-pressed={active}
                  onClick={() => jump(i)}
                  className={cn(
                    "relative flex cursor-pointer flex-col items-start justify-start overflow-hidden rounded-xl p-4 text-left transition-colors duration-200",
                    active ? "bg-blue" : "bg-white/5 hover:bg-blue",
                  )}
                >
                  <span className={cn("flex size-8 items-center justify-center rounded-lg", active ? "bg-green text-white" : "bg-white/10 text-white")}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-[15px] font-semibold text-white">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-[#B8C4D3]">{text}</span>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
                    {active && <span className="block h-full bg-green" style={{ width: `${(reduceMotion ? 1 : progress) * 100}%` }} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[520px] lg:mr-0">
        <p className="sr-only">{t.summary}</p>

        <div aria-hidden="true" className="relative sm:pt-12">
          <BirdyChatShell
            className="h-[740px] sm:h-[650px] lg:h-[700px] xl:h-[650px]"
            monthlyRequests={500}
            requestsLeft={476 - index - sentTurns.length}
            inputActive={typed.length > 0}
            fading={fading}
            input={
              typed && (
                <span className="text-[#1F2937]">
                  {typed}
                  <TypingCaret />
                </span>
              )
            }
          >
            {/* The opening greeting, until the first message is sent */}
            {scenario.greet && sentTurns.length === 0 && <Greeting picked={ms >= GREET_MS - 900} />}
            {sentTurns.map((turn) => (
              <div key={turn.ask} className="space-y-3.5">
                <UserMessage>{turn.ask}</UserMessage>
                <BirdyMessage>
                  {ms >= turn.replyAt ? (
                    <div className="animate-fade-in">
                      <p className="text-[14px]">{turn.reply}</p>
                      {turn.result}
                    </div>
                  ) : (
                    <ThinkingDots />
                  )}
                </BirdyMessage>
              </div>
            ))}
          </BirdyChatShell>

          {/* Floating card: who Birdy is */}
          <div className="absolute top-0 -left-6 hidden items-center gap-3 rounded-xl bg-blue py-2.5 pr-4 pl-2.5 shadow-[0_12px_32px_rgba(4,16,32,0.35)] sm:flex xl:-left-12">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/10">
              <BirdyMascot size={30} />
            </span>
            <span>
              <span className="block text-[14px] leading-tight font-semibold text-white">Birdy</span>
              <span className="block text-[12px] text-[#B8C4D3]">{t.assistant}</span>
            </span>
            <span className="ml-1 flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-green">
              <span className="size-1.5 rounded-full bg-green" /> {t.online}
            </span>
          </div>

          {/* Floating card: what it works from, over the chat's bottom edge */}
          <div className="absolute -right-4 -bottom-5 hidden lg:right-2 items-center gap-2 rounded-full border border-green/30 bg-white px-4 py-2 text-[13px] font-medium text-navy sm:flex xl:-right-4 min-[1400px]:-right-10">
            {t.usesSaved}
          </div>
        </div>
      </div>
    </div>
  );
}
