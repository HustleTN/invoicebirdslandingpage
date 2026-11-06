import { INTL_LOCALE, type Locale, type Localized } from "@/lib/i18n";

/**
 * One customization story, step by step. Changes are cumulative: a step's
 * edit stays applied for the rest of the loop, then everything resets.
 */
export const STEPS = [
  { id: "colors", length: 3_400 },
  { id: "layout", length: 3_800 },
  { id: "logo", length: 3_200 },
  { id: "taxes", length: 4_400 },
  { id: "signature", length: 4_200 },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

/** Each step's name, and a short one for phones. */
export const STEP_LABELS: Localized<Record<StepId, { label: string; short: string }>> = {
  en: {
    colors: { label: "Brand colors", short: "Colors" },
    layout: { label: "Corners & table", short: "Corners" },
    logo: { label: "Logo", short: "Logo" },
    taxes: { label: "Taxes & discount", short: "Taxes" },
    signature: { label: "Signature", short: "Sign" },
  },
  fr: {
    colors: { label: "Couleurs de marque", short: "Couleurs" },
    layout: { label: "Coins et tableau", short: "Coins" },
    logo: { label: "Logo", short: "Logo" },
    taxes: { label: "Taxes et remise", short: "Taxes" },
    signature: { label: "Signature", short: "Signer" },
  },
};

const STARTS = STEPS.map((_, i) => STEPS.slice(0, i).reduce((sum, step) => sum + step.length, 0));
const HOLD = 2_600;
const FADE = 500;
export const LOOP_MS = STARTS[STEPS.length - 1] + STEPS[STEPS.length - 1].length + HOLD;
export const stepStart = (index: number) => STARTS[index];

/** Moments within each step (ms after the step starts). */
const CLICK = {
  swatch: [0, 1_000],
  corners: [1, 1_000],
  table: [1, 2_300],
  logo: [2, 1_100],
  tax: [3, 1_000],
  discount: [3, 2_700],
  signature: [4, 2_700],
} as const;
const TYPE_DISCOUNT = [3, 1_800] as const;
const DRAW = [4, 400, 1_500] as const; // step, start, duration

const between = (ms: number, a: number, b: number) => ms >= a && ms < b;

export function getLook(ms: number) {
  const at = ([step, t]: readonly [number, number]) => STARTS[step] + t;
  const done = (key: keyof typeof CLICK) => ms >= at(CLICK[key]);
  const cursor = (key: keyof typeof CLICK) => ({
    visible: between(ms, at(CLICK[key]) - 750, at(CLICK[key]) + 450),
    clicking: between(ms, at(CLICK[key]) - 120, at(CLICK[key]) + 160),
  });
  const drawFrom = STARTS[DRAW[0]] + DRAW[1];

  return {
    brand: done("swatch"),
    rounded: done("corners"),
    striped: done("table"),
    logo: done("logo"),
    vat: done("tax"),
    discountTyped: ms >= at(TYPE_DISCOUNT),
    discount: done("discount"),
    signature: Math.min(1, Math.max(0, (ms - drawFrom) / DRAW[2])),
    signed: done("signature"),
    cursors: {
      swatch: cursor("swatch"),
      corners: cursor("corners"),
      table: cursor("table"),
      logo: cursor("logo"),
      tax: cursor("tax"),
      discount: cursor("discount"),
      signature: cursor("signature"),
    },
    resetting: ms >= LOOP_MS - FADE,
  };
}

export type Look = ReturnType<typeof getLook>;

/** Which step is playing; the last one stays active through the hold. */
export function activeStep(ms: number) {
  let index = 0;
  STARTS.forEach((start, i) => {
    if (ms >= start) index = i;
  });
  return index;
}

export const stepProgress = (ms: number, index: number) =>
  Math.min(1, Math.max(0, (ms - STARTS[index]) / STEPS[index].length));

/* Sample invoice: Ridgeway Towing & Recovery Ltd, same business as the hero. */
export const gbp = (locale: Locale) => (n: number) =>
  new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: "GBP", currencyDisplay: "narrowSymbol" }).format(n);

export const ITEMS: { name: Localized<string>; detail: Localized<string>; qty: number; rate: number }[] = [
  {
    name: { en: "Vehicle recovery, Ford Transit", fr: "Dépannage, Ford Transit" },
    detail: { en: "M62 J27 eastbound", fr: "M62 J27, direction est" },
    qty: 1,
    rate: 285,
  },
  {
    name: { en: "Towing to depot", fr: "Remorquage au dépôt" },
    detail: { en: "Per mile, to Leeds depot", fr: "Par mile, jusqu’au dépôt de Leeds" },
    qty: 24,
    rate: 3.5,
  },
  { name: { en: "Winching", fr: "Treuillage" }, detail: { en: "Ditch recovery", fr: "Sortie de fossé" }, qty: 1, rate: 95 },
];

export function totals(look: Pick<Look, "vat" | "discount">) {
  const subtotal = ITEMS.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const discount = look.discount ? subtotal * 0.1 : 0;
  const vat = look.vat ? (subtotal - discount) * 0.2 : 0;
  return { subtotal, discount, vat, total: subtotal - discount + vat };
}

export const THEMES = {
  plain: { primary: "#111827", secondary: "#1F2937", accent: "#9CA3AF" },
  brand: { primary: "#B91C1C", secondary: "#7F1D1D", accent: "#DC2626" },
} as const;
