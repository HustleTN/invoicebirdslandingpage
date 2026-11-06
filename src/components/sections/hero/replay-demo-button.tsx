"use client";

import { REPLAY_EVENT } from "./demo-timeline";

export function ReplayDemoButton({
  targetId,
  className,
  children,
}: {
  targetId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const replay = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.dispatchEvent(new Event(REPLAY_EVENT));
    document.getElementById(targetId)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <button type="button" onClick={replay} aria-controls={targetId} className={className}>
      {children}
    </button>
  );
}
