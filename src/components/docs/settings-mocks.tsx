"use client";

import { useRef, type ReactNode } from "react";
import {
  BadgePercent,
  Bell,
  Building2,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Globe,
  Image as ImageIcon,
  KeyRound,
  Languages,
  Mail,
  MapPin,
  PenLine,
  Plus,
  ShieldCheck,
  Trash,
  Undo2,
  Upload,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { FitCanvas } from "@/components/ui/fit-canvas";
import { cn } from "@/lib/cn";
import { LOCALE_NAMES, LOCALES, type Locale, type Localized } from "@/lib/i18n";

import { RidgewayLogo, SignatureStroke } from "./mini-invoice";
import { Cursor, cursorAt, Label, SOFT_SHADOW, Toggle, typed, useLoop } from "./mock-kit";

/* Ridgeway Towing & Recovery Ltd, set up in Settings. Every mock is a 620px app panel, scaled on small screens. */

export const SETTINGS_TABS = ["Business", "Invoices", "Templates", "Tax", "Reminders", "Notifications", "Billing & Plans", "Profile"] as const;
type Tab = (typeof SETTINGS_TABS)[number];

const TABS: Localized<Record<Tab, { name: string; info: string }>> = {
  en: {
    Business: { name: "Business", info: "Identity and defaults used by every new builder" },
    Invoices: { name: "Invoices", info: "Taxes, numbering, due dates and email defaults" },
    Templates: { name: "Templates", info: "Customize document templates" },
    Tax: { name: "Tax", info: "Tax tracking configuration" },
    Reminders: { name: "Reminders", info: "Automatic follow-ups for unpaid invoices" },
    Notifications: { name: "Notifications", info: "Manage notification settings" },
    "Billing & Plans": { name: "Billing & Plans", info: "Manage your subscription and billing" },
    Profile: { name: "Profile", info: "Personal account settings" },
  },
  fr: {
    Business: { name: "Entreprise", info: "Identité et valeurs par défaut utilisées par chaque nouveau document" },
    Invoices: { name: "Factures", info: "Taxes, numérotation, échéances et e-mails par défaut" },
    Templates: { name: "Modèles", info: "Personnalisez vos modèles de documents" },
    Tax: { name: "Taxes", info: "Configuration du suivi fiscal" },
    Reminders: { name: "Relances", info: "Relances automatiques des factures impayées" },
    Notifications: { name: "Notifications", info: "Gérez vos préférences de notification" },
    "Billing & Plans": { name: "Facturation et abonnement", info: "Gérez votre abonnement et votre facturation" },
    Profile: { name: "Profil", info: "Paramètres de votre compte personnel" },
  },
};

const SHELL: Localized<{ title: string; lead: string; dirty: string; clean: string; discard: string; save: string; saveBusiness: string }> = {
  en: {
    title: "Settings",
    lead: "Configure how your business appears, how documents behave, and how your account runs.",
    dirty: "Unsaved changes",
    clean: "Everything is up to date",
    discard: "Discard",
    save: "Save changes",
    saveBusiness: "Save business defaults",
  },
  fr: {
    title: "Paramètres",
    lead: "Configurez l’apparence de votre entreprise, vos documents et votre compte.",
    dirty: "Modifications non enregistrées",
    clean: "Tout est à jour",
    discard: "Annuler",
    save: "Enregistrer les modifications",
    saveBusiness: "Enregistrer les paramètres de l’entreprise",
  },
};

/** A grey stage holding one settings panel. */
function SettingsStage({ stageRef, label, children }: { stageRef: React.RefObject<HTMLDivElement | null>; label: string; children: ReactNode }) {
  return (
    <figure ref={stageRef} className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <figcaption className="sr-only">{label}</figcaption>
      <div aria-hidden="true">
        <FitCanvas width={620} fallback="max-sm:[zoom:0.5] sm:[zoom:0.82]">
          {children}
        </FitCanvas>
      </div>
    </figure>
  );
}

/** The Settings page chrome: heading, tab row with the active tab underlined, then the tab's content. */
function Shell({ tab, children, save }: { tab: Tab; children: ReactNode; save?: ReactNode }) {
  const locale = useLocale();
  const t = SHELL[locale];
  return (
    <div className={cn("w-[620px] overflow-hidden rounded-2xl border border-line bg-[#F8FAFB] text-left text-[12.5px] text-navy", SOFT_SHADOW)}>
      <div className="px-6 pt-5">
        <p className="text-[20px] font-semibold tracking-tight">{t.title}</p>
        <p className="mt-0.5 text-[11.5px] text-muted">{t.lead}</p>
        <div className="mt-4 flex gap-4 border-b border-line text-[11.5px]">
          {SETTINGS_TABS.map((name) => (
            <span key={name} className={cn("-mb-px border-b-2 pb-2 whitespace-nowrap transition-colors", name === tab ? "border-green font-semibold text-navy" : "border-transparent text-muted")}>
              {TABS[locale][name].name}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3 px-6 pt-4 pb-5">{children}</div>
      {save}
    </div>
  );
}

function Card({ icon: Icon, title, sub, children }: { icon?: typeof Bell; title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-start gap-2.5">
        {Icon && (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line text-[#4B5563]">
            <Icon size={14} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">{title}</p>
          {sub && <p className="mt-0.5 text-[11.5px] text-muted">{sub}</p>}
        </div>
      </div>
      {children && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  );
}

/** A labelled input showing `value` (with a caret while typing) or its placeholder. */
function Input({ label, value, placeholder, typing, icon: Icon, className }: { label?: string; value?: string; placeholder?: string; typing?: boolean; icon?: typeof Bell; className?: string }) {
  return (
    <div className={className}>
      {label && <p className="mb-1 text-[11px] font-medium text-[#374151]">{label}</p>}
      <div className={cn("flex min-h-[34px] items-center gap-2 rounded-lg border bg-white px-3 py-1.5", typing ? "border-green ring-2 ring-green/15" : "border-line")}>
        {Icon && <Icon size={13} className="shrink-0 text-[#9CA3AF]" />}
        {value ? (
          <span className="truncate">
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

function Select({ label, value, focused }: { label?: string; value: ReactNode; focused?: boolean }) {
  return (
    <div>
      {label && <p className="mb-1 text-[11px] font-medium text-[#374151]">{label}</p>}
      <div className={cn("flex min-h-[34px] items-center justify-between rounded-lg border bg-white px-3 py-1.5 transition-colors", focused ? "border-green ring-2 ring-green/15" : "border-line")}>
        <span>{value}</span>
        <ChevronDown size={13} className="text-[#6B7280]" />
      </div>
    </div>
  );
}

function ToggleRow({ title, text, on, cursor }: { title: string; text: string; on: boolean; cursor?: { visible: boolean; clicking: boolean } }) {
  return (
    <div className="flex items-center gap-3 border-t border-[#EEF0F3] pt-2.5 first:border-t-0 first:pt-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-[11px] text-muted">{text}</p>
      </div>
      <span className="relative">
        <Toggle on={on} />
        {cursor && <Cursor {...cursor} className="top-3 left-5" />}
      </span>
    </div>
  );
}

/** The sticky save bar under every tab: up to date, or unsaved changes with Save lit. */
function SaveBar({ dirty, saveLabel, cursor }: { dirty: boolean; saveLabel?: string; cursor?: { visible: boolean; clicking: boolean } }) {
  const t = SHELL[useLocale()];
  return (
    <div className="flex items-center gap-3 border-t border-line bg-white px-6 py-3 text-[11.5px]">
      {dirty ? (
        <span className="flex items-center gap-1.5 font-medium text-[#B25A16]">
          <span className="size-1.5 rounded-full bg-[#F59E0B]" /> {t.dirty}
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-muted">
          <Check size={13} className="text-green" /> {t.clean}
        </span>
      )}
      <span className="ml-auto text-[#9CA3AF]">{t.discard}</span>
      <span className="relative">
        <span className={cn("block rounded-lg px-3.5 py-1.5 font-semibold transition-colors", dirty ? "bg-green text-white" : "bg-[#EEF1F4] text-[#9CA3AF]")}>{saveLabel ?? t.save}</span>
        {cursor && <Cursor {...cursor} className="top-4 left-[55%]" />}
      </span>
    </div>
  );
}

/* 1. Find your settings ------------------------------------------------------------ */

const TAB_MS = 1_300;
const TABS_LABEL: Localized<string> = {
  en: "Settings: the eight tabs, from Business to Profile, each opened in turn.",
  fr: "Paramètres : les huit onglets, d’Entreprise à Profil, ouverts tour à tour.",
};

export function SettingsTabsMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, SETTINGS_TABS.length * TAB_MS, 0);
  const i = Math.floor(ms / TAB_MS) % SETTINGS_TABS.length;
  const tab = SETTINGS_TABS[i];
  const locale = useLocale();
  return (
    <SettingsStage stageRef={ref} label={TABS_LABEL[locale]}>
      <Shell tab={tab}>
        <div key={tab} className="animate-fade-in">
          <p className="text-[15px] font-semibold">{TABS[locale][tab].name}</p>
          <p className="mt-0.5 text-[11.5px] text-muted">{TABS[locale][tab].info}</p>
          <div className="mt-3 space-y-2">
            {[0.9, 0.7, 0.8].map((w, k) => (
              <div key={k} className="rounded-xl border border-line bg-white p-3.5">
                <div className="h-2.5 rounded bg-[#E5E9EE]" style={{ width: `${w * 45}%` }} />
                <div className="mt-2 h-2 rounded bg-[#F0F2F5]" style={{ width: `${w * 80}%` }} />
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </SettingsStage>
  );
}

/* 2. Business identity ------------------------------------------------------------- */

const ID = { logo: 900, name: 2_000, site: 4_300, save: 6_600 };

const identityEn = {
  label: "Business identity: uploading the Ridgeway logo, typing the company name and website, then saving.",
  title: "Business identity",
  sub: "The name and brand customers see on every document.",
  logo: "Company logo",
  drop: "Drop or browse",
  formats: "PNG, JPG or WebP. Max 5 MB.",
  name: "Company name *",
  namePlaceholder: "Your Company Name",
  website: "Website",
  sitePlaceholder: "example.com",
  email: "Business email",
  industry: "Industry",
  automotive: "Automotive",
};

const IDENTITY: Localized<typeof identityEn> = {
  en: identityEn,
  fr: {
    label: "Identité de l’entreprise : import du logo Ridgeway, saisie du nom de l’entreprise et du site web, puis enregistrement.",
    title: "Identité de l’entreprise",
    sub: "Le nom et l’image de marque que vos clients voient sur chaque document.",
    logo: "Logo de l’entreprise",
    drop: "Déposer ou parcourir",
    formats: "PNG, JPG ou WebP. 5 Mo max.",
    name: "Nom de l’entreprise *",
    namePlaceholder: "Nom de votre entreprise",
    website: "Site web",
    sitePlaceholder: "exemple.com",
    email: "E-mail professionnel",
    industry: "Secteur d’activité",
    automotive: "Automobile",
  },
};

export function BusinessIdentityMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_500, 8_000);
  const logo = ms >= ID.logo + 100;
  const name = typed("Ridgeway Towing & Recovery Ltd", ms, ID.name, 55);
  const site = typed("ridgewaytowing.co.uk", ms, ID.site, 60);
  const saved = ms >= ID.save + 100;
  const locale = useLocale();
  const t = IDENTITY[locale];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Business" save={<SaveBar dirty={ms >= ID.logo && !saved} saveLabel={SHELL[locale].saveBusiness} cursor={cursorAt(ms, ID.save)} />}>
        <Card icon={Building2} title={t.title} sub={t.sub}>
          <div className="grid grid-cols-[150px_1fr] gap-4">
            <div>
              <p className="mb-1 text-[11px] font-medium text-[#374151]">{t.logo}</p>
              <div className="relative flex h-[118px] flex-col items-center justify-center rounded-xl border border-dashed border-[#C5D0DC] bg-[#F8FAFB]">
                {logo ? (
                  <div className="animate-fade-in rounded-md bg-white px-2.5 py-2">
                    <RidgewayLogo />
                  </div>
                ) : (
                  <>
                    <Upload size={16} className="text-[#6B7280]" />
                    <p className="mt-1.5 text-[11px] text-[#4B5563]">{t.drop}</p>
                  </>
                )}
                <Cursor {...cursorAt(ms, ID.logo)} className="top-16 left-[55%]" />
              </div>
              <p className="mt-1.5 text-[10px] text-muted">{t.formats}</p>
            </div>
            <div className="space-y-2.5">
              <Input label={t.name} value={name} placeholder={t.namePlaceholder} typing={ms >= ID.name && ms < ID.site} />
              <div className="grid grid-cols-2 gap-2.5">
                <Input label={t.website} value={site} placeholder={t.sitePlaceholder} icon={Globe} typing={ms >= ID.site && ms < ID.save - 600} />
                <Input label={t.email} value="hello@ridgewaytowing.co.uk" icon={Mail} />
              </div>
              <Select label={t.industry} value={t.automotive} />
            </div>
          </div>
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 3. Contact & legal details ------------------------------------------------------- */

const CL = { address: 800, postal: 3_300, vat: 4_600 };

const contactEn = {
  label: "Contact and legal details: typing the address, postal code and VAT number for the From block.",
  title: "Contact & legal details",
  sub: "Shown in the From block and used for compliant e-invoices.",
  address: "Business address",
  postal: "Postal code",
  postalPlaceholder: "e.g. LS1 4AP",
  country: "Country",
  uk: "United Kingdom",
  phone: "Phone number",
  fax: "Fax number",
  vat: "VAT ID",
};

const CONTACT: Localized<typeof contactEn> = {
  en: contactEn,
  fr: {
    label: "Coordonnées et mentions légales : saisie de l’adresse, du code postal et du numéro de TVA pour le bloc Émetteur.",
    title: "Coordonnées et mentions légales",
    sub: "Affichées dans le bloc Émetteur et utilisées pour les factures électroniques conformes.",
    address: "Adresse de l’entreprise",
    postal: "Code postal",
    postalPlaceholder: "ex. LS1 4AP",
    country: "Pays",
    uk: "Royaume-Uni",
    phone: "Téléphone",
    fax: "Fax",
    vat: "N° de TVA",
  },
};

export function ContactLegalMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000, 7_000);
  const address = typed("Unit 4, Brookfield Industrial Estate, Leeds", ms, CL.address, 50);
  const postal = typed("LS11 5QR", ms, CL.postal, 90);
  const vat = typed("GB318440257", ms, CL.vat, 80);
  const locale = useLocale();
  const t = CONTACT[locale];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Business" save={<SaveBar dirty={ms >= CL.address && ms < 7_200} saveLabel={SHELL[locale].saveBusiness} />}>
        <Card icon={MapPin} title={t.title} sub={t.sub}>
          <Input label={t.address} value={address} typing={ms >= CL.address && ms < CL.postal} className="[&>div]:min-h-[48px] [&>div]:items-start" />
          <div className="grid grid-cols-2 gap-2.5">
            <Input label={t.postal} value={postal} placeholder={t.postalPlaceholder} typing={ms >= CL.postal && ms < CL.vat} />
            <Select label={t.country} value={t.uk} />
            <Input label={t.phone} value="+44 113 496 0721" />
            <Input label={t.fax} placeholder="+44" />
          </div>
          <Input label={t.vat} value={vat} placeholder="GB123456789" typing={ms >= CL.vat && ms < 6_200} />
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 4. Document defaults ------------------------------------------------------------- */

const DD = { currency: 1_000, notes: 2_300, terms: 4_600, save: 7_000 };

const defaultsEn = {
  label: "Document defaults: switching the primary currency to GBP and adding default notes and terms, then saving.",
  title: "Document defaults",
  sub: "Pre-fill every new invoice and estimate, while keeping each draft editable.",
  currency: "Primary currency",
  notes: "Default notes",
  notesPlaceholder: "Default notes to appear on all invoices",
  terms: "Default terms & conditions",
  termsPlaceholder: "Default terms to appear on all invoices",
  note: "Thank you for choosing Ridgeway.",
  term: "Payment is due within 14 days.",
};

const DEFAULTS: Localized<typeof defaultsEn> = {
  en: defaultsEn,
  fr: {
    label: "Valeurs par défaut des documents : passage de la devise principale en GBP, ajout des notes et conditions par défaut, puis enregistrement.",
    title: "Valeurs par défaut des documents",
    sub: "Préremplissez vos nouvelles factures et vos devis ; chaque brouillon reste modifiable.",
    currency: "Devise principale",
    notes: "Notes par défaut",
    notesPlaceholder: "Notes affichées sur toutes les factures",
    terms: "Conditions générales par défaut",
    termsPlaceholder: "Conditions affichées sur toutes les factures",
    note: "Merci d’avoir choisi Ridgeway.",
    term: "Paiement exigible sous 14 jours.",
  },
};

export function DocumentDefaultsMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 9_000, 8_500);
  const locale = useLocale();
  const t = DEFAULTS[locale];
  const gbp = ms >= DD.currency + 300;
  const notes = typed(t.note, ms, DD.notes, 45);
  const terms = typed(t.term, ms, DD.terms, 45);
  const saved = ms >= DD.save + 100;
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Business" save={<SaveBar dirty={ms >= DD.currency && !saved} saveLabel={SHELL[locale].saveBusiness} cursor={cursorAt(ms, DD.save)} />}>
        <Card icon={FileText} title={t.title} sub={t.sub}>
          <div className="relative w-1/2">
            <Select label={t.currency} value={gbp ? "GBP · £" : "USD · $"} focused={ms >= DD.currency - 300 && ms < DD.notes} />
            <Cursor {...cursorAt(ms, DD.currency)} className="top-9 left-[70%]" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Input label={t.notes} value={notes} placeholder={t.notesPlaceholder} typing={ms >= DD.notes && ms < DD.terms} className="[&>div]:min-h-[64px] [&>div]:items-start" />
            <Input label={t.terms} value={terms} placeholder={t.termsPlaceholder} typing={ms >= DD.terms && ms < DD.save - 500} className="[&>div]:min-h-[64px] [&>div]:items-start" />
          </div>
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 5. Authorized signature ---------------------------------------------------------- */

const signatureEn = {
  label: "Authorized signature: drawing a signature once for invoices, estimates and contracts, then saving.",
  title: "Authorized signature",
  sub: "Save one signature for invoices, estimates, and contracts.",
  sign: "Sign here",
  note: "Note:",
  png: "Only PNG files are allowed for signature uploads.",
};

const SIGNATURE: Localized<typeof signatureEn> = {
  en: signatureEn,
  fr: {
    label: "Signature autorisée : une signature tracée une seule fois pour les factures, devis et contrats, puis enregistrée.",
    title: "Signature autorisée",
    sub: "Enregistrez une signature pour vos factures, devis et contrats.",
    sign: "Signez ici",
    note: "Remarque :",
    png: "Seuls les fichiers PNG sont acceptés pour l’import d’une signature.",
  },
};

export function SignatureDefaultMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000, 6_500);
  const progress = Math.min(1, Math.max(0, (ms - 900) / 2_400));
  const saved = ms >= 5_100;
  const locale = useLocale();
  const t = SIGNATURE[locale];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Business" save={<SaveBar dirty={progress > 0 && !saved} saveLabel={SHELL[locale].saveBusiness} cursor={cursorAt(ms, 5_000)} />}>
        <Card icon={PenLine} title={t.title} sub={t.sub}>
          <div className="relative flex h-[120px] items-center justify-center rounded-xl border border-dashed border-[#C5D0DC] bg-[#F8FAFB]">
            {progress > 0 ? <SignatureStroke progress={progress} className="h-[70px] w-auto" /> : <p className="text-[12px] text-[#9CA3AF]">{t.sign}</p>}
          </div>
          <div className="flex items-center gap-2">
            {[Undo2, Trash, ImageIcon].map((Icon, i) => (
              <span key={i} className="flex size-8 items-center justify-center rounded-lg border border-line text-[#6B7280]">
                <Icon size={14} />
              </span>
            ))}
            <p className="ml-1 text-[11px] text-muted">
              <b className="text-navy">{t.note}</b> {t.png}
            </p>
          </div>
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 6. Invoice defaults -------------------------------------------------------------- */

const INV = { add: 900, name: 1_400, rate: 2_600, calc: 3_600, prefix: 5_000 };

const invoiceEn = {
  label: "Invoice defaults: adding 20% VAT added on top, then setting the invoice number prefix.",
  taxTitle: "Tax configuration",
  taxSub: "Define the tax rules available in every new invoice.",
  taxName: "Tax name",
  taxPlaceholder: "e.g. VAT",
  vat: "VAT",
  rate: "Rate",
  percent: (rate: string) => `${rate} %`,
  calculation: "Calculation",
  onTop: "Added on top",
  included: "Included",
  addTax: "Add tax",
  numberingTitle: "Numbering & due dates",
  numberingSub: "The defaults every new invoice starts with.",
  due: "Default due date",
  dueValue: "Due Immediately",
  prefix: "Invoice number prefix",
  example: "Example",
};

const INVOICE: Localized<typeof invoiceEn> = {
  en: invoiceEn,
  fr: {
    label: "Valeurs par défaut des factures : ajout d’une TVA de 20 % ajoutée au prix, puis choix du préfixe de numérotation.",
    taxTitle: "Configuration des taxes",
    taxSub: "Définissez les taxes disponibles dans chaque nouvelle facture.",
    taxName: "Nom de la taxe",
    taxPlaceholder: "ex. TVA",
    vat: "TVA",
    rate: "Taux",
    percent: (rate: string) => `${rate} %`,
    calculation: "Calcul",
    onTop: "Ajoutée au prix",
    included: "Incluse",
    addTax: "Ajouter une taxe",
    numberingTitle: "Numérotation et échéances",
    numberingSub: "Les valeurs de départ de chaque nouvelle facture.",
    due: "Échéance par défaut",
    dueValue: "À réception",
    prefix: "Préfixe de numérotation",
    example: "Exemple",
  },
};

export function InvoiceDefaultsMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_500, 8_000);
  const t = INVOICE[useLocale()];
  const row = ms >= INV.add + 100;
  const name = typed(t.vat, ms, INV.name, 120);
  const rate = typed("20", ms, INV.rate, 160);
  const onTop = ms >= INV.calc + 100;
  const prefix = typed("RTR-", ms, INV.prefix, 140);
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Invoices" save={<SaveBar dirty={row && ms < 7_400} />}>
        <Card title={t.taxTitle} sub={t.taxSub}>
          {row && (
            <div className="grid animate-fade-in grid-cols-[1fr_74px_auto_auto] items-end gap-2 rounded-lg border border-line p-2.5">
              <Input label={t.taxName} value={name} placeholder={t.taxPlaceholder} typing={ms >= INV.name && ms < INV.rate} />
              <Input label={t.rate} value={rate ? t.percent(rate) : ""} placeholder="%" typing={ms >= INV.rate && ms < INV.calc} />
              <div className="relative">
                <p className="mb-1 text-[11px] font-medium text-[#374151]">{t.calculation}</p>
                <div className="flex overflow-hidden rounded-lg border border-line text-[11px]">
                  <span className={cn("px-2.5 py-2 transition-colors", onTop ? "bg-navy text-white" : "text-[#4B5563]")}>{t.onTop}</span>
                  <span className={cn("px-2.5 py-2 transition-colors", onTop ? "text-[#4B5563]" : "bg-navy text-white")}>{t.included}</span>
                </div>
                <Cursor {...cursorAt(ms, INV.calc)} className="top-10 left-[30%]" />
              </div>
              <Trash size={14} className="mb-2.5 text-[#9CA3AF]" />
            </div>
          )}
          <span className="relative inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#C5D0DC] px-3 py-1.5 text-[#374151]">
            <Plus size={13} /> {t.addTax}
            <Cursor {...cursorAt(ms, INV.add)} className="top-4 left-[60%]" />
          </span>
        </Card>
        <Card title={t.numberingTitle} sub={t.numberingSub}>
          <div className="grid grid-cols-2 gap-2.5">
            <Select label={t.due} value={t.dueValue} />
            <div>
              <p className="mb-1 text-[11px] font-medium text-[#374151]">{t.prefix}</p>
              <div className={cn("flex items-center overflow-hidden rounded-lg border bg-white", ms >= INV.prefix && ms < 6_400 ? "border-green ring-2 ring-green/15" : "border-line")}>
                <span className="border-r border-line bg-[#F8FAFB] px-2.5 py-2 text-[11px] text-muted">{t.example}</span>
                <span className="flex-1 px-2.5">{prefix || "INV-"}</span>
                <span className="px-2.5 text-[#9CA3AF]">001</span>
              </div>
            </div>
          </div>
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 7. Templates, colors and fonts --------------------------------------------------- */

const PRESETS = [
  ["#06B047", "#0A2540"],
  ["#3B82F6", "#1E3A8A"],
  ["#DC2626", "#7F1D1D"],
  ["#7C3AED", "#4C1D95"],
  ["#059669", "#064E3B"],
  ["#D97706", "#7C2D12"],
  ["#334155", "#0F172A"],
  ["#EC4899", "#831843"],
];
const TPL = { classic: 1_100, red: 2_700, font: 4_300 };

const templatesEn = {
  label: "Templates: choosing the Classic layout, the red color preset and the Inter font.",
  templateTitle: "Template selection",
  templateSub: "Choose the layout every new invoice starts with.",
  templates: ["Modern", "Classic", "Minimal"],
  colorTitle: "Color scheme",
  colorSub: "Build one reusable brand palette for all invoice templates.",
  colors: ["Primary", "Secondary", "Accent"],
  typography: "Typography",
};

const TEMPLATES: Localized<typeof templatesEn> = {
  en: templatesEn,
  fr: {
    label: "Modèles : choix de la mise en page Classique, de la palette rouge et de la police Inter.",
    templateTitle: "Choix du modèle",
    templateSub: "Choisissez la mise en page de chaque nouvelle facture.",
    templates: ["Moderne", "Classique", "Minimal"],
    colorTitle: "Palette de couleurs",
    colorSub: "Créez une palette de marque réutilisable pour tous vos modèles de facture.",
    colors: ["Principale", "Secondaire", "Accent"],
    typography: "Typographie",
  },
};

export function TemplatesMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_500, 7_000);
  const template = ms >= TPL.classic + 100 ? 1 : 0;
  const red = ms >= TPL.red + 100;
  const font = ms >= TPL.font + 100 ? 1 : 0;
  const colors = red ? ["#B91C1C", "#7F1D1D", "#DC2626"] : ["#0A2540", "#334155", "#06B047"];
  const t = TEMPLATES[useLocale()];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Templates" save={<SaveBar dirty={ms >= TPL.classic && ms < 6_600} />}>
        <Card title={t.templateTitle} sub={t.templateSub}>
          <div className="grid grid-cols-3 gap-2.5 text-center text-[11.5px]">
            {t.templates.map((name, i) => (
              <div key={name} className={cn("relative rounded-xl border p-2 transition-colors", i === template ? "border-2 border-green" : "border-line")}>
                <div className="h-[54px] rounded-md border border-[#EEF0F3] bg-white p-1.5">
                  <div className="h-1.5 w-2/5 rounded-sm" style={{ backgroundColor: colors[0] }} />
                  <div className="mt-1.5 h-[3px] w-full" style={{ backgroundColor: colors[0] }} />
                  <div className="mt-1 h-[2px] w-4/5 bg-[#E5E7EB]" />
                  <div className="mt-2 ml-auto h-1 w-6" style={{ backgroundColor: colors[2] }} />
                </div>
                <p className={cn("mt-1.5", i === template ? "font-semibold text-green" : "")}>{name}</p>
                {i === 1 && <Cursor {...cursorAt(ms, TPL.classic)} className="top-10 left-[55%]" />}
              </div>
            ))}
          </div>
        </Card>
        <Card title={t.colorTitle} sub={t.colorSub}>
          <div className="grid grid-cols-3 gap-2">
            {t.colors.map((name, i) => (
              <div key={name}>
                <Label>{name}</Label>
                <div className="flex items-center gap-2 rounded-lg border border-line px-2 py-1.5">
                  <span className="size-4 rounded transition-colors duration-500" style={{ backgroundColor: colors[i] }} />
                  <span className="font-mono text-[10.5px] uppercase">{colors[i]}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {PRESETS.map(([a, b], i) => (
              <span key={a} className="relative">
                <span className={cn("block size-6 rounded-full ring-offset-2", i === 2 && red && "ring-2 ring-navy")} style={{ background: `linear-gradient(135deg, ${a} 50%, ${b} 50%)` }} />
                {i === 2 && <Cursor {...cursorAt(ms, TPL.red)} className="top-3.5 left-4" />}
              </span>
            ))}
          </div>
        </Card>
        <Card title={t.typography}>
          <div className="grid grid-cols-4 gap-2">
            {[
              ["Helvetica", "font-sans"],
              ["Inter", "font-sans"],
              ["Lora", "font-serif"],
              ["Times", "font-serif"],
            ].map(([name, family], i) => (
              <div key={name} className={cn("relative rounded-lg border px-2.5 py-2 transition-colors", i === font ? "border-2 border-green" : "border-line")}>
                <p className={cn("text-[14px] font-semibold", family)}>{name}</p>
                {i === 1 && <Cursor {...cursorAt(ms, TPL.font)} className="top-5 left-[55%]" />}
              </div>
            ))}
          </div>
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 8. Tax tracking ------------------------------------------------------------------ */

const TX = { enable: 900, quarterly: 2_800, remind: 4_400 };

const taxEn = {
  label: "Tax: turning on tax tracking, setting the jurisdiction, choosing a quarterly filing rhythm and a 7-day reminder.",
  title: "Tax tracking",
  sub: "Turn on tax reporting tools when your business needs them.",
  enable: "Enable tax tracking",
  enableText: "Turn on automatic tax calculation for your invoices",
  active: "Tax tracking is active for reports and deadline reminders.",
  jurisdiction: "Tax jurisdiction",
  country: "United Kingdom",
  city: "City (optional)",
  rhythm: "Filing rhythm",
  rhythms: ["Monthly", "Quarterly", "Annual"],
  automation: "Automation",
  reports: "Auto-calculate monthly reports",
  reportsText: "Automatically generate tax reports each month",
  reminders: "Enable tax reminders",
  remindersText: "Get notified before tax filing deadlines",
  remindBefore: "Remind me",
  remindAfter: "days before a deadline",
};

const TAX: Localized<typeof taxEn> = {
  en: taxEn,
  fr: {
    label: "Taxes : activation du suivi fiscal, choix de la juridiction, d’une déclaration trimestrielle et d’un rappel 7 jours avant.",
    title: "Suivi fiscal",
    sub: "Activez les outils de déclaration fiscale quand votre entreprise en a besoin.",
    enable: "Activer le suivi fiscal",
    enableText: "Activez le calcul automatique des taxes sur vos factures",
    active: "Le suivi fiscal est actif pour les rapports et les rappels d’échéance.",
    jurisdiction: "Juridiction fiscale",
    country: "Royaume-Uni",
    city: "Ville (facultatif)",
    rhythm: "Fréquence de déclaration",
    rhythms: ["Mensuelle", "Trimestrielle", "Annuelle"],
    automation: "Automatisation",
    reports: "Rapports mensuels automatiques",
    reportsText: "Générez automatiquement vos rapports fiscaux chaque mois",
    reminders: "Activer les rappels fiscaux",
    remindersText: "Soyez averti avant chaque échéance de déclaration",
    remindBefore: "Me prévenir",
    remindAfter: "jours avant une échéance",
  },
};

export function TaxSettingsMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000, 6_500);
  const on = ms >= TX.enable + 100;
  const rhythm = ms >= TX.quarterly + 100 ? 1 : 0;
  const t = TAX[useLocale()];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Tax" save={<SaveBar dirty={on && ms < 6_000} />}>
        <Card icon={BadgePercent} title={t.title} sub={t.sub}>
          <ToggleRow title={t.enable} text={t.enableText} on={on} cursor={cursorAt(ms, TX.enable)} />
          {on && <p className="flex animate-fade-in items-center gap-1.5 rounded-lg bg-green-soft px-3 py-2 text-[11.5px] text-green"><Check size={13} /> {t.active}</p>}
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Card icon={MapPin} title={t.jurisdiction}>
            <Select value={t.country} />
            <Input placeholder={t.city} value="Leeds" />
          </Card>
          <Card icon={Clock} title={t.rhythm}>
            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
              {t.rhythms.map((name, i) => (
                <span key={name} className={cn("relative rounded-lg border py-2 transition-colors", i === rhythm ? "border-2 border-green font-semibold" : "border-line")}>
                  {name}
                  {i === 1 && <Cursor {...cursorAt(ms, TX.quarterly)} className="top-5 left-[55%]" />}
                </span>
              ))}
            </div>
          </Card>
        </div>
        <Card icon={Bell} title={t.automation}>
          <ToggleRow title={t.reports} text={t.reportsText} on={on} />
          <ToggleRow title={t.reminders} text={t.remindersText} on={ms >= TX.remind} />
          {ms >= TX.remind && (
            <p className="animate-fade-in text-[11.5px]">
              {t.remindBefore} <span className="mx-1 rounded-md border border-line px-2 py-0.5 font-semibold">7</span> {t.remindAfter}
            </p>
          )}
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 9. Payment reminders ------------------------------------------------------------- */

const remindersEn = {
  label: "Reminders: turning on automatic payment reminders, with six follow-ups from two days before the due date to 21 days after.",
  steps: [
    { name: "Friendly heads-up", when: "2 days before" },
    { name: "Due today", when: "On the due date" },
    { name: "First follow-up", when: "2 days after" },
    { name: "Final notice", when: "7 days after" },
    { name: "Final notice", when: "14 days after" },
    { name: "Final notice", when: "21 days after" },
  ],
  autopilot: "Collection autopilot",
  autopilotSub: "Send calm, consistent payment follow-ups without tracking every due date.",
  auto: "Automatic payment reminders",
  autoText: "Reminders stop automatically when an invoice is paid.",
  timeline: "Reminder timeline",
  timelineSub: "Choose when each message goes out. You can still pause reminders on one invoice.",
  options: "Message options",
  link: "Include payment link",
  linkText: "Add a prominent “Pay now” action to reminder emails.",
  copy: "Send me a copy",
  copyText: "CC your account email on every automatic reminder.",
};

const REMINDERS: Localized<typeof remindersEn> = {
  en: remindersEn,
  fr: {
    label: "Relances : activation des relances de paiement automatiques, avec six relances, de deux jours avant l’échéance à 21 jours après.",
    steps: [
      { name: "Rappel amical", when: "2 jours avant" },
      { name: "Échéance du jour", when: "À l’échéance" },
      { name: "Première relance", when: "2 jours après" },
      { name: "Dernière relance", when: "7 jours après" },
      { name: "Dernière relance", when: "14 jours après" },
      { name: "Dernière relance", when: "21 jours après" },
    ],
    autopilot: "Recouvrement automatique",
    autopilotSub: "Envoyez des relances courtoises et régulières sans surveiller chaque échéance.",
    auto: "Relances de paiement automatiques",
    autoText: "Les relances s’arrêtent automatiquement dès qu’une facture est payée.",
    timeline: "Calendrier des relances",
    timelineSub: "Choisissez quand part chaque message. Vous pouvez toujours suspendre les relances d’une facture.",
    options: "Options des messages",
    link: "Inclure le lien de paiement",
    linkText: "Ajoutez un bouton « Payer maintenant » bien visible dans les e-mails de relance.",
    copy: "M’envoyer une copie",
    copyText: "Mettez en copie l’e-mail de votre compte à chaque relance automatique.",
  },
};

export function RemindersMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000, 7_500);
  const t = REMINDERS[useLocale()];
  const auto = ms >= 900;
  const lit = auto ? Math.min(t.steps.length, Math.floor((ms - 1_300) / 450) + 1) : 0;
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Reminders">
        <Card icon={Clock} title={t.autopilot} sub={t.autopilotSub}>
          <ToggleRow title={t.auto} text={t.autoText} on={auto} cursor={cursorAt(ms, 800)} />
        </Card>
        <Card icon={Mail} title={t.timeline} sub={t.timelineSub}>
          <ol className="grid grid-cols-6 gap-1.5 text-center">
            {t.steps.map((step, i) => (
              <li key={i} className={cn("rounded-lg border px-1 py-2 transition-colors duration-300", i < lit ? "border-green/50 bg-green-soft" : "border-line")}>
                <span className={cn("mx-auto flex size-5 items-center justify-center rounded-full text-[10px] font-semibold", i < lit ? "bg-green text-white" : "bg-surface text-muted")}>{i + 1}</span>
                <p className="mt-1.5 text-[10.5px] leading-tight font-semibold">{step.name}</p>
                <p className="mt-0.5 text-[10px] text-muted">{step.when}</p>
              </li>
            ))}
          </ol>
        </Card>
        <Card title={t.options}>
          <ToggleRow title={t.link} text={t.linkText} on={auto} />
          <ToggleRow title={t.copy} text={t.copyText} on={false} />
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 10. Notifications ---------------------------------------------------------------- */

const notificationsEn = {
  label: "Notifications: pausing all alerts, enabling them again, then turning one off individually.",
  heading: "Choose what deserves your attention",
  count: (active: number) => `${active} of 18 notifications are active`,
  enableAll: "Enable all",
  pauseAll: "Pause all",
  title: "Payments & documents",
  sub: "Get notified about payments and when clients respond.",
  notes: [
    ["Invoice Paid", "When a customer pays an invoice"],
    ["Invoice Overdue", "When an invoice becomes overdue"],
    ["Estimate Accepted", "When a client accepts your estimate"],
    ["Proposal Accepted", "When a client accepts your proposal"],
    ["Contract Signed", "When a client signs your contract"],
  ],
};

const NOTIFICATIONS: Localized<typeof notificationsEn> = {
  en: notificationsEn,
  fr: {
    label: "Notifications : toutes les alertes suspendues, puis réactivées, puis une seule désactivée.",
    heading: "Choisissez ce qui mérite votre attention",
    count: (active: number) => (active > 1 ? `${active} notifications actives sur 18` : `${active} notification active sur 18`),
    enableAll: "Tout activer",
    pauseAll: "Tout suspendre",
    title: "Paiements et documents",
    sub: "Soyez averti des paiements et des réponses de vos clients.",
    notes: [
      ["Facture payée", "Quand un client règle une facture"],
      ["Facture en retard", "Quand une facture passe en retard"],
      ["Devis accepté", "Quand un client accepte votre devis"],
      ["Proposition acceptée", "Quand un client accepte votre proposition"],
      ["Contrat signé", "Quand un client signe votre contrat"],
    ],
  },
};

export function NotificationsMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000, 0);
  const paused = ms >= 1_600 && ms < 3_800;
  const offOne = ms >= 4_800;
  const active = paused ? 0 : offOne ? 15 : 16;
  const t = NOTIFICATIONS[useLocale()];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Notifications">
        <div className="flex items-center gap-3 rounded-xl border border-green/30 bg-green-soft/50 p-3.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-green text-white">
            <Bell size={15} />
          </span>
          <div className="flex-1">
            <p className="font-semibold">{t.heading}</p>
            <p className="text-[11px] text-muted tabular-nums">{t.count(active)}</p>
          </div>
          <span className="relative rounded-lg border border-line bg-white px-2.5 py-1.5 font-medium">
            {t.enableAll}
            <Cursor {...cursorAt(ms, 3_700)} className="top-4 left-[55%]" />
          </span>
          <span className="relative rounded-lg border border-line bg-white px-2.5 py-1.5 font-medium">
            {t.pauseAll}
            <Cursor {...cursorAt(ms, 1_500)} className="top-4 left-[55%]" />
          </span>
        </div>
        <Card title={t.title} sub={t.sub}>
          {t.notes.map(([title, text], i) => (
            <ToggleRow key={title} title={title} text={text} on={!paused && !(offOne && i === 3)} cursor={i === 3 ? cursorAt(ms, 4_700) : undefined} />
          ))}
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 11. Billing & plans -------------------------------------------------------------- */

const PRICES = { Professional: { monthly: 16, yearly: 96 }, Growth: { monthly: 24, yearly: 144 } };

const billingEn = {
  label: "Billing and plans: the current Growth plan, the payment method, and switching between monthly and yearly prices.",
  currentPlan: "CURRENT PLAN",
  active: "Active",
  renews: "RENEWS",
  renewal: "16 Aug 2027",
  method: "Default payment method",
  card: "Visa ending 4242",
  update: "Update payment method",
  available: "Available plans",
  monthly: "Monthly",
  yearly: "Yearly",
  bestValue: "BEST VALUE",
  price: (amount: number) => `$${amount}`,
  perMonth: "/month",
  perYear: "/year",
  current: "Current plan",
  switch: "Switch plan",
};

const BILLING: Localized<typeof billingEn> = {
  en: billingEn,
  fr: {
    label: "Facturation et abonnement : la formule Growth actuelle, le moyen de paiement et le passage des prix mensuels aux prix annuels.",
    currentPlan: "FORMULE ACTUELLE",
    active: "Active",
    renews: "RENOUVELLEMENT",
    renewal: "16 août 2027",
    method: "Moyen de paiement",
    card: "Visa se terminant par 4242",
    update: "Modifier la carte",
    available: "Formules disponibles",
    monthly: "Mensuel",
    yearly: "Annuel",
    bestValue: "MEILLEUR PRIX",
    price: (amount: number) => `${amount} $`,
    perMonth: "/mois",
    perYear: "/an",
    current: "Formule actuelle",
    switch: "Changer de formule",
  },
};

export function BillingMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 7_000, 0);
  const monthly = ms >= 1_600 && ms < 4_600;
  const t = BILLING[useLocale()];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Billing & Plans">
        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
          <div className="rounded-xl bg-navy p-4 text-white">
            <p className="text-[10px] tracking-[0.16em] text-white/60">{t.currentPlan}</p>
            <p className="mt-2 flex items-center gap-2 text-[20px] font-semibold">
              Growth
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-medium text-green">
                <span className="size-1.5 rounded-full bg-green" /> {t.active}
              </span>
            </p>
            <p className="mt-3 border-t border-white/10 pt-2 text-[10px] tracking-[0.14em] text-white/60">{t.renews}</p>
            <p className="text-[12.5px]">{t.renewal}</p>
          </div>
          <Card icon={CreditCard} title={t.method} sub={t.card}>
            <span className="flex items-center justify-between rounded-lg border border-line px-3 py-1.5 font-medium">
              {t.update} <span aria-hidden>→</span>
            </span>
          </Card>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold">{t.available}</p>
          <div className="flex rounded-xl border border-line bg-white p-1 text-[11.5px]">
            <span className="relative rounded-lg px-3 py-1" style={{ background: monthly ? "#F1F3F5" : undefined }}>
              {t.monthly}
              <Cursor {...cursorAt(ms, 1_500)} className="top-4 left-[55%]" />
            </span>
            <span className="relative rounded-lg px-3 py-1" style={{ background: monthly ? undefined : "#F1F3F5" }}>
              {t.yearly} <span className="text-[9.5px] font-semibold text-green">{t.bestValue}</span>
              <Cursor {...cursorAt(ms, 4_500)} className="top-4 left-[40%]" />
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(PRICES) as (keyof typeof PRICES)[]).map((name) => (
            <div key={name} className="rounded-xl border border-line bg-white p-4">
              <p className="font-semibold">{name}</p>
              <p key={String(monthly)} className="mt-2 animate-fade-in text-[26px] font-semibold tracking-tight">
                {t.price(monthly ? PRICES[name].monthly : PRICES[name].yearly)}
                <span className="ml-1 text-[11px] font-normal text-muted">{monthly ? t.perMonth : t.perYear}</span>
              </p>
              <span className={cn("mt-3 block rounded-lg py-2 text-center font-semibold", name === "Growth" ? "bg-[#EEF1F4] text-[#9CA3AF]" : "bg-green text-white")}>
                {name === "Growth" ? t.current : t.switch}
              </span>
            </div>
          ))}
        </div>
      </Shell>
    </SettingsStage>
  );
}

/* 12. Profile, password and two-factor authentication ------------------------------ */

const PW = { current: 800, next: 2_000, confirm: 3_200, update: 4_500, twofa: 5_800 };

const profileEn = {
  label: "Profile: changing the password, then turning on two-factor authentication.",
  passwordTitle: "Change password",
  passwordSub: "Use a unique password you do not use anywhere else.",
  current: "Current password *",
  currentPlaceholder: "Enter your current password",
  next: "New password *",
  nextPlaceholder: "Enter your new password",
  confirm: "Confirm new password *",
  confirmPlaceholder: "Confirm your new password",
  rule: "Password must be at least 8 characters long",
  update: "Update password",
  updated: "Password updated",
  twoFactor: "Two-factor authentication",
  twoFactorSub: "Add a second verification step when you sign in.",
  twoFactorText: "Add an extra layer of security by requiring additional verification steps.",
};

const PROFILE: Localized<typeof profileEn> = {
  en: profileEn,
  fr: {
    label: "Profil : modification du mot de passe, puis activation de l’authentification à deux facteurs.",
    passwordTitle: "Modifier le mot de passe",
    passwordSub: "Choisissez un mot de passe unique, que vous n’utilisez nulle part ailleurs.",
    current: "Mot de passe actuel *",
    currentPlaceholder: "Saisissez votre mot de passe actuel",
    next: "Nouveau mot de passe *",
    nextPlaceholder: "Saisissez le nouveau mot de passe",
    confirm: "Confirmer le mot de passe *",
    confirmPlaceholder: "Confirmez le nouveau mot de passe",
    rule: "Le mot de passe doit contenir au moins 8 caractères",
    update: "Mettre à jour le mot de passe",
    updated: "Mot de passe mis à jour",
    twoFactor: "Authentification à deux facteurs",
    twoFactorSub: "Ajoutez une seconde étape de vérification à la connexion.",
    twoFactorText: "Renforcez la sécurité en exigeant une étape de vérification supplémentaire.",
  },
};

export function ProfileSecurityMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000, 7_500);
  const dots = (start: number) => "•".repeat(Math.min(10, Math.max(0, Math.floor((ms - start) / 90))));
  const updated = ms >= PW.update + 100 && ms < PW.update + 2_200;
  const t = PROFILE[useLocale()];
  return (
    <SettingsStage stageRef={ref} label={t.label}>
      <Shell tab="Profile">
        <Card icon={KeyRound} title={t.passwordTitle} sub={t.passwordSub}>
          <Input label={t.current} value={dots(PW.current)} placeholder={t.currentPlaceholder} typing={ms >= PW.current && ms < PW.next} icon={Eye} />
          <div className="grid grid-cols-2 gap-2.5">
            <Input label={t.next} value={dots(PW.next)} placeholder={t.nextPlaceholder} typing={ms >= PW.next && ms < PW.confirm} />
            <Input label={t.confirm} value={dots(PW.confirm)} placeholder={t.confirmPlaceholder} typing={ms >= PW.confirm && ms < PW.update - 300} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] text-muted">{t.rule}</p>
            <span className="relative rounded-lg border border-line px-3 py-1.5 font-semibold">
              {updated ? (
                <span className="flex items-center gap-1 text-green">
                  <Check size={13} /> {t.updated}
                </span>
              ) : (
                t.update
              )}
              <Cursor {...cursorAt(ms, PW.update)} className="top-4 left-[55%]" />
            </span>
          </div>
        </Card>
        <Card icon={ShieldCheck} title={t.twoFactor} sub={t.twoFactorSub}>
          <ToggleRow title={t.twoFactor} text={t.twoFactorText} on={ms >= PW.twofa + 100} cursor={cursorAt(ms, PW.twofa)} />
        </Card>
      </Shell>
    </SettingsStage>
  );
}

/* 13. Language --------------------------------------------------------------------- */

const MENU = [
  ["Dashboard", "Tableau de bord"],
  ["Invoices", "Factures"],
  ["Estimates", "Devis"],
  ["Proposals", "Propositions"],
  ["Contracts", "Contrats"],
  ["Expenses", "Dépenses"],
  ["Payments", "Paiements"],
  ["Clients", "Clients"],
  ["Settings", "Paramètres"],
] as const;

const APP: Localized<{ newDocument: string; settings: string; lead: string; tabs: string[] }> = {
  en: { newDocument: "New document", settings: "Settings", lead: "Configure how your business appears and how documents behave.", tabs: ["Business", "Invoices", "Templates", "Tax"] },
  fr: {
    newDocument: "Nouveau document",
    settings: "Paramètres",
    lead: "Configurez l’apparence de votre entreprise et le fonctionnement de vos documents.",
    tabs: ["Entreprise", "Factures", "Modèles", "Taxes"],
  },
};

const LANGUAGE_LABEL: Localized<string> = {
  en: "Language: switching the whole app from English to French, then back.",
  fr: "Langue : toute l’application passe du français à l’anglais, puis revient au français.",
};

/** Starts in the reader's language, switches to the other one, then back. */
export function LanguageMock() {
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoop(ref, 8_000, 7_000);
  const locale = useLocale();
  const open = ms >= 1_200 && ms < 2_700;
  const switched = ms >= 2_600 && ms < 6_400;
  const shown: Locale = switched ? (locale === "fr" ? "en" : "fr") : locale;
  const app = APP[shown];
  const fr = shown === "fr" ? 1 : 0;
  return (
    <SettingsStage stageRef={ref} label={LANGUAGE_LABEL[locale]}>
      <div className={cn("flex w-[620px] overflow-hidden rounded-2xl border border-line bg-white text-left text-[12.5px] text-navy", SOFT_SHADOW)}>
        <div className="flex w-[210px] flex-col bg-navy p-3 text-white">
          <span className="rounded-lg bg-green py-2 text-center font-semibold">+ {app.newDocument}</span>
          <ul className="mt-3 space-y-0.5">
            {MENU.map((item) => (
              <li key={item[0]} className="rounded-md px-2.5 py-1.5 text-white/85 transition-opacity duration-300">
                {item[fr]}
              </li>
            ))}
          </ul>
          <div className="relative mt-auto rounded-lg border border-white/15 p-2.5">
            <p className="font-semibold">Ridgeway Towing</p>
            <p className="flex items-center gap-1.5 text-[11px] text-white/70">
              <Languages size={12} /> {LOCALE_NAMES[shown]}
            </p>
            <Cursor {...cursorAt(ms, 1_100)} className="top-7 left-[70%]" />
            {open && (
              <div className="absolute bottom-full left-0 mb-2 w-full animate-fade-in rounded-lg bg-white p-1 text-navy shadow-lg">
                {LOCALES.map((lang) => (
                  <span key={lang} className={cn("relative flex items-center justify-between rounded-md px-2.5 py-1.5", lang !== locale && "bg-surface")}>
                    {LOCALE_NAMES[lang]}
                    {lang === locale && <Check size={12} className="text-green" />}
                    {lang !== locale && <Cursor {...cursorAt(ms, 2_500)} className="top-4 left-[50%]" />}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-5">
          <p key={shown} className="animate-fade-in text-[20px] font-semibold tracking-tight">
            {app.settings}
          </p>
          <p className="mt-1 text-[11.5px] text-muted">{app.lead}</p>
          <div className="mt-4 space-y-2">
            {app.tabs.map((t) => (
              <div key={t} className="rounded-lg border border-line px-3 py-2.5 font-medium">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsStage>
  );
}
