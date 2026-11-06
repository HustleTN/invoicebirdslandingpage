import { notFound } from "next/navigation";
import { lang } from "next/root-params";

import { hasLocale, type Locale } from "./i18n";

/** The current page's language, for Server Components. Client Components use `useLocale()`. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}
