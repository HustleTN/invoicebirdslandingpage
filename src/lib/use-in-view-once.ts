"use client";

import { useEffect, useState, type RefObject } from "react";

/** True from the first time the element is at least `threshold` visible; never turns back off. */
export function useInViewOnce(ref: RefObject<HTMLElement | null>, threshold = 0.25) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, seen]);

  return seen;
}
