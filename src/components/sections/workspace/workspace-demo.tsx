"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Clock, FileText, Receipt, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

import { ScenarioChat } from "./scenario-chat";
import { finalFrameMs, getScenarioFrame, scenarioDuration, SCENARIOS, type ScenarioId } from "./scenarios";
import { WorkspacePanel } from "./workspace-panel";

const TICK_MS = 50;
const ICONS: Record<ScenarioId, LucideIcon> = { invoice: FileText, overdue: Clock, expense: Receipt };

/**
 * Plays each scenario while the demo is on screen. Scenarios advance on their
 * own until the visitor picks one; then that one repeats.
 */
function useScenarioPlayer(targetRef: React.RefObject<HTMLElement | null>) {
  const reduceMotion = usePrefersReducedMotion();
  const [state, setState] = useState({ index: 0, ms: 0, pinned: false });

  useEffect(() => {
    if (reduceMotion) return;

    let isOnScreen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isOnScreen = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );
    if (targetRef.current) observer.observe(targetRef.current);

    const timer = window.setInterval(() => {
      if (!isOnScreen || document.hidden) return;
      setState((previous) => {
        const ms = previous.ms + TICK_MS;
        if (ms < scenarioDuration(SCENARIOS[previous.index])) return { ...previous, ms };
        const index = previous.pinned ? previous.index : (previous.index + 1) % SCENARIOS.length;
        return { ...previous, index, ms: 0 };
      });
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [reduceMotion, targetRef]);

  const scenario = SCENARIOS[state.index];
  return {
    index: state.index,
    scenario,
    ms: reduceMotion ? finalFrameMs(scenario) : state.ms,
    progress: reduceMotion ? 1 : state.ms / scenarioDuration(scenario),
    select: (index: number) => setState({ index, ms: 0, pinned: true }),
  };
}

export function WorkspaceDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { index, scenario, ms, progress, select } = useScenarioPlayer(ref);
  const frame = getScenarioFrame(scenario, ms);

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + SCENARIOS.length) % SCENARIOS.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div ref={ref}>
      <div
        role="tablist"
        aria-label="Things Birdy can do"
        onKeyDown={onTabKeyDown}
        className="mx-auto flex w-fit max-w-full gap-1 rounded-full border border-[#DFE5EA] bg-white p-1 shadow-sm"
      >
        {SCENARIOS.map((item, itemIndex) => {
          const Icon = ICONS[item.id];
          const active = itemIndex === index;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[itemIndex] = element;
              }}
              id={`birdy-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="birdy-scenario-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => select(itemIndex)}
              className={cn(
                "relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-full px-3 py-2 text-[13px] font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-sm",
                active ? "bg-navy text-white" : "text-[#4B5563] hover:bg-surface hover:text-navy",
              )}
            >
              <Icon size={15} aria-hidden="true" className="hidden sm:block" />
              {item.tab}
              {active && (
                <span aria-hidden="true" className="absolute inset-x-4 bottom-1 h-0.5 overflow-hidden rounded-full bg-white/15">
                  <span className="block h-full bg-green" style={{ width: `${progress * 100}%` }} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id="birdy-scenario-panel"
        role="tabpanel"
        aria-labelledby={`birdy-tab-${scenario.id}`}
        className="mt-10 grid items-stretch gap-5 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8"
      >
        <p className="sr-only">{scenario.description}</p>
        <div aria-hidden="true">
          <WorkspacePanel highlights={frame.highlights} />
        </div>
        <div aria-hidden="true" className="relative order-first lg:order-none">
          <ScenarioChat scenario={scenario} frame={frame} className="h-[540px] lg:absolute lg:inset-0 lg:h-auto" />
        </div>
      </div>
    </div>
  );
}
