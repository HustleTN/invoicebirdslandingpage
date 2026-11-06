"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { FitCanvas } from "@/components/ui/fit-canvas";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export { DemoCursor as Cursor } from "@/components/sections/hero/demo-cursor";

const TICK = 50;

/**
 * Milliseconds into a looping mockup. Runs only while on screen, restarts
 * without fading, and holds `final` for visitors who prefer reduced motion.
 */
export function useLoop(ref: RefObject<HTMLElement | null>, length: number, final = length - 1) {
  const reduceMotion = usePrefersReducedMotion();
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setMs((t) => (t + TICK) % length);
    }, TICK);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [reduceMotion, ref, length]);

  return reduceMotion ? final : ms;
}

/** The part of `text` typed out by `ms`, starting at `start`. */
export const typed = (text: string, ms: number, start: number, perChar = 45) =>
  ms < start ? "" : text.slice(0, Math.floor((ms - start) / perChar));

/** A cursor that arrives shortly before `at` and clicks at `at`. */
export const cursorAt = (ms: number, at: number) => ({
  visible: ms >= at - 750 && ms < at + 500,
  clicking: ms >= at - 120 && ms < at + 160,
});

export const SOFT_SHADOW = "shadow-[0_12px_40px_rgba(10,37,64,0.08),0_2px_6px_rgba(10,37,64,0.04)]";

/** The grey stage a mockup sits on: panel and invoice side by side. */
export function Stage({ ref, label, children }: { ref: RefObject<HTMLDivElement | null>; label: string; children: ReactNode }) {
  return (
    <figure ref={ref} className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <figcaption className="sr-only">{label}</figcaption>
      <div aria-hidden="true" className="flex flex-col items-center gap-5 lg:flex-row lg:items-start lg:justify-center">
        {children}
      </div>
    </figure>
  );
}

const DONE: Localized<string> = { en: "Done", fr: "Terminé" };

/** App panel chrome: back arrow, title, Done. */
export function Panel({ title, back = true, children, className }: { title: string; back?: boolean; children: ReactNode; className?: string }) {
  const locale = useLocale();
  return (
    <div className={cn("w-full max-w-[320px] shrink-0 overflow-hidden rounded-2xl border border-line bg-white text-left text-navy", SOFT_SHADOW, className)}>
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        {back && <ArrowLeft size={15} className="text-[#6B7280]" />}
        <p className="flex-1 text-[14px] font-semibold">{title}</p>
        {back && <span className="text-[12.5px] font-semibold text-green">{DONE[locale]}</span>}
      </div>
      <div className="space-y-3 p-4 text-[12.5px]">{children}</div>
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="mb-1 text-[10.5px] font-semibold tracking-[0.1em] text-[#6B7280] uppercase">{children}</p>;
}

/** A text field: shows `value` (with a caret while typing) or its placeholder. */
export function Field({
  label,
  value,
  placeholder,
  typing = false,
  focused = false,
  tall = false,
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  typing?: boolean;
  focused?: boolean;
  tall?: boolean;
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div
        className={cn(
          "rounded-lg border px-3 py-2 transition-colors",
          tall && "min-h-[64px]",
          focused || typing ? "border-green ring-2 ring-green/15" : "border-line",
        )}
      >
        {value ? (
          <span className="text-navy">
            {value}
            {typing && <span className="ml-px inline-block h-3 w-px translate-y-0.5 animate-pulse bg-green" />}
          </span>
        ) : (
          <span className="text-[#A3ACB8]">{placeholder}</span>
        )}
      </div>
    </div>
  );
}

export function Toggle({ on }: { on: boolean }) {
  return (
    <span className={cn("relative inline-flex h-[20px] w-9 shrink-0 rounded-full transition-colors", on ? "bg-green" : "bg-[#D5DBE2]")}>
      <span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition-[left]", on ? "left-[18px]" : "left-0.5")} />
    </span>
  );
}

export function ToggleCard({ title, text, on }: { title: string; text: string; on: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-navy">{title}</p>
        <p className="mt-0.5 text-[11.5px] leading-snug text-[#6B7280]">{text}</p>
      </div>
      <Toggle on={on} />
    </div>
  );
}

/** Wraps the 520px document so it scales to the space beside or under its panel, at most 86%. */
export function InvoiceSlot({ children }: { children: ReactNode }) {
  return (
    <FitCanvas width={520} max={0.86} fallback="max-sm:[zoom:0.6] sm:[zoom:0.86] lg:[zoom:0.84]" className="lg:min-w-0 lg:flex-1">
      {children}
    </FitCanvas>
  );
}
