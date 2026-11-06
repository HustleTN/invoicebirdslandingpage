import Image from "next/image";
import { Check } from "lucide-react";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { ROWS, type Row } from "./comparison-data";

const en = {
  eyebrow: "Why InvoiceBirds",
  title: "Why pay more for less?",
  lead: "Create unlimited invoices for free, let Birdy handle repetitive work, and manage your entire client workflow in one place.",
  caption: "InvoiceBirds compared with other invoicing tools",
  features: "Features",
  others: "Other invoicing tools",
  ours: "InvoiceBirds: ",
  othersShort: "Other tools: ",
  closingTitle: "More than invoices. Everything works together.",
  closingNote: "Unlimited invoices. No credit card required.",
  cta: "Start invoicing for free",
};

const COPY: Localized<typeof en> = {
  en,
  fr: {
    eyebrow: "Pourquoi InvoiceBirds",
    title: "Pourquoi payer plus pour moins ?",
    lead: "Créez gratuitement des factures en illimité, laissez Birdy s’occuper des tâches répétitives et gérez tout votre parcours client au même endroit.",
    caption: "InvoiceBirds comparé aux autres outils de facturation",
    features: "Fonctionnalités",
    others: "Autres outils de facturation",
    ours: "InvoiceBirds : ",
    othersShort: "Autres outils : ",
    closingTitle: "Bien plus que des factures. Tout fonctionne ensemble.",
    closingNote: "Factures illimitées. Aucune carte bancaire requise.",
    cta: "Commencer à facturer gratuitement",
  },
};

/** Our answer: a green check, the bold lead, the detail, then the plan in italics. */
function Ours({ row }: { row: Row }) {
  return (
    <p className="flex items-start gap-2 leading-snug text-[#374151]">
      <Check size={14} strokeWidth={2.8} aria-hidden="true" className="mt-[2px] shrink-0 text-green" />
      <span>
        <span className="font-semibold text-navy">{row.lead}</span> {row.detail}
        {row.plan && <span className="text-muted italic"> {row.plan}</span>}
      </span>
    </p>
  );
}

export async function ComparisonSection() {
  const locale = await getLocale();
  const t = COPY[locale];
  const rows = ROWS[locale];
  return (
    <section aria-labelledby="comparison-title" className="border-t border-line bg-white py-20 sm:py-24 lg:py-30 text-navy">
      <Container>
        <div className="text-center">
          <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-blue">{t.eyebrow}</p>
          <h2 id="comparison-title" className="mt-4 max-w-[720px] text-[30px] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-[40px] lg:text-[44px] mx-auto">
            {t.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-base leading-relaxed sm:text-lg text-muted">
            {t.lead}
          </p>
        </div>

        {/* One minimal table: hairline rows, InvoiceBirds as a column tinted light blue */}
        <div className="mx-auto mt-8 hidden max-w-[1040px] overflow-hidden rounded-2xl border border-[#E6EBF0] md:block">
          <table className="w-full table-fixed border-collapse text-left text-[13.5px]">
            <caption className="sr-only">{t.caption}</caption>
            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[42%]" />
              <col />
            </colgroup>
            <thead>
              <tr className="align-bottom">
                <th scope="col" className="border-b border-[#E6EBF0] px-5 pt-5 pb-3.5 text-[15px] font-semibold text-navy">
                  {t.features}
                </th>
                <th scope="col" className="border-b border-[#E6EBF0] bg-blue-soft px-5 pt-5 pb-3.5">
                  <span className="sr-only">InvoiceBirds</span>
                  <Image src="/images/svgs/invoicebirdslogo.svg" alt="" width={188} height={40} className="h-6 w-auto" />
                </th>
                <th scope="col" className="border-b border-[#E6EBF0] px-5 pt-5 pb-3.5 text-[15px] font-semibold text-navy">
                  {t.others}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const line = index < rows.length - 1 && "border-b border-[#EEF2F5]";
                return (
                  <tr key={row.feature} className="align-top">
                    <th scope="row" className={cn("px-5 py-3 font-medium text-navy", line)}>
                      {row.feature}
                    </th>
                    <td className={cn("bg-blue-soft px-5 py-3", line)}>
                      <Ours row={row} />
                    </td>
                    <td className={cn("px-5 py-3 leading-snug text-muted", line)}>{row.theirs}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Phones: the same rows, stacked */}
        <dl className="mt-8 overflow-hidden rounded-2xl border border-[#E6EBF0] text-[13.5px] md:hidden">
          {rows.map((row, index) => (
            <div key={row.feature} className={cn("px-4 py-3.5", index > 0 && "border-t border-[#EEF2F5]")}>
              <dt className="text-[14.5px] font-semibold text-navy">{row.feature}</dt>
              <dd className="mt-2 rounded-xl bg-blue-soft px-3.5 py-2.5">
                <span className="sr-only">{t.ours}</span>
                <Ours row={row} />
              </dd>
              <dd className="mt-2 px-1 leading-snug text-muted">
                <span className="font-medium text-[#4B5563]">{t.othersShort}</span>
                {row.theirs}
              </dd>
            </div>
          ))}
        </dl>

        {/* Conversion: the same width and edges as the table above */}
        <div className="mx-auto mt-8 flex max-w-[1040px] flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em] sm:text-[24px]">{t.closingTitle}</h3>
            <p className="mt-1.5 text-[14.5px] text-muted">{t.closingNote}</p>
            </div>
          <a
            href={siteConfig.links.signup}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-green px-6 text-[15px] font-semibold text-white transition-colors hover:bg-green-hover"
          >
            {t.cta}
          </a>
        </div>
      </Container>
    </section>
  );
}
