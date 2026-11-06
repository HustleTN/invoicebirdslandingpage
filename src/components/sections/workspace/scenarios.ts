/** Workspace items Birdy can "use", highlighted on the left while it works. */
export type HighlightKey =
  | "client:northlight"
  | "client:daniel"
  | "client:sarah"
  | "service:recovery"
  | "service:flatbed"
  | "vat"
  | "terms"
  | "category:fuel";

export type ScenarioId = "invoice" | "overdue" | "expense";

type Lookup = { label: string; highlights: HighlightKey[] };

export type Scenario = {
  id: ScenarioId;
  tab: string;
  request: string;
  intro: string;
  lookups: Lookup[];
  resultIntro: string;
  followUp: string;
  confirmation: string;
  /** Plain-language summary for screen readers. */
  description: string;
};

export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export const SERVICES = [
  { key: "service:recovery", name: "Vehicle Recovery", price: 350 },
  { key: "service:flatbed", name: "Flatbed Towing", price: 250 },
  { key: null, name: "Winching", price: 120 },
] as const;

export const VAT_RATE = 0.2;

export const SCENARIOS: Scenario[] = [
  {
    id: "invoice",
    tab: "Prepare invoice",
    request: "Prepare an invoice for Northlight Logistics for vehicle recovery and flatbed towing.",
    intro: "Using your saved details:",
    lookups: [
      { label: "Client: Northlight Logistics", highlights: ["client:northlight"] },
      { label: "Vehicle Recovery · $350.00", highlights: ["service:recovery"] },
      { label: "Flatbed Towing · $250.00", highlights: ["service:flatbed"] },
      { label: "VAT 20%", highlights: ["vat"] },
      { label: "Payment terms · 14 days", highlights: ["terms"] },
    ],
    resultIntro: "Your invoice is ready for review:",
    followUp: "Actually, change the payment terms to 30 days.",
    confirmation: "Done. INV-823 is now due in 30 days. Your default terms stay at 14 days.",
    description:
      "A user asks Birdy to prepare an invoice for Northlight Logistics for vehicle recovery and flatbed towing. Birdy uses the saved client, the saved prices of $350 and $250, 20% VAT and 14-day payment terms to prepare a $720 invoice for review: $600 subtotal plus $120 VAT. The user then asks for 30-day terms, and Birdy updates the invoice.",
  },
  {
    id: "overdue",
    tab: "Check overdue",
    request: "What's overdue right now?",
    intro: "Checking your saved clients:",
    lookups: [
      { label: "Daniel Carter · INV-814", highlights: ["client:daniel"] },
      { label: "Sarah Mitchell · INV-809", highlights: ["client:sarah"] },
    ],
    resultIntro: "Two invoices are overdue:",
    followUp: "Draft a friendly reminder for both.",
    confirmation: "Two reminder emails are drafted and waiting for your review. Nothing has been sent yet.",
    description:
      "A user asks Birdy what is overdue. Birdy finds two overdue invoices: INV-814 for Daniel Carter, $564, 12 days overdue, and INV-809 for Sarah Mitchell, $300, 5 days overdue. The user asks for friendly reminders, and Birdy drafts two reminder emails for review without sending them.",
  },
  {
    id: "expense",
    tab: "Log expense",
    request: "Log $85 of diesel for the flatbed truck, paid today.",
    intro: "Matching your settings:",
    lookups: [
      { label: "Category: Fuel", highlights: ["category:fuel"] },
      { label: "VAT 20% included", highlights: ["vat"] },
    ],
    resultIntro: "Logged to your expenses:",
    followUp: "Actually, it was $95.",
    confirmation: "Updated to $95.00, including $15.83 VAT.",
    description:
      "A user asks Birdy to log $85 of diesel for the flatbed truck. Birdy files it under Fuel with 20% VAT included ($14.17). The user corrects the amount to $95, and Birdy updates the expense to $95.00 including $15.83 VAT.",
  },
];

const MS_PER_CHAR = 24;
const START = 500;
const LOOKUP_GAP = 550;

/** Absolute timings for a scenario, derived from its message lengths. */
function timeline(scenario: Scenario) {
  const requestSent = START + scenario.request.length * MS_PER_CHAR + 300;
  const lookupsStart = requestSent + 800;
  const resultAt = lookupsStart + scenario.lookups.length * LOOKUP_GAP + 300;
  const followUpStart = resultAt + 1_800;
  const followUpSent = followUpStart + scenario.followUp.length * MS_PER_CHAR + 300;
  const confirmedAt = followUpSent + 900;
  const fadeAt = confirmedAt + 3_800;
  return { requestSent, lookupsStart, resultAt, followUpStart, followUpSent, confirmedAt, fadeAt, duration: fadeAt + 500 };
}

export const scenarioDuration = (scenario: Scenario) => timeline(scenario).duration;

/** A finished frame, used for reduced motion. */
export const finalFrameMs = (scenario: Scenario) => timeline(scenario).fadeAt - 1;

const typed = (text: string, ms: number, start: number) =>
  ms >= start ? text.slice(0, Math.floor((ms - start) / MS_PER_CHAR)) : "";

/** Everything the scenario shows at a given point in its loop. */
export function getScenarioFrame(scenario: Scenario, ms: number) {
  const t = timeline(scenario);
  const requestSent = ms >= t.requestSent;
  const followUpSent = ms >= t.followUpSent;
  const lookupsShown = scenario.lookups.filter((_, index) => ms >= t.lookupsStart + index * LOOKUP_GAP);

  let input = "";
  if (!requestSent) input = typed(scenario.request, ms, START);
  else if (ms >= t.followUpStart && !followUpSent) input = typed(scenario.followUp, ms, t.followUpStart);

  return {
    input,
    typing: input.length > 0,
    requestSent,
    thinking: requestSent && ms < t.lookupsStart,
    lookupsShown,
    highlights: new Set(lookupsShown.flatMap((lookup) => lookup.highlights)),
    resultShown: ms >= t.resultAt,
    followUpSent,
    followUpThinking: followUpSent && ms < t.confirmedAt,
    updated: ms >= t.confirmedAt,
    requestsUsed: Number(requestSent) + Number(followUpSent),
    fading: ms >= t.fadeAt,
  };
}

export type ScenarioFrame = ReturnType<typeof getScenarioFrame>;
