"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, ChartColumn, Receipt, Wallet, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { useLoopClock } from "@/lib/use-loop-clock";

import { ExpensesTab } from "./expenses-tab";
import { birdyAnswered, CHAT_FINAL_FRAME, CHAT_LOOP_MS, InsightsChat } from "./insights-chat";
import { PaymentsTab } from "./payments-tab";
import { ReportsTab } from "./reports-tab";

const TABS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "reports", label: "Reports", icon: ChartColumn },
];

export function InsightsDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const ms = useLoopClock(ref, { loopEnd: CHAT_LOOP_MS, finalFrame: CHAT_FINAL_FRAME });

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + TABS.length) % TABS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const tab = TABS[active];

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-3xl border border-[#E3E7EC] bg-white text-left shadow-[0_24px_70px_rgba(10,37,64,0.08)] lg:grid lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="min-w-0">
        {/* App header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1F4] px-4 pt-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Dashboard views"
            onKeyDown={onTabKeyDown}
            className="-mb-px flex gap-1 sm:gap-2"
          >
            {TABS.map((item, index) => {
              const Icon = item.icon;
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={`insights-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="insights-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 border-b-2 px-2.5 pt-1 pb-3 text-[14px] font-semibold transition-colors sm:px-3",
                    selected ? "border-navy text-navy" : "border-transparent text-[#6B7280] hover:text-navy",
                  )}
                >
                  <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <span className="mb-3 hidden items-center gap-1.5 rounded-lg border border-[#E3E7EC] px-2.5 py-1.5 text-[12px] font-medium text-[#374151] sm:flex">
            <CalendarDays size={13} aria-hidden="true" /> This month
          </span>
        </div>

        <div
          key={tab.id}
          id="insights-panel"
          role="tabpanel"
          aria-labelledby={`insights-tab-${tab.id}`}
          className="animate-fade-in p-4 sm:p-6"
        >
          {tab.id === "payments" && <PaymentsTab highlightUnpaid={birdyAnswered(ms)} />}
          {tab.id === "expenses" && <ExpensesTab />}
          {tab.id === "reports" && <ReportsTab />}
        </div>
      </div>

      <div className="relative border-t border-[#EEF1F4] lg:border-t-0 lg:border-l">
        <p className="sr-only">
          Birdy example: asked who still owes money, Birdy answers that €3,200 is outstanding, including €900 overdue
          from Daniel Carter, and prepares a reminder for review.
        </p>
        <div aria-hidden="true" className="h-[480px] lg:absolute lg:inset-0 lg:h-auto">
          <InsightsChat ms={ms} className="h-full rounded-none border-0 shadow-none" />
        </div>
      </div>
    </div>
  );
}
