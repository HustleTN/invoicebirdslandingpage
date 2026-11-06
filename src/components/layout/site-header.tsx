"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { LanguageMenu, LanguageToggle } from "@/components/i18n/language-switcher";
import { useHref, useLocale } from "@/components/i18n/locale-provider";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import type { Localized } from "@/lib/i18n";

const MOBILE_MENU_ID = "mobile-menu";

const COPY: Localized<{ home: string; logIn: string; start: string; openMenu: string; closeMenu: string; main: string; mobile: string }> = {
  en: { home: "home", logIn: "Log in", start: "Start for free", openMenu: "Open menu", closeMenu: "Close menu", main: "Main", mobile: "Mobile" },
  fr: { home: "accueil", logIn: "Se connecter", start: "Commencer gratuitement", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", main: "Principale", mobile: "Mobile" },
};

/** Navy header that continues the hero, with the grid's line along its bottom edge; it stays navy over light sections. */
export function SiteHeader() {
  const locale = useLocale();
  const href = useHref();
  const t = COPY[locale];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => desktop.matches && setMenuOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const navLink = "rounded-lg px-2.5 py-2 text-[15px] whitespace-nowrap xl:px-3 font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <header className="grid-navy sticky top-0 z-50 border-b border-white/10 bg-navy">
      <Container className="flex h-16 items-center justify-between gap-4 xl:gap-6">
        <Link href={href("/")} aria-label={`${siteConfig.name} ${t.home}`} className="shrink-0 rounded-md" onClick={closeMenu}>
          <Image src="/images/svgs/invoicebirdslogo-on-navy.svg" alt="" width={188} height={40} priority className="h-8 w-auto" />
        </Link>

        <nav aria-label={t.main} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={href(item.href)} className={navLink}>
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <LanguageMenu />
          <a href={siteConfig.links.login} className={navLink}>
            {t.logIn}
          </a>
          <a
            href={siteConfig.links.signup}
            className="ml-1 inline-flex h-10 items-center gap-1.5 rounded-lg bg-green px-4 text-sm whitespace-nowrap font-semibold text-white transition-colors hover:bg-green-hover"
          >
            {t.start}
          </a>
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={menuOpen ? t.closeMenu : t.openMenu}
          onClick={() => setMenuOpen((open) => !open)}
          className="-mr-2 flex size-10 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <div id={MOBILE_MENU_ID} hidden={!menuOpen} className="border-t border-white/10 bg-navy lg:hidden">
        <Container className="py-4">
          <nav aria-label={t.mobile}>
            <ul className="space-y-1">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={href(item.href)} onClick={closeMenu} className="block rounded-lg px-3 py-3 text-base font-medium text-white hover:bg-white/10">
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
            <a href={siteConfig.links.signup} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-green text-sm font-semibold text-white">
              {t.start}
            </a>
            <a href={siteConfig.links.login} className="inline-flex h-11 items-center justify-center rounded-lg border border-white/25 text-sm font-semibold text-white">
              {t.logIn}
            </a>
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <LanguageToggle />
          </div>
        </Container>
      </div>
    </header>
  );
}
