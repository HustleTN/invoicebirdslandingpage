import { Paperclip, Receipt, Percent, Fuel } from "lucide-react";

import { EXPENSE_CATEGORIES, EXPENSES_TOTAL, euro, RECENT_EXPENSES, REPORT, VAT_RECLAIMABLE } from "./data";
import { KpiTile, PanelTitle } from "./dashboard-ui";

const largest = Math.max(...EXPENSE_CATEGORIES.map((category) => category.amount));

export function ExpensesTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <KpiTile label="Spent this month" value={euro(EXPENSES_TOTAL)} detail="22 expenses · 5 categories" icon={Receipt} accent="bg-[#EEF4FF] text-[#1D4ED8]" />
        <KpiTile label="VAT to reclaim" value={euro(VAT_RECLAIMABLE)} detail="20% VAT included" icon={Percent} accent="bg-[#F5F3FF] text-[#6D28D9]" />
        <KpiTile label="Top category" value="Fuel" detail={`${euro(EXPENSE_CATEGORIES[0].amount)} · ${REPORT.fuelShare}% of spend`} icon={Fuel} accent="bg-[#FFF7E6] text-[#B45309]" />
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <PanelTitle>By category</PanelTitle>
          <ul className="space-y-3 rounded-xl border border-[#E6EAEF] p-4">
            {EXPENSE_CATEGORIES.map((category) => (
              <li key={category.name}>
                <div className="flex justify-between text-[12.5px]">
                  <span className="text-[#374151]">{category.name}</span>
                  <span className="font-medium text-navy tabular-nums">{euro(category.amount)}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-r-[4px] bg-[#F1F4F7]">
                  <div className="h-full rounded-r-[4px] bg-[#2A78D6]" style={{ width: `${(category.amount / largest) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <PanelTitle action={<span className="text-[12px] font-medium text-green">+ Add expense</span>}>Recent expenses</PanelTitle>
          <ul className="divide-y divide-[#EEF1F4] rounded-xl border border-[#E6EAEF]">
            {RECENT_EXPENSES.map((expense) => (
              <li key={expense.name} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-navy">{expense.name}</p>
                  <p className="text-[11.5px] text-[#6B7280]">
                    {expense.category} · {expense.when}
                  </p>
                </div>
                <Paperclip size={13} className="shrink-0 text-[#9CA3AF]" aria-label="Receipt attached" />
                <span className="text-[13px] font-medium text-navy tabular-nums">{euro(expense.amount, true)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
