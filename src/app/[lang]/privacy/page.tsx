import type { Metadata } from "next";

import { PRIVACY_POLICY } from "@/components/legal/documents";
import { LegalPage } from "@/components/legal/legal-page";
import { localeAlternates } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { title, lead } = PRIVACY_POLICY[locale];
  return { title, description: lead, alternates: localeAlternates(locale, "/privacy") };
}

export default function PrivacyPage() {
  return <LegalPage document={PRIVACY_POLICY} />;
}
