import { Bell, Check, Download, Fuel, Mail } from "lucide-react";

import { BirdyChatShell, BirdyMessage, ThinkingDots, TypingCaret, UserMessage } from "@/components/birdy/birdy-chat";
import { cn } from "@/lib/cn";

import { money, SERVICES, VAT_RATE, type Scenario, type ScenarioFrame } from "./scenarios";

const REQUESTS_LEFT = 24;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 animate-fade-in overflow-hidden rounded-xl border border-[#E3E7EC] bg-white text-[12px]">{children}</div>
  );
}

function Badge({ tone, children }: { tone: "neutral" | "green" | "red"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10.5px] font-medium",
        tone === "neutral" && "bg-[#F1F3F5] text-[#4B5563]",
        tone === "green" && "bg-green-soft text-green",
        tone === "red" && "bg-[#FEF2F2] text-[#B91C1C]",
      )}
    >
      {children}
    </span>
  );
}

function Row({ label, value, strong = false }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className={cn("flex items-baseline justify-between", strong ? "font-bold" : "text-[#6B7280]")}>
      <span>{label}</span>
      <span className={cn("tabular-nums", strong ? "text-[15px]" : "text-[#111827]")}>{value}</span>
    </div>
  );
}

/** Flashes green briefly when its content changes because of a follow-up edit. */
function Changed({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={cn("rounded px-1 transition-colors duration-700", active ? "animate-fade-in bg-green-soft text-green" : "")}>
      {children}
    </span>
  );
}

function InvoiceCard({ updated }: { updated: boolean }) {
  const [recovery, flatbed] = SERVICES;
  const subtotal = recovery.price + flatbed.price;
  const vat = subtotal * VAT_RATE;

  return (
    <Card>
      <div className="flex items-center justify-between px-3.5 pt-3">
        <p className="text-[#6B7280]">
          Invoice <span className="ml-0.5 text-[14px] font-bold text-[#111827]">INV-823</span>
        </p>
        <Badge tone="neutral">Draft</Badge>
      </div>
      <p className="px-3.5 pt-1 pb-2.5 text-[#1F2937] uppercase">Northlight Logistics</p>
      <div className="space-y-1.5 border-t border-[#EEF0F3] px-3.5 py-2.5">
        {[recovery, flatbed].map((service) => (
          <div key={service.name} className="flex justify-between">
            <span>
              <span className="font-semibold">{service.name}</span>
              <span className="ml-1.5 text-[11px] text-[#6B7280]">1 × {money(service.price)}</span>
            </span>
            <span className="tabular-nums">{money(service.price)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1 border-t border-[#EEF0F3] px-3.5 py-2.5">
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="VAT 20%" value={money(vat)} />
        <Row label="Total" value={money(subtotal + vat)} strong />
        <p className="pt-0.5 text-[11px] text-[#6B7280]">
          Payment terms: <Changed active={updated}>{updated ? "30 days" : "14 days"}</Changed>
        </p>
      </div>
      <div className="flex items-center gap-3 border-t border-[#EEF0F3] bg-[#FAFBFC] px-3.5 py-2 font-medium text-[#1F2937]">
        <span>Open</span>
        <span className="flex items-center gap-1">
          <Download size={12} /> Download PDF
        </span>
        <span className="ml-auto flex items-center gap-1 rounded-lg bg-green px-2.5 py-1.5 text-white">
          <Mail size={12} /> Send
        </span>
      </div>
    </Card>
  );
}

const OVERDUE_INVOICES = [
  { client: "Daniel Carter", number: "INV-814", amount: 564, days: 12 },
  { client: "Sarah Mitchell", number: "INV-809", amount: 300, days: 5 },
];

function OverdueCard({ updated }: { updated: boolean }) {
  const total = OVERDUE_INVOICES.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <Card>
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <p className="font-semibold">2 overdue invoices</p>
        <span className="text-[14px] font-bold tabular-nums">{money(total)}</span>
      </div>
      <ul className="divide-y divide-[#EEF0F3] border-t border-[#EEF0F3]">
        {OVERDUE_INVOICES.map((invoice) => (
          <li key={invoice.number} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
            <div>
              <p className="font-semibold">{invoice.client}</p>
              <p className="text-[11px] text-[#6B7280]">
                {invoice.number} · {money(invoice.amount)}
              </p>
            </div>
            {updated ? (
              <span className="animate-fade-in">
                <Badge tone="green">Reminder drafted</Badge>
              </span>
            ) : (
              <Badge tone="red">{invoice.days} days overdue</Badge>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 border-t border-[#EEF0F3] bg-[#FAFBFC] px-3.5 py-2 font-medium text-[#1F2937]">
        <span>View invoices</span>
        <span className="ml-auto flex items-center gap-1 rounded-lg bg-green px-2.5 py-1.5 text-white">
          <Bell size={12} /> {updated ? "Review reminders" : "Draft reminders"}
        </span>
      </div>
    </Card>
  );
}

function ExpenseCard({ updated }: { updated: boolean }) {
  const amount = updated ? 95 : 85;
  const vat = amount - amount / (1 + VAT_RATE);

  return (
    <Card>
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-green-soft text-green">
            <Fuel size={15} />
          </span>
          <div>
            <p className="font-semibold">Diesel · Flatbed truck</p>
            <p className="text-[11px] text-[#6B7280]">Fuel · Paid today</p>
          </div>
        </div>
        <Badge tone="green">Logged</Badge>
      </div>
      <div className="space-y-1 border-t border-[#EEF0F3] px-3.5 py-2.5">
        <Row label="Amount" value={<Changed active={updated}>{money(amount)}</Changed>} strong />
        <Row label="VAT 20% (included)" value={<Changed active={updated}>{money(vat)}</Changed>} />
        <Row label="Category" value="Fuel" />
      </div>
    </Card>
  );
}

const RESULT_CARDS = { invoice: InvoiceCard, overdue: OverdueCard, expense: ExpenseCard } as const;

/** The animated Birdy conversation for one scenario. */
export function ScenarioChat({ scenario, frame, className }: { scenario: Scenario; frame: ScenarioFrame; className?: string }) {
  const ResultCard = RESULT_CARDS[scenario.id];

  return (
    <BirdyChatShell
      className={className}
      requestsLeft={REQUESTS_LEFT - frame.requestsUsed}
      inputActive={frame.typing}
      fading={frame.fading}
      input={
        frame.typing && (
          <span className="text-[#1F2937]">
            {frame.input}
            <TypingCaret />
          </span>
        )
      }
    >
      {frame.requestSent && <UserMessage>{scenario.request}</UserMessage>}

      {frame.requestSent && (
        <BirdyMessage>
          {frame.thinking ? (
            <ThinkingDots />
          ) : (
            <>
              <p>{frame.resultShown ? scenario.resultIntro : scenario.intro}</p>
              {!frame.resultShown && (
                <ul className="mt-1.5 space-y-1 text-[12.5px] text-[#374151]">
                  {frame.lookupsShown.map((lookup) => (
                    <li key={lookup.label} className="flex animate-fade-in items-center gap-1.5">
                      <Check size={13} strokeWidth={2.5} className="shrink-0 text-green" />
                      {lookup.label}
                    </li>
                  ))}
                </ul>
              )}
              {frame.resultShown && <ResultCard updated={frame.updated} />}
            </>
          )}
        </BirdyMessage>
      )}

      {frame.followUpSent && <UserMessage>{scenario.followUp}</UserMessage>}

      {frame.followUpSent && (
        <BirdyMessage>{frame.followUpThinking ? <ThinkingDots /> : <p>{scenario.confirmation}</p>}</BirdyMessage>
      )}
    </BirdyChatShell>
  );
}
