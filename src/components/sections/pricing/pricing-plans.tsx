"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { BirdyMascot } from "@/components/birdy/birdy-chat";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";

import { PLANS, type Billing, type Plan } from "./plans";

type Copy = {
  period: string;
  billing: Record<Billing, string>;
  save: string;
  saveNote: string;
  /** A whole-dollar amount: "$8" in English, "8 $" in French. */
  usd: (amount: number) => string;
  perMonth: string;
  billedMonthly: string;
  billedYearly: (amount: string) => string;
  birdyRequests: (count: number) => string;
  birdyIncluded: string;
};

const COPY: Localized<Copy> = {
  en: {
    period: "Billing period",
    billing: { monthly: "Monthly", yearly: "Yearly" },
    save: "Save 50%",
    saveNote: "Yearly billing saves 50%.",
    usd: (amount) => `$${amount}`,
    perMonth: "/month",
    billedMonthly: "Billed monthly",
    billedYearly: (amount) => `Billed ${amount} yearly`,
    birdyRequests: (count) => `${count} Birdy requests/month`,
    birdyIncluded: "Birdy is included in paid plans.",
  },
  fr: {
    period: "Période de facturation",
    billing: { monthly: "Mensuel", yearly: "Annuel" },
    save: "Économisez 50 %",
    saveNote: "La facturation annuelle vous fait économiser 50 %.",
    usd: (amount) => `${amount} $`,
    perMonth: "/mois",
    billedMonthly: "Facturé mensuellement",
    billedYearly: (amount) => `Facturé ${amount} par an`,
    birdyRequests: (count) => `${count} requêtes Birdy/mois`,
    birdyIncluded: "Birdy est inclus dans les formules payantes.",
  },
};

function BillingToggle({ t, billing, onChange }: { t: Copy; billing: Billing; onChange: (billing: Billing) => void }) {
  return (
    <div role="group" aria-label={t.period} className="inline-flex items-center gap-1 rounded-lg border border-line bg-white p-1">
      {(["monthly", "yearly"] as const).map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={billing === id}
          onClick={() => onChange(id)}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
            billing === id ? "bg-blue text-white" : "text-muted hover:text-navy",
          )}
        >
          {t.billing[id]}
        </button>
      ))}
    </div>
  );
}

/**
 * The discount callout: "Save 50%" with a hand-drawn arrow curling back to Yearly. It hangs off the
 * toggle's right edge from sm up; on phones it sits below the toggle with the arrow flipped to point up.
 */
function SaveCallout({ text }: { text: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-full right-1 mt-1 flex items-center gap-0.5 sm:top-auto sm:right-auto sm:bottom-1/2 sm:left-full sm:mt-0 sm:ml-1.5 sm:items-start"
    >
      <svg width="38" height="30" viewBox="0 0 38 30" fill="none" className="shrink-0 -scale-y-100 text-green sm:mt-2 sm:scale-y-100">
        <path d="M35 4C31 17 21 25 6 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M11 19.5 5.5 24l6 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="rotate-6 text-[14px] font-semibold whitespace-nowrap text-green sm:-rotate-6">{text}</span>
    </span>
  );
}

/** Price, its billing pill and the Birdy allowance. `onDark` for the Growth header. */
function PriceBlock({ t, plan, billing, onDark = false }: { t: Copy; plan: Plan; billing: Billing; onDark?: boolean }) {
  const free = plan.price.monthly === 0;
  const pill = free ? null : billing === "yearly" ? t.billedYearly(t.usd(plan.billedYearly ?? 0)) : t.billedMonthly;
  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="flex items-baseline">
          <span key={`${plan.id}-${billing}`} className="animate-fade-in text-[42px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
            {t.usd(plan.price[billing])}
          </span>
          <span className={cn("ml-1 text-[16px]", onDark ? "text-white/80" : "text-muted")}>{t.perMonth}</span>
        </p>
        {pill && (
          <span className={cn("rounded-full px-3 py-1 text-[13px] font-medium", onDark ? "bg-white/15 text-white" : "bg-[#EEF1F5] text-navy")}>
            {pill}
          </span>
        )}
      </div>
      <p className={cn("mt-4 flex items-center gap-2.5 text-[15px]", onDark ? "text-white" : "text-navy")}>
        {plan.birdyRequests ? (
          <>
            <BirdyMascot size={24} />
            <span className="font-semibold">{t.birdyRequests(plan.birdyRequests)}</span>
          </>
        ) : (
          <span className="text-muted">{t.birdyIncluded}</span>
        )}
      </p>
    </>
  );
}

function Features({ plan }: { plan: Plan }) {
  return (
    <div className="flex-1">
      {plan.includesAbove && (
        <p className="mb-5 rounded-lg bg-[#EEF1F5] px-4 py-2.5 text-center text-[14.5px] font-semibold text-navy">{plan.includesAbove}</p>
      )}
      <ul className="space-y-2.5 text-[15px]">
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-3">
            <Check size={17} strokeWidth={2.4} aria-hidden="true" className="mt-0.5 shrink-0 text-green" />
            <span className={feature.strong ? "font-semibold text-navy" : "text-[#374151]"}>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cta({ plan }: { plan: Plan }) {
  const styles = {
    free: "border border-navy text-navy hover:bg-surface",
    professional: "bg-blue text-white hover:bg-[#0E3866]",
    growth: "bg-green text-white hover:bg-green-hover",
  }[plan.id];
  return (
    <div className="mt-7">
      <a href={siteConfig.links.signup} className={cn("flex h-12 items-center justify-center rounded-lg text-[15px] font-semibold transition-colors", styles)}>
        {plan.cta}
      </a>
      {plan.note && <p className="mt-3 text-center text-[13px] text-muted">{plan.note}</p>}
    </div>
  );
}

function Badge({ text, onDark = false }: { text: string; onDark?: boolean }) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-[13px] font-semibold whitespace-nowrap text-white", onDark ? "bg-green" : "bg-blue")}>
      {text}
    </span>
  );
}

function Header({ plan }: { plan: Plan }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 id={`plan-${plan.id}`} className="text-[24px] font-semibold tracking-tight">
        {plan.name}
      </h3>
      {plan.badge && <Badge text={plan.badge} onDark={plan.id === "growth"} />}
    </div>
  );
}

function PlanCard({ t, plan, billing }: { t: Copy; plan: Plan; billing: Billing }) {
  if (plan.id === "growth") {
    return (
      <article aria-labelledby={`plan-${plan.id}`} className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-blue/20 bg-white text-navy">
        <div className="bg-blue p-6 text-white sm:px-8 sm:py-7">
          <Header plan={plan} />
          <p className="mt-2.5 text-[15px] leading-relaxed text-white/85">{plan.description}</p>
          <PriceBlock t={t} plan={plan} billing={billing} onDark />
        </div>
        <div className="flex flex-1 flex-col p-6 sm:px-8 sm:py-7">
          <Features plan={plan} />
          <Cta plan={plan} />
        </div>
      </article>
    );
  }
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cn("flex flex-col rounded-2xl border border-line bg-white p-6 text-navy sm:px-8 sm:py-7", plan.id === "free" ? "lg:mt-auto" : "flex-1")}
    >
      <Header plan={plan} />
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{plan.description}</p>
      <PriceBlock t={t} plan={plan} billing={billing} />
      <div className="mt-6 flex flex-1 flex-col border-t border-line pt-6">
        <Features plan={plan} />
        <Cta plan={plan} />
      </div>
    </article>
  );
}

export function PricingPlans() {
  const locale = useLocale();
  const t = COPY[locale];
  const [billing, setBilling] = useState<Billing>("yearly");
  return (
    <div>
      <div className="flex justify-center">
        {/* the toggle stays centred; the callout hangs off its right edge */}
        <div className="relative">
          <BillingToggle t={t} billing={billing} onChange={setBilling} />
          <SaveCallout text={t.save} />
          <span className="sr-only">{t.saveNote}</span>
        </div>
      </div>
      <div className="mt-14 grid gap-5 sm:mt-10 lg:grid-cols-3 lg:items-stretch">
        {PLANS[locale].map((plan) => (
          <div key={plan.id} className="flex flex-col">
            <PlanCard t={t} plan={plan} billing={billing} />
          </div>
        ))}
      </div>
    </div>
  );
}
