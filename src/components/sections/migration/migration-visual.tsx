"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, Check, FileSpreadsheet, Mail, MessageCircle, Video, type LucideIcon } from "lucide-react";

import { BirdyMascot } from "@/components/birdy/birdy-chat";
import { useLocale } from "@/components/i18n/locale-provider";
import { FitCanvas } from "@/components/ui/fit-canvas";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";
import { useLoopClock } from "@/lib/use-loop-clock";

/* One loop of the import, in ms: the file arrives, its columns are matched, the records count up, then it's done. */
const FILE_AT = 500;
const MATCH_AT = 1_400;
const MATCH_STEP = 450;
const COUNT_FROM = 3_000;
const COUNT_MS = 2_600;
const DONE_AT = COUNT_FROM + COUNT_MS + 200;
const LOOP = 10_000;

const en = {
  summary:
    "Our support team at work. Beside them, an example import: a CSV export is uploaded, its columns are matched, and 248 clients, 36 items and services and 112 expenses are imported. A message from the team offers help by video call, chat or email.",
  photoAlt: "InvoiceBirds support team members on headsets, helping customers",
  support: "InvoiceBirds Support",
  online: "Online now",
  message: "Moving from another tool? We've got you. Let's move your clients and items together.",
  importTitle: "Import from CSV",
  complete: "Complete",
  importing: "Importing…",
  matching: "Matching columns…",
  upload: "Upload",
  exported: "Exported from your old tool",
  drop: "Drop your CSV file here",
  /** The old tool's column, then the InvoiceBirds field it maps to. */
  columns: [
    ["Company", "Client name"],
    ["E-mail", "Email"],
    ["Unit price", "Rate"],
  ] as [string, string][],
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    summary:
      "Notre équipe d’assistance au travail. À côté, un exemple d’import : un export CSV est chargé, ses colonnes sont associées, puis 248 clients, 36 articles et prestations et 112 dépenses sont importés. Un message de l’équipe propose de l’aide par appel vidéo, chat ou e-mail.",
    photoAlt: "Des membres de l’équipe d’assistance InvoiceBirds, casque sur les oreilles, aident des clients",
    support: "Assistance InvoiceBirds",
    online: "En ligne",
    message: "Vous changez d’outil ? On vous accompagne. Transférons ensemble vos clients et vos articles.",
    importTitle: "Import CSV",
    complete: "Terminé",
    importing: "Import en cours…",
    matching: "Association des colonnes…",
    upload: "En attente",
    exported: "Exporté de votre ancien outil",
    drop: "Déposez votre fichier CSV ici",
    columns: [
      ["Société", "Nom du client"],
      ["Courriel", "E-mail"],
      ["Tarif HT", "Prix unitaire"],
    ],
  },
};

const RECORDS: { total: number; label: Localized<string> }[] = [
  { total: 248, label: { en: "Clients", fr: "Clients" } },
  { total: 36, label: { en: "Items & services", fr: "Articles et prestations" } },
  { total: 112, label: { en: "Expenses", fr: "Dépenses" } },
];

const CHANNELS: { icon: LucideIcon; label: Localized<string> }[] = [
  { icon: Video, label: { en: "Video call", fr: "Visio" } },
  { icon: MessageCircle, label: { en: "Chat", fr: "Chat" } },
  { icon: Mail, label: { en: "Email", fr: "E-mail" } },
];

const card = "rounded-2xl bg-white text-left text-navy shadow-[0_18px_50px_rgba(10,37,64,0.16),0_2px_8px_rgba(10,37,64,0.06)]";

/** The support photo with two cards: a CSV import running on a loop, and a message from the team. */
export function MigrationVisual() {
  const locale = useLocale();
  const t = COPY[locale];
  const ref = useRef<HTMLDivElement>(null);
  const ms = useLoopClock(ref, { loopEnd: LOOP, finalFrame: DONE_AT + 500 });
  const counted = Math.min(1, Math.max(0, (ms - COUNT_FROM) / COUNT_MS));
  const done = ms >= DONE_AT;
  const channel = Math.floor(ms / (LOOP / CHANNELS.length)) % CHANNELS.length;

  return (
    <div ref={ref}>
      <p className="sr-only">{t.summary}</p>

      {/* A 640px composition at every size: the photo, with the cards just off its corners so the team stays in view. */}
      <FitCanvas width={640} fallback="max-sm:[zoom:0.56] sm:max-lg:[zoom:1]">
      <div className="relative pt-[130px] pb-[150px] pl-10">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
        <Image
          src="/images/customer support.jpg"
          alt={t.photoAlt}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover object-[68%_center]"
        />
      </div>

      {/* A message from the team, top left */}
      <div
        aria-hidden="true"
        className={cn(card, "absolute top-0 left-0 z-10 w-[310px] p-4")}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-surface">
            <BirdyMascot size={26} />
          </span>
          <div className="flex-1">
            <p className="text-[13.5px] leading-tight font-semibold">{t.support}</p>
            <p className="flex items-center gap-1 text-[11.5px] text-green">
              <span className="size-1.5 rounded-full bg-green" /> {t.online}
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-2xl rounded-tl-md bg-surface px-3.5 py-2.5 text-[13px] leading-snug text-[#1F2937]">
          {t.message}
        </p>
        <div className="mt-3 flex gap-1.5">
          {CHANNELS.map(({ icon: Icon, label }, i) => (
            <span
              key={label.en}
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors duration-500",
                i === channel ? "bg-blue text-white" : "bg-surface text-[#4B5563]",
              )}
            >
              <Icon size={12} /> {label[locale]}
            </span>
          ))}
        </div>
      </div>

      {/* The import, bottom right */}
      <div
        aria-hidden="true"
        className={cn(card, "absolute right-0 bottom-0 z-10 w-[320px] p-4")}
      >
        <div className="flex items-center justify-between">
          <p className="text-[13.5px] font-semibold">{t.importTitle}</p>
          {done ? (
            <span className="flex animate-fade-in items-center gap-1 rounded-full bg-green-soft px-2 py-0.5 text-[11.5px] font-semibold text-green">
              <Check size={12} strokeWidth={3} /> {t.complete}
            </span>
          ) : (
            <span className="text-[11.5px] text-muted">
              {ms >= COUNT_FROM ? t.importing : ms >= MATCH_AT ? t.matching : t.upload}
            </span>
          )}
        </div>

        <div
          className={cn(
            "mt-3 flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors duration-300",
            ms >= FILE_AT ? "border-line bg-white" : "border-dashed border-[#C5D0DC] bg-surface",
          )}
        >
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors",
              ms >= FILE_AT ? "bg-green-soft text-green" : "bg-white text-[#9CA3AF]",
            )}
          >
            <FileSpreadsheet size={16} />
          </span>
          {ms >= FILE_AT ? (
            <span className="animate-fade-in">
              <span className="block font-mono text-[12.5px] font-semibold">clients-export.csv</span>
              <span className="block text-[11px] text-muted">{t.exported}</span>
            </span>
          ) : (
            <span className="text-[12.5px] text-muted">{t.drop}</span>
          )}
        </div>

        {/* Columns matched one by one, then the records counting up */}
        {ms < COUNT_FROM ? (
          <ul className="mt-3 space-y-1.5 text-[12px]">
            {t.columns.map(([from, to], i) => {
              const matched = ms >= MATCH_AT + i * MATCH_STEP;
              return (
                <li
                  key={from}
                  className={cn("flex items-center gap-2 transition-opacity duration-300", matched ? "opacity-100" : "opacity-35")}
                >
                  <span className="w-[78px] truncate text-muted">{from}</span>
                  <ArrowRight size={12} className="text-[#9CA3AF]" />
                  <span className="flex-1 font-medium">{to}</span>
                  <span
                    className={cn("flex size-4 items-center justify-center rounded-full", matched ? "bg-green text-white" : "bg-surface")}
                  >
                    {matched && <Check size={10} strokeWidth={3} />}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="mt-3 grid animate-fade-in grid-cols-3 gap-2 text-center">
            {RECORDS.map(({ label, total }) => (
              <li key={label.en} className="rounded-xl bg-surface px-1.5 py-2">
                <p className="text-[18px] font-semibold tabular-nums">{Math.round(total * counted)}</p>
                <p className="text-[10.5px] leading-tight text-muted">{label[locale]}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
      </FitCanvas>
    </div>
  );
}
