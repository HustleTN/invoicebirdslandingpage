import type { CSSProperties, ReactNode } from "react";
import { X, type LucideIcon } from "lucide-react";

import { FitCanvas } from "@/components/ui/fit-canvas";

export type UpgradeFeature = { icon: LucideIcon; title: string; text: string };

export type UpgradeContent = {
  plan: "Professional" | "Growth";
  title: string;
  lead: string;
  features: UpgradeFeature[];
  /** Shown under the button, e.g. "From $12/month, billed yearly." */
  price: string;
};

/** Staggered entrance: each piece of the left column rises in a beat after the one before. */
const RISE = "animate-rise motion-reduce:animate-none";
const beat = (n: number): CSSProperties => ({ animationDelay: `${120 + n * 70}ms` });

/**
 * Feature upgrade popup: the plan, what the feature does and one button on the left; a live preview of the
 * feature on a navy panel on the right. Layout follows the popup's own width (container queries), so it
 * also works as a scaled thumbnail and stacks on phones.
 */
export function UpgradeModal({
  content,
  preview,
  titleId,
  onClose,
}: {
  content: UpgradeContent;
  preview: ReactNode;
  titleId?: string;
  onClose?: () => void;
}) {
  const { plan, title, lead, features, price } = content;

  return (
    <div className="@container relative overflow-hidden rounded-2xl bg-white text-navy shadow-[0_32px_80px_rgba(10,37,64,0.28)]">
      <div className="grid @3xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="order-2 px-7 pt-8 pb-8 @3xl:order-1 @3xl:px-11 @3xl:py-12">
          <p className={`text-[12.5px] font-semibold tracking-[0.08em] text-blue uppercase ${RISE}`} style={beat(0)}>
            {plan} plan
          </p>
          <h2 id={titleId} className={`mt-3 text-[28px] leading-[1.1] font-semibold tracking-[-0.035em] @3xl:text-[34px] ${RISE}`} style={beat(1)}>
            {title}
          </h2>
          <p className={`mt-3 text-[15.5px] leading-relaxed text-muted ${RISE}`} style={beat(2)}>
            {lead}
          </p>

          <ul className="mt-7 space-y-3.5">
            {features.map(({ icon: Icon, title: feature, text }, i) => (
              <li key={feature} className={`flex gap-3 text-[14.5px] leading-relaxed ${RISE}`} style={beat(3 + i)}>
                <Icon size={18} strokeWidth={1.9} aria-hidden="true" className="mt-[3px] shrink-0 text-green" />
                <p>
                  <span className="font-semibold">{feature}</span> <span className="text-muted">{text}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className={`mt-8 ${RISE}`} style={beat(6)}>
            <button
              type="button"
              className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-green px-7 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-green-hover active:scale-[0.98] @md:w-auto"
            >
              Upgrade to {plan}
            </button>
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-muted">
              {price} Cancel anytime.{" "}
              <a href="#" className="font-semibold text-navy underline decoration-line underline-offset-[3px] transition-colors hover:decoration-navy">
                Compare plans
              </a>
            </p>
          </div>
        </div>

        {/* Preview panel: navy like the hero, with a faint grid and the preview floating on it. */}
        <div className="relative order-1 flex items-center justify-center overflow-hidden bg-navy px-6 pt-10 pb-8 @3xl:order-2 @3xl:px-8 @3xl:py-10">
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-grid-drift bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)] motion-reduce:animate-none"
          />
          <div aria-hidden="true" className="absolute size-[320px] animate-hub-breathe rounded-full bg-blue/60 blur-3xl motion-reduce:animate-none" />
          <div aria-hidden="true" className="relative w-full animate-pop-in motion-reduce:animate-none" style={{ animationDelay: "80ms" }}>
            <FitCanvas width={430} max={1}>
              <div className="flex animate-float justify-center px-12 motion-reduce:animate-none">{preview}</div>
            </FitCanvas>
          </div>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Close"
          className="absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-[background-color,transform] duration-200 hover:rotate-90 hover:bg-white/20"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
