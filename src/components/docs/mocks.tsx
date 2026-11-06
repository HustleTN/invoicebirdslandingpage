"use client";

import { useRef, type ReactNode } from "react";
import {
  BadgePercent,
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileText,
  Info,
  Link2,
  Mail,
  MapPin,
  PenTool,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash,
  Upload,
  Users,
  X,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { gbp, ITEMS, MiniInvoice, RidgewayLogo, SignatureStroke, totalsFor, type DocKind, type Part } from "./mini-invoice";
import { Cursor, cursorAt, Field, InvoiceSlot, Label, Panel, SOFT_SHADOW, Stage, ToggleCard, typed, useLoop } from "./mock-kit";

/** The document noun with its French articles. */
const FR_DOC: Record<DocKind, { name: string; the: string; of: string; this: string; to: string; sent: string }> = {
  invoice: { name: "facture", the: "la facture", of: "de la facture", this: "cette facture", to: "à la facture", sent: "Envoyée" },
  estimate: { name: "devis", the: "le devis", of: "du devis", this: "ce devis", to: "au devis", sent: "Envoyé" },
};

const DATES: Localized<{ nov1: string; nov15: string; nov16: string; dec1: string }> = {
  en: { nov1: "1 Nov 2026", nov15: "15 Nov 2026", nov16: "16 Nov 2026", dec1: "1 Dec 2026" },
  fr: { nov1: "1er nov. 2026", nov15: "15 nov. 2026", nov16: "16 nov. 2026", dec1: "1er déc. 2026" },
};

/* 1. The builder ------------------------------------------------------------------- */

const SECTIONS: Localized<{ name: string; part: Part }[]> = {
  en: [
    { name: "Business Identity", part: "logo" },
    { name: "Client Details", part: "client" },
    { name: "Invoice Setup", part: "setup" },
    { name: "Items & Services", part: "items" },
    { name: "Taxes & Discounts", part: "totals" },
    { name: "Payment Methods", part: "payment" },
    { name: "Notes", part: "notes" },
    { name: "Terms & Conditions", part: "terms" },
    { name: "Signature", part: "signature" },
  ],
  fr: [
    { name: "Identité de l’entreprise", part: "logo" },
    { name: "Informations client", part: "client" },
    { name: "Configuration de la facture", part: "setup" },
    { name: "Articles et prestations", part: "items" },
    { name: "Taxes et remises", part: "totals" },
    { name: "Moyens de paiement", part: "payment" },
    { name: "Notes", part: "notes" },
    { name: "Conditions générales", part: "terms" },
    { name: "Signature", part: "signature" },
  ],
};
const SETUP_NAME: Localized<Record<DocKind, string>> = {
  en: { invoice: "Invoice Setup", estimate: "Estimate Setup" },
  fr: { invoice: "Configuration de la facture", estimate: "Configuration du devis" },
};
const STEP = 1_150;

const builderEn = {
  label: (kind: DocKind) => `The ${kind} builder: each section in the left list fills one part of the ${kind}.`,
  title: (kind: DocKind) => `Build your ${kind}`,
  ready: "Ready to send",
  of: "of",
  todos: ["Choose a client", "Add the client email", "Add a priced item"],
  allSet: "All set. Review and send.",
};

const BUILDER: Localized<typeof builderEn> = {
  en: builderEn,
  fr: {
    label: (kind) => `L’éditeur de ${FR_DOC[kind].name} : chaque section de la liste de gauche remplit une partie ${FR_DOC[kind].of}.`,
    title: (kind) => `Créez votre ${FR_DOC[kind].name}`,
    ready: "Prêt à l’envoi",
    of: "sur",
    todos: ["Choisir un client", "Ajouter l’e-mail du client", "Ajouter un article avec prix"],
    allSet: "Tout est prêt. Vérifiez et envoyez.",
  },
};

/** The estimate builder's "Ready to send" card: 2 of 5 to start, three to-dos that tick off. */
function EstimateReadiness({ done }: { done: number }) {
  const copy = BUILDER[useLocale()];
  // Sections reached so far: Client Details (2) brings the client and email, Items & Services (4) a priced item.
  const todos = [
    { label: copy.todos[0], ok: done >= 2 },
    { label: copy.todos[1], ok: done >= 2 },
    { label: copy.todos[2], ok: done >= 4 },
  ];
  const count = 2 + todos.filter((t) => t.ok).length;
  return (
    <div className="rounded-xl border border-line px-3 py-2.5">
      <div className="flex justify-between font-semibold">
        <span>{copy.ready}</span>
        <span className="font-normal text-[#6B7280]">
          {count} {copy.of} 5
        </span>
      </div>
      <div className="mt-2 mb-1.5 h-1.5 rounded-full bg-[#E9ECEF]">
        <div className="h-full rounded-full bg-green transition-[width] duration-300" style={{ width: `${(count / 5) * 100}%` }} />
      </div>
      {count === 5 ? (
        <p className="flex items-center gap-1.5 py-1 font-medium text-green">
          <Check size={13} /> {copy.allSet}
        </p>
      ) : (
        todos.map((t) => (
          <p key={t.label} className="flex items-center gap-2 py-1">
            <span className={cn("flex size-4 items-center justify-center rounded-full", t.ok ? "bg-green text-white" : "border border-dashed border-[#9CA3AF]")}>
              {t.ok && <Check size={10} strokeWidth={3} />}
            </span>
            <span className={cn("flex-1", t.ok ? "text-[#9CA3AF] line-through" : "text-[#374151]")}>{t.label}</span>
            <ChevronRight size={13} className="text-[#9CA3AF]" />
          </p>
        ))
      )}
    </div>
  );
}

export function BuilderMock({ kind = "invoice" }: { kind?: DocKind }) {
  const locale = useLocale();
  const t = BUILDER[locale];
  const ref = useRef<HTMLDivElement>(null);
  const sections = kind === "estimate" ? SECTIONS[locale].filter((x) => x.part !== "payment") : SECTIONS[locale];
  const ms = useLoop(ref, sections.length * STEP + 1_600);
  const current = Math.min(sections.length - 1, Math.floor(ms / STEP));
  const done = Math.min(sections.length, Math.floor((ms + STEP / 2) / STEP));

  return (
    <Stage ref={ref} label={t.label(kind)}>
      <Panel title={t.title(kind)} back={false}>
        {kind === "estimate" ? (
          <EstimateReadiness done={done} />
        ) : (
          <div>
            <div className="flex justify-between font-semibold">
              <span>{t.ready}</span>
              <span className="font-normal text-[#6B7280]">
                {done} {t.of} {sections.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[#E9ECEF]">
              <div className="h-full rounded-full bg-green transition-[width] duration-300" style={{ width: `${(done / sections.length) * 100}%` }} />
            </div>
          </div>
        )}
        <ul className="space-y-1">
          {sections.map((section, i) => (
            <li
              key={section.name}
              className={cn("flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors", i === current && "bg-[#06B047]/[0.08]")}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full transition-colors",
                  i < done ? "bg-green text-white" : "border border-dashed border-[#9CA3AF]",
                )}
              >
                {i < done && <Check size={10} strokeWidth={3} />}
              </span>
              <span className={cn("flex-1", i === current ? "font-semibold text-navy" : "text-[#374151]")}>
                {section.part === "setup" ? SETUP_NAME[locale][kind] : section.name}
              </span>
              <ChevronRight size={13} className="text-[#9CA3AF]" />
            </li>
          ))}
        </ul>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} highlight={sections[current].part} />
      </InvoiceSlot>
    </Stage>
  );
}

/* 2. Business identity & logo ------------------------------------------------------ */

const logoEn = {
  label: (kind: DocKind) => `Uploading the Ridgeway logo in Business Identity; it appears on the ${kind}.`,
  title: "Business Identity",
  synced: (kind: DocKind) => `Your business details are synced from Settings. Logo changes here apply only to this ${kind}.`,
  logoOn: (kind: DocKind) => `Logo on this ${kind}`,
  formats: "PNG, JPG or WebP · 512 × 512 or larger",
  replace: "Replace logo",
  upload: "Upload logo",
  useDefault: "Use default",
  details: "Business details",
  businessName: "Business name",
  email: "Email",
  addInSettings: "Add in Settings",
  phone: "Phone",
  address: "Address",
};

const LOGO: Localized<typeof logoEn> = {
  en: logoEn,
  fr: {
    label: (kind) => `Import du logo Ridgeway dans Identité de l’entreprise ; il apparaît sur ${FR_DOC[kind].the}.`,
    title: "Identité de l’entreprise",
    synced: (kind) => `Vos informations sont synchronisées depuis les Paramètres. Ce logo ne s’applique qu’à ${FR_DOC[kind].this}.`,
    logoOn: (kind) => `Logo de ${FR_DOC[kind].this}`,
    formats: "PNG, JPG ou WebP · 512 × 512 ou plus",
    replace: "Changer le logo",
    upload: "Importer un logo",
    useDefault: "Par défaut",
    details: "Informations de l’entreprise",
    businessName: "Nom de l’entreprise",
    email: "E-mail",
    addInSettings: "À ajouter dans les Paramètres",
    phone: "Téléphone",
    address: "Adresse",
  },
};

export function LogoMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = LOGO[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000);
  const uploaded = ms >= 1_800;

  return (
    <Stage ref={ref} label={t.label(kind)}>
      <Panel title={t.title}>
        <p className="flex gap-2 rounded-lg border border-[#D6E2F5] bg-[#F3F7FD] px-3 py-2 text-[11.5px] leading-snug text-[#1F3B6E]">
          <Info size={14} className="mt-0.5 shrink-0 text-[#2563EB]" />
          {t.synced(kind)}
        </p>
        <Label>{t.logoOn(kind)}</Label>
        <div className="flex h-[70px] items-center justify-center rounded-xl border border-line bg-[#F7F8FA]">
          {uploaded ? (
            <div className="animate-fade-in rounded-md bg-white px-3 py-2">
              <RidgewayLogo />
            </div>
          ) : (
            <p className="text-[11.5px] text-[#9CA3AF]">{t.formats}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 font-semibold">
          <span className="relative">
            <span className="flex items-center justify-center gap-1.5 rounded-lg bg-green py-2 text-white">
              <Upload size={13} /> {uploaded ? t.replace : t.upload}
            </span>
            <Cursor {...cursorAt(ms, 1_800)} className="top-5 left-[60%]" />
          </span>
          <span className="flex items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[#9CA3AF]">
            <RotateCcw size={13} /> {t.useDefault}
          </span>
        </div>
        <Label>{t.details}</Label>
        <ul className="divide-y divide-line rounded-lg border border-line">
          {(
            [
              [Users, t.businessName, "Ridgeway Towing & Recovery Ltd"],
              [Mail, t.email, t.addInSettings],
              [Phone, t.phone, "+44 113 496 0721"],
              [MapPin, t.address, "Unit 4, Brookfield Ind. Estate, Leeds"],
            ] as const
          ).map(([Icon, name, value]) => (
            <li key={name} className="flex items-center gap-2.5 px-3 py-2">
              <Icon size={14} className="shrink-0 text-[#6B7280]" />
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.08em] text-[#9CA3AF] uppercase">{name}</p>
                <p className={cn("truncate", value === t.addInSettings ? "text-[#9CA3AF] underline decoration-dotted" : "text-navy")}>{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} logo={uploaded} highlight="logo" />
      </InvoiceSlot>
    </Stage>
  );
}

/* 3. Client details ---------------------------------------------------------------- */

const CLIENTS = ["Harbour Logistics Ltd", "Northgate Haulage", "Daniel Carter"];

const clientEn = {
  label: (kind: DocKind) => `Selecting the saved client Harbour Logistics; the client details and the ${kind} fill in.`,
  title: "Client Details",
  select: "Select a saved client",
  saved: "3 saved · search & tap to fill",
  manual: "or enter manually",
  name: "Client name",
  email: "Email",
  address: "Address",
  addressPlaceholder: "Street, city, ZIP",
  postal: "Postal code",
  country: "Country",
  countryValue: "United Kingdom",
};

const CLIENT: Localized<typeof clientEn> = {
  en: clientEn,
  fr: {
    label: (kind) => `Sélection du client enregistré Harbour Logistics ; les informations client et ${FR_DOC[kind].the} se remplissent.`,
    title: "Informations client",
    select: "Choisir un client",
    saved: "3 enregistrés · recherche rapide",
    manual: "ou saisir manuellement",
    name: "Nom du client",
    email: "E-mail",
    address: "Adresse",
    addressPlaceholder: "Rue, ville, code postal",
    postal: "Code postal",
    country: "Pays",
    countryValue: "Royaume-Uni",
  },
};

export function ClientMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = CLIENT[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 9_000);
  const open = ms >= 1_000 && ms < 3_300;
  const query = typed("Harb", ms, 1_500, 140);
  const picked = ms >= 3_300;
  const list = query ? CLIENTS.filter((c) => c.toLowerCase().startsWith(query.toLowerCase())) : CLIENTS;

  return (
    <Stage ref={ref} label={t.label(kind)}>
      <Panel title={t.title}>
        <div className="relative">
          <div className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5", open ? "border-green ring-2 ring-green/15" : "border-line")}>
            <span className="flex size-8 items-center justify-center rounded-lg bg-green-soft text-green">
              <Users size={15} />
            </span>
            <div className="flex-1">
              <p className="font-semibold">{open && query ? query : t.select}</p>
              <p className="text-[11px] text-[#6B7280]">{t.saved}</p>
            </div>
            <Search size={14} className="text-[#9CA3AF]" />
          </div>
          <Cursor {...cursorAt(ms, 1_000)} className="top-6 left-[70%]" />
          {open && (
            <ul className="absolute inset-x-0 top-full z-10 mt-1 animate-fade-in divide-y divide-line rounded-xl border border-line bg-white">
              {list.map((client) => (
                <li key={client} className={cn("relative px-3 py-2", client.startsWith("Harbour") && ms >= 2_900 && "bg-green-soft")}>
                  {client}
                  {client.startsWith("Harbour") && <Cursor {...cursorAt(ms, 3_200)} className="top-4 left-[45%]" />}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-center text-[11px] text-[#9CA3AF]">{t.manual}</p>
        <Field label={t.name} value={picked ? "Harbour Logistics Ltd" : ""} placeholder="Acme Marketing" />
        <Field label={t.email} value={picked ? "accounts@harbourlogistics.co.uk" : ""} placeholder="billing@acme.com" />
        <Field label={t.address} value={picked ? "Dock Road, Hull" : ""} placeholder={t.addressPlaceholder} />
        <div className="grid grid-cols-2 gap-2">
          <Field label={t.postal} value={picked ? "HU9 1TA" : ""} placeholder="K1P 6B9" />
          <Field label={t.country} value={picked ? t.countryValue : ""} placeholder="Canada" />
        </div>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} client={picked} highlight="client" />
      </InvoiceSlot>
    </Stage>
  );
}

/* 4. Invoice setup ----------------------------------------------------------------- */

const setupEn = {
  label: "Invoice Setup: choosing Net 15 updates the due date; showing the currency code adds GBP to the total.",
  estimateLabel: "Estimate Setup: setting the valid-until date; showing the currency code adds GBP to the total.",
  terms: ["On receipt", "Net 7", "Net 15", "Net 30", "Net 60"],
  number: "Invoice number",
  estimateNumber: "Estimate number",
  issue: "Issue date",
  due: "Due date",
  validUntil: "Valid until",
  currency: "Currency",
  showCode: "Show currency code",
  showCodeText: "Adds the currency code (e.g. GBP) next to the total.",
  showNumber: "Show invoice number",
  showNumberText: "Displays the invoice number on the invoice and PDF.",
  showEstimateNumber: "Show estimate number",
  showEstimateNumberText: "Displays the estimate number on the estimate and PDF.",
};

const SETUP: Localized<typeof setupEn> = {
  en: setupEn,
  fr: {
    label: "Configuration de la facture : choisir « 15 jours » met à jour la date d’échéance ; afficher le code devise ajoute GBP au total.",
    estimateLabel: "Configuration du devis : réglage de la date de validité ; afficher le code devise ajoute GBP au total.",
    terms: ["À réception", "7 jours", "15 jours", "30 jours", "60 jours"],
    number: "Numéro de facture",
    estimateNumber: "Numéro de devis",
    issue: "Date d’émission",
    due: "Date d’échéance",
    validUntil: "Valable jusqu’au",
    currency: "Devise",
    showCode: "Afficher le code devise",
    showCodeText: "Ajoute le code devise (par ex. GBP) à côté du total.",
    showNumber: "Afficher le numéro de facture",
    showNumberText: "Affiche le numéro sur la facture et le PDF.",
    showEstimateNumber: "Afficher le numéro de devis",
    showEstimateNumberText: "Affiche le numéro sur le devis et le PDF.",
  },
};

export function SetupMock({ kind = "invoice" }: { kind?: DocKind }) {
  const locale = useLocale();
  const t = SETUP[locale];
  const date = DATES[locale];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_500);
  const net15 = ms >= 1_600;
  const code = ms >= 3_800;

  return (
    <Stage ref={ref} label={t.label}>
      <Panel title={SETUP_NAME[locale].invoice}>
        <Field label={t.number} value="INV-1206" />
        <div className="grid grid-cols-2 gap-2">
          <Field label={t.issue} value={date.nov1} />
          <Field label={t.due} value={net15 ? date.nov16 : date.nov1} focused={ms >= 1_600 && ms < 2_600} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {t.terms.map((term, i) => {
            const on = i === (net15 ? 2 : 0);
            return (
              <span key={term} className="relative">
                <span className={cn("block rounded-full border px-3 py-1 transition-colors", on ? "border-navy bg-navy text-white" : "border-line text-navy")}>
                  {term}
                </span>
                {i === 2 && <Cursor {...cursorAt(ms, 1_600)} className="top-4 left-[55%]" />}
              </span>
            );
          })}
        </div>
        <div>
          <Label>{t.currency}</Label>
          <p className="flex items-center gap-1 text-[14px] font-semibold">
            GBP <ChevronDown size={13} className="text-[#6B7280]" />
          </p>
        </div>
        <div className="relative">
          <ToggleCard title={t.showCode} text={t.showCodeText} on={code} />
          <Cursor {...cursorAt(ms, 3_800)} className="top-7 right-6" />
        </div>
        <ToggleCard title={t.showNumber} text={t.showNumberText} on />
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} due={net15 ? date.nov16 : date.nov1} currencyCode={code} highlight={code ? ["setup", "totals"] : "setup"} />
      </InvoiceSlot>
    </Stage>
  );
}

/* 5. Items & services -------------------------------------------------------------- */

const itemsEn = {
  label: (kind: DocKind) => `Adding a Winching line item directly on the ${kind}: description, quantity and rate; the totals update.`,
  title: "Items & Services",
  lines: (n: number) => `${n} line items`,
  canvas: "Edit items directly on the canvas. Click any cell to update it.",
  add: "Add additional item",
  catalog: "Pick saved items from your catalog to reuse prices.",
};

const ITEMS_COPY: Localized<typeof itemsEn> = {
  en: itemsEn,
  fr: {
    label: (kind) =>
      `Ajout d’une ligne Treuillage directement sur ${FR_DOC[kind].the} : désignation, quantité et prix unitaire ; les totaux se mettent à jour.`,
    title: "Articles et prestations",
    lines: (n) => `${n} lignes`,
    canvas: "Modifiez les articles directement sur le document. Cliquez sur une cellule pour la changer.",
    add: "Ajouter un article",
    catalog: "Choisissez des articles de votre catalogue pour réutiliser leurs prix.",
  },
};

export function ItemsMock({ kind = "invoice" }: { kind?: DocKind }) {
  const locale = useLocale();
  const t = ITEMS_COPY[locale];
  const sample = ITEMS[locale];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_500);
  const adding = ms >= 1_000;
  const name = typed(sample[2].name, ms, 1_300, 90);
  const qty = ms >= 2_400 ? 1 : undefined;
  const rate = ms >= 3_000 ? 95 : undefined;
  const settled = ms >= 3_800;
  const items = adding ? sample : sample.slice(0, 2);

  return (
    <Stage ref={ref} label={t.label(kind)}>
      <Panel title={t.title}>
        <div className="rounded-xl border border-dashed border-[#D5DBE2] px-4 py-5 text-center">
          <Sparkles size={18} className="mx-auto text-[#9CA3AF]" />
          <p className="mt-2 font-semibold text-navy">{t.lines(settled || adding ? 3 : 2)}</p>
          <p className="mt-1 text-[11.5px] leading-snug text-[#6B7280]">{t.canvas}</p>
        </div>
        <ul className="space-y-2 text-[12px] text-[#374151]">
          <li className="flex items-center gap-2">
            <span className="relative flex items-center gap-1.5 font-semibold text-green">
              <Plus size={13} /> {t.add}
              <Cursor {...cursorAt(ms, 1_000)} className="top-4 left-[70%]" />
            </span>
          </li>
          <li className="flex items-center gap-2 text-[#6B7280]">{t.catalog}</li>
        </ul>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} items={items} typingRow={adding && !settled ? { index: 2, name, qty, rate } : undefined} highlight={["items", "totals"]} />
      </InvoiceSlot>
    </Stage>
  );
}

/* 6. Taxes & discounts ------------------------------------------------------------- */

const taxesEn = {
  label: (kind: DocKind) => `Adding VAT at 20% and a 10% discount; the ${kind} totals recalculate.`,
  title: "Taxes & Discounts",
  defaultTax: "Your default tax is set in Invoice Defaults.",
  taxes: "Taxes",
  vat: "VAT",
  default: "Default",
  rate: "20% · Exclusive",
  addTax: "Add tax",
  discount: "Discount",
  value: "Value",
  percent: "Percent %",
  applied: "Discount applied",
  apply: "Apply discount",
};

const TAXES: Localized<typeof taxesEn> = {
  en: taxesEn,
  fr: {
    label: (kind) => `Ajout de la TVA à 20 % et d’une remise de 10 % ; les totaux ${FR_DOC[kind].of} se recalculent.`,
    title: "Taxes et remises",
    defaultTax: "Votre taxe par défaut se définit dans les paramètres des factures.",
    taxes: "Taxes",
    vat: "TVA",
    default: "Par défaut",
    rate: "20 % · En sus",
    addTax: "Ajouter une taxe",
    discount: "Remise",
    value: "Valeur",
    percent: "Pourcentage %",
    applied: "Remise appliquée",
    apply: "Appliquer la remise",
  },
};

export function TaxesMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = TAXES[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 9_000);
  const vat = ms >= 1_300;
  const typedValue = ms >= 2_500;
  const discount = ms >= 3_700;

  return (
    <Stage ref={ref} label={t.label(kind)}>
      <Panel title={t.title}>
        <p className="flex gap-2 rounded-lg border border-line bg-[#F7F8FA] px-3 py-2 text-[11.5px] leading-snug text-[#4B5563]">
          <Info size={14} className="mt-0.5 shrink-0" /> {t.defaultTax}
        </p>
        <p className="font-semibold">{t.taxes}</p>
        {vat && (
          <div className="flex animate-fade-in items-center gap-2.5 rounded-lg border border-line px-3 py-2">
            <span className="flex size-7 items-center justify-center rounded-md border border-line text-[#4B5563]">
              <BadgePercent size={14} />
            </span>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 font-semibold">
                {t.vat} <span className="rounded-full bg-green-soft px-1.5 text-[10px] font-medium text-green">{t.default}</span>
              </p>
              <p className="text-[11px] text-[#6B7280]">{t.rate}</p>
            </div>
            <Trash size={13} className="text-[#9CA3AF]" />
          </div>
        )}
        <span className="relative block">
          <span className="flex items-center justify-center gap-1.5 rounded-lg bg-green py-2 font-semibold text-white">
            <Plus size={13} /> {t.addTax}
          </span>
          <Cursor {...cursorAt(ms, 1_300)} className="top-5 left-[58%]" />
        </span>
        <p className="border-t border-line pt-3 font-semibold">{t.discount}</p>
        <div className="grid grid-cols-2 gap-2">
          <Field value={typedValue ? "10" : ""} placeholder={t.value} focused={typedValue && !discount} />
          <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
            {t.percent} <ChevronDown size={12} className="text-[#6B7280]" />
          </div>
        </div>
        <span className="relative block">
          <span className={cn("flex items-center justify-center gap-1.5 rounded-lg py-2 font-semibold text-white", typedValue ? "bg-green" : "bg-[#C9D2DC]")}>
            {discount ? (
              <>
                <Check size={13} /> {t.applied}
              </>
            ) : (
              t.apply
            )}
          </span>
          <Cursor {...cursorAt(ms, 3_700)} className="top-5 left-[62%]" />
        </span>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} vat={vat} discount={discount} highlight="totals" />
      </InvoiceSlot>
    </Stage>
  );
}

/* 7. Design ------------------------------------------------------------------------ */

const SWATCHES = [
  ["#0A2540", "#06B047"],
  ["#374151", "#111827"],
  ["#1D4ED8", "#60A5FA"],
  ["#4C1D95", "#7C3AED"],
  ["#B91C1C", "#DC2626"],
  ["#7C2D12", "#D97706"],
];
const DESIGN = { red: 1_200, corners: 2_700, table: 4_100, navy: 5_700 };

const designEn = {
  label: (kind: DocKind) => `Design: picking colours, rounded corners and a striped item table; the ${kind} restyles live.`,
  title: "Design",
  template: "Template",
  templates: ["Modern", "Classic", "Minimal"],
  colors: "Colors",
  corners: "Corners",
  cornerOptions: ["Sharp", "Soft", "Rounded"],
  font: "Font",
  table: "Item table",
  tableOptions: ["Lined", "Striped", "Card"],
};

const DESIGN_COPY: Localized<typeof designEn> = {
  en: designEn,
  fr: {
    label: (kind) => `Design : choix des couleurs, des coins arrondis et d’un tableau d’articles zébré ; ${FR_DOC[kind].the} change de style en direct.`,
    title: "Design",
    template: "Modèle",
    templates: ["Moderne", "Classique", "Minimal"],
    colors: "Couleurs",
    corners: "Coins",
    cornerOptions: ["Droits", "Doux", "Arrondis"],
    font: "Police",
    table: "Tableau des articles",
    tableOptions: ["Lignes", "Zébré", "Cartes"],
  },
};

export function Seg({ options, value, ms, cursor }: { options: string[]; value: string; ms: number; cursor?: { at: number; target: string } }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 rounded-lg border border-line bg-[#F7F8FA] p-0.5 text-[11.5px]">
      {options.map((o) => (
        <span key={o} className={cn("relative rounded-md py-1.5 text-center transition-colors", o === value ? "bg-white font-semibold" : "text-[#6B7280]")}>
          {o}
          {cursor?.target === o && <Cursor {...cursorAt(ms, cursor.at)} className="top-4 left-[55%]" />}
        </span>
      ))}
    </div>
  );
}

export function DesignMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = DESIGN_COPY[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_800);
  const theme = ms >= DESIGN.navy ? "navy" : ms >= DESIGN.red ? "red" : "plain";
  const picked = theme === "navy" ? 0 : theme === "red" ? 4 : -1;
  const rounded = ms >= DESIGN.corners;
  const striped = ms >= DESIGN.table;
  return (
    <Stage ref={ref} label={t.label(kind)}>
      <Panel title={t.title} back={false}>
        <p className="font-semibold">{t.template}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          {t.templates.map((name, i) => (
            <div key={name}>
              <div className={cn("h-[40px] rounded-lg border p-1.5", i === 0 ? "border-2 border-green" : "border-line")}>
                <div className="h-2 rounded-sm bg-[#1F2937]" />
                <div className="mt-1 h-[2px] w-4/5 bg-[#E5E7EB]" />
                <div className="mt-1 ml-auto h-[4px] w-5 bg-[#1F2937]" />
              </div>
              <p className={cn("mt-1", i === 0 ? "font-semibold" : "text-[#6B7280]")}>{name}</p>
            </div>
          ))}
        </div>
        <p className="font-semibold">{t.colors}</p>
        <div className="flex justify-between">
          {SWATCHES.map(([a, b], i) => (
            <span key={a} className="relative">
              <span
                className={cn("block size-[26px] rounded-full ring-offset-2 transition-shadow", i === picked && "ring-2 ring-navy")}
                style={{ background: `linear-gradient(135deg, ${a} 50%, ${b} 50%)` }}
              />
              {i === 4 && <Cursor {...cursorAt(ms, DESIGN.red)} className="top-3.5 left-4" />}
              {i === 0 && <Cursor {...cursorAt(ms, DESIGN.navy)} className="top-3.5 left-4" />}
            </span>
          ))}
        </div>
        <p className="font-semibold">{t.corners}</p>
        <Seg options={t.cornerOptions} value={t.cornerOptions[rounded ? 2 : 1]} ms={ms} cursor={{ at: DESIGN.corners, target: t.cornerOptions[2] }} />
        <p className="font-semibold">{t.font}</p>
        <div className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2">
          <span className="text-[14px]">Aa</span> <span className="flex-1">Helvetica</span> <ChevronDown size={13} className="text-[#6B7280]" />
        </div>
        <p className="font-semibold">{t.table}</p>
        <Seg options={t.tableOptions} value={t.tableOptions[striped ? 1 : 0]} ms={ms} cursor={{ at: DESIGN.table, target: t.tableOptions[1] }} />
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} theme={theme} rounded={rounded} striped={striped} highlight="design" />
      </InvoiceSlot>
    </Stage>
  );
}

/* 8. Payment methods --------------------------------------------------------------- */

const paymentEn = {
  label: "Payment Methods: entering bank transfer details and showing them on the invoice.",
  title: "Payment Methods",
  show: "Show on invoice",
  showText: "Hide the Payment Methods block if the client pays another way.",
  bank: "Bank Transfer",
  bankText: "Account number, routing, SWIFT/BIC",
  bankName: "Bank name",
  account: "Account number",
  paypalText: "Receive payments by email",
};

const PAYMENT: Localized<typeof paymentEn> = {
  en: paymentEn,
  fr: {
    label: "Moyens de paiement : saisie des coordonnées bancaires et affichage sur la facture.",
    title: "Moyens de paiement",
    show: "Afficher sur la facture",
    showText: "Masquez le bloc Moyens de paiement si le client paie autrement.",
    bank: "Virement bancaire",
    bankText: "Compte, code banque, SWIFT/BIC",
    bankName: "Nom de la banque",
    account: "Numéro de compte",
    paypalText: "Recevez des paiements par e-mail",
  },
};

export function PaymentMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = PAYMENT[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 9_500);
  const bank = typed("Barclays Business", ms, 900, 55);
  const account = typed("41263321", ms, 2_100, 70);
  const swift = typed("BARCGB22", ms, 2_900, 70);
  const shown = ms >= 4_300;

  return (
    <Stage ref={ref} label={t.label}>
      <Panel title={t.title}>
        <div className="relative">
          <ToggleCard title={t.show} text={t.showText} on={shown} />
          <Cursor {...cursorAt(ms, 4_300)} className="top-7 right-6" />
        </div>
        <div className="rounded-xl border border-line">
          <div className="flex items-center gap-2.5 border-b border-line px-3 py-2.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#F1F3F5]">
              <Plus size={12} />
            </span>
            <div className="flex-1">
              <p className="font-semibold">{t.bank}</p>
              <p className="text-[11px] text-[#6B7280]">{t.bankText}</p>
            </div>
            <ChevronDown size={13} className="text-[#6B7280]" />
          </div>
          <div className="space-y-2.5 p-3">
            <Field label={t.bankName} value={bank} placeholder="Chase Business Checking" typing={bank.length > 0 && bank.length < 17} />
            <Field label={t.account} value={account} placeholder="••••••4321" typing={account.length > 0 && account.length < 8} />
            <Field label="SWIFT / BIC" value={swift} placeholder="CHASUS33" typing={swift.length > 0 && swift.length < 8} />
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#F1F3F5]">
            <Plus size={12} />
          </span>
          <div className="flex-1">
            <p className="font-semibold">PayPal</p>
            <p className="text-[11px] text-[#6B7280]">{t.paypalText}</p>
          </div>
          <ChevronRight size={13} className="text-[#6B7280]" />
        </div>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} payment={shown} highlight="payment" />
      </InvoiceSlot>
    </Stage>
  );
}

/* 9 and 10. Notes, terms ------------------------------------------------------------ */

const blockEn = {
  show: (kind: DocKind) => `Show on ${kind}`,
  hide: (title: string, kind: DocKind) => `Hide the ${title} block from this ${kind}'s preview and PDF.`,
  placeholder: "Start typing",
};

const BLOCK: Localized<typeof blockEn> = {
  en: blockEn,
  fr: {
    show: (kind) => `Afficher sur ${FR_DOC[kind].the}`,
    hide: (title, kind) => `Masquez le bloc ${title} de l’aperçu et du PDF de ${FR_DOC[kind].this}.`,
    placeholder: "Commencez à écrire",
  },
};

function TextBlockMock({
  kind,
  title,
  field,
  hint,
  sample,
  part,
  label,
}: {
  kind: DocKind;
  title: string;
  field: string;
  hint: string;
  sample: string;
  part: "notes" | "terms";
  label: string;
}) {
  const t = BLOCK[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000);
  const text = typed(sample, ms, 900, 38);

  return (
    <Stage ref={ref} label={label}>
      <Panel title={title}>
        <ToggleCard title={t.show(kind)} text={t.hide(title, kind)} on />
        <Field label={field} value={text} placeholder={t.placeholder} typing={text.length > 0 && text.length < sample.length} tall />
        <p className="text-[11.5px] text-[#6B7280]">{hint}</p>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} {...{ [part]: text }} highlight={part} />
      </InvoiceSlot>
    </Stage>
  );
}

const notesEn = {
  title: "Notes",
  field: "Note to client",
  hint: (kind: DocKind) => `Shown at the bottom of the ${kind}. Keep it short and warm.`,
  sample: "Thank you for choosing Ridgeway. We appreciate your business.",
  label: (kind: DocKind) => `Typing a note to the client; it appears in the ${kind} notes.`,
};

const NOTES: Localized<typeof notesEn> = {
  en: notesEn,
  fr: {
    title: "Notes",
    field: "Note au client",
    hint: (kind) => `Affichée en bas ${FR_DOC[kind].of}. Restez bref et chaleureux.`,
    sample: "Merci d’avoir choisi Ridgeway. Nous apprécions votre confiance.",
    label: (kind) => `Saisie d’une note au client ; elle apparaît dans les notes ${FR_DOC[kind].of}.`,
  },
};

export function NotesMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = NOTES[useLocale()];
  return <TextBlockMock kind={kind} title={t.title} field={t.field} part="notes" hint={t.hint(kind)} sample={t.sample} label={t.label(kind)} />;
}

const termsEn = {
  title: "Terms & Conditions",
  field: "Terms & conditions",
  hint: "Payment terms, late fees, refund policy.",
  sample: { invoice: "Payment due within 14 days by bank transfer.", estimate: "Valid for 30 days. Final price confirmed on completion." },
  label: (kind: DocKind) => `Typing terms; they appear on the ${kind}.`,
};

const TERMS: Localized<typeof termsEn> = {
  en: termsEn,
  fr: {
    title: "Conditions générales",
    field: "Conditions générales",
    hint: "Délais de paiement, pénalités, remboursements.",
    sample: { invoice: "Paiement sous 14 jours par virement bancaire.", estimate: "Valable 30 jours. Prix définitif confirmé à la fin des travaux." },
    label: (kind) => `Saisie des conditions ; elles apparaissent sur ${FR_DOC[kind].the}.`,
  },
};

export function TermsMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = TERMS[useLocale()];
  return <TextBlockMock kind={kind} title={t.title} field={t.field} part="terms" hint={t.hint} sample={t.sample[kind]} label={t.label(kind)} />;
}

/* 11. Signature -------------------------------------------------------------------- */

const signatureEn = {
  label: (kind: DocKind) => `Drawing a signature and applying it to the ${kind}.`,
  title: "Signature",
  block: "signature",
  draw: "Draw",
  upload: "Upload",
  drawYours: "Draw your signature",
  signHere: "Sign here",
  applied: "Signature applied",
  apply: "Apply signature",
};

const SIGNATURE: Localized<typeof signatureEn> = {
  en: signatureEn,
  fr: {
    label: (kind) => `Tracé d’une signature, puis application ${FR_DOC[kind].to}.`,
    title: "Signature",
    block: "signature",
    draw: "Dessiner",
    upload: "Importer",
    drawYours: "Dessinez votre signature",
    signHere: "Signez ici",
    applied: "Signature appliquée",
    apply: "Appliquer la signature",
  },
};

export function SignatureMock({ kind = "invoice" }: { kind?: DocKind }) {
  const locale = useLocale();
  const t = SIGNATURE[locale];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000);
  const progress = Math.min(1, Math.max(0, (ms - 800) / 1_500));
  const applied = ms >= 3_200;

  return (
    <Stage ref={ref} label={t.label(kind)}>
      <Panel title={t.title}>
        <ToggleCard title={BLOCK[locale].show(kind)} text={BLOCK[locale].hide(t.block, kind)} on />
        <div className="grid grid-cols-2 gap-0.5 rounded-lg bg-[#F1F3F5] p-0.5">
          <span className="flex items-center justify-center gap-1.5 rounded-md bg-white py-1.5 font-semibold">
            <PenTool size={12} /> {t.draw}
          </span>
          <span className="flex items-center justify-center gap-1.5 py-1.5 text-[#6B7280]">
            <Upload size={12} /> {t.upload}
          </span>
        </div>
        <Label>{t.drawYours}</Label>
        <div className="relative flex h-[100px] items-center justify-center rounded-lg border border-line">
          {progress > 0 ? <SignatureStroke progress={progress} className="h-[56px] w-auto" /> : <p className="text-[11px] text-[#9CA3AF]">{t.signHere}</p>}
          <span className="absolute inset-x-5 bottom-4 border-t border-dashed border-[#D1D5DB]" />
        </div>
        <span className="relative block">
          <span className={cn("flex items-center justify-center gap-1.5 rounded-lg py-2 font-semibold", progress >= 1 ? "bg-green text-white" : "bg-[#F1F3F5] text-[#9CA3AF]")}>
            {applied ? (
              <>
                <Check size={13} /> {t.applied}
              </>
            ) : (
              t.apply
            )}
          </span>
          <Cursor {...cursorAt(ms, 3_200)} className="top-5 left-[60%]" />
        </span>
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind={kind} signature={applied ? 1 : 0} highlight="signature" />
      </InvoiceSlot>
    </Stage>
  );
}

/* 12. Preview, PDF and send -------------------------------------------------------- */

function Action({ icon: Icon, label, ms, when }: { icon: typeof Eye; label: string; ms: number; when: number }) {
  return (
    <span className="relative flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[#374151]">
      <Icon size={15} /> {label}
      <Cursor {...cursorAt(ms, when)} className="top-5 left-[55%]" />
    </span>
  );
}

const SEND_OPTIONS: { icon: typeof Send; label: Localized<string>; shortcut?: boolean }[] = [
  { icon: Send, label: { en: "Send by email", fr: "Envoyer par e-mail" }, shortcut: true },
  { icon: CreditCard, label: { en: "Request payment", fr: "Demander le paiement" } },
  { icon: Link2, label: { en: "Copy share link", fr: "Copier le lien" } },
];

/** The menu behind the arrow next to Send, hovering each option in turn. */
function SendMenu({ ms, from }: { ms: number; from: number }) {
  const locale = useLocale();
  const hovered = Math.floor((ms - from - 500) / 800);
  return (
    <div className={cn("absolute top-full right-0 z-20 mt-2 w-55 rounded-xl border border-line bg-white p-1 text-left text-[13px] font-normal text-navy", SOFT_SHADOW)}>
      {SEND_OPTIONS.map(({ icon: Icon, label, shortcut }, i) => (
        <span key={label.en} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors", hovered === i && "bg-[#F3F5F7]")}>
          <Icon size={15} className="text-[#6B7280]" />
          <span className="flex-1">{label[locale]}</span>
          {shortcut && <span className="text-[11px] text-[#9CA3AF]">⌘ ↵</span>}
        </span>
      ))}
      <span className="absolute left-[45%] transition-[top] duration-300" style={{ top: 22 + Math.max(hovered, 0) * 36 }}>
        <Cursor visible={hovered >= 0 && hovered < SEND_OPTIONS.length} clicking={false} className="top-0 left-0" />
      </span>
    </div>
  );
}

const sendEn = {
  menuLabel:
    "The action bar: preview the invoice, download the PDF, then open the Send menu: Send by email, Request payment or Copy share link.",
  label: (kind: DocKind) => `The action bar: preview the ${kind}, download the PDF, then send it; the status changes to Sent.`,
  preview: "Preview",
  duplicate: "Duplicate",
  template: "Template",
  send: "Send",
  sent: { invoice: "Sent", estimate: "Sent" } as Record<DocKind, string>,
};

const SEND: Localized<typeof sendEn> = {
  en: sendEn,
  fr: {
    menuLabel:
      "La barre d’actions : prévisualiser la facture, télécharger le PDF, puis ouvrir le menu Envoyer : Envoyer par e-mail, Demander le paiement ou Copier le lien.",
    label: (kind) =>
      `La barre d’actions : prévisualiser ${FR_DOC[kind].the}, télécharger le PDF, puis l’envoyer ; le statut passe à ${FR_DOC[kind].sent}.`,
    preview: "Aperçu",
    duplicate: "Dupliquer",
    template: "Modèle",
    send: "Envoyer",
    sent: { invoice: FR_DOC.invoice.sent, estimate: FR_DOC.estimate.sent },
  },
};

export function SendMock({ kind = "invoice" }: { kind?: DocKind }) {
  const t = SEND[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_500, 5_800);
  const at = { preview: 1_200, pdf: 2_800, send: 4_400 };
  const downloaded = ms >= at.pdf && ms < at.pdf + 1_400;
  // Invoices open the Send menu; estimates send straight away.
  const withMenu = kind === "invoice";
  const menuOpen = withMenu && ms >= at.send && ms < at.send + 3_200;
  const sent = !withMenu && ms >= at.send + 400;
  return (
    <Stage ref={ref} label={withMenu ? t.menuLabel : t.label(kind)}>
      <div className="flex flex-col items-center gap-5">
        <div className={cn("flex flex-wrap items-center gap-1 rounded-2xl border border-line bg-white p-1.5 text-[13px]", SOFT_SHADOW)}>
          <Action icon={Eye} label={t.preview} ms={ms} when={at.preview} />
          <span className="hidden items-center gap-1.5 px-2.5 py-2 text-[#374151] sm:flex">
            <Copy size={15} /> {t.duplicate}
          </span>
          <span className="hidden items-center gap-1.5 px-2.5 py-2 text-[#374151] sm:flex">
            <BookmarkPlus size={15} /> {t.template}
          </span>
          <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
          <span className="relative flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 font-medium text-navy">
            {downloaded ? <Check size={15} className="text-green" /> : <Download size={15} />} PDF
            <Cursor {...cursorAt(ms, at.pdf)} className="top-5 left-[55%]" />
          </span>
          <span className="relative">
            <span className="flex overflow-hidden rounded-lg bg-green font-semibold text-white">
              <span className="flex items-center gap-1.5 px-3.5 py-2">
                {sent ? <Check size={15} /> : <Send size={15} />} {sent ? t.sent[kind] : t.send}
              </span>
              <span className={cn("flex items-center border-l border-white/25 px-2 transition-colors", menuOpen && "bg-black/15")}>
                <ChevronDown size={14} className={cn("transition-transform", menuOpen && "rotate-180")} />
              </span>
            </span>
            <Cursor {...cursorAt(ms, at.send)} className={cn("top-5", withMenu ? "right-1" : "left-[35%]")} />
            {menuOpen && <SendMenu ms={ms} from={at.send} />}
          </span>
        </div>
        <InvoiceSlot>
          <MiniInvoice kind={kind} status={sent ? "Sent" : "Draft"} />
        </InvoiceSlot>
      </div>
    </Stage>
  );
}

/* Estimate setup ------------------------------------------------------------------- */

export function EstimateSetupMock() {
  const locale = useLocale();
  const t = SETUP[locale];
  const date = DATES[locale];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_500);
  const changed = ms >= 1_600;
  const code = ms >= 3_800;

  return (
    <Stage ref={ref} label={t.estimateLabel}>
      <Panel title={SETUP_NAME[locale].estimate}>
        <Field label={t.estimateNumber} value="EST-0418" />
        <div className="grid grid-cols-2 gap-2">
          <Field label={t.issue} value={date.nov1} />
          <div className="relative">
            <Field label={t.validUntil} value={changed ? date.dec1 : date.nov16} focused={ms >= 1_000 && ms < 2_400} />
            <Cursor {...cursorAt(ms, 1_000)} className="top-10 left-[60%]" />
          </div>
        </div>
        <div>
          <Label>{t.currency}</Label>
          <p className="flex items-center gap-1 text-[14px] font-semibold">
            GBP <ChevronDown size={13} className="text-[#6B7280]" />
          </p>
        </div>
        <div className="relative">
          <ToggleCard title={t.showCode} text={t.showCodeText} on={code} />
          <Cursor {...cursorAt(ms, 3_800)} className="top-7 right-6" />
        </div>
        <ToggleCard title={t.showEstimateNumber} text={t.showEstimateNumberText} on />
      </Panel>
      <InvoiceSlot>
        <MiniInvoice kind="estimate" due={changed ? date.dec1 : date.nov16} currencyCode={code} highlight={code ? ["setup", "totals"] : "setup"} />
      </InvoiceSlot>
    </Stage>
  );
}

/* Send by email and Request payment ------------------------------------------------ */

const CLIENT_EMAIL = "accounts@harbourlogistics.co.uk";
const CC_EMAIL = "finance@harbourlogistics.co.uk";
const EMAIL_SEND_AT = 5_200;

const emailEn = {
  cancel: "Cancel",
  inbox: "Your client's inbox",
  new: "New",
  invoice: "Invoice INV-1206",
  amountDue: "Amount due",
  due: "Due 15 Nov 2026",
  payNow: "Pay now",
  file: "invoice-INV-1206.pdf",
  attached: "invoice-INV-1206.pdf attached",
  payLabel:
    "Request payment: entering the client's email and a CC, then sending; the client receives an email with a Pay now button.",
  sendLabel: "Send by email: entering the client's email and a CC, then sending; the PDF is attached and the status changes to Sent.",
  payTitle: "Request payment",
  sendTitle: "Send invoice",
  paySub: "Emails a secure Pay now button so your client can pay by card. The PDF is attached too.",
  sendSub: "The PDF is generated automatically and attached on send.",
  sent: "Sent",
  payAction: "Send payment request",
  sendAction: "Send invoice",
  payNote: {
    before: "This email includes a ",
    bold: "Pay now",
    after: " button. Your client can pay this invoice online by card. Funds go to your connected Stripe account.",
  },
  to: "To",
  cc: "CC",
  ccHint: "(optional, comma-separated)",
  subject: "Subject",
  message: "Message",
  body: ["Hi,", "Please find attached invoice INV-1206 for your review.", "Thank you for your business."],
  attachment: "Attachment",
  generated: "Generated automatically when you press Send",
};

const EMAIL: Localized<typeof emailEn> = {
  en: emailEn,
  fr: {
    cancel: "Annuler",
    inbox: "Boîte de réception du client",
    new: "Nouveau",
    invoice: "Facture INV-1206",
    amountDue: "Montant dû",
    due: "Échéance le 15 nov. 2026",
    payNow: "Payer maintenant",
    file: "facture-INV-1206.pdf",
    attached: "facture-INV-1206.pdf en pièce jointe",
    payLabel:
      "Demande de paiement : saisie de l’e-mail du client et d’une adresse en copie, puis envoi ; le client reçoit un e-mail avec un bouton Payer maintenant.",
    sendLabel:
      "Envoi par e-mail : saisie de l’e-mail du client et d’une adresse en copie, puis envoi ; le PDF est joint et le statut passe à Envoyée.",
    payTitle: "Demander le paiement",
    sendTitle: "Envoyer la facture",
    paySub: "Votre client reçoit un bouton « Payer maintenant » sécurisé pour régler par carte. Le PDF est aussi joint.",
    sendSub: "Le PDF est généré automatiquement et joint à l’envoi.",
    sent: "Envoyée",
    payAction: "Envoyer la demande",
    sendAction: "Envoyer la facture",
    payNote: {
      before: "Cet e-mail contient un bouton ",
      bold: "Payer maintenant",
      after: ". Votre client peut régler cette facture en ligne par carte. Les fonds sont versés sur votre compte Stripe connecté.",
    },
    to: "À",
    cc: "Cc",
    ccHint: "(facultatif, séparés par des virgules)",
    subject: "Objet",
    message: "Message",
    body: ["Bonjour,", "Veuillez trouver ci-joint la facture INV-1206.", "Merci pour votre confiance."],
    attachment: "Pièce jointe",
    generated: "Généré automatiquement à l’envoi",
  },
};

/** App dialog chrome: title, subtitle and close, body, then Cancel and the main action. */
function Dialog({ title, sub, action, children }: { title: string; sub: string; action: ReactNode; children: ReactNode }) {
  const t = EMAIL[useLocale()];
  return (
    <div className={cn("w-full max-w-[380px] shrink-0 overflow-hidden rounded-2xl border border-line bg-white text-left text-navy", SOFT_SHADOW)}>
      <div className="flex items-start gap-3 border-b border-line px-5 py-4">
        <div className="flex-1">
          <p className="text-[15px] font-semibold">{title}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-[#6B7280]">{sub}</p>
        </div>
        <X size={16} className="mt-0.5 text-[#9CA3AF]" />
      </div>
      <div className="space-y-3 px-5 py-4 text-[12.5px]">{children}</div>
      <div className="flex items-center justify-end gap-4 border-t border-line px-5 py-3 text-[13px]">
        <span className="text-[#374151]">{t.cancel}</span>
        {action}
      </div>
    </div>
  );
}

function MailField({ label, hint, value, placeholder, typing }: { label: string; hint?: string; value: string; placeholder: string; typing: boolean }) {
  return (
    <div>
      <p className="mb-1 text-[10.5px] font-semibold tracking-[0.1em] text-[#6B7280] uppercase">
        {label} {hint && <span className="font-normal tracking-normal normal-case">{hint}</span>}
      </p>
      <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors", typing ? "border-green ring-2 ring-green/15" : "border-line")}>
        <Mail size={13} className="shrink-0 text-[#9CA3AF]" />
        {value ? (
          <span className="truncate text-navy">
            {value}
            {typing && <span className="ml-px inline-block h-3 w-px translate-y-0.5 animate-pulse bg-green" />}
          </span>
        ) : (
          <span className="truncate text-[#A3ACB8]">{placeholder}</span>
        )}
      </div>
    </div>
  );
}

/** What the client receives from Request payment. */
function PayNowEmail({ received }: { received: boolean }) {
  const locale = useLocale();
  const t = EMAIL[locale];
  const { total } = totalsFor({ items: ITEMS[locale], vat: true, discount: false });
  return (
    <div className={cn("w-full max-w-[340px] shrink-0 overflow-hidden rounded-2xl border border-line bg-white text-left text-navy transition-opacity duration-500", SOFT_SHADOW, received ? "opacity-100" : "opacity-45")}>
      <div className="border-b border-line px-4 py-3 text-[12px]">
        <p className="flex items-center justify-between text-[10.5px] font-semibold tracking-[0.1em] text-[#6B7280] uppercase">
          {t.inbox}
          {received && <span className="rounded-full bg-green px-2 py-0.5 text-[10px] tracking-normal text-white normal-case">{t.new}</span>}
        </p>
        <p className="mt-1.5 font-semibold">Ridgeway Towing &amp; Recovery Ltd</p>
        <p className="text-[#6B7280]">{t.invoice}</p>
      </div>
      <div className="px-4 py-4 text-center">
        <RidgewayLogo className="inline-block text-left" />
        <p className="mt-4 text-[11px] text-[#6B7280]">{t.amountDue}</p>
        <p className="text-[26px] font-bold tracking-[-0.02em] tabular-nums">{gbp(total, locale)}</p>
        <p className="text-[11.5px] text-[#6B7280]">{t.due}</p>
        <span className={cn("mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-green py-2.5 text-[13px] font-semibold text-white", "ring-4 transition-shadow duration-500", received ? "ring-green/20" : "ring-transparent")}>
          <CreditCard size={14} /> {t.payNow}
        </span>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280]">
          <FileText size={12} /> {t.attached}
        </p>
      </div>
    </div>
  );
}

/** Send by email, or Request payment when `payment` is set: fill in To and CC, then send. */
export function EmailMock({ payment = false }: { payment?: boolean }) {
  const t = EMAIL[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 9_500);
  const to = typed(CLIENT_EMAIL, ms, 500, 40);
  const cc = typed(CC_EMAIL, ms, 2_500, 40);
  const ready = to === CLIENT_EMAIL;
  const sent = ms >= EMAIL_SEND_AT + 200;
  const Icon = payment ? CreditCard : Send;

  return (
    <Stage ref={ref} label={payment ? t.payLabel : t.sendLabel}>
      <Dialog
        title={payment ? t.payTitle : t.sendTitle}
        sub={payment ? t.paySub : t.sendSub}
        action={
          <span className="relative">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold text-white transition-colors",
                ready ? "bg-green" : "bg-[#D5DBE2]",
              )}
            >
              {sent ? <Check size={14} /> : <Icon size={14} />}
              {sent ? t.sent : payment ? t.payAction : t.sendAction}
            </span>
            <Cursor {...cursorAt(ms, EMAIL_SEND_AT)} className="top-5 left-[55%]" />
          </span>
        }
      >
        {payment && (
          <p className="flex gap-2.5 rounded-lg border border-green/30 bg-green-soft px-3 py-2.5 leading-snug text-navy">
            <CreditCard size={15} className="mt-px shrink-0 text-green" />
            <span>
              {t.payNote.before}
              <b>{t.payNote.bold}</b>
              {t.payNote.after}
            </span>
          </p>
        )}
        <MailField label={t.to} value={to} placeholder="client@example.com" typing={ms < 2_400 && (ms < 500 || !ready)} />
        <MailField
          label={t.cc}
          hint={t.ccHint}
          value={cc}
          placeholder="cfo@example.com, accounting@example.com"
          typing={ms >= 2_500 && cc !== CC_EMAIL}
        />
        <Field label={t.subject} value={t.invoice} />
        <div>
          <Label>{t.message}</Label>
          <div className="space-y-2 rounded-lg border border-line px-3 py-2 leading-snug">
            {t.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        {!payment && (
          <div>
            <Label>{t.attachment}</Label>
            <div className="flex items-center gap-3 rounded-lg border border-line bg-[#F8FAFB] px-3 py-2">
              <span className="flex size-8 items-center justify-center rounded-md bg-green-soft text-green">
                <FileText size={15} />
              </span>
              <span>
                <span className="block font-semibold">{t.file}</span>
                <span className="block text-[11px] text-[#6B7280]">{t.generated}</span>
              </span>
            </div>
          </div>
        )}
      </Dialog>
      {payment ? (
        <PayNowEmail received={sent} />
      ) : (
        <InvoiceSlot>
          <MiniInvoice status={sent ? "Sent" : "Draft"} />
        </InvoiceSlot>
      )}
    </Stage>
  );
}

/* Copy share link ------------------------------------------------------------------ */

const shareEn = {
  label: "Share this invoice: copying the link; anyone with the link can view the invoice without an account.",
  title: "Share this invoice",
  text: "Anyone with this link can view the invoice. No account needed.",
  copied: "Copied",
  copy: "Copy link",
  url: "https://app.invoicebirds.com/en/invoice/share/r7k2m9",
};

const SHARE: Localized<typeof shareEn> = {
  en: shareEn,
  fr: {
    label: "Partager cette facture : copie du lien ; toute personne disposant du lien peut consulter la facture sans compte.",
    title: "Partager cette facture",
    text: "Toute personne disposant de ce lien peut consulter la facture. Aucun compte requis.",
    copied: "Copié",
    copy: "Copier le lien",
    url: "https://app.invoicebirds.com/fr/invoice/share/r7k2m9",
  },
};

export function ShareLinkMock() {
  const t = SHARE[useLocale()];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000, 2_600);
  const copied = ms >= 2_000 && ms < 4_200;

  return (
    <Stage ref={ref} label={t.label}>
      <div className={cn("relative w-full max-w-[380px] shrink-0 rounded-2xl border border-line bg-white px-5 pt-6 pb-5 text-center text-navy", SOFT_SHADOW)}>
        <span className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-[#F1F3F5] text-[#6B7280]">
          <X size={14} />
        </span>
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-green-soft text-green">
          <Link2 size={22} />
        </span>
        <p className="mt-3 text-[16px] font-semibold">{t.title}</p>
        <p className="mt-1 text-[12px] text-[#6B7280]">{t.text}</p>
        <div className="mt-4 flex gap-2 text-[12px]">
          <span className={cn("min-w-0 flex-1 truncate rounded-lg border px-3 py-2 text-left transition-colors", copied ? "border-green bg-green-soft/50" : "border-line bg-[#F8FAFB]")}>
            {t.url}
          </span>
          <span className="relative">
            <span className="flex items-center gap-1.5 rounded-lg bg-green px-3 py-2 font-semibold whitespace-nowrap text-white">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t.copied : t.copy}
            </span>
            <Cursor {...cursorAt(ms, 2_000)} className="top-5 left-[50%]" />
          </span>
        </div>
      </div>
      <div className={cn("shrink-0 overflow-hidden rounded-xl border border-line bg-white", SOFT_SHADOW)}>
        <div className="flex items-center gap-2 border-b border-line bg-[#F8FAFB] px-3 py-2">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rounded-full bg-[#D5DBE2]" />
            ))}
          </span>
          <span className="min-w-0 flex-1 truncate rounded-md bg-white px-2.5 py-1 text-[11px] text-[#6B7280]">{t.url.replace("https://", "")}</span>
        </div>
        <div className="sm:p-3">
          <InvoiceSlot>
            <MiniInvoice status="Sent" />
          </InvoiceSlot>
        </div>
      </div>
    </Stage>
  );
}
