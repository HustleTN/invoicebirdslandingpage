"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { useLocale } from "@/components/i18n/locale-provider";
import { FitCanvas } from "@/components/ui/fit-canvas";
import { cn } from "@/lib/cn";
import type { Localized } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

import { InvoicePreview } from "./invoice-preview";
import { DesignPanel, LogoPanel, SignaturePanel, TaxPanel } from "./panels";
import { activeStep, getLook, LOOP_MS, STEP_LABELS, stepProgress, stepStart, STEPS, type StepId } from "./timeline";

const COPY: Localized<{ summary: string; steps: string; play: string; pause: string }> = {
  en: {
    summary:
      "Animated example: an invoice from Ridgeway Towing & Recovery to Harbour Logistics is customized step by step. Brand colors are applied, corners are rounded and the item table becomes striped, a logo is added, VAT at 20% and a 10% discount are applied (total £501.12), and a drawn signature is added.",
    steps: "Customization steps",
    play: "Play customization demo",
    pause: "Pause customization demo",
  },
  fr: {
    summary:
      "Exemple animé : une facture de Ridgeway Towing & Recovery pour Harbour Logistics est personnalisée étape par étape. Les couleurs de marque sont appliquées, les coins s’arrondissent et le tableau des articles passe en bandes alternées, un logo est ajouté, la TVA à 20 % et une remise de 10 % sont appliquées (total 501,12 £), puis une signature manuscrite est ajoutée.",
    steps: "Étapes de personnalisation",
    play: "Lire la démo de personnalisation",
    pause: "Mettre en pause la démo de personnalisation",
  },
};

const TICK = 50;
/** A frame with every customization applied, for reduced motion. */
const FINISHED = LOOP_MS - 1_000;

function usePlayer(targetRef: React.RefObject<HTMLElement | null>) {
  const reduceMotion = usePrefersReducedMotion();
  const [ms, setMs] = useState(0);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion || paused) return;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.25 });
    if (targetRef.current) observer.observe(targetRef.current);
    const timer = window.setInterval(() => {
      if (visible && !document.hidden) setMs((t) => (t + TICK) % LOOP_MS);
    }, TICK);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [reduceMotion, paused, targetRef]);

  return {
    ms: reduceMotion ? FINISHED : ms,
    // With reduced motion everything is applied; choosing a step only highlights its panel.
    active: reduceMotion ? (chosen ?? STEPS.length - 1) : activeStep(ms),
    reduceMotion,
    paused,
    togglePause: () => setPaused((p) => !p),
    jump: (index: number) => (reduceMotion ? setChosen(index) : setMs(stepStart(index))),
  };
}

export function CustomizeDemo() {
  const locale = useLocale();
  const t = COPY[locale];
  const labels = STEP_LABELS[locale];
  const ref = useRef<HTMLDivElement>(null);
  const { ms, active, reduceMotion, paused, togglePause, jump } = usePlayer(ref);
  const look = getLook(ms);
  const is = (id: StepId) => STEPS[active].id === id;
  const panels: Record<StepId, React.ReactNode> = {
    colors: <DesignPanel look={look} active />,
    layout: <DesignPanel look={look} active />,
    logo: <LogoPanel look={look} active />,
    taxes: <TaxPanel look={look} active />,
    signature: <SignaturePanel look={look} active />,
  };

  return (
    <div ref={ref}>
      <p className="sr-only">{t.summary}</p>

      <div aria-hidden="true">
        {/* Desktop: the invoice centred between the app's panels, on a fixed canvas scaled to fit */}
        <div className="customize-canvas hidden lg:block">
          <div className="relative mx-auto h-[730px] w-[1216px]">
            <div className="absolute top-0 left-0 flex w-[288px] flex-col gap-4">
              <DesignPanel look={look} active={is("colors") || is("layout")} />
              <LogoPanel look={look} active={is("logo")} />
            </div>
            <div className="absolute top-6 left-[328px]">
              <InvoicePreview look={look} />
            </div>
            <div className="absolute top-12 right-0 flex w-[288px] flex-col gap-4">
              <TaxPanel look={look} active={is("taxes")} />
              <SignaturePanel look={look} active={is("signature")} />
            </div>
          </div>
        </div>

        {/* Smaller screens: the invoice with whichever panel is in use beside it, one composition scaled to fit */}
        <div className="lg:hidden">
          <FitCanvas width={880} fallback="max-sm:[zoom:0.41] sm:[zoom:0.8]">
            <div className="flex items-start gap-8">
              <InvoicePreview look={look} />
              <div key={STEPS[active].id} className="w-[288px] shrink-0 animate-fade-in pt-6">
                {panels[STEPS[active].id]}
              </div>
            </div>
          </FitCanvas>
        </div>
      </div>

      {/* Steps: what is being customized; each also jumps to that step */}
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-4">
        <div role="group" aria-label={t.steps} className="flex justify-center gap-0.5 sm:flex-wrap sm:gap-1">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              type="button"
              aria-pressed={i === active}
              onClick={() => jump(i)}
              className={cn(
                "relative cursor-pointer rounded-md px-2 pt-2 pb-2.5 text-[13.5px] font-medium whitespace-nowrap transition-colors sm:px-3 sm:text-[14px]",
                i === active ? "text-navy" : "text-muted hover:text-navy",
              )}
            >
              {/* short labels on phones keep every step on one line */}
              <span className="sm:hidden">{labels[step.id].short}</span>
              <span className="hidden sm:inline">{labels[step.id].label}</span>
              <span aria-hidden="true" className="absolute inset-x-2 bottom-1 h-0.5 overflow-hidden rounded-full bg-line sm:inset-x-3">
                {i === active && (
                  <span className="block h-full bg-green" style={{ width: `${(reduceMotion ? 1 : stepProgress(ms, i)) * 100}%` }} />
                )}
              </span>
            </button>
          ))}
        </div>
        {!reduceMotion && (
          <button
            type="button"
            onClick={togglePause}
            aria-label={paused ? t.play : t.pause}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-navy transition-colors hover:bg-surface"
          >
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
