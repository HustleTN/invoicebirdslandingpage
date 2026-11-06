"use client";

import type { ReactNode } from "react";
import { CalendarDays, ChevronDown, Search } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { gbp, RidgewayLogo, SignatureStroke, THEMES } from "./mini-invoice";
import { AddRow, Caret, RichToolbar, SectionBlock } from "./mini-proposal";
import { Cursor } from "./mock-kit";

/* Sample data: Ridgeway Towing & Recovery Ltd contracting with Harbour Logistics Ltd. */

export type ContractPart = "cover" | "parties" | "services" | "schedule" | "terms" | "signatures";

export const CONTRACT_ORDER: ContractPart[] = ["cover", "parties", "services", "schedule", "terms", "signatures"];

export type Service = { name: string; rate?: number; qty?: number };
export type Milestone = { name: string; due?: string; amount?: number };

const contractEn = {
  title: "Fleet Recovery Service Agreement",
  description: "24/7 breakdown recovery for Harbour Logistics' fleet of 40 vehicles across Yorkshire and the Humber.",
  effective: "1 Jan 2027",
  expiration: "31 Dec 2027",
  services: [
    { name: "24/7 recovery cover (monthly)", rate: 1_000, qty: 12 },
    { name: "Standby recovery truck (monthly)", rate: 200, qty: 12 },
  ] as Service[],
  milestones: [
    { name: "Q1 payment", due: "1 Jan 2027", amount: 3_600 },
    { name: "Q2 payment", due: "1 Apr 2027", amount: 3_600 },
    { name: "Q3 payment", due: "1 Jul 2027", amount: 3_600 },
    { name: "Q4 payment", due: "1 Oct 2027", amount: 3_600 },
  ] as Milestone[],
  terms:
    "Ridgeway responds to recovery calls within 60 minutes, 24 hours a day. Either party may end this agreement with 30 days' written notice.",
  method: "Bank transfer",
  due: "Net 14",
  instructions: "Barclays Business · Account 41263321 · Sort code 20-45-77",
};

export const CONTRACT: Localized<typeof contractEn> = {
  en: contractEn,
  fr: {
    title: "Contrat de dépannage de flotte",
    description: "Dépannage 24 h/24, 7 j/7 de la flotte de 40 véhicules de Harbour Logistics dans le Yorkshire et le Humber.",
    effective: "1er janv. 2027",
    expiration: "31 déc. 2027",
    services: [
      { name: "Couverture dépannage 24 h/24 (par mois)", rate: 1_000, qty: 12 },
      { name: "Dépanneuse en astreinte (par mois)", rate: 200, qty: 12 },
    ],
    milestones: [
      { name: "Paiement T1", due: "1er janv. 2027", amount: 3_600 },
      { name: "Paiement T2", due: "1er avr. 2027", amount: 3_600 },
      { name: "Paiement T3", due: "1er juil. 2027", amount: 3_600 },
      { name: "Paiement T4", due: "1er oct. 2027", amount: 3_600 },
    ],
    terms:
      "Ridgeway intervient sous 60 minutes, 24 h/24, sur tout appel de dépannage. Chaque partie peut résilier le contrat par préavis écrit de 30 jours.",
    method: "Virement bancaire",
    due: "14 jours",
    instructions: "Barclays Business · Compte 41263321 · Code guichet 20-45-77",
  },
};

const copyEn = {
  status: { Draft: "Draft", Sent: "Sent" },
  selectDate: "Select date",
  kind: "SERVICE CONTRACT",
  titleHint: "Professional Service Agreement",
  descriptionHint: "Brief description of the agreement…",
  effective: "EFFECTIVE DATE",
  expiration: "EXPIRATION DATE",
  search: "Search saved clients",
  provider: "PROVIDER",
  client: "CLIENT",
  clientName: "Client",
  fullName: "Full name",
  email: "email@example.com",
  phone: "Phone number",
  address: "Address",
  services: "SERVICES",
  columns: ["DESCRIPTION", "RATE", "QTY", "AMOUNT"],
  noServices: "No services yet. Add one below",
  addService: "Add service",
  total: "TOTAL",
  schedule: "PAYMENT SCHEDULE",
  noMilestones: "No milestones yet. Add one below",
  addMilestone: "Add milestone",
  scheduled: (part: string, total: string) => `Scheduled ${part} of ${total}`,
  terms: "TERMS & CONDITIONS",
  paymentTerms: "PAYMENT TERMS",
  method: "Method",
  methodHint: "e.g. Bank Transfer",
  due: "Due",
  dueHint: "e.g. Net 30",
  instructions: "Instructions",
  instructionsHint: "Additional payment instructions…",
  signatures: "SIGNATURES",
  awaiting: "Awaiting signature",
};

const COPY: Localized<typeof copyEn> = {
  en: copyEn,
  fr: {
    status: { Draft: "Brouillon", Sent: "Envoyé" },
    selectDate: "Choisir une date",
    kind: "CONTRAT DE PRESTATION",
    titleHint: "Contrat de prestation de services",
    descriptionHint: "Brève description du contrat…",
    effective: "DATE D’EFFET",
    expiration: "DATE D’EXPIRATION",
    search: "Rechercher un client enregistré",
    provider: "PRESTATAIRE",
    client: "CLIENT",
    clientName: "Client",
    fullName: "Nom complet",
    email: "email@exemple.com",
    phone: "Téléphone",
    address: "Adresse",
    services: "PRESTATIONS",
    columns: ["DÉSIGNATION", "P.U.", "QTÉ", "MONTANT"],
    noServices: "Aucune prestation. Ajoutez-en une ci-dessous",
    addService: "Ajouter une prestation",
    total: "TOTAL",
    schedule: "ÉCHÉANCIER DE PAIEMENT",
    noMilestones: "Aucun jalon. Ajoutez-en un ci-dessous",
    addMilestone: "Ajouter un jalon",
    scheduled: (part: string, total: string) => `Planifié : ${part} sur ${total}`,
    terms: "CONDITIONS GÉNÉRALES",
    paymentTerms: "CONDITIONS DE PAIEMENT",
    method: "Mode de paiement",
    methodHint: "ex. Virement bancaire",
    due: "Échéance",
    dueHint: "ex. 30 jours",
    instructions: "Instructions",
    instructionsHint: "Instructions de paiement complémentaires…",
    signatures: "SIGNATURES",
    awaiting: "En attente de signature",
  },
};

export type ContractState = {
  title?: string;
  description?: string;
  effective?: string;
  expiration?: string;
  client?: boolean;
  services?: Service[];
  milestones?: Milestone[];
  terms?: string;
  method?: string;
  due?: string;
  instructions?: string;
  theme?: keyof typeof THEMES;
  rounded?: boolean;
  order?: ContractPart[];
  focus?: ContractPart;
  caret?: "title" | "description" | "services" | "milestones" | "terms" | "method" | "due";
  /** The date box being picked. */
  picking?: "effective" | "expiration";
  status?: "Draft" | "Sent";
  /** A cursor on Search saved clients, and the menu it opens. */
  searchCursor?: { visible: boolean; clicking: boolean };
  clientMenu?: ReactNode;
  downCursor?: { visible: boolean; clicking: boolean };
};

const heading = "text-[8.5px] font-semibold tracking-[0.22em] text-[#8A94A3]";
const empty = "text-[10px] text-[#B5BDC7] italic";
const placeholder = "text-[#A3ACB8] italic";

function DateBox({ label, value, hint, active, radius }: { label: string; value: string; hint: string; active: boolean; radius: number }) {
  return (
    <div className={cn("border px-3 py-2 transition-colors", active ? "border-green ring-2 ring-green/15" : "border-[#E5E7EB]")} style={{ borderRadius: radius }}>
      <p className="text-[7.5px] font-semibold tracking-[0.18em] text-[#8A94A3]">{label}</p>
      <p className={cn("mt-1 flex items-center gap-1.5 text-[11px] font-semibold", !value && "text-[#374151] italic")}>
        <CalendarDays size={10} className="text-[#9CA3AF]" /> {value || hint}
      </p>
    </div>
  );
}

function SmallField({ label, value, hint, caret, tall, radius }: { label: string; value: string; hint: string; caret?: boolean; tall?: boolean; radius: number }) {
  return (
    <div>
      <p className="mb-1 text-[9.5px] text-[#374151]">{label}</p>
      <p
        className={cn("border px-2.5 py-1.5", tall && "min-h-[38px]", caret ? "border-green ring-2 ring-green/15" : "border-[#E5E7EB]")}
        style={{ borderRadius: radius }}
      >
        {value ? <span>{value}</span> : <span className="text-[#A3ACB8]">{hint}</span>}
        {caret && <Caret />}
      </p>
    </div>
  );
}

/** The sample contract (520px wide). Unset props use a complete contract. */
export function MiniContract(props: ContractState) {
  const locale = useLocale();
  const t = COPY[locale];
  const s = {
    ...CONTRACT[locale],
    client: true,
    theme: "red" as keyof typeof THEMES,
    rounded: false,
    order: CONTRACT_ORDER,
    status: "Draft" as const,
    ...Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)),
  } as typeof contractEn & Required<Pick<ContractState, "client" | "theme" | "rounded" | "order" | "status">> & ContractState;
  const theme = THEMES[s.theme];
  const radius = s.rounded ? 10 : 4;
  const money = (n: number) => gbp(n, locale);
  const total = s.services.reduce((sum, r) => sum + (r.rate ?? 0) * (r.qty ?? 0), 0);
  const scheduled = s.milestones.reduce((sum, m) => sum + (m.amount ?? 0), 0);

  const sections: Record<ContractPart, ReactNode> = {
    cover: (
      <>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="[zoom:0.72]">
              <RidgewayLogo />
            </div>
            <div className="leading-[1.45]">
              <p className="font-semibold">Ridgeway Towing &amp; Recovery Ltd</p>
              <p className="text-[9px] text-[#6B7280]">hello@ridgewaytowing.co.uk</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[7.5px] font-semibold tracking-[0.2em] text-[#8A94A3]">{t.kind}</p>
            <p className="mt-1 font-mono text-[10px] text-[#6B7280] italic">CONT-001</p>
          </div>
        </div>
        <p className={cn("mt-4 text-[16px] font-bold transition-colors duration-500", !s.title && "text-[#A3ACB8] italic")} style={s.title ? { color: theme.primary } : undefined}>
          {s.title || t.titleHint}
          {s.caret === "title" && <Caret />}
        </p>
        <p className={cn("mt-1 leading-snug", s.description ? "text-[#4B5563]" : placeholder)}>
          {s.description || t.descriptionHint}
          {s.caret === "description" && <Caret />}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <DateBox label={t.effective} value={s.effective} hint={t.selectDate} active={s.picking === "effective"} radius={radius} />
          <DateBox label={t.expiration} value={s.expiration} hint={t.selectDate} active={s.picking === "expiration"} radius={radius} />
        </div>
      </>
    ),
    parties: (
      <>
        <p className="relative inline-flex items-center gap-1 text-[9.5px] font-medium text-[#06B047]">
          <Search size={10} /> {t.search} <ChevronDown size={10} />
          {s.searchCursor && <Cursor {...s.searchCursor} className="top-3 left-[60%]" />}
          {s.clientMenu}
        </p>
        <div className="mt-2.5 grid grid-cols-2 border-t border-[#EEF0F3] pt-2.5 leading-[1.6]">
          <div className="border-r border-[#EEF0F3] pr-4">
            <p className={heading}>{t.provider}</p>
            <p className="mt-1 font-semibold transition-colors duration-500" style={{ color: theme.primary }}>
              Ridgeway Towing &amp; Recovery Ltd
            </p>
            <p className="text-[#4B5563]">hello@ridgewaytowing.co.uk</p>
            <p className="text-[#4B5563]">+44 113 496 0721</p>
            <p className="text-[#4B5563]">Unit 4, Brookfield Industrial Estate, Leeds LS11 5QR</p>
          </div>
          <div className="pl-4">
            <p className={heading}>{t.client}</p>
            {s.client ? (
              <div className="animate-fade-in">
                <p className="mt-1 font-semibold">Harbour Logistics Ltd</p>
                <p className="text-[#4B5563]">accounts@harbourlogistics.co.uk</p>
                <p className="text-[#4B5563]">+44 1482 496 210</p>
                <p className="text-[#4B5563]">Dock Road, Hull HU9 1TA</p>
              </div>
            ) : (
              <>
                <p className={cn("mt-1 font-semibold", placeholder)}>{t.fullName}</p>
                <p className={placeholder}>{t.email}</p>
                <p className={placeholder}>{t.phone}</p>
                <p className={placeholder}>{t.address}</p>
              </>
            )}
          </div>
        </div>
      </>
    ),
    services: (
      <>
        <p className={heading}>{t.services}</p>
        <div className="mt-2 overflow-hidden border border-[#E5E7EB] transition-[border-radius]" style={{ borderRadius: radius }}>
          <div
            className="grid grid-cols-[1fr_64px_34px_70px] gap-2 px-3 py-2 text-[7.5px] font-semibold tracking-[0.16em] text-white transition-colors duration-500"
            style={{ backgroundColor: theme.primary }}
          >
            <span>{t.columns[0]}</span>
            <span className="text-right">{t.columns[1]}</span>
            <span className="text-center">{t.columns[2]}</span>
            <span className="text-right">{t.columns[3]}</span>
          </div>
          {s.services.length ? (
            s.services.map((r, i) => (
              <div key={i} className={cn("grid grid-cols-[1fr_64px_34px_70px] gap-2 px-3 py-2", i > 0 && "border-t border-[#EEF0F3]")}>
                <span className="truncate font-medium">
                  {r.name}
                  {s.caret === "services" && i === s.services.length - 1 && r.rate === undefined && <Caret />}
                </span>
                <span className="text-right tabular-nums">{r.rate !== undefined ? money(r.rate) : "-"}</span>
                <span className="text-center">{r.qty ?? "-"}</span>
                <span className="text-right font-semibold tabular-nums">{r.rate !== undefined && r.qty !== undefined ? money(r.rate * r.qty) : "-"}</span>
              </div>
            ))
          ) : (
            <p className={cn("py-5 text-center", empty)}>{t.noServices}</p>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <AddRow label={t.addService} />
          {total > 0 && (
            <p className="mt-2 flex items-baseline gap-2.5">
              <span className="text-[8px] font-semibold tracking-[0.16em] text-[#6B7280]">{t.total}</span>
              <span className="text-[14px] font-bold tabular-nums transition-colors duration-500" style={{ color: theme.primary }}>
                {money(total)}
              </span>
            </p>
          )}
        </div>
      </>
    ),
    schedule: (
      <>
        <div className="overflow-hidden border border-[#E5E7EB] transition-[border-radius]" style={{ borderRadius: radius }}>
          <p className="px-3 py-2 text-[7.5px] font-semibold tracking-[0.16em] text-white transition-colors duration-500" style={{ backgroundColor: theme.primary }}>
            {t.schedule}
          </p>
          {s.milestones.length ? (
            s.milestones.map((m, i) => (
              <div key={i} className={cn("grid grid-cols-[1fr_auto_70px] items-center gap-3 px-3 py-1.5", i > 0 && "border-t border-[#EEF0F3]")}>
                <span className="font-medium">
                  {m.name}
                  {s.caret === "milestones" && i === s.milestones.length - 1 && m.due === undefined && <Caret />}
                </span>
                <span className="flex items-center gap-1 text-[9.5px] text-[#6B7280]">{m.due && <CalendarDays size={9} />} {m.due}</span>
                <span className="text-right font-semibold tabular-nums">{m.amount !== undefined ? money(m.amount) : ""}</span>
              </div>
            ))
          ) : (
            <p className={cn("py-5 text-center", empty)}>{t.noMilestones}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <AddRow label={t.addMilestone} />
          {scheduled > 0 && <p className="mt-2 text-[9.5px] text-[#6B7280]">{t.scheduled(money(scheduled), money(total))}</p>}
        </div>
      </>
    ),
    terms: (
      <>
        <p className={heading}>{t.terms}</p>
        <div className="mt-2 border border-[#E5E7EB] px-3 pb-3" style={{ borderRadius: radius }}>
          <RichToolbar />
          <p className={cn("mt-2 min-h-[30px] leading-[1.55]", s.terms ? "text-[#374151]" : empty)}>
            {s.terms}
            {s.caret === "terms" && <Caret />}
          </p>
        </div>
        <p className={cn(heading, "mt-3")}>{t.paymentTerms}</p>
        <div className="mt-1.5 grid grid-cols-2 gap-2.5">
          <SmallField label={t.method} value={s.method} hint={t.methodHint} caret={s.caret === "method"} radius={radius} />
          <SmallField label={t.due} value={s.due} hint={t.dueHint} caret={s.caret === "due"} radius={radius} />
        </div>
        <div className="mt-2">
          <SmallField label={t.instructions} value={s.instructions} hint={t.instructionsHint} tall radius={radius} />
        </div>
      </>
    ),
    signatures: (
      <>
        <p className={heading}>{t.signatures}</p>
        <div className="mt-2 grid grid-cols-2 gap-6">
          <div>
            <div className="flex h-[40px] items-end border-b border-[#D1D5DB] pb-1">
              <SignatureStroke progress={1} className="h-[34px] w-auto" />
            </div>
            <p className="mt-1.5 font-semibold">Ridgeway Towing &amp; Recovery Ltd</p>
            <p className="text-[7.5px] tracking-[0.16em] text-[#9CA3AF]">{t.provider}</p>
          </div>
          <div>
            <div className="flex h-[40px] items-end justify-center border-b border-[#D1D5DB] pb-1.5 text-[9px] text-[#9CA3AF]">
              {s.status === "Sent" ? <span className="animate-pulse">{t.awaiting}</span> : t.awaiting}
            </div>
            <p className="mt-1.5 font-semibold">{s.client ? "Harbour Logistics Ltd" : t.clientName}</p>
            <p className="text-[7.5px] tracking-[0.16em] text-[#9CA3AF]">{t.client}</p>
          </div>
        </div>
      </>
    ),
  };

  return (
    <div className="relative w-[520px] overflow-hidden rounded-xl border border-line bg-white px-8 pt-7 pb-5 font-[Helvetica,Arial,sans-serif] text-[10.5px] text-[#111827] shadow-[0_12px_40px_rgba(10,37,64,0.08),0_2px_6px_rgba(10,37,64,0.04)]">
      <span className="absolute inset-x-0 top-0 h-[4px] transition-colors duration-500" style={{ backgroundColor: theme.primary }} />
      <span
        className={cn(
          "absolute top-2.5 right-3 rounded-full px-2 py-0.5 text-[9px] font-semibold transition-colors",
          s.status === "Sent" ? "bg-[#E8F7EE] text-green" : "bg-[#F1F3F5] text-[#4B5563]",
        )}
      >
        {t.status[s.status]}
      </span>
      {s.order.map((part) => (
        <SectionBlock key={part} part={part} on={s.focus === part} downCursor={s.focus === part ? s.downCursor : undefined}>
          {sections[part]}
        </SectionBlock>
      ))}
    </div>
  );
}
