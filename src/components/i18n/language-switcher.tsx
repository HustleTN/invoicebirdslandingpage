"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";

import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, localizeHref, stripLocale, type Locale, type Localized } from "@/lib/i18n";
import { cn } from "@/lib/cn";

import { useLocale } from "./locale-provider";

const LABEL: Localized<string> = { en: "Language", fr: "Langue" };

/** Remembers the choice for a year, then loads the same page in the other language. */
function switchTo(target: Locale, pathname: string) {
  document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
  window.location.assign(localizeHref(target, stripLocale(pathname)) + window.location.hash);
}

/** Globe button with a two-item menu, on the navy header. */
export function LanguageMenu() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${LABEL[locale]}: ${LOCALE_NAMES[locale]}`}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[14px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Globe size={17} aria-hidden="true" />
        {locale.toUpperCase()}
        <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          id={menuId}
          aria-label={LABEL[locale]}
          className="absolute top-full right-0 z-10 mt-2 w-44 animate-fade-in rounded-xl border border-line bg-white p-1.5 shadow-[0_12px_32px_rgba(10,37,64,0.14)]"
        >
          {LOCALES.map((option) => (
            <li key={option}>
              <a
                href={localizeHref(option, stripLocale(pathname))}
                hrefLang={option}
                lang={option}
                aria-current={option === locale ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  if (option === locale) setOpen(false);
                  else switchTo(option, pathname);
                }}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-[14.5px] font-medium text-navy transition-colors hover:bg-surface"
              >
                {LOCALE_NAMES[option]}
                {option === locale && <Check size={16} aria-hidden="true" className="text-green" />}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Segmented English / Français choice for the mobile menu. */
export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <div role="group" aria-label={LABEL[locale]} className="flex items-center gap-3">
      <Globe size={17} aria-hidden="true" className="text-white/70" />
      <div className="inline-flex rounded-lg bg-white/10 p-1">
        {LOCALES.map((option) => (
          <a
            key={option}
            href={localizeHref(option, stripLocale(pathname))}
            hrefLang={option}
            lang={option}
            aria-current={option === locale ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              if (option !== locale) switchTo(option, pathname);
            }}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-[14px] font-semibold transition-colors",
              option === locale ? "bg-white text-navy" : "text-white/80 hover:text-white",
            )}
          >
            {LOCALE_NAMES[option]}
          </a>
        ))}
      </div>
    </div>
  );
}
