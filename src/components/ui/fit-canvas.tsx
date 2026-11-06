"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Shows a fixed-size design canvas scaled to fit its container's width, never above `max`.
 * Product visuals keep their full composition on small screens instead of stacking.
 * `fallback` (zoom classes) applies until the first measurement, so the server render is close.
 */
export function FitCanvas({
  width,
  max = 1,
  fallback,
  className,
  children,
}: {
  /** The canvas's design width, in CSS pixels. */
  width: number;
  max?: number;
  fallback?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const box = ref.current;
    if (!box) return;
    const update = () => setScale(Math.min(max, box.clientWidth / width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    return () => observer.disconnect();
  }, [width, max]);

  return (
    // inline-size containment: the canvas never widens its column, so the measured width is the space available
    <div ref={ref} className={cn("flex w-full justify-center [contain:inline-size]", className)}>
      <div className={cn("shrink-0", scale === null && fallback)} style={{ width, zoom: scale ?? undefined }}>
        {children}
      </div>
    </div>
  );
}
