"use client";

import { useRef } from "react";
import { CalendarClock, Check, Download, ListChecks, PenLine, Send, ShieldCheck, Sparkles, Users } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { CONTRACT, CONTRACT_ORDER, MiniContract, type ContractPart, type ContractState, type Milestone, type Service } from "./mini-contract";
import { ProposalWindow } from "./mini-proposal";
import { Cursor, cursorAt, InvoiceSlot, SOFT_SHADOW, Stage, typed, useLoop } from "./mock-kit";
import { BuilderSidebar, CLIENTS, type SidebarItem } from "./proposal-mocks";

/* The contract sidebar ------------------------------------------------------------- */

type Todo = "title" | "name" | "email" | "priced";

/** Signing is done already ("Signed by you"), so Ready to send starts at 1 of 5. */
const TODOS: Localized<{ key: Todo; label: string }[]> = {
  en: [
    { key: "title", label: "Add a contract title" },
    { key: "name", label: "Add the client name" },
    { key: "email", label: "Add the client email" },
    { key: "priced", label: "Add a priced service or milestone" },
  ],
  fr: [
    { key: "title", label: "Ajouter un titre au contrat" },
    { key: "name", label: "Ajouter le nom du client" },
    { key: "email", label: "Ajouter l’e-mail du client" },
    { key: "priced", label: "Chiffrer une prestation ou un jalon" },
  ],
};

const BUILD: Localized<Record<ContractPart, Omit<SidebarItem, "key">>> = {
  en: {
    cover: { name: "Cover", sub: "Title, number, dates", icon: Sparkles },
    parties: { name: "Parties", sub: "Provider and client", icon: Users },
    services: { name: "Services", sub: "Scope of work", icon: ListChecks },
    schedule: { name: "Payment Schedule", sub: "Milestones and amounts", icon: CalendarClock },
    terms: { name: "Terms", sub: "Terms and conditions", icon: ShieldCheck },
    signatures: { name: "Signatures", sub: "Signed by you", icon: PenLine, signed: true },
  },
  fr: {
    cover: { name: "Couverture", sub: "Titre, numéro, dates", icon: Sparkles },
    parties: { name: "Parties", sub: "Prestataire et client", icon: Users },
    services: { name: "Prestations", sub: "Périmètre des travaux", icon: ListChecks },
    schedule: { name: "Échéancier de paiement", sub: "Jalons et montants", icon: CalendarClock },
    terms: { name: "Conditions", sub: "Conditions générales", icon: ShieldCheck },
    signatures: { name: "Signatures", sub: "Signé par vous", icon: PenLine, signed: true },
  },
};

const copyEn = {
  noun: "contract",
  savedClients: "SAVED CLIENTS",
  send: "Send",
  sent: "Sent",
  builder: "The contract builder: selecting each section in the left list jumps to it on the contract, and Ready to send fills up.",
  cover: "Cover: typing the contract title and description, then setting the effective and expiration dates.",
  parties: "Parties: searching saved clients and choosing Harbour Logistics; the client's name, email, phone and address fill in.",
  services: "Services: adding two monthly services with a rate and quantity; the total updates.",
  schedule: "Payment Schedule: adding four quarterly payments with due dates and amounts.",
  terms: "Terms: typing the terms and conditions, then the payment method and due terms.",
  signatures: "Signatures: your signature is in place as the provider; the client's line awaits their signature.",
  arrange: "Moving the Payment Schedule below Terms with the down arrow; the sidebar list follows.",
  sendLabel: "The action bar: download the PDF, then send the contract; it's marked Sent and awaits the client's signature.",
};

const COPY: Localized<typeof copyEn> = {
  en: copyEn,
  fr: {
    noun: "contrat",
    savedClients: "CLIENTS ENREGISTRÉS",
    send: "Envoyer",
    sent: "Envoyé",
    builder: "L’éditeur de contrat : chaque section choisie dans la liste de gauche s’affiche sur le contrat, et la jauge Prêt à l’envoi se remplit.",
    cover: "Couverture : saisie du titre et de la description du contrat, puis choix des dates d’effet et d’expiration.",
    parties:
      "Parties : recherche parmi les clients enregistrés et choix de Harbour Logistics ; le nom, l’e-mail, le téléphone et l’adresse du client se remplissent.",
    services: "Prestations : ajout de deux prestations mensuelles avec prix unitaire et quantité ; le total se met à jour.",
    schedule: "Échéancier de paiement : ajout de quatre paiements trimestriels avec leur date d’échéance et leur montant.",
    terms: "Conditions : saisie des conditions générales, puis du mode de paiement et de l’échéance.",
    signatures: "Signatures : votre signature de prestataire est en place ; la ligne du client attend sa signature.",
    arrange: "L’échéancier de paiement passe sous les conditions grâce à la flèche vers le bas ; la liste latérale suit.",
    sendLabel: "La barre d’actions : téléchargement du PDF, puis envoi du contrat ; il passe à Envoyé et attend la signature du client.",
  },
};

const DONE_BEFORE: Record<ContractPart, Todo[]> = {
  cover: [],
  parties: ["title"],
  services: ["title", "name", "email"],
  schedule: ["title", "name", "email", "priced"],
  terms: ["title", "name", "email", "priced"],
  signatures: ["title", "name", "email", "priced"],
};

function ContractSidebar({
  active,
  done,
  order = CONTRACT_ORDER,
  click,
}: {
  active?: ContractPart;
  done: Todo[];
  order?: ContractPart[];
  click?: { key: ContractPart; ms: number; at: number };
}) {
  const locale = useLocale();
  return (
    <BuilderSidebar
      noun={COPY[locale].noun}
      todos={TODOS[locale]}
      total={5}
      done={done}
      items={order.map((key) => ({ key, ...BUILD[locale][key] }))}
      active={active}
      click={click}
    />
  );
}

/** Sidebar on the left, the contract window on the right; the cursor picks `part` at `clickAt`. */
function ContractStage({
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
  part: ContractPart;
  done: Todo[];
  doc: ContractState;
  clickAt?: number;
  order?: ContractPart[];
}) {
  const selected = ms >= clickAt + 100;
  return (
    <Stage ref={stageRef} label={label}>
      <ContractSidebar active={selected ? part : undefined} done={done} order={order} click={{ key: part, ms, at: clickAt }} />
      <InvoiceSlot>
        <ProposalWindow focus={selected ? part : undefined}>
          <MiniContract order={order} focus={selected ? part : undefined} {...doc} />
        </ProposalWindow>
      </InvoiceSlot>
    </Stage>
  );
}

/** An empty contract after `part`, so each step builds on the ones before it. */
const EMPTY_FROM: Record<ContractPart, ContractState> = {
  cover: { title: "", description: "", effective: "", expiration: "", client: false, services: [], milestones: [], terms: "", method: "", due: "", instructions: "" },
  parties: { client: false, services: [], milestones: [], terms: "", method: "", due: "", instructions: "" },
  services: { services: [], milestones: [], terms: "", method: "", due: "", instructions: "" },
  schedule: { milestones: [], terms: "", method: "", due: "", instructions: "" },
  terms: { terms: "", method: "", due: "", instructions: "" },
  signatures: {},
};

/* 1. The builder ------------------------------------------------------------------- */

const STEP = 1_400;
const TICKS: Partial<Record<ContractPart, Todo[]>> = { cover: ["title"], parties: ["name", "email"], services: ["priced"] };

export function ContractBuilderMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, CONTRACT_ORDER.length * STEP + 1_600);
  const current = Math.min(CONTRACT_ORDER.length - 1, Math.floor(ms / STEP));
  const reached = Math.min(CONTRACT_ORDER.length, Math.floor((ms + STEP / 2) / STEP));
  const done = CONTRACT_ORDER.slice(0, reached).flatMap((p) => TICKS[p] ?? []);
  const part = CONTRACT_ORDER[current];
  const t = COPY[useLocale()];

  return (
    <Stage ref={ref} label={t.builder}>
      <ContractSidebar active={part} done={done} />
      <InvoiceSlot>
        <ProposalWindow focus={part}>
          <MiniContract focus={part} />
        </ProposalWindow>
      </InvoiceSlot>
    </Stage>
  );
}

/* 3. Cover ------------------------------------------------------------------------- */

const COVER = { title: 1_200, description: 2_800, effective: 5_000, expiration: 6_000 };

export function ContractCoverMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000);
  const locale = useLocale();
  const c = CONTRACT[locale];
  const title = typed(c.title, ms, COVER.title, 40);
  const description = typed(c.description, ms, COVER.description, 18);
  const titled = title === c.title;
  return (
    <ContractStage
      ms={ms}
      stageRef={ref}
      label={COPY[locale].cover}
      part="cover"
      done={titled ? ["title"] : []}
      doc={{
        ...EMPTY_FROM.cover,
        title,
        description,
        effective: ms >= COVER.effective + 300 ? c.effective : "",
        expiration: ms >= COVER.expiration + 300 ? c.expiration : "",
        picking: ms >= COVER.effective - 200 && ms < COVER.effective + 600 ? "effective" : ms >= COVER.expiration - 200 && ms < COVER.expiration + 600 ? "expiration" : undefined,
        caret: ms >= COVER.title && !titled ? "title" : ms >= COVER.description && description !== c.description ? "description" : undefined,
      }}
    />
  );
}

/* 4. Parties ----------------------------------------------------------------------- */

const PARTIES = { search: 1_800, pick: 3_400 };

function ClientMenu({ ms }: { ms: number }) {
  const hover = ms >= PARTIES.pick - 700;
  const t = COPY[useLocale()];
  return (
    <span className={cn("absolute top-full left-0 z-20 mt-1.5 block w-[180px] rounded-lg border border-line bg-white p-1 text-left text-[10px] font-normal text-navy", SOFT_SHADOW)}>
      <span className="block px-2 pt-1 pb-1.5 text-[8.5px] tracking-[0.12em] text-[#9CA3AF]">{t.savedClients}</span>
      {CLIENTS.map((name, i) => (
        <span key={name} className={cn("relative block rounded-md px-2 py-1.5", i === 0 && hover && "bg-[#F3F5F7]")}>
          {name}
          {i === 0 && <Cursor {...cursorAt(ms, PARTIES.pick)} className="top-4 left-[45%]" />}
        </span>
      ))}
    </span>
  );
}

export function ContractPartiesMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000, 5_000);
  const picked = ms >= PARTIES.pick + 100;
  const t = COPY[useLocale()];
  return (
    <ContractStage
      ms={ms}
      stageRef={ref}
      label={t.parties}
      part="parties"
      done={picked ? ["title", "name", "email"] : DONE_BEFORE.parties}
      doc={{
        ...EMPTY_FROM.parties,
        client: picked,
        searchCursor: cursorAt(ms, PARTIES.search),
        clientMenu: ms >= PARTIES.search && !picked ? <ClientMenu ms={ms} /> : undefined,
      }}
    />
  );
}

/** Adds rows one at a time: the name types out, then the rest appears. */
function typedRows<T extends { name: string }>(rows: T[], ms: number, starts: number[], fill: (row: T) => Partial<T>) {
  return rows.flatMap((row, i) => {
    if (ms < starts[i]) return [];
    const name = typed(row.name, ms, starts[i], 35);
    const complete = name === row.name && ms >= starts[i] + row.name.length * 35 + 250;
    return [complete ? row : ({ ...row, ...fill(row), name } as T)];
  });
}

/* 5. Services ---------------------------------------------------------------------- */

export function ContractServicesMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_500, 5_500);
  const locale = useLocale();
  const services = typedRows<Service>(CONTRACT[locale].services, ms, [1_300, 3_200], () => ({ rate: undefined, qty: undefined }));
  const priced = services[0]?.rate !== undefined;
  const last = services.at(-1);
  return (
    <ContractStage
      ms={ms}
      stageRef={ref}
      label={COPY[locale].services}
      part="services"
      done={[...DONE_BEFORE.services, ...(priced ? (["priced"] as const) : [])]}
      doc={{ ...EMPTY_FROM.services, services, caret: last && last.rate === undefined ? "services" : undefined }}
    />
  );
}

/* 6. Payment schedule -------------------------------------------------------------- */

export function ContractScheduleMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000, 6_500);
  const locale = useLocale();
  const milestones = typedRows<Milestone>(CONTRACT[locale].milestones, ms, [1_300, 2_600, 3_900, 5_200], () => ({ due: undefined, amount: undefined }));
  const last = milestones.at(-1);
  return (
    <ContractStage
      ms={ms}
      stageRef={ref}
      label={COPY[locale].schedule}
      part="schedule"
      done={DONE_BEFORE.schedule}
      doc={{ ...EMPTY_FROM.schedule, milestones, caret: last && last.due === undefined ? "milestones" : undefined }}
    />
  );
}

/* 7. Terms ------------------------------------------------------------------------- */

const TERMS = { text: 1_200, method: 5_600, due: 6_500 };

export function ContractTermsMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 9_000, 8_000);
  const locale = useLocale();
  const c = CONTRACT[locale];
  const terms = typed(c.terms, ms, TERMS.text, 30);
  const method = typed(c.method, ms, TERMS.method, 50);
  const due = typed(c.due, ms, TERMS.due, 70);
  const caret =
    ms >= TERMS.text && terms !== c.terms ? "terms" : ms >= TERMS.method && method !== c.method ? "method" : ms >= TERMS.due && due !== c.due ? "due" : undefined;
  return (
    <ContractStage
      ms={ms}
      stageRef={ref}
      label={COPY[locale].terms}
      part="terms"
      done={DONE_BEFORE.terms}
      doc={{ ...EMPTY_FROM.terms, terms, method, due, instructions: ms >= 7_200 ? c.instructions : "", caret }}
    />
  );
}

/* 8. Signatures -------------------------------------------------------------------- */

export function ContractSignaturesMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 5_000, 3_000);
  const t = COPY[useLocale()];
  return (
    <ContractStage
      ms={ms}
      stageRef={ref}
      label={t.signatures}
      part="signatures"
      done={DONE_BEFORE.signatures}
      doc={{}}
    />
  );
}

/* 9. Arrange sections -------------------------------------------------------------- */

const MOVE_AT = 2_600;
const MOVED: ContractPart[] = ["cover", "parties", "services", "terms", "schedule", "signatures"];

export function ContractArrangeMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 6_500, 4_000);
  const order = ms >= MOVE_AT + 100 ? MOVED : CONTRACT_ORDER;
  const t = COPY[useLocale()];
  return (
    <ContractStage
      ms={ms}
      stageRef={ref}
      label={t.arrange}
      part="schedule"
      done={DONE_BEFORE.signatures}
      order={order}
      doc={{ downCursor: cursorAt(ms, MOVE_AT) }}
    />
  );
}

/* 10. PDF and send ----------------------------------------------------------------- */

const C_SEND = { pdf: 1_400, send: 3_200 };

export function ContractSendMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000, 5_000);
  const downloaded = ms >= C_SEND.pdf && ms < C_SEND.pdf + 1_400;
  const sent = ms >= C_SEND.send + 400;
  const t = COPY[useLocale()];
  return (
    <Stage ref={ref} label={t.sendLabel}>
      <div className="flex flex-col items-center gap-5">
        <div className={cn("flex items-center gap-1 rounded-2xl border border-line bg-white p-1.5 text-[13px]", SOFT_SHADOW)}>
          <span className="relative flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 font-medium text-navy">
            {downloaded ? <Check size={15} className="text-green" /> : <Download size={15} />} PDF
            <Cursor {...cursorAt(ms, C_SEND.pdf)} className="top-5 left-[55%]" />
          </span>
          <span className="relative flex items-center gap-1.5 rounded-lg bg-green px-3.5 py-2 font-semibold text-white">
            {sent ? <Check size={15} /> : <Send size={15} />} {sent ? t.sent : t.send}
            <Cursor {...cursorAt(ms, C_SEND.send)} className="top-5 left-[45%]" />
          </span>
        </div>
        <InvoiceSlot>
          <ProposalWindow focus={sent ? "signatures" : undefined} height={460}>
            <MiniContract status={sent ? "Sent" : "Draft"} />
          </ProposalWindow>
        </InvoiceSlot>
      </div>
    </Stage>
  );
}
