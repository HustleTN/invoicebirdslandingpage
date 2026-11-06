"use client";

import { useState } from "react";
import { Fuel, PiggyBank, TrendingUp, Wallet, Receipt, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

import { euro, MONTHS, REPORT } from "./data";
import { KpiTile, PanelTitle } from "./dashboard-ui";

/* Validated pair (dataviz validator, light surface): brand green + blue. */
const SERIES = [
  { key: "revenue", label: "Revenue", color: "#06B047" },
  { key: "expenses", label: "Expenses", color: "#2A78D6" },
] as const;

const SCALE_MAX = 12_000;
const TICKS = [0, 4_000, 8_000, 12_000];
const CHART_HEIGHT = 200;

const compact = (amount: number) => (amount === 0 ? "€0" : `€${amount / 1_000}k`);

const previousExpenses = MONTHS[MONTHS.length - 2].expenses;
const expenseChange = Math.round(((REPORT.expenses - previousExpenses) / previousExpenses) * 100);

const INSIGHTS: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: TrendingUp, title: `Revenue up ${REPORT.revenueChange}% on September`, detail: "Your best month in the last six." },
  { icon: Fuel, title: `Fuel is ${REPORT.fuelShare}% of spending`, detail: "Your largest expense category." },
  { icon: PiggyBank, title: `${REPORT.margin}% profit margin`, detail: `${euro(REPORT.profit)} profit in October.` },
];

function RevenueChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-[#E6EAEF] p-4">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#4B5563]">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: series.color }} />
            {series.label}
            <span className="text-navy tabular-nums">{euro(series.key === "revenue" ? REPORT.revenue : REPORT.expenses)}</span>
          </span>
        ))}
        <span className="ml-auto text-[#6B7280]">Last 6 months</span>
      </div>

      <div aria-hidden="true" className="relative pl-9" style={{ height: CHART_HEIGHT + 22 }}>
        {/* Recessive gridlines and y-axis labels */}
        {TICKS.map((tick) => (
          <div
            key={tick}
            className="absolute right-0 left-9 border-t border-[#EEF1F4]"
            style={{ bottom: 22 + (tick / SCALE_MAX) * CHART_HEIGHT }}
          >
            <span className="absolute -top-2 -left-9 w-7 text-right text-[10.5px] text-[#9CA3AF] tabular-nums">{compact(tick)}</span>
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 left-9 flex" style={{ height: CHART_HEIGHT + 22 }}>
          {MONTHS.map((month, index) => (
            <div
              key={month.month}
              className="relative flex flex-1 flex-col items-center justify-end"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={cn("flex items-end gap-0.5 transition-opacity", hovered !== null && hovered !== index && "opacity-40")}
                style={{ height: CHART_HEIGHT }}
              >
                {SERIES.map((series) => (
                  <span
                    key={series.key}
                    className="w-3.5 rounded-t-[4px] sm:w-[18px]"
                    style={{ height: (month[series.key] / SCALE_MAX) * CHART_HEIGHT, backgroundColor: series.color }}
                  />
                ))}
              </div>
              <span className="mt-1.5 h-[14px] text-[11px] text-[#6B7280]">{month.month}</span>

              {hovered === index && (
                <div
                  className={cn(
                    "pointer-events-none absolute top-6 z-10 w-40 rounded-lg border border-[#E3E7EC] bg-white p-2.5 text-[12px] shadow-lg",
                    index >= MONTHS.length / 2 ? "right-[calc(50%+22px)]" : "left-[calc(50%+22px)]",
                  )}
                >
                  <p className="mb-1 font-semibold text-navy">{month.month} 2026</p>
                  {SERIES.map((series) => (
                    <p key={series.key} className="flex items-center justify-between gap-2 text-[#4B5563]">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-[2px]" style={{ backgroundColor: series.color }} />
                        {series.label}
                      </span>
                      <span className="text-navy tabular-nums">{euro(month[series.key])}</span>
                    </p>
                  ))}
                  <p className="mt-1 flex justify-between border-t border-[#EEF1F4] pt-1 text-[#4B5563]">
                    Profit <span className="font-medium text-navy tabular-nums">{euro(month.revenue - month.expenses)}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <table className="sr-only">
        <caption>Monthly revenue and expenses, May to October 2026</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Revenue</th>
            <th>Expenses</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((month) => (
            <tr key={month.month}>
              <td>{month.month}</td>
              <td>{euro(month.revenue)}</td>
              <td>{euro(month.expenses)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReportsTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <KpiTile label="Revenue" value={euro(REPORT.revenue)} detail={`+${REPORT.revenueChange}% vs September`} icon={TrendingUp} accent="bg-green-soft text-green" />
        <KpiTile label="Expenses" value={euro(REPORT.expenses)} detail={`${expenseChange}% vs September`} icon={Receipt} accent="bg-[#EEF4FF] text-[#1D4ED8]" />
        <KpiTile label="Profit" value={euro(REPORT.profit)} detail={`${REPORT.margin}% margin`} icon={Wallet} accent="bg-[#F1F4F7] text-navy" />
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <PanelTitle>Revenue vs expenses</PanelTitle>
          <RevenueChart />
        </div>
        <div>
          <PanelTitle>Insights</PanelTitle>
          <ul className="space-y-2.5">
            {INSIGHTS.map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex gap-3 rounded-xl border border-[#E6EAEF] p-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-navy">
                  <Icon size={15} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-navy">{title}</p>
                  <p className="text-[12px] text-[#6B7280]">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
