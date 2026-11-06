import { ChevronRight, Lightbulb } from "lucide-react";

import { Container } from "@/components/ui/container";
import { localizeHref, type Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

import { DocsMobileNav, DocsSidebar } from "./docs-nav";
import { CATEGORY_LABELS, getGuides, type Guide } from "./guides";

const COPY: Localized<{ breadcrumb: string; help: string; docs: string; step: string }> = {
  en: { breadcrumb: "Breadcrumb", help: "Help Center", docs: "Docs", step: "Step" },
  fr: { breadcrumb: "Fil d’Ariane", help: "Centre d’aide", docs: "Documentation", step: "Étape" },
};

export async function GuidePage({ guide }: { guide: Guide }) {
  const locale = await getLocale();
  const t = COPY[locale];
  const nav = guide.sections.map(({ id, title }) => ({ id, title }));
  const others = getGuides(locale).map(({ slug, title, category }) => ({
    href: localizeHref(locale, `/docs/${slug}`),
    title,
    category: CATEGORY_LABELS[locale][category],
    current: slug === guide.slug,
  }));

  return (
    <div className="bg-white text-navy">
      <Container className="grid gap-12 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-16">
        <aside>
          <DocsSidebar guides={others} items={nav} />
        </aside>

        <article className="min-w-0 max-w-[920px]">
          <nav aria-label={t.breadcrumb} className="flex items-center gap-1.5 text-[13px] text-muted">
            <a href={localizeHref(locale, "/help")} className="hover:text-navy">
              {t.help}
            </a>
            <ChevronRight size={13} aria-hidden="true" />
            <a href={localizeHref(locale, "/docs")} className="hover:text-navy">
              {t.docs}
            </a>
            <ChevronRight size={13} aria-hidden="true" />
            <span>{guide.group}</span>
          </nav>
          <h1 className="mt-4 text-[34px] leading-[1.1] font-semibold tracking-[-0.035em] sm:text-[44px]">{guide.title}</h1>
          <p className="mt-4 max-w-[680px] text-[17px] leading-relaxed text-muted">{guide.intro}</p>
          <div className="mt-8">
            <DocsMobileNav guides={others} items={nav} />
          </div>

          <div className="space-y-20">
            {guide.sections.map(({ id, title, intro, steps, tip, mock }, index) => (
              <section key={id} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
                <p className="text-[13px] font-semibold tracking-[0.08em] text-blue uppercase">{`${t.step} ${index + 1}`}</p>
                <h2 id={`${id}-title`} className="mt-2 text-[26px] leading-tight font-semibold tracking-[-0.025em] sm:text-[30px]">
                  {title}
                </h2>
                <p className="mt-3 max-w-[720px] text-[16px] leading-relaxed text-muted">{intro}</p>
                <ol className="mt-5 max-w-[720px] space-y-2.5">
                  {steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-[15.5px] leading-relaxed">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green-soft text-[12.5px] font-semibold text-green">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                {tip && (
                  <p className="mt-5 flex max-w-[720px] gap-2.5 rounded-xl bg-blue-soft px-4 py-3 text-[14.5px] leading-relaxed text-navy">
                    <Lightbulb size={17} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
                    {tip}
                  </p>
                )}
                {mock}
              </section>
            ))}
          </div>
        </article>
      </Container>
    </div>
  );
}
