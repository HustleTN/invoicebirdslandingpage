/**
 * Site languages. English is the default and stays unprefixed (/docs); French lives under /fr (/fr/docs).
 * The proxy rewrites unprefixed paths to /en internally, so every route sits under app/[lang].
 */
export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Remembers the visitor's choice from the language switcher. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** One value per language, typed from the English one. */
export type Localized<T> = Record<Locale, T>;

/** Names shown in the language switcher, each in its own language. */
export const LOCALE_NAMES: Localized<string> = { en: "English", fr: "Français" };

/** BCP 47 tags for Intl formatting. */
export const INTL_LOCALE: Localized<string> = { en: "en-US", fr: "fr-FR" };

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefixes a site path with the locale ("/docs" -> "/fr/docs", "/#pricing" -> "/fr#pricing"); other hrefs pass through. */
export function localizeHref(locale: Locale, href: string): string {
  if (locale === DEFAULT_LOCALE || !href.startsWith("/") || href.startsWith("//")) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith("/#") || href.startsWith("/?")) return `/${locale}${href.slice(1)}`;
  return `/${locale}${href}`;
}

/** The path without its locale prefix ("/fr/docs" -> "/docs", "/fr" -> "/"). */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|fr)(?=\/|$)/);
  if (!match) return pathname;
  return pathname.slice(match[0].length) || "/";
}

/** hreflang alternates for a page's metadata. `path` is the unprefixed path, e.g. "/help". */
export function localeAlternates(locale: Locale, path: string) {
  return {
    canonical: localizeHref(locale, path),
    languages: { en: path, fr: localizeHref("fr", path), "x-default": path },
  };
}
