"use client";

import type { CSSProperties } from "react";
import { Check, Lock, X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

export type LimitContent = {
  icon: LucideIcon;
  /** The action that hit the limit, e.g. "Add client". */
  action: string;
  /** Plural noun, e.g. "clients". */
  noun: string;
  limit: number;
};

const PROFESSIONAL = ["Unlimited clients, items and estimates", "Automatic payment reminders", "Custom templates and tax reports"];

const beat = (n: number): CSSProperties => ({ animationDelay: `${100 + n * 80}ms` });

/**
 * Free-plan limit popup: the limit, the slots in use, then Professional with its price and one button.
 * With `animated`, the pieces rise in one by one, the slots fill in turn and the locked one gives a shake.
 */
export function LimitModal({
  content,
  animated = false,
  titleId,
  onClose,
}: {
  content: LimitContent;
  animated?: boolean;
  titleId?: string;
  onClose?: () => void;
}) {
  const { icon: Icon, action, noun, limit } = content;

  // Stagger helper: adds the rise animation and its delay to an element's own classes.
  const rise = (n: number, className: string) => ({
    className: cn(className, animated && "animate-rise motion-reduce:animate-none"),
    style: animated ? beat(n) : undefined,
  });

  return (
    <div className="@container overflow-hidden rounded-2xl bg-white text-navy shadow-[0_32px_80px_rgba(10,37,64,0.28)]">
      <div className="flex items-center justify-between px-6 pt-5">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-muted">
          <Icon size={15} aria-hidden="true" />
          {action}
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            aria-label="Close"
            className="-mr-2 flex size-9 cursor-pointer items-center justify-center rounded-full text-muted transition-[background-color,color,transform] duration-200 hover:rotate-90 hover:bg-surface hover:text-navy"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="px-6 pt-5 pb-7 @md:px-8">
        {/* Slots: the ones in use fill in turn, then the next one shows it's locked. */}
        <div {...rise(0, "flex items-center gap-2")}>
          {Array.from({ length: limit }, (_, i) => (
            <span
              key={i}
              className={cn("size-3 rounded-full bg-navy", animated && "animate-chip-in motion-reduce:animate-none")}
              style={animated ? { animationDelay: `${350 + i * 140}ms` } : undefined}
            />
          ))}
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full border border-dashed border-[#B9C5D3] text-muted",
              animated && "animate-wiggle motion-reduce:animate-none",
            )}
            style={animated ? { animationDelay: "950ms" } : undefined}
          >
            <Lock size={11} aria-hidden="true" />
          </span>
          <span className="ml-1 text-[13px] text-muted">
            {limit} of {limit} used
          </span>
        </div>

        <h2 id={titleId} {...rise(1, "mt-4 text-[24px] leading-[1.15] font-semibold tracking-[-0.03em] @md:text-[26px]")}>
          You’ve used all {limit} {noun} on Free
        </h2>
        <p {...rise(2, "mt-2.5 text-[15px] leading-relaxed text-muted")}>
          Upgrade to Professional to add as many {noun} as you need. Invoices stay unlimited on every plan.
        </p>

        <div {...rise(3, "mt-6 rounded-xl border border-line p-5")}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[12.5px] font-semibold tracking-[0.08em] text-blue uppercase">Professional</p>
            <p className="text-[13.5px] text-muted">
              <span className="text-[17px] font-semibold text-navy">$8</span>/month
            </p>
          </div>
          <ul className="mt-3.5 space-y-2 text-[14.5px]">
            {PROFESSIONAL.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <Check size={16} strokeWidth={2.4} className="shrink-0 text-green" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div {...rise(4, "mt-5")}>
          <button
            type="button"
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-green text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-green-hover active:scale-[0.98]"
          >
            Upgrade to Professional
          </button>
          <p className="mt-3.5 text-center text-[13.5px] text-muted">
            Billed yearly. Cancel anytime.{" "}
            <a href="#" className="font-semibold text-navy underline decoration-line underline-offset-[3px] transition-colors hover:decoration-navy">
              See all plans
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
