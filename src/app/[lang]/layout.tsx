import type { Metadata, Viewport } from "next";

import { LocaleProvider } from "@/components/i18n/locale-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/config/site";
import { LOCALES, type Localized } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import "../globals.css";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const SKIP_LINK: Localized<string> = { en: "Skip to main content", fr: "Aller au contenu principal" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
    description: siteConfig.description[locale],
    openGraph: { siteName: siteConfig.name, locale: locale === "fr" ? "fr_FR" : "en_US" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0A2540",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
          >
            {SKIP_LINK[locale]}
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
