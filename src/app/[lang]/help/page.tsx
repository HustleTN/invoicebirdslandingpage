import type { Metadata } from "next";

import { getGuides } from "@/components/docs/guides";
import { HelpCenter, type HelpGuide } from "@/components/help/help-center";
import { localeAlternates, type Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

const META: Localized<{ title: string; description: string }> = {
  en: {
    title: "Help Center",
    description: "Answers, step-by-step guides and account help for InvoiceBirds. Search the docs or talk to our team.",
  },
  fr: {
    title: "Centre d’aide",
    description: "Réponses, guides pas à pas et aide sur votre compte InvoiceBirds. Parcourez la documentation ou contactez notre équipe.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { ...META[locale], alternates: localeAlternates(locale, "/help") };
}

export default async function HelpPage() {
  const locale = await getLocale();
  /** Guides without their mockups: the Help Center only needs titles and step anchors. */
  const guides: HelpGuide[] = getGuides(locale).map(({ slug, title, description, category, sections }) => ({
    slug,
    title,
    description,
    category,
    sections: sections.map(({ id, title }) => ({ id, title })),
  }));
  return <HelpCenter guides={guides} />;
}
