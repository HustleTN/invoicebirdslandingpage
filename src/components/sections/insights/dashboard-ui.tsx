import { CircleAlert, CircleCheck, Clock, Eye, Send, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

import type { InvoiceStatus } from "./data";

/** Status colours are reserved for state and always paired with an icon and a label. */
export const STATUS: Record<InvoiceStatus, { label: string; icon: LucideIcon; badge: string }> = {
  paid: { label: "Paid", icon: CircleCheck, badge: "bg-green-soft text-green" },
  sent: { label: "Sent", icon: Send, badge: "bg-[#EEF4FF] text-[#1D4ED8]" },
  viewed: { label: "Viewed", icon: Eye, badge: "bg-[#FFF7E6] text-[#B45309]" },
  overdue: { label: "Overdue", icon: CircleAlert, badge: "bg-[#FEF2F2] text-[#B91C1C]" },
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, icon: Icon, badge } = STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium", badge)}>
      <Icon size={12} strokeWidth={2.2} />
      {label}
    </span>
  );
}

export function KpiTile({
  label,
  value,
  detail,
  icon: Icon = Clock,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon?: LucideIcon;
  /** Tailwind classes for the icon chip. */
  accent: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[#E6EAEF] bg-white p-3 sm:p-4">
      <div className="flex items-center gap-2 text-[11.5px] text-[#6B7280] sm:text-[12.5px]">
        <span className={cn("hidden size-6 shrink-0 items-center justify-center rounded-md sm:flex", accent)}>
          <Icon size={13} strokeWidth={2.2} />
        </span>
        {label}
      </div>
      <p className="mt-2 text-[18px] leading-none font-semibold tracking-[-0.02em] text-navy tabular-nums sm:mt-2.5 sm:text-[26px]">{value}</p>
      <p className="mt-1.5 hidden text-[12px] text-[#6B7280] sm:block">{detail}</p>
    </div>
  );
}

export function PanelTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-[14px] font-semibold text-navy">{children}</h3>
      {action}
    </div>
  );
}
