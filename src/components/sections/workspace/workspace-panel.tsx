import { Check, Plus, Settings2, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

import { money, SERVICES, type HighlightKey } from "./scenarios";

const CLIENTS = [
  { key: "client:northlight", name: "Northlight Logistics", detail: "Fleet account · 12 invoices", initials: "NL", tint: "bg-[#E0EAFF] text-[#1D4ED8]" },
  { key: null, name: "Michael Thompson", detail: "Private customer · 2 invoices", initials: "MT", tint: "bg-[#FEF3C7] text-[#92400E]" },
  { key: "client:sarah", name: "Sarah Mitchell", detail: "Private customer · 1 invoice", initials: "SM", tint: "bg-[#FCE7F3] text-[#9D174D]" },
  { key: "client:daniel", name: "Daniel Carter", detail: "Private customer · 3 invoices", initials: "DC", tint: "bg-[#DCFCE7] text-[#166534]" },
] as const;

const OVERDUE: Partial<Record<HighlightKey, string>> = {
  "client:daniel": `Overdue · ${money(564)}`,
  "client:sarah": `Overdue · ${money(300)}`,
};

const EXPENSE_CATEGORIES = [
  { key: "category:fuel", name: "Fuel" },
  { key: null, name: "Maintenance" },
  { key: null, name: "Tolls" },
  { key: null, name: "Insurance" },
] as const;

/** Small "used by Birdy" marker shown on highlighted items. */
function UsedTag() {
  return (
    <span className="flex animate-fade-in items-center gap-1 rounded-full bg-green-soft px-2 py-0.5 text-[10px] font-medium text-green">
      <Sparkles size={10} /> Used
    </span>
  );
}

const highlightRing = "ring-2 ring-green/70 bg-[#F3FCF6]";

function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-[#6B7280] uppercase">{children}</p>
      {action}
    </div>
  );
}

/** Mock of the business's saved workspace data in InvoiceBirds. */
export function WorkspacePanel({ highlights }: { highlights: Set<HighlightKey> }) {
  const isUsed = (key: HighlightKey | null) => key !== null && highlights.has(key);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E3E7EC] bg-white text-left text-[#111827] shadow-[0_24px_70px_rgba(10,37,64,0.08)]">
      {/* Business */}
      <div className="flex items-center justify-between border-b border-[#EEF0F3] px-5 py-3.5">
        <div className="leading-none">
          <p className="mb-2 text-[11px] font-medium text-[#6B7280]">Your workspace</p>
          <p className="text-[19px] font-black tracking-[-0.02em] text-[#B91C1C] italic">RIDGEWAY</p>
          <p className="mt-1 text-[8.5px] font-bold tracking-[0.28em] text-[#1F2937]">TOWING &amp; RECOVERY</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-lg border border-[#E3E6EA] px-2.5 py-1.5 text-[11px] font-medium text-[#374151]">
          <Settings2 size={13} /> Business settings
        </span>
      </div>

      <div className="space-y-4 px-5 pt-4 pb-5">
        {/* Clients */}
        <div>
          <SectionLabel action={<span className="text-[11px] font-medium text-green">+ Add client</span>}>
            Saved clients (4)
          </SectionLabel>
          <ul className="space-y-1">
            {CLIENTS.map((client) => {
              const used = isUsed(client.key);
              const selected = client.key === "client:northlight";
              const overdue = used && client.key ? OVERDUE[client.key] : undefined;
              return (
                <li
                  key={client.name}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-1.5 transition-all duration-300",
                    selected ? "border-[#CFE9D9]" : "border-transparent",
                    used && highlightRing,
                  )}
                >
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold", client.tint)}>
                    {client.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{client.name}</p>
                    <p className="truncate text-[11px] text-[#6B7280]">{client.detail}</p>
                  </div>
                  {overdue ? (
                    <span className="animate-fade-in rounded-full bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-medium text-[#B91C1C]">
                      {overdue}
                    </span>
                  ) : used ? (
                    <UsedTag />
                  ) : (
                    selected && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-green text-white">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Services */}
        <div>
          <SectionLabel>Saved services</SectionLabel>
          <ul className="divide-y divide-[#EEF0F3] rounded-xl border border-[#EEF0F3]">
            {SERVICES.map((service) => {
              const used = isUsed(service.key);
              return (
                <li
                  key={service.name}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2 text-[13px] transition-all duration-300 first:rounded-t-xl last:rounded-b-xl",
                    used && highlightRing,
                  )}
                >
                  <span className="font-medium">{service.name}</span>
                  <span className="flex items-center gap-2">
                    {used && <UsedTag />}
                    <span className="font-semibold tabular-nums">{money(service.price)}</span>
                  </span>
                </li>
              );
            })}
            <li className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-[#6B7280]">
              <Plus size={12} /> 2 more services
            </li>
          </ul>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-2.5">
          {(
            [
              ["vat", "VAT", "20%"],
              ["terms", "Payment terms", "14 days"],
            ] as const
          ).map(([key, label, value]) => (
            <div
              key={key}
              className={cn(
                "rounded-xl border border-[#EEF0F3] px-3 py-2.5 transition-all duration-300",
                isUsed(key) && highlightRing,
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#6B7280]">{label}</p>
                {isUsed(key) && <UsedTag />}
              </div>
              <p className="mt-0.5 text-[15px] font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* Expense categories */}
        <div>
          <SectionLabel>Expense categories</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {EXPENSE_CATEGORIES.map((category) => (
              <span
                key={category.name}
                className={cn(
                  "rounded-full border border-[#E3E6EA] px-2.5 py-1 text-[12px] text-[#374151] transition-all duration-300",
                  isUsed(category.key) && "border-transparent font-medium text-green " + highlightRing,
                )}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
