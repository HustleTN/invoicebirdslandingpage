"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Check, FileInput, LoaderCircle, Paperclip } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { FitCanvas } from "@/components/ui/fit-canvas";
import { cn } from "@/lib/cn";
import { INTL_LOCALE, type Locale, type Localized } from "@/lib/i18n";
import { useLoopClock } from "@/lib/use-loop-clock";

import { FORMATS, SAMPLE, type Format } from "./formats";

const eur = (locale: Locale) => (n: number) => new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: "EUR" }).format(n);

const en = {
  formats: "E-invoice formats",
  invoice: "Invoice",
  issued: SAMPLE.issueDate as string,
  billTo: "Bill to",
  vat: (rate: number) => `VAT ${rate}%`,
  total: "Total",
  exporting: "Exporting…",
  supported: "Supported format",
  embedded: "· embedded in this PDF",
  abbreviated: "Abbreviated example for illustration, not a complete file.",
  importing: "Importing supplier invoice…",
  imported: "Supplier invoice imported",
  reading: "Reading structured data",
  recognised: "Recognised as XRechnung",
  checking: "Checking totals and VAT",
  ready: "Ready to review",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    formats: "Formats de facture électronique",
    invoice: "Facture",
    issued: "31 oct. 2026",
    billTo: "Facturé à",
    vat: (rate) => `TVA ${rate} %`,
    total: "Total",
    exporting: "Export en cours…",
    supported: "Format pris en charge",
    embedded: "· intégré à ce PDF",
    abbreviated: "Extrait abrégé à titre d’illustration, et non un fichier complet.",
    importing: "Import en cours…",
    imported: "Facture d’achat importée",
    reading: "Lecture des données structurées",
    recognised: "Reconnue comme XRechnung",
    checking: "Contrôle des totaux et TVA",
    ready: "Prête à être vérifiée",
  },
};

/** Each format gets the same slot in the loop: its code types out, then holds. */
const SEGMENT = 7_000;
const LOOP = SEGMENT * 3;
const TYPE_MS = 4_000;
/** Shown at the end of a segment: the whole file, for reduced motion. */
const FINAL = SEGMENT - 1;

/** A small file glyph: folded corner, the file kind on its face, one accent. */
function FileGlyph({ format, size = 34 }: { format: Format; size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 34 41" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 1h18l11 11v24a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4z" transform="translate(.5 .5)" fill="#fff" stroke="#C5D0DC" />
      <path d="M22.5 1.5v8a3 3 0 0 0 3 3h8" stroke="#C5D0DC" />
      <rect x="0.5" y="21" width="26" height="12" rx="3" fill={format.accent.icon} />
      <text x="13.5" y="30" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" fontFamily="ui-sans-serif, system-ui">
        {format.kind}
      </text>
    </svg>
  );
}

/** Minimal XML highlighting on navy: tags, attribute values, comments. */
function XmlLine({ line }: { line: string }) {
  if (line.trim().startsWith("<!--")) return <span className="text-[#7F93AB] italic">{line}</span>;
  return (
    <>
      {line.split(/(<[^>]+>)/).map((part, i) =>
        part.startsWith("<") ? (
          <span key={i} className="text-[#8DB9EC]">
            {part.split(/("[^"]*")/).map((piece, j) =>
              piece.startsWith('"') ? (
                <span key={j} className="text-[#7FD9A4]">
                  {piece}
                </span>
              ) : (
                piece
              ),
            )}
          </span>
        ) : (
          <span key={i} className="text-white">
            {part}
          </span>
        ),
      )}
    </>
  );
}

/** The XML, typed out to `shown` characters; the rest is laid out invisibly so the panel never changes height. */
function Code({ format, shown, className }: { format: Format; shown: number; className?: string }) {
  const starts = format.xml.map((_, i) => format.xml.slice(0, i).reduce((n, line) => n + line.length + 1, 0));
  const done = shown >= chars(format);
  return (
    <div className={cn("min-w-0 bg-navy", className)}>
      <div className="overflow-x-auto px-5 py-4">
        <pre className="font-mono text-[11.5px] leading-[1.7]">
          {format.xml.map((line, i) => {
            const left = shown - starts[i];
            const take = Math.max(0, Math.min(line.length, left));
            const typing = !done && left >= 0 && left <= line.length;
            return (
              <div key={i} className="whitespace-pre">
                <XmlLine line={line.slice(0, take)} />
                {typing && <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-[#7FD9A4]/80" />}
                <span className="text-transparent">{line.slice(take)}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

const chars = (format: Format) => format.xml.reduce((n, line) => n + line.length + 1, 0);

/** The human-readable side of a Factur-X file. */
const rise = (i: number): CSSProperties => ({
  animationDelay: `${120 + i * 110}ms`,
});

function PdfPage() {
  const locale = useLocale();
  const t = COPY[locale];
  const money = eur(locale);
  return (
    <div className="bg-[#F7F9FB] p-5">
      <div className="animate-fade-in rounded-lg border border-line bg-white p-4 text-[12px] text-navy">
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold">{SAMPLE.seller}</p>
          <p className="text-[15px] font-semibold tracking-tight">{t.invoice}</p>
        </div>
        <p className="mt-1 text-[11px] text-muted">
          {SAMPLE.number} · {t.issued}
        </p>
        <p className="mt-3 text-[11px] text-muted">{t.billTo}</p>
        <p>{SAMPLE.buyer}</p>
        <div className="mt-3 space-y-1 border-t border-line pt-3">
          {SAMPLE.lines.map((line, i) => (
            <div key={line.name.en} className="flex animate-fade-in justify-between gap-3" style={rise(i)}>
              <span>{line.name[locale]}</span>
              <span className="tabular-nums">{money(line.amount)}</span>
            </div>
          ))}
          <div className="flex animate-fade-in justify-between gap-3 text-muted" style={rise(2)}>
            <span>{t.vat(SAMPLE.vatRate)}</span>
            <span className="tabular-nums">{money(SAMPLE.vat)}</span>
          </div>
        </div>
        <div className="mt-3 flex animate-fade-in justify-between gap-3 border-t border-line pt-2.5 font-semibold" style={rise(3)}>
          <span>{t.total}</span>
          <span className="tabular-nums">{money(SAMPLE.total)}</span>
        </div>
      </div>
    </div>
  );
}

export function FormatExplorer() {
  const locale = useLocale();
  const copy = COPY[locale];
  const money = eur(locale);
  const formats = FORMATS[locale];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoopClock(ref, { loopEnd: LOOP, finalFrame: FINAL });
  // Choosing a format shifts the loop to that format's slot; it keeps going from there.
  const [offset, setOffset] = useState(0);
  const t = (ms + offset) % LOOP;
  const active = Math.floor(t / SEGMENT);
  const into = t % SEGMENT;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const format = formats[active];
  const total = chars(format);
  const shown = Math.min(total, Math.floor((into / TYPE_MS) * total));
  const exporting = shown < total;
  // The supplier invoice is re-imported each time XRechnung comes round.
  const importing = active === 1 && into < 1_600;

  const setActive = (index: number) => setOffset((index * SEGMENT - (ms % LOOP) + LOOP) % LOOP);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + formats.length) % formats.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div ref={ref} className="relative min-w-0">
      {/* Format selectors, with a highlight that slides to the active one */}
      <div
        role="tablist"
        aria-label={copy.formats}
        onKeyDown={onKeyDown}
        className="relative grid grid-cols-3 gap-2 [--gap:0.5rem] sm:gap-3 sm:[--gap:0.75rem]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[calc((100%-2*var(--gap))/3)] rounded-xl border border-navy bg-white shadow-[0_8px_24px_rgba(10,37,64,0.08)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translateX(calc(${active} * (100% + var(--gap))))`,
          }}
        />
        {formats.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              id={`format-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="format-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={cn(
                "relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-colors duration-300 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3.5 sm:text-left",
                selected ? "border-transparent" : "border-line hover:border-[#B9C5D3] hover:bg-surface/70",
              )}
            >
              <FileGlyph format={item} size={28} />
              <span className="min-w-0">
                <span className={cn("block text-[13px] font-semibold sm:text-[14.5px]", selected ? "text-navy" : "text-[#374151]")}>
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </span>
                <span className="mt-0.5 hidden text-[12px] leading-snug text-muted lg:block">{item.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* File preview */}
      <div
        id="format-panel"
        role="tabpanel"
        aria-labelledby={`format-tab-${format.id}`}
        className="mt-4 overflow-hidden rounded-2xl border border-line bg-white"
      >
        {/* Every preview shares one grid cell, so the panel keeps the tallest height and never jumps.
            The panel is a 700px design, scaled down on small screens rather than restacked. */}
        <FitCanvas width={700} fallback="max-sm:[zoom:0.5]">
        <div className="grid grid-cols-[minmax(0,1fr)]">
          {formats.map((item, index) => {
            const on = index === active;
            return (
              <div
                key={`${item.id}-${on}`}
                aria-hidden={!on}
                className={cn("flex min-w-0 flex-col [grid-area:1/1]", on ? "animate-slide-in" : "invisible")}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-5 py-4">
                  <FileGlyph format={item} size={26} />
                  <div className="min-w-0 flex-1 basis-0">
                    <p className="truncate font-mono text-[13.5px] font-semibold text-navy">{item.filename}</p>
                    <p className="text-[12.5px] text-muted">
                      {item.name} · {item.description}
                    </p>
                  </div>
                  {on && exporting ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium text-[#4B5563]">
                      <LoaderCircle size={13} className="animate-spin" aria-hidden="true" /> {copy.exporting}
                    </span>
                  ) : (
                    <span className="inline-flex animate-fade-in items-center gap-1 rounded-full bg-green-soft px-2.5 py-1 text-[12px] font-medium text-green">
                      <Check size={13} strokeWidth={2.6} aria-hidden="true" /> {copy.supported}
                    </span>
                  )}
                </div>

                {item.embedded ? (
                  <div className="grid flex-1 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                    <PdfPage />
                    <div className="relative flex min-w-0 flex-col bg-navy">
                      <p className="flex items-center gap-1.5 border-b border-white/10 px-5 py-2.5 font-mono text-[11.5px] text-[#B8C4D3]">
                        <Paperclip size={12} aria-hidden="true" /> {item.embedded}
                        <span className="text-white/45">{copy.embedded}</span>
                      </p>
                      <Code format={item} shown={on ? shown : 0} className="flex-1" />
                    </div>
                  </div>
                ) : (
                  <Code format={item} shown={on ? shown : 0} className="flex-1" />
                )}

                <div className="flex flex-col gap-1 border-t border-line px-5 py-4 sm:pr-[38%] lg:pr-[40%]">
                  <p className="text-[14px] leading-relaxed text-navy">{item.why}</p>
                  <p className="text-[11.5px] text-muted">{copy.abbreviated}</p>
                </div>
              </div>
            );
          })}
        </div>
        </FitCanvas>
      </div>

      {/* Supporting element: an incoming invoice, imported and recognised */}
      <div className="mt-4 rounded-2xl border border-green/30 bg-white p-4 sm:absolute sm:right-0 xl:right-[-12px] sm:-bottom-10 sm:mt-0 sm:w-[36%]">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-white transition-colors duration-300",
              importing ? "bg-blue" : "bg-green",
            )}
          >
            {importing ? (
              <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <FileInput size={15} aria-hidden="true" />
            )}
          </span>
          <p className="text-[13.5px] leading-tight font-semibold text-navy xl:whitespace-nowrap">
            {importing ? copy.importing : copy.imported}
          </p>
        </div>
        <p className="mt-3 flex justify-between gap-3 text-[13px] text-navy">
          <span>Brightway Supplies GmbH</span>
          <span className="font-semibold tabular-nums">{money(642.6)}</span>
        </p>
        <p className={cn("mt-1 text-[12px] font-medium transition-colors", importing ? "text-muted" : "text-green")}>
          {importing ? copy.reading : copy.recognised}
        </p>
        <p className="text-[12px] text-muted">{importing ? copy.checking : copy.ready}</p>
      </div>
    </div>
  );
}
