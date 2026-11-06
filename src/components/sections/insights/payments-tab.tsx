import { CircleAlert, CircleCheck, Clock } from "lucide-react";

import { cn } from "@/lib/cn";

import { COLLECTED, euro, INVOICED, INVOICES, OUTSTANDING, OVERDUE } from "./data";
import { KpiTile, PanelTitle, StatusBadge } from "./dashboard-ui";

const SEGMENTS = [
  { label: "Collected", amount: COLLECTED, color: "bg-green" },
  { label: "Outstanding", amount: OUTSTANDING - OVERDUE, color: "bg-[#F5A524]" },
  { label: "Overdue", amount: OVERDUE, color: "bg-[#E5484D]" },
];

/** `highlightUnpaid` marks the invoices Birdy is talking about. */
export function PaymentsTab({ highlightUnpaid }: { highlightUnpaid: boolean }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <KpiTile label="Collected" value={euro(COLLECTED)} detail="This month · 14 invoices" icon={CircleCheck} accent="bg-green-soft text-green" />
        <KpiTile label="Outstanding" value={euro(OUTSTANDING)} detail="3 invoices awaiting payment" icon={Clock} accent="bg-[#FFF7E6] text-[#B45309]" />
        <KpiTile label="Overdue" value={euro(OVERDUE)} detail="1 invoice · 12 days late" icon={CircleAlert} accent="bg-[#FEF2F2] text-[#B91C1C]" />
      </div>

      {/* Share of this month's invoiced total, by payment state */}
      <div>
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          {SEGMENTS.map((segment) => (
            <span key={segment.label} className={segment.color} style={{ width: `${(segment.amount / INVOICED) * 100}%` }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#4B5563]">
          {SEGMENTS.map((segment) => (
            <span key={segment.label} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", segment.color)} />
              {segment.label} <span className="text-navy tabular-nums">{euro(segment.amount)}</span>
            </span>
          ))}
          <span className="ml-auto text-[#6B7280]">of {euro(INVOICED)} invoiced</span>
        </div>
      </div>

      <div>
        <PanelTitle action={<span className="text-[12px] font-medium text-green">View all</span>}>Recent invoices</PanelTitle>
        <div className="overflow-hidden rounded-xl border border-[#E6EAEF]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#F8FAFB] text-[11px] tracking-[0.06em] text-[#6B7280] uppercase">
              <tr>
                <th className="px-4 py-2.5 font-medium">Invoice</th>
                <th className="hidden px-4 py-2.5 font-medium sm:table-cell">Client</th>
                <th className="hidden px-4 py-2.5 font-medium md:table-cell">Date</th>
                <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1F4]">
              {INVOICES.map((invoice) => {
                const unpaid = invoice.status !== "paid";
                return (
                  <tr
                    key={invoice.number}
                    className={cn(
                      "transition-colors duration-500",
                      highlightUnpaid && unpaid && (invoice.status === "overdue" ? "bg-[#FFF5F5]" : "bg-[#FFFBF2]"),
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <p className="font-medium text-navy">{invoice.number}</p>
                      <p className="text-[11.5px] text-[#6B7280] sm:hidden">{invoice.client}</p>
                    </td>
                    <td className="hidden px-4 py-2.5 text-[#374151] sm:table-cell">{invoice.client}</td>
                    <td
                      className={cn(
                        "hidden px-4 py-2.5 md:table-cell",
                        invoice.status === "overdue" ? "font-medium text-[#B91C1C]" : "text-[#6B7280]",
                      )}
                    >
                      {invoice.when}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-navy tabular-nums">{euro(invoice.amount, true)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <StatusBadge status={invoice.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
