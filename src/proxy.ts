import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALE_COOKIE, hasLocale, localizeHref, stripLocale } from "@/lib/i18n";

/**
 * Language routing. French pages are served as-is under /fr. Unprefixed paths are English and are
 * rewritten to /en internally; /en URLs redirect to their unprefixed form so each page has one address.
 * A visitor who picked French in the switcher is sent to the French version of unprefixed pages.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = pathname.split("/")[1] ?? "";

  if (prefix === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = stripLocale(pathname);
    return NextResponse.redirect(url);
  }
  if (hasLocale(prefix)) return NextResponse.next();

  const preferred = request.cookies.get(LOCALE_COOKIE)?.value;
  if (preferred && hasLocale(preferred) && preferred !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = localizeHref(preferred, pathname);
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: skip Next internals and any path with a file extension (images, figures, favicon).
  matcher: ["/((?!_next/|__nextjs|api/|.*\\.[^/]+$).*)"],
};
