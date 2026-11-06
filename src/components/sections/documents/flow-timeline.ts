export const CLIENT = {
  name: "Northlight Logistics",
  contact: "Jordan Hale",
  role: "Fleet Manager",
};

export const ITEMS = [
  { name: "Vehicle Recovery", price: 350 },
  { name: "Flatbed Towing", price: 250 },
] as const;

export const SUBTOTAL = ITEMS.reduce((sum, item) => sum + item.price, 0);
export const VAT = SUBTOTAL * 0.2;
export const TOTAL = SUBTOTAL + VAT;

export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

/** Card i fades in at 100 + i × 180 ms; connectors draw once both neighbours are in. */
const CARD_STAGGER = 180;
const cardAt = (index: number) => 100 + index * CARD_STAGGER;

/** After the first pass, the loop restarts here so cards stay revealed and only the conversion replays. */
export const LOOP_FROM = 2_000;
export const LOOP_END = 11_000;
/** A finished frame, used for reduced motion. */
export const FINAL_FRAME = 10_000;

const T = {
  proposalStatus: 1_100,
  contractStatus: 1_350,
  estimateStatus: 1_600,
  convertPress: 2_600,
  convertRelease: 2_900,
  toInvoice: 2_900,
  invoiceClient: 3_500,
  invoiceItems: 3_900,
  invoiceTotal: 4_300,
  invoiceSent: 4_900,
  toPayment: 5_500,
  paymentReceived: 6_100,
  reset: 10_500,
} as const;

const FLASH_MS = 1_200;
const between = (ms: number, start: number, end: number) => ms >= start && ms < end;

export function getFlowFrame(ms: number) {
  return {
    cardsShown: [0, 1, 2, 3, 4].filter((index) => ms >= cardAt(index)).length,
    connectorsShown: [0, 1, 2, 3].filter((index) => ms >= cardAt(index + 1) + 120).length,

    proposalAccepted: ms >= T.proposalStatus,
    contractSigned: ms >= T.contractStatus,
    estimateApproved: ms >= T.estimateStatus,

    convertPressed: between(ms, T.convertPress, T.convertRelease),
    converting: between(ms, T.convertPress, T.invoiceTotal + FLASH_MS),
    toInvoice: between(ms, T.toInvoice, T.invoiceClient),

    invoiceClient: ms >= T.invoiceClient,
    invoiceItems: ms >= T.invoiceItems,
    invoiceTotal: ms >= T.invoiceTotal,
    clientFlash: between(ms, T.invoiceClient, T.invoiceClient + FLASH_MS),
    itemsFlash: between(ms, T.invoiceItems, T.invoiceItems + FLASH_MS),
    totalFlash: between(ms, T.invoiceTotal, T.invoiceTotal + FLASH_MS),
    invoiceSent: ms >= T.invoiceSent,

    toPayment: between(ms, T.toPayment, T.paymentReceived),
    paymentReceived: ms >= T.paymentReceived,

    resetting: ms >= T.reset,
  };
}

export type FlowFrame = ReturnType<typeof getFlowFrame>;
