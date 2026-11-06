import Image from "next/image";
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  ChartColumn,
  CreditCard,
  FilePen,
  FileSignature,
  FileText,
  HandCoins,
  Landmark,
  LifeBuoy,
  ListChecks,
  MoreHorizontal,
  Palette,
  PenLine,
  Plus,
  Minus,
  Presentation,
  ReceiptText,
  Redo2,
  ShieldCheck,
  StickyNote,
  Undo2,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { DemoCursor } from "./demo-cursor";
import { BUSINESS, CLIENT, THEMES, type DemoFrame, type InvoiceDates } from "./demo-timeline";
import { DemoToggle } from "./demo-toggle";
import { InvoicePaper } from "./invoice-paper";

/** Fixed design size of the builder; it is scaled to the viewport with CSS `zoom`. */
export const BUILDER_WIDTH = 1280;
export const BUILDER_HEIGHT = 800;

const NAV: { icon: LucideIcon; label: Localized<string>; active?: boolean }[] = [
  { icon: ChartColumn, label: { en: "Dashboard", fr: "Tableau de bord" } },
  { icon: FileText, label: { en: "Invoices", fr: "Factures" }, active: true },
  { icon: FilePen, label: { en: "Estimates", fr: "Devis" } },
  { icon: Presentation, label: { en: "Proposals", fr: "Propositions" } },
  { icon: FileSignature, label: { en: "Contracts", fr: "Contrats" } },
  { icon: ReceiptText, label: { en: "Expenses", fr: "Dépenses" } },
  { icon: CreditCard, label: { en: "Payments", fr: "Paiements" } },
  { icon: Bookmark, label: { en: "Tax Reports", fr: "Rapports fiscaux" } },
  { icon: HandCoins, label: { en: "Collections", fr: "Recouvrement" } },
];

const CORNERS = ["sharp", "soft", "rounded"] as const;

const en = {
  create: "Create",
  sent: "Sent",
  draft: "Draft",
  saved: "Saved",
  notSaved: "Not saved yet",
  save: "Save",
  design: "Design",
  designSummary: "Template, colors, font",
  readyToSend: "Ready to send",
  progress: (done: number, total: number) => `${done} of ${total}`,
  allSet: "All set. Review and send.",
  chooseClient: "Choose a client",
  addEmail: "Add the client email",
  addPricedItem: "Add a priced item",
  buildInvoice: "Build your invoice",
  businessIdentity: "Business Identity",
  clientDetails: "Client Details",
  clientDetailsEmpty: "Bill-to and project context",
  invoiceSetup: "Invoice Setup",
  due: (date: string) => `INV-822 · due ${date}`,
  items: "Items & Services",
  noItems: "No items yet",
  oneItem: "1 item",
  twoItems: "2 items",
  taxes: "Taxes & Discounts",
  vat: "VAT 20%",
  noTaxes: "No taxes",
  paymentMethods: "Payment Methods",
  paymentMethodsSummary: "Hidden on the document",
  notes: "Notes",
  notesSummary: "Friendly note to the client",
  terms: "Terms & Conditions",
  termsSummary: "Payment terms and policies",
  signature: "Signature",
  signatureSummary: "Authorize and sign",
  template: "Template",
  templates: ["Modern", "Classic", "Minimal"],
  colors: "Colors",
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  corners: "Corners",
  cornerStyles: { sharp: "Sharp", soft: "Soft", rounded: "Rounded" },
  font: "Font",
  zoom: "100%",
  fit: "Fit",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    create: "Créer",
    sent: "Envoyée",
    draft: "Brouillon",
    saved: "Enregistrée",
    notSaved: "Pas encore enregistrée",
    save: "Enregistrer",
    design: "Apparence",
    designSummary: "Modèle, couleurs, police",
    readyToSend: "Prête pour l’envoi",
    progress: (done, total) => `${done} sur ${total}`,
    allSet: "C’est prêt. Vérifiez et envoyez.",
    chooseClient: "Choisir un client",
    addEmail: "Ajouter l’e-mail du client",
    addPricedItem: "Ajouter un article et son prix",
    buildInvoice: "Préparez votre facture",
    businessIdentity: "Identité de l’entreprise",
    clientDetails: "Informations client",
    clientDetailsEmpty: "Destinataire et contexte projet",
    invoiceSetup: "Paramètres de la facture",
    due: (date) => `INV-822 · éch. ${date}`,
    items: "Articles et prestations",
    noItems: "Aucun article",
    oneItem: "1 article",
    twoItems: "2 articles",
    taxes: "Taxes et remises",
    vat: "TVA 20 %",
    noTaxes: "Aucune taxe",
    paymentMethods: "Moyens de paiement",
    paymentMethodsSummary: "Masqués sur la facture",
    notes: "Notes",
    notesSummary: "Un mot pour votre client",
    terms: "Conditions de vente",
    termsSummary: "Modalités de paiement",
    signature: "Signature",
    signatureSummary: "Valider et signer",
    template: "Modèle",
    templates: ["Moderne", "Classique", "Minimal"],
    colors: "Couleurs",
    primary: "Principale",
    secondary: "Secondaire",
    accent: "Accent",
    corners: "Angles",
    cornerStyles: { sharp: "Vifs", soft: "Adoucis", rounded: "Arrondis" },
    font: "Police",
    zoom: "100 %",
    fit: "Auto",
  },
};

/** Index of the swatch the demo cursor clicks. */
const BLUE_SWATCH = 2;

const SWATCHES = [
  ["#0A2540", "#06B047"],
  ["#1F2937", "#4B5563"],
  ["#1D4ED8", "#60A5FA"],
  ["#4C1D95", "#8B5CF6"],
  ["#7F1D1D", "#DC2626"],
  ["#7C2D12", "#EA580C"],
  ["#831843", "#EC4899"],
  ["#14532D", "#06B047"],
];

function NavRail() {
  const locale = useLocale();

  return (
    <div className="flex w-[72px] shrink-0 flex-col items-center bg-navy text-white">
      <div className="flex h-16 items-center">
        <Image src="/images/svgs/invoicebirds-mark-white.svg" alt="" width={34} height={27} />
      </div>
      <div className="mb-3 flex flex-col items-center gap-1 text-[10px]">
        <span className="flex size-8 items-center justify-center rounded-lg bg-green">
          <Plus size={18} />
        </span>
        {COPY[locale].create}
      </div>
      {NAV.map(({ icon: Icon, label, active }) => (
        <div
          key={label.en}
          className={cn(
            "flex h-[56px] w-full flex-col items-center justify-center gap-1 text-center text-[9.5px] leading-tight",
            active ? "bg-white/10 text-white" : "text-white/75",
          )}
        >
          <Icon size={17} strokeWidth={1.6} />
          {label[locale]}
        </div>
      ))}
      <div className="mt-auto mb-3 flex flex-col items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-green text-[11px] font-semibold">RT</span>
        <LifeBuoy size={18} strokeWidth={1.6} className="text-white/75" />
      </div>
    </div>
  );
}

function DocumentHeader({ frame }: { frame: DemoFrame }) {
  const t = COPY[useLocale()];

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E6E9EE] bg-white px-5">
      <div className="flex items-center gap-4">
        <ArrowLeft size={17} className="text-[#374151]" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold">INV-822</span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                frame.sent ? "bg-green-soft text-green" : "bg-[#F1F3F5] text-[#374151]",
              )}
            >
              {frame.sent ? t.sent : t.draft}
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
            <span className={cn("size-1.5 rounded-full", frame.sent ? "bg-green" : "bg-[#F59E0B]")} />
            {frame.sent ? t.saved : t.notSaved}
          </p>
        </div>
        <div className="ml-2 flex gap-3 text-[#6B7280]">
          <Undo2 size={16} />
          <Redo2 size={16} className="text-[#C4C9D0]" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg border border-[#DDE1E6]">
          <MoreHorizontal size={16} />
        </span>
        <span className="rounded-lg border border-[#DDE1E6] px-3.5 py-2 text-[13px] font-medium">{t.save}</span>
      </div>
    </div>
  );
}

function TodoRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1 text-[11.5px]">
      {done ? (
        <span className="flex size-3.5 items-center justify-center rounded-full bg-green text-white">
          <Check size={9} strokeWidth={3} />
        </span>
      ) : (
        <span className="size-3.5 rounded-full border border-dashed border-[#9CA3AF]" />
      )}
      <span className={cn("flex-1 transition-colors", done ? "text-[#9CA3AF] line-through" : "text-[#374151]")}>{label}</span>
      <ChevronRight size={13} className="text-[#9CA3AF]" />
    </div>
  );
}

function SectionRow({
  icon: Icon,
  title,
  subtitle,
  done = false,
  toggle,
  muted = false,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  done?: boolean;
  toggle?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 py-[7px]">
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#E3E6EA] text-[#374151]">
        <Icon size={15} strokeWidth={1.6} />
        {done && (
          <span className="absolute -right-1 -bottom-1 flex size-3 items-center justify-center rounded-full border border-white bg-green text-white">
            <Check size={7} strokeWidth={3.5} />
          </span>
        )}
      </span>
      <div className={cn("min-w-0 flex-1", muted && "opacity-50")}>
        <p className="truncate text-[12px] font-semibold">{title}</p>
        <p className="truncate text-[10.5px] text-[#6B7280]">{subtitle}</p>
      </div>
      {toggle !== undefined && <DemoToggle on={toggle} />}
      <ChevronRight size={13} className="shrink-0 text-[#9CA3AF]" />
    </div>
  );
}

function EditorPanel({ frame, dates }: { frame: DemoFrame; dates: InvoiceDates }) {
  const t = COPY[useLocale()];
  const allDone = frame.stepsDone === 5;

  return (
    <div className="w-[256px] shrink-0 overflow-hidden border-r border-[#E6E9EE] bg-white px-3 pt-3">
      <div className="flex items-center gap-2.5 rounded-xl border border-[#DDE1E6] p-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg border border-[#E3E6EA] text-green">
          <Palette size={16} />
        </span>
        <div className="flex-1">
          <p className="text-[12.5px] font-semibold">{t.design}</p>
          <p className="text-[10.5px] text-[#6B7280]">{t.designSummary}</p>
        </div>
        <ChevronRight size={14} className="text-[#374151]" />
      </div>

      <div className="mt-2.5 rounded-xl border border-[#E6E9EE] px-3 py-2.5">
        <div className="flex justify-between text-[12.5px] font-semibold">
          <span>{t.readyToSend}</span>
          <span className="font-normal text-[#6B7280]">{t.progress(frame.stepsDone, 5)}</span>
        </div>
        <div className="mt-2 mb-1.5 h-[5px] rounded-full bg-[#E9ECEF]">
          <div
            className="h-full rounded-full bg-green transition-[width] duration-500"
            style={{ width: `${(frame.stepsDone / 5) * 100}%` }}
          />
        </div>
        {allDone ? (
          <p className="flex items-center gap-1.5 py-1 text-[11.5px] font-medium text-green">
            <Check size={13} /> {t.allSet}
          </p>
        ) : (
          <>
            <TodoRow label={t.chooseClient} done={frame.clientReady} />
            <TodoRow label={t.addEmail} done={frame.emailReady} />
            <TodoRow label={t.addPricedItem} done={frame.priceReady} />
          </>
        )}
      </div>

      <p className="mt-3.5 mb-0.5 px-1 text-[11px] text-[#6B7280]">{t.buildInvoice}</p>
      <SectionRow icon={Building2} title={t.businessIdentity} subtitle={BUSINESS.name} done />
      <SectionRow
        icon={Users}
        title={t.clientDetails}
        subtitle={frame.clientReady ? CLIENT.name : t.clientDetailsEmpty}
        done={frame.clientReady}
      />
      <SectionRow icon={FileText} title={t.invoiceSetup} subtitle={t.due(frame.dueReady ? dates.due : dates.issued)} done />
      <SectionRow
        icon={ListChecks}
        title={t.items}
        subtitle={frame.secondItemReady ? t.twoItems : frame.priceReady ? t.oneItem : t.noItems}
        done={frame.priceReady}
      />
      <SectionRow icon={Calculator} title={t.taxes} subtitle={frame.vatReady ? t.vat : t.noTaxes} done={frame.vatReady} />
      <SectionRow icon={Landmark} title={t.paymentMethods} subtitle={t.paymentMethodsSummary} toggle={false} muted />
      <SectionRow icon={StickyNote} title={t.notes} subtitle={t.notesSummary} toggle />
      <SectionRow icon={ShieldCheck} title={t.terms} subtitle={t.termsSummary} toggle />
      <SectionRow icon={PenLine} title={t.signature} subtitle={t.signatureSummary} toggle />
    </div>
  );
}

function DesignPanel({ frame }: { frame: DemoFrame }) {
  const t = COPY[useLocale()];
  const theme = frame.branded ? THEMES.blue : THEMES.initial;
  const colorRows = [
    [t.primary, theme.primary],
    [t.secondary, theme.secondary],
    [t.accent, theme.accent],
  ] as const;

  return (
    <div className="w-[280px] shrink-0 border-l border-[#E6E9EE] bg-white">
      <p className="border-b border-[#E6E9EE] px-4 py-3.5 text-[14px] font-semibold">{t.design}</p>
      <div className="px-4 pt-3.5">
        <p className="text-[12.5px] font-semibold">{t.template}</p>
        <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[10.5px]">
          {t.templates.map((name, index) => (
            <div key={name}>
              <div
                className={cn(
                  "relative h-[82px] rounded-lg border p-2",
                  index === 0 ? "border-2 border-green" : "border-[#E3E6EA]",
                )}
              >
                {index === 0 && (
                  <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-green text-white">
                    <Check size={8} strokeWidth={3.5} />
                  </span>
                )}
                <div
                  className={cn("rounded-sm transition-colors duration-500", index === 0 ? "w-full" : "mx-auto w-8")}
                  style={{ backgroundColor: index === 0 ? theme.primary : "#1F2937", height: index === 0 ? 10 : 3 }}
                />
                <div className="mt-2 space-y-1">
                  <div className="h-[2px] w-4/5 bg-[#E5E7EB]" />
                  <div className="h-[2px] w-3/5 bg-[#E5E7EB]" />
                </div>
                <div
                  className="mt-2 h-[5px] w-full transition-colors duration-500"
                  style={{ backgroundColor: index === 2 ? "#E5E7EB" : theme.primary }}
                />
                <div className="mt-1.5 space-y-1">
                  <div className="h-[2px] w-full bg-[#E5E7EB]" />
                  <div className="h-[2px] w-full bg-[#E5E7EB]" />
                </div>
                <div className="mt-2 ml-auto h-[5px] w-6 transition-colors duration-500" style={{ backgroundColor: theme.primary }} />
              </div>
              <p className={cn("mt-1.5", index === 0 ? "font-semibold" : "text-[#4B5563]")}>{name}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12.5px] font-semibold">{t.colors}</p>
        <div className="mt-2.5 flex justify-between">
          {SWATCHES.map(([dark, light], index) => (
            <span key={dark} className="relative">
              <span
                className={cn(
                  "block size-[25px] rounded-full ring-offset-2 transition-shadow",
                  index === BLUE_SWATCH && frame.branded && "ring-2 ring-[#1D4ED8]",
                )}
                style={{ background: `linear-gradient(135deg, ${dark} 50%, ${light} 50%)` }}
              />
              {index === BLUE_SWATCH && (
                <DemoCursor visible={frame.colorCursor} clicking={frame.colorClick} className="top-3 left-3.5" />
              )}
            </span>
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {colorRows.map(([label, hex]) => (
            <div key={label} className="flex items-center gap-2.5 rounded-lg border border-[#E3E6EA] px-2.5 py-1.5 text-[12px]">
              <span className="size-[18px] rounded transition-colors duration-500" style={{ backgroundColor: hex }} />
              <span className="flex-1">{label}</span>
              <span className="font-mono text-[10.5px] text-[#6B7280]">{hex}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12.5px] font-semibold">{t.corners}</p>
        <div className="mt-2 grid grid-cols-3 rounded-lg border border-[#E3E6EA] bg-[#F7F8FA] p-0.5 text-[10.5px] text-[#4B5563]">
          {CORNERS.map((corner) => (
            <span
              key={corner}
              className={cn(
                "rounded-md py-1.5 text-center transition-colors",
                corner === (frame.branded ? "rounded" : "soft") && "bg-white font-semibold text-[#111827] shadow-sm",
              )}
            >
              {t.cornerStyles[corner]}
            </span>
          ))}
        </div>

        <p className="mt-4 text-[12.5px] font-semibold">{t.font}</p>
        <div className="mt-2 flex items-center gap-2.5 rounded-lg border border-[#E3E6EA] px-3 py-2 text-[12px]">
          <span className="text-[14px]">Aa</span>
          <span className="flex-1">Helvetica</span>
          <ChevronDown size={14} className="text-[#6B7280]" />
        </div>
      </div>
    </div>
  );
}

/** Marketing mock of the InvoiceBirds invoice builder at a fixed 1280×800 design size. */
export function DesktopBuilder({ frame, dates }: { frame: DemoFrame; dates: InvoiceDates }) {
  const t = COPY[useLocale()];

  return (
    <div
      className="flex overflow-hidden rounded-[18px] border border-[#DCE3EB] bg-white text-[#111827] shadow-[0_18px_48px_rgba(10,37,64,0.1),0_4px_12px_rgba(10,37,64,0.04)]"
      style={{ width: BUILDER_WIDTH, height: BUILDER_HEIGHT }}
    >
      <NavRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <DocumentHeader frame={frame} />
        <div className="flex min-h-0 flex-1">
          <EditorPanel frame={frame} dates={dates} />
          <div className="relative flex min-w-0 flex-1 justify-center overflow-hidden bg-[#F3F4F6] pt-4">
            <InvoicePaper frame={frame} dates={dates} />
            <div className="absolute top-[150px] right-2 flex w-8 flex-col items-center gap-2.5 rounded-lg border border-[#E3E6EA] bg-white py-2.5 text-[9px] text-[#374151] shadow-sm">
              <Plus size={13} />
              <span>{t.zoom}</span>
              <Minus size={13} />
              <span className="font-medium text-green">{t.fit}</span>
            </div>
          </div>
          <DesignPanel frame={frame} />
        </div>
      </div>
    </div>
  );
}
