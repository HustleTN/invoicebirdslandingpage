"use client";

import { createContext, useContext } from "react";

import { DEFAULT_LOCALE, localizeHref, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Hands the page's language to Client Components; set once in the root layout. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

/** The current page's language, for Client Components. Server Components use `getLocale()`. */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Localizes a site path for the current language: `const href = useHref(); href("/docs")`. */
export function useHref() {
  const locale = useLocale();
  return (path: string) => localizeHref(locale, path);
}
