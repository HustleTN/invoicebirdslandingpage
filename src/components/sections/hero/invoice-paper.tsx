import { GripVertical, Package, Pencil, Plus } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { BUSINESS, CLIENT, ITEMS, money, THEMES, type DemoFrame, type InvoiceDates } from "./demo-timeline";
import { TypingCaret } from "./typing-caret";

const placeholder = "text-[#B5BDC7] italic";
const sectionLabel = "mb-1.5 text-[9px] font-semibold tracking-[0.16em] text-[#8A94A3]";
const itemColumns = "grid grid-cols-[1fr_40px_70px_76px] gap-2";

const en = {
  itemPlaceholder: "Item description",
  detailsPlaceholder: "Additional details (optional)",
  zeroAmount: "0.00",
  title: "INVOICE",
  invoiceNumber: "Invoice No.",
  issueDate: "Issue Date",
  dueDate: "Due Date",
  from: "FROM",
  billTo: "BILL TO",
  updateBusiness: "Update business details",
  chooseClient: "Choose a client",
  phone: "Phone",
  email: "Email",
  description: "DESCRIPTION",
  qty: "QTY",
  rate: "RATE",
  amount: "AMOUNT",
  addItem: "Add additional item",
  fromCatalog: "From catalog",
  subtotal: "Subtotal",
  vat: "VAT (20%)",
  totalDue: "TOTAL DUE",
  notes: "NOTES",
  note: "Thank you for choosing Ridgeway.",
  notePlaceholder: "Add a note for your client…",
  terms: "TERMS & CONDITIONS",
  paymentTerms: "Payment due within 14 days by bank transfer.",
  termsPlaceholder: "Add your payment terms…",
  authorized: "AUTHORIZED",
  addSignature: "Click to add signature",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    itemPlaceholder: "Description de l’article",
    detailsPlaceholder: "Détails supplémentaires (facultatif)",
    zeroAmount: "0,00",
    title: "FACTURE",
    invoiceNumber: "N° de facture",
    issueDate: "Date d’émission",
    dueDate: "Date d’échéance",
    from: "ÉMETTEUR",
    billTo: "CLIENT",
    updateBusiness: "Modifier les informations de l’entreprise",
    chooseClient: "Choisir un client",
    phone: "Téléphone",
    email: "E-mail",
    description: "DÉSIGNATION",
    qty: "QTÉ",
    rate: "P.U.",
    amount: "MONTANT",
    addItem: "Ajouter un article",
    fromCatalog: "Depuis le catalogue",
    subtotal: "Sous-total",
    vat: "TVA (20 %)",
    totalDue: "TOTAL À PAYER",
    notes: "NOTES",
    note: "Merci d’avoir choisi Ridgeway.",
    notePlaceholder: "Ajoutez une note pour votre client…",
    terms: "CONDITIONS DE VENTE",
    paymentTerms: "Paiement sous 14 jours par virement bancaire.",
    termsPlaceholder: "Ajoutez vos conditions de paiement…",
    authorized: "SIGNATAIRE AUTORISÉ",
    addSignature: "Cliquez pour signer",
  },
};

/** Text-only wordmark for the demo towing business. */
export function RidgewayWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("leading-none", className)}>
      <div className="text-[21px] font-black tracking-[-0.02em] text-[#B91C1C] italic">RIDGEWAY</div>
      <div className="mt-1 text-[8px] font-bold tracking-[0.28em] text-[#1F2937]">TOWING &amp; RECOVERY</div>
    </div>
  );
}

function ItemRow({
  index,
  description,
  details,
  qty,
  rate,
  priced,
  typing = false,
}: {
  index: number;
  description: string;
  details: string;
  qty: number;
  rate: number;
  priced: boolean;
  typing?: boolean;
}) {
  const locale = useLocale();
  const t = COPY[locale];

  return (
    <div className={cn(itemColumns, "items-start px-4 pt-2 pb-1.5")}>
      <div className="flex min-w-0 gap-1.5">
        <span className="mt-px flex items-center text-[9px] text-[#9CA3AF]">
          0{index} <GripVertical size={9} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium">
            {description || <span className="font-normal text-[#B5BDC7]">{t.itemPlaceholder}</span>}
            {typing && <TypingCaret />}
          </p>
          <p className={cn("mt-0.5 truncate text-[9px]", priced ? "text-[#6B7280]" : "text-[#C9CFD6]")}>
            {priced ? details : t.detailsPlaceholder}
          </p>
        </div>
      </div>
      <span className="text-center">{qty}</span>
      <span className="text-right tabular-nums">{priced ? money(rate, locale) : "0"}</span>
      <span className="text-right font-semibold tabular-nums">{priced ? money(qty * rate, locale) : t.zeroAmount}</span>
    </div>
  );
}

/** The invoice document as shown in the builder canvas (natural size 580px wide). */
export function InvoicePaper({ frame, dates }: { frame: DemoFrame; dates: InvoiceDates }) {
  const locale = useLocale();
  const t = COPY[locale];
  const theme = frame.branded ? THEMES.blue : THEMES.initial;
  const radius = frame.branded ? 10 : 6;

  return (
    <div className="w-[580px] rounded-md bg-white px-8 pt-6 pb-5 font-[Helvetica,Arial,sans-serif] text-[10.5px] text-[#111827] shadow-[0_1px_10px_rgba(17,29,44,0.08)]">
      <div className={cn("transition-opacity duration-500", frame.resetting ? "opacity-0" : "opacity-100")}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <RidgewayWordmark className="pt-1" />
          <div className="text-right">
            <p
              className="text-[32px] leading-none font-bold tracking-[-0.02em] transition-colors duration-500"
              style={{ color: theme.primary }}
            >
              {t.title}
            </p>
            <dl className="mt-3 grid grid-cols-[auto_88px] gap-x-4 gap-y-1 text-left text-[9.5px]">
              <dt className="text-[#6B7280]">{t.invoiceNumber}</dt>
              <dd className="text-right font-semibold">INV-822</dd>
              <dt className="text-[#6B7280]">{t.issueDate}</dt>
              <dd className="text-right">{dates.issued}</dd>
              <dt className="text-[#6B7280]">{t.dueDate}</dt>
              <dd className="text-right">{frame.dueReady ? dates.due : dates.issued}</dd>
            </dl>
          </div>
        </div>

        {/* Parties */}
        <div className="mt-4 grid grid-cols-2 gap-8 border-t border-[#E8EBEF] pt-3.5 leading-[1.55]">
          <div>
            <p className={sectionLabel}>{t.from}</p>
            <p className="text-[11px] font-semibold">{BUSINESS.name}</p>
            {BUSINESS.address.map((line) => (
              <p key={line} className="text-[#4B5563]">
                {line}
              </p>
            ))}
            <p className="text-[#4B5563]">{BUSINESS.vatNumber[locale]}</p>
            <p className="mt-1 flex items-center gap-1 text-[9.5px] font-medium text-green">
              <Pencil size={10} /> {t.updateBusiness}
            </p>
          </div>
          <div>
            <p className={sectionLabel}>{t.billTo}</p>
            {frame.clientReady ? (
              <div className="animate-fade-in">
                <p className="text-[11px] font-semibold">{CLIENT.name}</p>
                {CLIENT.address.map((line) => (
                  <p key={line} className="text-[#4B5563]">
                    {line}
                  </p>
                ))}
                <p className={frame.emailReady ? "text-[#4B5563]" : placeholder}>
                  {frame.emailReady ? CLIENT.email : t.email}
                </p>
              </div>
            ) : (
              <>
                <p className={cn("text-[11px]", placeholder)}>{t.chooseClient}</p>
                <p className={placeholder}>{t.phone}</p>
                <p className={placeholder}>{t.email}</p>
              </>
            )}
          </div>
        </div>

        {/* Items */}
        <div
          className="mt-4 overflow-hidden border border-[#E4E7EB] transition-[border-radius] duration-500"
          style={{ borderRadius: radius }}
        >
          <div
            className={cn(
              itemColumns,
              "px-4 py-2 text-[8.5px] font-semibold tracking-[0.16em] text-white transition-colors duration-500",
            )}
            style={{ backgroundColor: theme.primary }}
          >
            <span className="pl-6">{t.description}</span>
            <span className="text-center">{t.qty}</span>
            <span className="text-right">{t.rate}</span>
            <span className="text-right">{t.amount}</span>
          </div>
          <ItemRow
            index={1}
            description={frame.typedItem}
            details={ITEMS[0].details[locale]}
            qty={ITEMS[0].qty}
            rate={ITEMS[0].rate}
            priced={frame.priceReady}
            typing={frame.itemTyping}
          />
          <div className={cn("transition-opacity duration-500", frame.secondItemReady ? "opacity-100" : "opacity-0")}>
            <ItemRow
              index={2}
              description={ITEMS[1].description[locale]}
              details={ITEMS[1].details[locale]}
              qty={ITEMS[1].qty}
              rate={ITEMS[1].rate}
              priced
            />
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-[#E4E7EB] px-4 py-1.5 text-[9.5px]">
            <span className="flex items-center gap-1 font-medium text-green">
              <Plus size={11} /> {t.addItem}
            </span>
            <span className="flex items-center gap-1 text-[#4B5563]">
              <Package size={10} /> {t.fromCatalog}
            </span>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-3 ml-auto w-[245px] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#4B5563]">{t.subtotal}</span>
            <span className="tabular-nums">{money(frame.subtotal, locale)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#4B5563]">{t.vat}</span>
            <span className="tabular-nums">{frame.vatReady ? money(frame.vat, locale) : "-"}</span>
          </div>
          <div
            className="mt-2 flex items-center justify-between px-4 py-3 text-white transition-[background-color,border-radius] duration-500"
            style={{ backgroundColor: theme.primary, borderRadius: radius }}
          >
            <span className="text-[9px] font-semibold tracking-[0.18em]">{t.totalDue}</span>
            <span className="text-[19px] font-bold tabular-nums">
              {money(frame.total, locale)} <span className="text-[9px] font-medium">GBP</span>
            </span>
          </div>
        </div>

        {/* Notes and terms */}
        <div className="mt-3 grid grid-cols-2 gap-5">
          <div>
            <p className={sectionLabel}>{t.notes}</p>
            <p
              className={cn(
                "min-h-[32px] rounded-md border border-dashed border-[#DDE1E6] px-2.5 py-1.5",
                !frame.draftReady && placeholder,
              )}
            >
              {frame.draftReady ? t.note : t.notePlaceholder}
            </p>
          </div>
          <div>
            <p className={sectionLabel}>{t.terms}</p>
            <p
              className={cn(
                "min-h-[32px] rounded-md border border-dashed border-[#DDE1E6] px-2.5 py-1.5",
                !frame.dueReady && placeholder,
              )}
            >
              {frame.dueReady ? t.paymentTerms : t.termsPlaceholder}
            </p>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-3 ml-auto w-[245px] text-right">
          <p className="text-[8.5px] font-semibold tracking-[0.18em] text-[#4B5563]">{t.authorized}</p>
          <div className="mt-1 flex items-center justify-between rounded-full border border-[#DDE1E6] px-3 py-1.5 text-[9.5px] text-[#9CA3AF]">
            {t.addSignature} <Pencil size={10} />
          </div>
          <p className="mt-1 text-[9.5px] text-[#4B5563]">{BUSINESS.name}</p>
        </div>
      </div>
    </div>
  );
}
