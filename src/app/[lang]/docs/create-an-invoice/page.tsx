import type { Metadata } from "next";

import { GuidePage } from "@/components/docs/guide-page";
import { guideBySlug } from "@/components/docs/guides";
import { localeAlternates } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const SLUG = "create-an-invoice";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const guide = guideBySlug(locale, SLUG);
  return { title: `${guide.title} · Documentation`, description: guide.description, alternates: localeAlternates(locale, `/docs/${SLUG}`) };
}

export default async function Page() {
  const locale = await getLocale();
  return <GuidePage guide={guideBySlug(locale, SLUG)} />;
}
