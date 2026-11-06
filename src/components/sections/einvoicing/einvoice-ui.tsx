import { ChevronDown, Download, FileCode2, FileText, Inbox } from "lucide-react";

import { cn } from "@/lib/cn";

import { BUSINESS, CLIENT, euro, FORMATS, INCOMING, ITEMS, SUBTOTAL, TOTAL, VAT, xmlPreview, type FormatId } from "./data";

export type Mode = "regular" | "einvoice";

export type InvoiceDates = { issued: string; due: string; issueIso: string; dueIso: string };

export function FormatSelector({ mode, onChange, className }: { mode: Mode; onChange: (mode: Mode) => void; className?: string }) {
  const options: { id: Mode; label: string; icon: typeof FileText }[] = [
    { id: "regular", label: "Regular invoice", icon: FileText },
    { id: "einvoice", label: "E-invoice", icon: FileCode2 },
  ];

  return (
    <div role="group" aria-label="Invoice format" className={cn("flex rounded-xl bg-[#F1F4F7] p-1", className)}>
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={mode === id}
          onClick={() => onChange(id)}
          className={cn(
            "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition-all duration-300",
            mode === id ? "bg-white text-navy shadow-sm" : "text-[#6B7280] hover:text-navy",
          )}
        >
          <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

export function FormatOptions({
  format,
  onChange,
  compact = false,
}: {
  format: FormatId;
  onChange: (format: FormatId) => void;
  compact?: boolean;
}) {
  return (
    <div role="group" aria-label="E-invoice format" className={cn(compact ? "grid grid-cols-2 gap-2" : "space-y-1.5")}>
      {FORMATS.map((item) => {
        const selected = item.id === format;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors duration-300",
              selected ? "border-green bg-[#F3FCF6]" : "border-[#E6EAEF] hover:border-[#CBD3DC]",
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                selected ? "border-green" : "border-[#C4CCD5]",
              )}
            >
              {selected && <span className="size-1.5 rounded-full bg-green" />}
            </span>
            <span className="min-w-0">
              <span className={cn("block text-[12.5px] leading-snug font-semibold text-navy", !compact && "truncate")}>{item.name}</span>
              <span className={cn("block text-[11px] leading-snug text-[#6B7280]", !compact && "truncate")}>{item.output}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function CurrencyField() {
  return (
    <div>
      <div className="flex items-center gap-2.5 rounded-xl border border-[#E6EAEF] px-3 py-2.5 text-[13px]">
        <span className="flex size-6 items-center justify-center rounded-full bg-surface text-[12px] font-semibold text-navy">€</span>
        <span className="flex-1 font-medium text-navy">EUR · Euro</span>
        <ChevronDown size={14} className="text-[#6B7280]" />
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-[#6B7280]">
        {["GBP", "USD", "CHF", "SEK", "PLN"].map((code) => (
          <span key={code} className="rounded-md bg-[#F4F6F8] px-1.5 py-0.5 font-medium text-[#4B5563]">
            {code}
          </span>
        ))}
        <span>135+ currencies</span>
      </p>
    </div>
  );
}

export function ClientField() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E6EAEF] px-3 py-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E0EAFF] text-[11px] font-semibold text-[#1D4ED8]">
        {CLIENT.initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-navy">{CLIENT.name}</p>
        <p className="truncate text-[11px] text-[#6B7280]">Cork, Ireland · {CLIENT.vatId}</p>
      </div>
    </div>
  );
}

/** Rendered invoice; the visual document behind both formats. */
export function InvoicePaper({ mode, format, dates }: { mode: Mode; format: FormatId; dates: InvoiceDates }) {
  const formatName = FORMATS.find((item) => item.id === format)?.name;

  return (
    <div className="w-full rounded-lg bg-white p-6 font-[Helvetica,Arial,sans-serif] text-[10.5px] leading-[1.5] text-[#111827] shadow-[0_2px_16px_rgba(17,29,44,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="leading-none">
          <p className="text-[17px] font-black tracking-[-0.02em] text-[#B91C1C] italic">RIDGEWAY</p>
          <p className="mt-1 text-[6.5px] font-bold tracking-[0.28em] text-[#1F2937]">TOWING &amp; RECOVERY</p>
        </div>
        <div className="text-right">
          <p className="text-[22px] leading-none font-bold tracking-[-0.01em] text-navy">INVOICE</p>
          <p className="mt-1.5 text-[#6B7280]">
            No. <span className="font-semibold text-[#111827]">INV-842</span>
          </p>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-500",
          mode === "einvoice" ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-soft px-2 py-0.5 text-[9.5px] font-semibold text-green">
            <FileCode2 size={10} /> E-invoice · {formatName}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#EEF1F4] pt-3">
        <div>
          <p className="mb-1 text-[8px] font-semibold tracking-[0.16em] text-[#8A94A3]">FROM</p>
          <p className="font-semibold">{BUSINESS.name}</p>
          <p className="text-[#6B7280]">{BUSINESS.address}</p>
          <p className="text-[#6B7280]">VAT {BUSINESS.vatId}</p>
        </div>
        <div>
          <p className="mb-1 text-[8px] font-semibold tracking-[0.16em] text-[#8A94A3]">BILL TO</p>
          <p className="font-semibold">{CLIENT.name}</p>
          <p className="text-[#6B7280]">{CLIENT.address}</p>
          <p className="text-[#6B7280]">VAT {CLIENT.vatId}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-6 text-[#6B7280]">
        <p>
          Issued <span className="text-[#111827]">{dates.issued}</span>
        </p>
        <p>
          Due <span className="text-[#111827]">{dates.due}</span>
        </p>
      </div>

      <div className="mt-3 overflow-hidden rounded-md border border-[#E6EAEF]">
        <div className="grid grid-cols-[1fr_32px_72px] gap-2 bg-navy px-3 py-1.5 text-[8px] font-semibold tracking-[0.14em] text-white">
          <span>DESCRIPTION</span>
          <span className="text-center">QTY</span>
          <span className="text-right">AMOUNT</span>
        </div>
        {ITEMS.map((item) => (
          <div key={item.name} className="grid grid-cols-[1fr_32px_72px] gap-2 border-t border-[#F1F3F5] px-3 py-1.5">
            <span>{item.name}</span>
            <span className="text-center">{item.qty}</span>
            <span className="text-right tabular-nums">{euro(item.qty * item.rate)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 ml-auto w-[190px] space-y-1">
        <div className="flex justify-between text-[#6B7280]">
          <span>Subtotal</span>
          <span className="text-[#111827] tabular-nums">{euro(SUBTOTAL)}</span>
        </div>
        <div className="flex justify-between text-[#6B7280]">
          <span>VAT 23%</span>
          <span className="text-[#111827] tabular-nums">{euro(VAT)}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between rounded-md bg-navy px-3 py-2 text-white">
          <span className="text-[8px] font-semibold tracking-[0.16em]">TOTAL DUE</span>
          <span className="text-[14px] font-bold tabular-nums">{euro(TOTAL)}</span>
        </div>
      </div>
    </div>
  );
}

/** Minimal XML highlighting: tags blue, attribute values green, content navy. */
function XmlLine({ line }: { line: string }) {
  return (
    <>
      {line.split(/(<[^>]+>)/).map((part, index) =>
        part.startsWith("<") ? (
          <span key={index} className="text-[#2563EB]">
            {part.split(/("[^"]*")/).map((piece, pieceIndex) =>
              piece.startsWith('"') ? (
                <span key={pieceIndex} className="text-green">
                  {piece}
                </span>
              ) : (
                piece
              ),
            )}
          </span>
        ) : (
          <span key={index} className={part.trim() === "…" ? "text-[#9CA3AF]" : "font-medium text-navy"}>
            {part}
          </span>
        ),
      )}
    </>
  );
}

export function XmlPanel({ format, dates }: { format: FormatId; dates: InvoiceDates }) {
  const meta = FORMATS.find((item) => item.id === format)!;
  const lines = xmlPreview(format, dates);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E3E7EC] bg-white shadow-[0_18px_50px_rgba(10,37,64,0.14)]">
      <div className="flex items-center gap-2.5 border-b border-[#EEF1F4] px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-lg bg-green-soft text-green">
          <FileCode2 size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[12px] font-semibold text-navy">{meta.file}</p>
          <p className="truncate text-[11px] text-[#6B7280]">
            {meta.name} · {meta.output}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-lg border border-[#E3E7EC] px-2 py-1 text-[11px] font-medium text-navy">
          <Download size={12} /> Download
        </span>
      </div>
      {/* Re-keyed per format so the lines replay their reveal on every switch. */}
      <div key={format} className="overflow-hidden bg-[#FAFBFC] px-4 py-3 font-mono text-[10px] leading-[1.5] whitespace-pre">
        {lines.map((line, index) => (
          <div key={index} className="animate-fade-in truncate" style={{ animationDelay: `${index * 45}ms` }}>
            <XmlLine line={line} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function IncomingNotice({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[#E3E7EC] bg-white p-3.5 shadow-[0_18px_50px_rgba(10,37,64,0.16)]", className)}>
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1D4ED8]">
          <Inbox size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12.5px] font-semibold text-navy">E-invoice received</p>
            <span className="text-[10.5px] text-[#9CA3AF]">Just now</span>
          </div>
          <p className="mt-0.5 truncate text-[12px] text-[#374151]">
            {INCOMING.supplier} · <span className="font-medium tabular-nums">{euro(INCOMING.total)}</span>
          </p>
          <p className="mt-0.5 truncate text-[11px] text-[#6B7280]">
            {INCOMING.number} · {INCOMING.format} · Ready to review
          </p>
        </div>
      </div>
    </div>
  );
}
