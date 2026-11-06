import { ArrowLeft, BadgePercent, Check, ChevronDown, PenTool, Plus, RotateCcw, Trash, Upload } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { DemoCursor } from "@/components/sections/hero/demo-cursor";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { RidgewayLogo, Signature } from "./invoice-preview";
import { THEMES, type Look } from "./timeline";

const en = {
  done: "Done",
  design: "Design",
  template: "Template",
  templates: ["Modern", "Classic", "Minimal"],
  colors: "Colors",
  roles: ["Primary", "Secondary", "Accent"],
  corners: "Corners",
  cornerOptions: ["Sharp", "Soft", "Rounded"],
  itemTable: "Item table",
  tableOptions: ["Lined", "Striped", "Card"],
  identity: "Business Identity",
  logoOnInvoice: "LOGO ON THIS INVOICE",
  noLogo: "No logo uploaded",
  replaceLogo: "Replace logo",
  uploadLogo: "Upload logo",
  useDefault: "Use default",
  taxesDiscounts: "Taxes & Discounts",
  taxes: "Taxes",
  vat: "VAT",
  isDefault: "Default",
  vatRate: "20% · Exclusive",
  addTax: "Add tax",
  discount: "Discount",
  value: "Value",
  percent: "Percent %",
  discountApplied: "Discount applied",
  applyDiscount: "Apply discount",
  signature: "Signature",
  showOnInvoice: "Show on invoice",
  draw: "Draw",
  upload: "Upload",
  signHere: "Sign here",
  signatureApplied: "Signature applied",
  applySignature: "Apply signature",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    done: "OK",
    design: "Apparence",
    template: "Modèle",
    templates: ["Moderne", "Classique", "Minimal"],
    colors: "Couleurs",
    roles: ["Principale", "Secondaire", "Accent"],
    corners: "Coins",
    cornerOptions: ["Droits", "Adoucis", "Arrondis"],
    itemTable: "Tableau des articles",
    tableOptions: ["Lignes", "Bandes", "Carte"],
    identity: "Identité de l’entreprise",
    logoOnInvoice: "LOGO SUR CETTE FACTURE",
    noLogo: "Aucun logo importé",
    replaceLogo: "Changer le logo",
    uploadLogo: "Importer un logo",
    useDefault: "Par défaut",
    taxesDiscounts: "Taxes et remises",
    taxes: "Taxes",
    vat: "TVA",
    isDefault: "Par défaut",
    vatRate: "20 % · Hors taxe",
    addTax: "Ajouter une taxe",
    discount: "Remise",
    value: "Valeur",
    percent: "Pourcentage %",
    discountApplied: "Remise appliquée",
    applyDiscount: "Appliquer la remise",
    signature: "Signature",
    showOnInvoice: "Afficher sur la facture",
    draw: "Dessiner",
    upload: "Importer",
    signHere: "Signez ici",
    signatureApplied: "Signature appliquée",
    applySignature: "Appliquer la signature",
  },
};

/** The panel chrome from the app: title row with back arrow and Done. Dims when not in use. */
function Panel({ title, sub = true, active, children }: { title: string; sub?: boolean; active: boolean; children: React.ReactNode }) {
  const t = COPY[useLocale()];
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-white text-left text-navy shadow-[0_12px_40px_rgba(10,37,64,0.08),0_2px_6px_rgba(10,37,64,0.04)] transition-[opacity,border-color] duration-500",
        active ? "border-navy/35 opacity-100" : "border-line opacity-55",
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-2.5">
        {sub && <ArrowLeft size={15} className="text-[#6B7280]" />}
        <p className="flex-1 text-[14px] font-semibold">{title}</p>
        {sub && <span className="text-[12.5px] font-semibold text-green">{t.done}</span>}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  );
}

function Segmented({ options, value }: { options: string[]; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 rounded-lg border border-line bg-[#F7F8FA] p-0.5 text-[11.5px]">
      {options.map((option) => (
        <span
          key={option}
          className={cn(
            "rounded-md py-1.5 text-center transition-colors duration-300",
            option === value ? "bg-white font-semibold text-navy" : "text-[#6B7280]",
          )}
        >
          {option}
        </span>
      ))}
    </div>
  );
}

/** The swatch the demo cursor picks. */
const RED = 4;

const SWATCHES = [
  ["#0A2540", "#06B047"],
  ["#374151", "#111827"],
  ["#1E3A8A", "#3B82F6"],
  ["#4C1D95", "#7C3AED"],
  ["#7F1D1D", "#DC2626"],
  ["#7C2D12", "#D97706"],
];

/** Design: template, colors, corners and item table. */
export function DesignPanel({ look, active }: { look: Look; active: boolean }) {
  const t = COPY[useLocale()];
  const theme = look.brand ? THEMES.brand : THEMES.plain;
  return (
    <Panel title={t.design} sub={false} active={active}>
      <p className="text-[12.5px] font-semibold">{t.template}</p>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
        {t.templates.map((name, i) => (
          <div key={name}>
            <div className={cn("relative h-[44px] rounded-lg border p-1.5", i === 0 ? "border-2 border-green" : "border-line")}>
              {i === 0 && (
                <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-green text-white">
                  <Check size={8} strokeWidth={3.5} />
                </span>
              )}
              <div className="h-2 rounded-sm transition-colors duration-500" style={{ backgroundColor: i === 0 ? theme.primary : "#E5E7EB" }} />
              <div className="mt-1 h-[3px] w-full transition-colors duration-500" style={{ backgroundColor: i === 2 ? "#EEF0F3" : theme.primary }} />
              <div className="mt-1 h-[2px] w-full bg-[#E5E7EB]" />
              <div className="mt-1.5 ml-auto h-[4px] w-5 transition-colors duration-500" style={{ backgroundColor: theme.primary }} />
            </div>
            <p className={cn("mt-1", i === 0 ? "font-semibold" : "text-[#6B7280]")}>{name}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[12.5px] font-semibold">{t.colors}</p>
      <div className="mt-2 flex justify-between">
        {SWATCHES.map(([a, b], i) => (
          <span key={a} className="relative">
            <span
              className={cn("block size-[26px] rounded-full ring-offset-2 transition-shadow", i === RED && look.brand && "ring-2 ring-[#B91C1C]")}
              style={{ background: `linear-gradient(135deg, ${a} 50%, ${b} 50%)` }}
            />
            {i === RED && <DemoCursor {...look.cursors.swatch} className="top-3.5 left-4" />}
          </span>
        ))}
      </div>
      <div className="mt-2 space-y-1">
        {(
          [
            [t.roles[0], theme.primary],
            [t.roles[1], theme.secondary],
            [t.roles[2], theme.accent],
          ] as const
        ).map(([name, hex]) => (
          <div key={name} className="flex items-center gap-2.5 rounded-lg border border-line px-2.5 py-1 text-[12px]">
            <span className="size-4 rounded transition-colors duration-500" style={{ backgroundColor: hex }} />
            <span className="flex-1">{name}</span>
            <span className="font-mono text-[10.5px] text-[#6B7280] uppercase">{hex}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[12.5px] font-semibold">{t.corners}</p>
      <div className="relative mt-2">
        <Segmented options={t.cornerOptions} value={t.cornerOptions[look.rounded ? 2 : 1]} />
        <DemoCursor {...look.cursors.corners} className="top-4 right-[14%]" />
      </div>

      <p className="mt-3 text-[12.5px] font-semibold">{t.itemTable}</p>
      <div className="relative mt-2">
        <Segmented options={t.tableOptions} value={t.tableOptions[look.striped ? 1 : 0]} />
        <DemoCursor {...look.cursors.table} className="top-4 left-[46%]" />
      </div>
    </Panel>
  );
}

/** Business Identity: the logo on this invoice. */
export function LogoPanel({ look, active }: { look: Look; active: boolean }) {
  const t = COPY[useLocale()];
  return (
    <Panel title={t.identity} active={active}>
      <p className="text-[10px] font-semibold tracking-[0.14em] text-[#9CA3AF]">{t.logoOnInvoice}</p>
      <div className="mt-2 flex h-[58px] items-center justify-center rounded-xl border border-line bg-[#F7F8FA]">
        {look.logo ? (
          <div className="animate-fade-in rounded-md bg-white px-3 py-2">
            <RidgewayLogo size={0.85} />
          </div>
        ) : (
          <p className="text-[11.5px] text-[#9CA3AF]">{t.noLogo}</p>
        )}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] font-semibold">
        <span className="relative">
          <span className="flex items-center justify-center gap-1.5 rounded-lg bg-green py-2 text-white">
            <Upload size={13} /> {look.logo ? t.replaceLogo : t.uploadLogo}
          </span>
          <DemoCursor {...look.cursors.logo} className="top-5 left-[60%]" />
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-[#9CA3AF]">
          <RotateCcw size={13} /> {t.useDefault}
        </span>
      </div>
    </Panel>
  );
}

/** Taxes & Discounts: add VAT, then a 10% discount. */
export function TaxPanel({ look, active }: { look: Look; active: boolean }) {
  const t = COPY[useLocale()];
  return (
    <Panel title={t.taxesDiscounts} active={active}>
      <p className="text-[12.5px] font-semibold">{t.taxes}</p>
      <div className={cn("grid transition-all duration-500", look.vat ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <div className="flex items-center gap-2.5 rounded-lg border border-line px-2.5 py-2">
            <span className="flex size-7 items-center justify-center rounded-md border border-line text-[#4B5563]">
              <BadgePercent size={14} />
            </span>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold">
                {t.vat} <span className="rounded-full bg-green-soft px-1.5 text-[10px] font-medium text-green">{t.isDefault}</span>
              </p>
              <p className="text-[11px] text-[#6B7280]">{t.vatRate}</p>
            </div>
            <Trash size={13} className="text-[#9CA3AF]" />
          </div>
        </div>
      </div>
      <span className="relative mt-2 block">
        <span className="flex items-center justify-center gap-1.5 rounded-lg bg-green py-2 text-[12px] font-semibold text-white">
          <Plus size={13} /> {t.addTax}
        </span>
        <DemoCursor {...look.cursors.tax} className="top-5 left-[58%]" />
      </span>

      <p className="mt-3 border-t border-line pt-2.5 text-[12.5px] font-semibold">{t.discount}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
        <span className={cn("rounded-lg border px-2.5 py-1.5", look.discountTyped ? "border-navy/40 text-navy" : "border-line text-[#9CA3AF]")}>
          {look.discountTyped ? "10" : t.value}
        </span>
        <span className="flex items-center justify-between rounded-lg border border-line px-2.5 py-1.5">
          {t.percent} <ChevronDown size={12} className="text-[#6B7280]" />
        </span>
      </div>
      <span className="relative mt-2 block">
        <span
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold text-white transition-colors",
            look.discountTyped ? "bg-green" : "bg-[#C9D2DC]",
          )}
        >
          {look.discount ? (
            <>
              <Check size={13} /> {t.discountApplied}
            </>
          ) : (
            t.applyDiscount
          )}
        </span>
        <DemoCursor {...look.cursors.discount} className="top-5 left-[62%]" />
      </span>
    </Panel>
  );
}

/** Signature: draw, then apply. */
export function SignaturePanel({ look, active }: { look: Look; active: boolean }) {
  const t = COPY[useLocale()];
  const drawn = look.signature >= 1;
  return (
    <Panel title={t.signature} active={active}>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
        <p className="text-[12px] font-semibold">{t.showOnInvoice}</p>
        <span className="relative h-[18px] w-8 rounded-full bg-green">
          <span className="absolute top-0.5 left-[15px] size-3.5 rounded-full bg-white" />
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-0.5 rounded-lg bg-[#F1F3F5] p-0.5 text-[12px]">
        <span className="flex items-center justify-center gap-1.5 rounded-md bg-white py-1.5 font-semibold">
          <PenTool size={12} /> {t.draw}
        </span>
        <span className="flex items-center justify-center gap-1.5 py-1.5 text-[#6B7280]">
          <Upload size={12} /> {t.upload}
        </span>
      </div>
      <div className="relative mt-2 flex h-[68px] items-center justify-center rounded-lg border border-line">
        {look.signature > 0 ? (
          <Signature progress={look.signature} className="h-[44px] w-auto" />
        ) : (
          <p className="text-[11px] text-[#9CA3AF]">{t.signHere}</p>
        )}
        <span className="absolute inset-x-5 bottom-3 border-t border-dashed border-[#D1D5DB]" />
      </div>
      <span className="relative mt-2 block">
        <span
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold transition-colors",
            drawn ? "bg-green text-white" : "bg-[#F1F3F5] text-[#9CA3AF]",
          )}
        >
          {look.signed ? (
            <>
              <Check size={13} /> {t.signatureApplied}
            </>
          ) : (
            t.applySignature
          )}
        </span>
        <DemoCursor {...look.cursors.signature} className="top-5 left-[60%]" />
      </span>
    </Panel>
  );
}
