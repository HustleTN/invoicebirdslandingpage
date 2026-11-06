import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export type LegalSection = { id: string; title: string; body: ReactNode };

export type LegalDocument = {
  title: string;
  lead: string;
  /** Shown as written, e.g. "6 November 2026". */
  updated: string;
  /** Plain-language summary shown above the full text. */
  summary: string[];
  intro: ReactNode;
  sections: LegalSection[];
};

const UI: Localized<{ eyebrow: string; updated: string; summary: string; contents: string; questions: string; write: string }> = {
  en: {
    eyebrow: "Legal",
    updated: "Last updated",
    summary: "The short version",
    contents: "Contents",
    questions: "Questions about this document?",
    write: "Write to us at",
  },
  fr: {
    eyebrow: "Informations légales",
    updated: "Dernière mise à jour :",
    summary: "En bref",
    contents: "Sommaire",
    questions: "Une question sur ce document ?",
    write: "Écrivez-nous à",
  },
};

/** Prose styles for the legal text: headings, paragraphs, lists and links inside each section. */
const PROSE =
  "text-[15.5px] leading-[1.75] text-[#374151] [&_a]:font-medium [&_a]:text-blue [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mt-7 [&_h3]:text-[16.5px] [&_h3]:font-semibold [&_h3]:text-navy [&_li]:mt-2 [&_li]:pl-1 [&_ol]:mt-4 [&_ol]:list-[lower-alpha] [&_ol]:pl-6 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-navy [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:marker:text-[#9AA7B8]";

/** Privacy Policy and Terms of Service: header, short summary, table of contents and numbered sections. */
export async function LegalPage({ document }: { document: Localized<LegalDocument> }) {
  const locale = await getLocale();
  const doc = document[locale];
  const t = UI[locale];

  const contents = (
    <ol className="space-y-1.5 text-[14px] leading-snug">
      {doc.sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className="flex gap-2 text-muted transition-colors hover:text-navy">
            <span className="w-5 shrink-0 tabular-nums">{index + 1}.</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="bg-white text-navy">
      <section aria-labelledby="legal-title" className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <p className="text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">{t.eyebrow}</p>
          <h1 id="legal-title" className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-[-0.035em] sm:text-[48px]">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-[640px] text-[17px] leading-relaxed text-muted">{doc.lead}</p>
          <p className="mt-6 text-[14px] text-muted">
            {t.updated} <time className="font-semibold text-navy">{doc.updated}</time>
          </p>
        </Container>
      </section>

      <section aria-label={doc.title}>
        <Container className="grid gap-12 py-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 lg:py-16">
          <aside className="hidden lg:block">
            <nav aria-label={t.contents} className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
              <p className="mb-4 text-[13px] font-semibold tracking-[0.08em] text-navy uppercase">{t.contents}</p>
              {contents}
            </nav>
          </aside>

          <article className="min-w-0 max-w-[760px]">
            <div className="rounded-2xl bg-blue-soft px-6 py-6 sm:px-8">
              <h2 className="text-[17px] font-semibold">{t.summary}</h2>
              <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-navy">
                {doc.summary.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 rounded-full bg-blue" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <details className="group mt-8 rounded-xl border border-line px-5 py-4 lg:hidden">
              <summary className="cursor-pointer list-none text-[15px] font-semibold [&::-webkit-details-marker]:hidden">{t.contents}</summary>
              <div className="mt-4">{contents}</div>
            </details>

            <div className={`mt-10 ${PROSE}`}>{doc.intro}</div>

            <div className="mt-4">
              {doc.sections.map((section, index) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24 border-t border-line pt-10 mt-10">
                  <h2 id={`${section.id}-title`} className="text-[22px] leading-tight font-semibold tracking-[-0.02em] sm:text-[24px]">
                    <span className="mr-2 text-muted tabular-nums">{index + 1}.</span>
                    {section.title}
                  </h2>
                  <div className={PROSE}>{section.body}</div>
                </section>
              ))}
            </div>

            <div className="mt-14 rounded-2xl border border-line px-6 py-6 sm:px-8">
              <p className="text-[17px] font-semibold">{t.questions}</p>
              <p className="mt-1.5 text-[15px] text-muted">
                {t.write}{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-blue underline underline-offset-2">
                  {siteConfig.email}
                </a>
                .
              </p>
            </div>
          </article>
        </Container>
      </section>
    </div>
  );
}
