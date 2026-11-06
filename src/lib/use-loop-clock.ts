"use client";

import { useEffect, useState, type RefObject } from "react";

import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const TICK_MS = 50;

/**
 * Milliseconds into a looping animation. Starts when `targetRef` scrolls into view,
 * pauses while it is off screen or the tab is hidden, and returns `finalFrame`
 * for visitors who prefer reduced motion.
 */
export function useLoopClock(
  targetRef: RefObject<HTMLElement | null>,
  { loopEnd, finalFrame, threshold = 0.3 }: { loopEnd: number; finalFrame: number; threshold?: number },
) {
  const reduceMotion = usePrefersReducedMotion();
  const [ms, setMs] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let isOnScreen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isOnScreen = entry.isIntersecting;
      },
      { threshold },
    );
    if (targetRef.current) observer.observe(targetRef.current);

    const timer = window.setInterval(() => {
      if (isOnScreen && !document.hidden) setMs((previous) => (previous + TICK_MS) % loopEnd);
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [reduceMotion, targetRef, loopEnd, threshold]);

  return reduceMotion ? finalFrame : ms;
}
