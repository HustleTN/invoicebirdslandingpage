"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

import { INTL_LOCALE, type Locale, type Localized } from "@/lib/i18n";

/** One full loop of the Birdy demo. */
export const LOOP_MS = 23_200;
/** A finished frame: shown first so the hero never loads empty, and kept static for reduced motion. */
export const COMPLETE_FRAME_MS = 19_500;
/** Dispatched on `window` to restart the demo from the beginning. */
export const REPLAY_EVENT = "birdy-demo:replay";

const TICK_MS = 50;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Key moments in the loop, in milliseconds. */
const T = {
  typeRequest: 800,
  sendRequest: 4_000,
  replyStart: 5_000,
  client: 5_600,
  clientEmail: 6_200,
  typeItem: 6_800,
  price: 8_000,
  secondItem: 8_500,
  vat: 9_100,
  due: 9_700,
  draftReady: 10_300,
  colorCursor: 11_000,
  colorClick: 11_600,
  colorCursorOut: 12_400,
  chatSendCursor: 12_800,
  chatSendClick: 13_400,
  typeRecipient: 13_700,
  typeCc: 14_900,
  sendCursor: 16_200,
  sendClick: 16_800,
  sent: 17_600,
  sendCursorOut: 17_800,
  reset: 22_400,
} as const;

export const BUSINESS = {
  name: "Ridgeway Towing & Recovery Ltd",
  shortName: "Ridgeway Towing",
  address: ["Unit 4, Brookfield Industrial Estate", "Leeds LS11 5QR, United Kingdom"],
  vatNumber: { en: "VAT Reg. GB 318 4402 57", fr: "N° TVA GB 318 4402 57" } satisfies Localized<string>,
};

export const CLIENT = {
  name: "Harbour Logistics Ltd",
  address: ["Dock Road", "Hull HU9 1TA, United Kingdom"],
  email: "accounts@harbourlogistics.co.uk",
  cc: "fleet@harbourlogistics.co.uk",
};

export const ITEMS = [
  {
    description: { en: "Vehicle recovery, Ford Transit", fr: "Dépannage, Ford Transit" },
    details: { en: "Roadside recovery, M62 J27 eastbound", fr: "Intervention sur route, M62 J27 direction est" },
    qty: 1,
    rate: 285,
  },
  {
    description: { en: "Towing to depot", fr: "Remorquage au dépôt" },
    details: { en: "Per mile, M62 J27 to Leeds depot", fr: "Au mile, M62 J27 jusqu’au dépôt de Leeds" },
    qty: 24,
    rate: 3.5,
  },
] as const;

export const REQUEST: Localized<string> = {
  en: "Invoice Harbour Logistics for the Ford Transit recovery on the M62: £285, plus 24 miles towing at £3.50. Add 20% VAT, due in 14 days.",
  fr: "Facture Harbour Logistics : dépannage du Ford Transit sur la M62 à 285 £, plus 24 miles de remorquage à 3,50 £. TVA 20 %, à 14 jours.",
};
export const SUBTOTAL = ITEMS.reduce((sum, item) => sum + item.qty * item.rate, 0);
export const VAT_RATE = 0.2;
export const VAT = SUBTOTAL * VAT_RATE;
export const TOTAL = SUBTOTAL + VAT;

/** The demo business is in the UK, so English formats as en-GB. */
const FORMAT_LOCALE: Localized<string> = { en: "en-GB", fr: INTL_LOCALE.fr };

const MONEY_FORMAT: Localized<Intl.NumberFormat> = {
  en: new Intl.NumberFormat(FORMAT_LOCALE.en, { style: "currency", currency: "GBP" }),
  // The narrow symbol gives "442,80 £" rather than "442,80 £GB".
  fr: new Intl.NumberFormat(FORMAT_LOCALE.fr, { style: "currency", currency: "GBP", currencyDisplay: "narrowSymbol" }),
};

export const money = (amount: number, locale: Locale) => MONEY_FORMAT[locale].format(amount);

/** Invoice theme before and after the user picks the blue swatch in the design panel. */
export const THEMES = {
  initial: { primary: "#000000", secondary: "#111111", accent: "#999999" },
  blue: { primary: "#1D4ED8", secondary: "#1E40AF", accent: "#60A5FA" },
} as const;

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/**
 * Advances the demo clock while the demo is on screen and the tab is visible.
 * Returns the current position in the loop, in milliseconds.
 */
export function useDemoClock(targetRef: RefObject<HTMLElement | null>) {
  const reduceMotion = usePrefersReducedMotion();
  const [ms, setMs] = useState(COMPLETE_FRAME_MS);

  useEffect(() => {
    if (reduceMotion) return;

    let isOnScreen = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isOnScreen = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    if (targetRef.current) observer.observe(targetRef.current);

    const replay = () => setMs(0);
    window.addEventListener(REPLAY_EVENT, replay);

    const timer = window.setInterval(() => {
      if (isOnScreen && !document.hidden) {
        setMs((previous) => (previous + TICK_MS) % LOOP_MS);
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener(REPLAY_EVENT, replay);
      observer.disconnect();
    };
  }, [reduceMotion, targetRef]);

  return reduceMotion ? COMPLETE_FRAME_MS : ms;
}

function typed(text: string, ms: number, start: number, msPerChar: number) {
  return ms >= start ? text.slice(0, Math.floor((ms - start) / msPerChar)) : "";
}

const isBetween = (ms: number, start: number, end: number) => ms >= start && ms < end;

/** Everything the demo shows at a given point in the loop. */
export function getDemoFrame(ms: number, locale: Locale) {
  const requestSent = ms >= T.sendRequest;
  const clientReady = ms >= T.client;
  const emailReady = ms >= T.clientEmail;
  const priceReady = ms >= T.price;
  const secondItemReady = ms >= T.secondItem;
  const vatReady = ms >= T.vat;
  const dueReady = ms >= T.due;
  const draftReady = ms >= T.draftReady;
  const sent = ms >= T.sent;

  const firstItem = ITEMS[0].description[locale];
  const draftInput = requestSent ? "" : typed(REQUEST[locale], ms, T.typeRequest, 24);
  const typedItem = typed(firstItem, ms, T.typeItem, 38);
  const recipient = typed(CLIENT.email, ms, T.typeRecipient, 35);
  const cc = typed(CLIENT.cc, ms, T.typeCc, 35);
  const subtotal =
    (priceReady ? ITEMS[0].qty * ITEMS[0].rate : 0) + (secondItemReady ? ITEMS[1].qty * ITEMS[1].rate : 0);
  const vat = vatReady ? subtotal * VAT_RATE : 0;

  return {
    // Birdy chat
    draftInput,
    draftTyping: ms >= T.typeRequest && !requestSent,
    requestSent,
    thinking: requestSent && ms < T.replyStart,
    requestsLeft: requestSent ? 18 : 19,
    sendRequestCursor: isBetween(ms, T.sendRequest - 700, T.sendRequest + 400),
    sendRequestClick: isBetween(ms, T.sendRequest - 150, T.sendRequest + 100),
    chatSendCursor: isBetween(ms, T.chatSendCursor, T.chatSendClick + 600),
    chatSendClick: isBetween(ms, T.chatSendClick, T.chatSendClick + 250),

    // Builder
    clientReady,
    emailReady,
    typedItem,
    itemTyping: ms >= T.typeItem && typedItem.length < firstItem.length,
    priceReady,
    secondItemReady,
    vatReady,
    dueReady,
    draftReady,
    subtotal,
    vat,
    total: subtotal + vat,
    stepsDone: 2 + Number(clientReady) + Number(emailReady) + Number(priceReady),
    branded: ms >= T.colorClick,
    colorCursor: isBetween(ms, T.colorCursor, T.colorCursorOut),
    colorClick: isBetween(ms, T.colorClick, T.colorClick + 250),

    // Send invoice
    recipient,
    recipientTyping: ms >= T.typeRecipient && recipient.length < CLIENT.email.length,
    cc,
    ccTyping: ms >= T.typeCc && cc.length < CLIENT.cc.length,
    canSend: cc.length === CLIENT.cc.length,
    sending: ms >= T.sendClick && !sent,
    sent,
    sendCursor: isBetween(ms, T.sendCursor, T.sendCursorOut),
    sendClick: isBetween(ms, T.sendClick, T.sendClick + 250),

    resetting: ms >= T.reset,
  };
}

export type DemoFrame = ReturnType<typeof getDemoFrame>;

const subscribeNever = () => () => {};

const NEUTRAL_DATES: Localized<{ issued: string; due: string }> = {
  en: { issued: "Today", due: "In 14 days" },
  fr: { issued: "Aujourd’hui", due: "Dans 14 jours" },
};

const GREETINGS: Localized<{ morning: string; afternoon: string; evening: string; neutral: string }> = {
  en: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening", neutral: "Hello" },
  fr: { morning: "Bonjour", afternoon: "Bonjour", evening: "Bonsoir", neutral: "Bonjour" },
};

function formatDateFromToday(daysAhead: number, locale: Locale) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return new Intl.DateTimeFormat(FORMAT_LOCALE[locale], { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function greetingForNow(locale: Locale) {
  const hour = new Date().getHours();
  if (hour < 12) return GREETINGS[locale].morning;
  if (hour < 18) return GREETINGS[locale].afternoon;
  return GREETINGS[locale].evening;
}

/** Real dates on the client; neutral labels during prerender so hydration matches. */
export function useInvoiceDates(locale: Locale) {
  const issued = useSyncExternalStore(subscribeNever, () => formatDateFromToday(0, locale), () => NEUTRAL_DATES[locale].issued);
  const due = useSyncExternalStore(subscribeNever, () => formatDateFromToday(14, locale), () => NEUTRAL_DATES[locale].due);
  return { issued, due };
}

export type InvoiceDates = ReturnType<typeof useInvoiceDates>;

export function useGreeting(locale: Locale) {
  return useSyncExternalStore(subscribeNever, () => greetingForNow(locale), () => GREETINGS[locale].neutral);
}
