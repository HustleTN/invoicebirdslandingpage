"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

export type NavItem = { id: string; title: string };

/** Highlights the section being read and scrolls to a section on click. */
function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/** `category` is the sidebar heading, already in the page's language. */
export type GuideLink = { href: string; title: string; category: string; current: boolean };

const COPY: Localized<{ nav: string; onThisPage: string }> = {
  en: { nav: "Documentation", onThisPage: "On this page" },
  fr: { nav: "Documentation", onThisPage: "Sur cette page" },
};

/**
 * Guides, with the current one expanded into its steps. Guide links are plain
 * anchors: with Cache Components a client-side Link keeps the previous guide
 * mounted (hidden), and guides share section ids such as #builder.
 */
export function DocsSidebar({ guides, items }: { guides: GuideLink[]; items: NavItem[] }) {
  const active = useActive(items.map((i) => i.id));
  const t = COPY[useLocale()];
  return (
    <nav aria-label={t.nav} className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 lg:block">
      {[...new Set(guides.map((g) => g.category))].map((category) => (
        <div key={category} className="mb-7">
          <p className="mb-3 text-[12px] font-semibold tracking-[0.08em] text-muted uppercase">{category}</p>
          <ul className="space-y-4">
            {guides
              .filter((g) => g.category === category)
              .map((guide) => (
                <li key={guide.href}>
                  <a
                    href={guide.href}
                    aria-current={guide.current ? "page" : undefined}
                    className={cn("text-[15px] font-semibold", guide.current ? "text-navy" : "text-muted hover:text-navy")}
                  >
                    {guide.title}
                  </a>
                  {guide.current && (
                    <ol className="mt-2 space-y-0.5 border-l border-line">
                      {items.map((item, i) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            aria-current={active === item.id ? "true" : undefined}
                            className={cn(
                              "-ml-px flex gap-2.5 border-l-2 py-1.5 pr-2 pl-4 text-[14px] transition-colors",
                              active === item.id ? "border-green font-semibold text-navy" : "border-transparent text-muted hover:text-navy",
                            )}
                          >
                            <span className="w-4 shrink-0 text-right tabular-nums">{i + 1}</span>
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Small screens: other guides, then a collapsible "On this page" list. */
export function DocsMobileNav({ guides, items }: { guides: GuideLink[]; items: NavItem[] }) {
  const t = COPY[useLocale()];
  return (
    <div className="mb-8 lg:hidden">
      <div className="mb-3 flex flex-wrap gap-2">
        {guides.map((guide) => (
          <a
            key={guide.href}
            href={guide.href}
            aria-current={guide.current ? "page" : undefined}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[14px] font-semibold",
              guide.current ? "border-navy bg-navy text-white" : "border-line text-navy",
            )}
          >
            {guide.title}
          </a>
        ))}
      </div>
      <details className="group rounded-xl border border-line">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-semibold text-navy [&::-webkit-details-marker]:hidden">
          {t.onThisPage}
          <ChevronDown size={18} className="text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ol className="border-t border-line px-4 py-3">
          {items.map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="flex gap-2.5 py-1.5 text-[15px] text-muted hover:text-navy">
                <span className="w-4 text-right tabular-nums">{i + 1}</span>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
