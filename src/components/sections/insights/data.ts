/** Sample figures for Ridgeway Towing & Recovery, October. Totals are consistent across tabs. */

export const euro = (amount: number, cents = false) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(amount);

export type InvoiceStatus = "paid" | "sent" | "viewed" | "overdue";

export const INVOICES: { number: string; client: string; amount: number; status: InvoiceStatus; when: string }[] = [
  { number: "INV-831", client: "Northlight Logistics", amount: 1_450, status: "sent", when: "Due in 9 days" },
  { number: "INV-830", client: "Michael Thompson", amount: 420, status: "paid", when: "Paid today" },
  { number: "INV-829", client: "Harbour Logistics", amount: 850, status: "viewed", when: "Due in 4 days" },
  { number: "INV-827", client: "Sarah Mitchell", amount: 300, status: "paid", when: "Paid yesterday" },
  { number: "INV-826", client: "Northlight Logistics", amount: 1_180, status: "paid", when: "Paid 3 days ago" },
  { number: "INV-814", client: "Daniel Carter", amount: 900, status: "overdue", when: "12 days overdue" },
];

export const COLLECTED = 8_400;
export const OUTSTANDING = INVOICES.filter((invoice) => invoice.status !== "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
export const OVERDUE = INVOICES.filter((invoice) => invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
export const INVOICED = COLLECTED + OUTSTANDING;

export const EXPENSE_CATEGORIES = [
  { name: "Fuel", amount: 860 },
  { name: "Vehicle maintenance", amount: 540 },
  { name: "Insurance", amount: 410 },
  { name: "Tolls & parking", amount: 190 },
  { name: "Equipment", amount: 140 },
];

export const EXPENSES_TOTAL = EXPENSE_CATEGORIES.reduce((sum, category) => sum + category.amount, 0);
/** VAT included in this month's expenses at 20%. */
export const VAT_RECLAIMABLE = Math.round(EXPENSES_TOTAL - EXPENSES_TOTAL / 1.2);

export const RECENT_EXPENSES = [
  { name: "Diesel · Flatbed truck", category: "Fuel", amount: 95, when: "Today" },
  { name: "Winch cable", category: "Equipment", amount: 140, when: "Yesterday" },
  { name: "Brake service · Recovery truck", category: "Vehicle maintenance", amount: 260, when: "3 days ago" },
  { name: "Diesel · Recovery truck", category: "Fuel", amount: 110, when: "4 days ago" },
];

export const MONTHS = [
  { month: "May", revenue: 9_200, expenses: 2_300 },
  { month: "Jun", revenue: 10_100, expenses: 2_450 },
  { month: "Jul", revenue: 9_800, expenses: 2_600 },
  { month: "Aug", revenue: 11_200, expenses: 2_380 },
  { month: "Sep", revenue: 10_600, expenses: 2_250 },
  { month: "Oct", revenue: INVOICED, expenses: EXPENSES_TOTAL },
];

const latest = MONTHS[MONTHS.length - 1];
const previous = MONTHS[MONTHS.length - 2];

export const REPORT = {
  revenue: latest.revenue,
  expenses: latest.expenses,
  profit: latest.revenue - latest.expenses,
  revenueChange: Math.round(((latest.revenue - previous.revenue) / previous.revenue) * 100),
  margin: Math.round(((latest.revenue - latest.expenses) / latest.revenue) * 100),
  fuelShare: Math.round((EXPENSE_CATEGORIES[0].amount / EXPENSES_TOTAL) * 100),
};
