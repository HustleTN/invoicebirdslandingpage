import type { Metadata } from "next";

import { TERMS_OF_SERVICE } from "@/components/legal/documents";
import { LegalPage } from "@/components/legal/legal-page";
import { localeAlternates } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { title, lead } = TERMS_OF_SERVICE[locale];
  return { title, description: lead, alternates: localeAlternates(locale, "/terms") };
}

export default function TermsPage() {
  return <LegalPage document={TERMS_OF_SERVICE} />;
}
